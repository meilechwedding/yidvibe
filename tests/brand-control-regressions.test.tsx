// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

const mocks = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn(), save: vi.fn(), status: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: mocks.push, refresh: mocks.refresh }), notFound: () => { throw new Error("Not found"); } }));
vi.mock("next/link", () => ({ default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a> }));
vi.mock("@/lib/actions/saves", () => ({ toggleSave: mocks.save }));
vi.mock("@/lib/actions/gigs", () => ({ applyToGig: vi.fn(), setGigStatus: mocks.status }));
vi.mock("@/lib/current-user", () => ({ getCurrentProfile: async () => ({ id: "owner" }) }));
vi.mock("@/lib/gigs", () => ({
  getGigBySlug: async () => ({ id: "gig", slug: "example", poster_id: "owner", poster: null, title: "Example gig", description: "A mocked gig", type: "task", status: "open", tags: [] }),
  getThreadsForGig: async () => [],
  getMyThreadForGig: async () => null,
  GIG_TYPE_LABEL: { task: "Task" },
  gigBudgetLabel: () => "",
}));
vi.mock("@/components/brand/section-crumb", () => ({ SectionCrumb: () => null }));

import { SaveButton } from "@/components/brand/save-button";
import { PostedShareCard } from "@/components/brand/posted-share-card";
import GigDetailPage from "@/app/gigs/[slug]/page";

afterEach(() => { cleanup(); vi.clearAllMocks(); });

test("the overlay Save control uses brand corners and preserves its signed-out return path", () => {
  render(<SaveButton projectId="example" initialSaved={false} isAuthed={false} redirectTo="/showcase/example" />);
  const save = screen.getByRole("button", { name: "Save" });
  expect(save.className).toContain("rounded-input");
  expect(save.className).not.toContain("rounded-full");
  fireEvent.click(save);
  expect(mocks.push).toHaveBeenCalledWith("/login?next=%2Fshowcase%2Fexample");
  expect(mocks.save).not.toHaveBeenCalled();
});

test("the share-card Dismiss control uses brand corners and still removes the banner", () => {
  render(<PostedShareCard path="/showcase/example" title="Example" caption="Example project" />);
  const dismiss = screen.getByRole("button", { name: "Dismiss" });
  expect(dismiss.className).toContain("rounded-input");
  expect(dismiss.className).not.toContain("rounded-full");
  fireEvent.click(dismiss);
  expect(screen.queryByText("Posted! Now share it")).toBeNull();
});

test("gig owner status controls retain submission and selected state with brand corners", async () => {
  render(await GigDetailPage({ params: Promise.resolve({ slug: "example" }) }));
  for (const label of ["Open", "In progress", "Closed"]) {
    const control = screen.getByRole("button", { name: label });
    expect(control.className).toContain("rounded-input");
    expect(control.className).not.toContain("rounded-full");
    expect(control.getAttribute("type")).toBe("submit");
    expect(control.getAttribute("aria-pressed")).toBe(label === "Open" ? "true" : "false");
    expect(control.closest("form")).not.toBeNull();
  }
  expect(mocks.status).not.toHaveBeenCalled();
});
