// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

const fixture = vi.hoisted(() => ({
  isPublic: false,
  viewer: null as null | { id: string },
  coverUrl: null as string | null,
}));
vi.mock("@/lib/queries", () => ({
  getProjectById: async () => ({
    id: "p",
    name: "Example",
    description: "Project",
    owner_id: "owner",
    owner: { handle: "maker", name: "Maker" },
    created_at: "2026-01-01",
    tools: [],
    tags: [],
    upvote_count: 0,
  }),
  getProfileByHandle: async () => ({
    id: "owner",
    handle: "maker",
    name: "Private name",
    bio: "Private biography",
    is_public: fixture.isPublic,
    cover_url: fixture.coverUrl,
    avatar_url: null,
    tools: [],
    skills: [],
    created_at: "2026-01-01",
    show_real_name: true,
    links: { email: "private@example.test" },
  }),
  getComments: async () => [],
  getMyUpvotedProjectIds: async () => new Set(),
  getMySavedProjectIds: async () => new Set(),
  getProjectsByOwner: async () => [],
}));
vi.mock("@/lib/current-user", () => ({
  getCurrentProfile: async () => fixture.viewer,
}));
vi.mock("@/lib/admin", () => ({
  getAdminContext: async () => null,
  isAdminUnlocked: async () => false,
}));
vi.mock("@/lib/actions/projects", () => ({ deleteProject: vi.fn() }));
vi.mock("next/link", () => ({
  default: ({
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
}));
vi.mock("@/components/brand/section-crumb", () => ({
  SectionCrumb: () => null,
}));
vi.mock("@/components/brand/media-gallery", () => ({
  MediaGallery: () => null,
}));
vi.mock("@/components/showcase/comments-card", () => ({
  CommentsCard: () => null,
}));
vi.mock("@/components/brand/upvote-button", () => ({
  UpvoteButton: () => null,
}));
vi.mock("@/components/brand/save-button", () => ({ SaveButton: () => null }));
vi.mock("@/components/brand/share-button", () => ({ ShareButton: () => null }));
vi.mock("@/components/brand/report-menu", () => ({ ReportMenu: () => null }));
vi.mock("@/components/showcase/delete-project-button", () => ({
  DeleteProjectButton: () => null,
}));
vi.mock("@/components/showcase/claim-button", () => ({
  ClaimButton: () => null,
}));
vi.mock("@/components/brand/posted-share-card", () => ({
  PostedShareCard: () => null,
}));
vi.mock("@/components/admin/feature-toggle", () => ({
  FeatureToggle: () => null,
}));
import ProjectDetailPage from "@/app/showcase/[id]/page";
import ProfilePage, { generateMetadata } from "@/app/u/[handle]/page";

afterEach(() => {
  cleanup();
  fixture.isPublic = false;
  fixture.viewer = null;
  fixture.coverUrl = null;
});

test("a guest sees truthful private-builder messaging without contact or profile CTA", async () => {
  render(await ProjectDetailPage({ params: Promise.resolve({ id: "p" }) }));
  expect(screen.getByText(/Contact details are unavailable/)).toBeTruthy();
  expect(screen.queryByRole("link", { name: "Email" })).toBeNull();
  expect(screen.queryByRole("link", { name: "View profile" })).toBeNull();
  expect(screen.queryByText("Reach out")).toBeNull();
});

test("a public builder keeps the existing profile and contact actions", async () => {
  fixture.isPublic = true;
  render(await ProjectDetailPage({ params: Promise.resolve({ id: "p" }) }));
  expect(screen.getByRole("link", { name: "Email" }).getAttribute("href")).toBe(
    "mailto:private@example.test",
  );
  expect(screen.getByRole("link", { name: "View profile" })).toBeTruthy();
});

test("private profile metadata omits its name and biography", async () => {
  const metadata = await generateMetadata({
    params: Promise.resolve({ handle: "maker" }),
  });
  expect(metadata.title).toBe("Builder profile");
  expect(JSON.stringify(metadata)).not.toContain("Private biography");
  expect(JSON.stringify(metadata)).not.toContain("Private name");
});

test("public profile metadata keeps its public identity", async () => {
  fixture.isPublic = true;
  const metadata = await generateMetadata({
    params: Promise.resolve({ handle: "maker" }),
  });
  expect(metadata.description).toBe("Private biography");
});

test("a public profile without a cover keeps identity and contact details visible", async () => {
  fixture.isPublic = true;
  const { container } = render(
    await ProfilePage({ params: Promise.resolve({ handle: "maker" }) }),
  );
  expect(screen.getByRole("heading", { name: "Private name" })).toBeTruthy();
  expect(container.querySelector(".connected-aside")).not.toBeNull();
  expect(container.querySelector('img[src=""]')).toBeNull();
});

test("a supplied profile cover keeps its image instead of the solid fallback", async () => {
  fixture.isPublic = true;
  fixture.coverUrl = "/example-cover.png";
  const { container } = render(
    await ProfilePage({ params: Promise.resolve({ handle: "maker" }) }),
  );
  expect(
    container.querySelector('img[src="/example-cover.png"]'),
  ).not.toBeNull();
  expect(container.querySelector("div.h-28")).toBeNull();
});
