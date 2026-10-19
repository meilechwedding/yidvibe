// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MediaGallery } from "@/components/brand/media-gallery";
import { EventCard } from "@/components/events/event-card";
import type { EventRow } from "@/lib/events";
import { CompetitionCard } from "@/components/brand/competition-card";
import type { CompetitionListItem } from "@/lib/competitions";

const fixtures = vi.hoisted(() => ({
  ended: true,
  status: "open",
  me: null as null | { id: string },
}));

vi.mock("@/lib/competitions", () => ({
  getCompetitionBySlug: vi.fn(async () => ({
    id: "competition-1", title: "Test competition", description: "Build something",
    creator_id: "host", review_status: "approved", winner_submission_id: null,
    deadline: "2026-06-03T12:00:00Z", status: fixtures.status, prize_amount: 100,
    tags: [], creator: null, loom_url: null,
  })),
  getSubmissions: vi.fn(async () => []),
  deadlineLabel: vi.fn(() => ({ ended: fixtures.ended, text: fixtures.ended ? "Ended" : "Open" })),
  submissionCount: vi.fn(() => 0),
}));
vi.mock("@/lib/current-user", () => ({ getCurrentProfile: async () => fixtures.me }));
vi.mock("@/lib/admin", () => ({ getAdminContext: async () => null }));
vi.mock("@/lib/actions/competitions", () => ({ pickWinner: vi.fn() }));
vi.mock("@/components/competitions/submit-entry-form", () => ({
  SubmitEntryForm: () => <form aria-label="Competition entry" />,
}));


afterEach(() => {
  cleanup();
  fixtures.ended = true;
  fixtures.status = "open";
  fixtures.me = null;
});

describe("project gallery recovery", () => {
  it("keeps named thumbnails available after an image fails and lets the viewer select a working image", () => {
    render(<MediaGallery name="Example" accent="teal" coverImage="/broken.png" images={["/working.png"]} />);
    fireEvent.error(screen.getByAltText("Example"));
    const first = screen.getByRole("button", { name: "View Example image 1" });
    const second = screen.getByRole("button", { name: "View Example image 2" });
    expect(first.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(second);
    expect(screen.getByAltText("Example").getAttribute("src")).toBe("/working.png");
    expect(second.getAttribute("aria-pressed")).toBe("true");
    expect(first.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(first);
    expect(screen.queryByAltText("Example")).toBeNull();
    expect(screen.getByRole("button", { name: "View Example image 2" })).toBeTruthy();
  });
});

describe("event description disclosure", () => {
  it("lets a viewer expand and collapse the full description without an external event link", () => {
    const event = { id: "event-1", title: "Community meetup", description: "A long description with all the details.", starts_at: null, location: null, url: null } as EventRow;
    render(<ul><EventCard event={event} /></ul>);
    const expand = screen.getByRole("button", { name: "Read more about Community meetup" });
    expect(expand.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByText(event.description!).className).toContain("line-clamp-2");
    fireEvent.click(expand);
    const collapse = screen.getByRole("button", { name: "Show less about Community meetup" });
    expect(collapse.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText(event.description!).className).not.toContain("line-clamp-2");
    fireEvent.click(collapse);
    expect(screen.getByText(event.description!).className).toContain("line-clamp-2");
  });
});

describe("competition entry availability", () => {
  it("labels a closed competition card as closed even before its deadline", () => {
    fixtures.ended = false;
    const competition = { id: "one", slug: "test", title: "Test competition", description: "Build", deadline: "2026-12-03T12:00:00Z", status: "closed", winner_submission_id: null, prize_amount: 100, creator: null } as CompetitionListItem;
    render(<CompetitionCard competition={competition} />);
    expect(screen.getByText("Closed")).toBeTruthy();
    expect(screen.queryByText("Open")).toBeNull();
  });

});
