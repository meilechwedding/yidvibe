// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";

const state = vi.hoisted(() => ({
  profile: null as null | { handle: string; name: string; avatar_url: null },
  user: null as null | { id: string },
  gigs: true,
  redirect: vi.fn((path: string) => { throw new Error(`REDIRECT:${path}`); }),
}));
vi.mock("next/navigation", () => ({ usePathname: () => "/showcase", redirect: state.redirect }));
vi.mock("@/lib/current-user", () => ({ getCurrentProfile: async () => state.profile, getAuthUser: async () => state.user }));
vi.mock("@/lib/admin", () => ({ getAdminContext: async () => null }));
vi.mock("@/lib/flags", () => ({ isFeatureEnabled: async (flag: string) => flag === "module.gigs" ? state.gigs : true }));
vi.mock("@/lib/notifications", () => ({ getNotificationSummary: async () => ({ items: [], unread: 0 }), describeNotification: vi.fn() }));
vi.mock("@/lib/actions/auth", () => ({ signOut: vi.fn() }));
vi.mock("@/lib/actions/projects", () => ({ createProject: vi.fn() }));
vi.mock("@/components/showcase/project-form", () => ({ ProjectForm: () => <form aria-label="Project form" /> }));
vi.mock("@/components/gigs/gig-form", () => ({ GigForm: () => <form aria-label="Gig form" /> }));
vi.mock("@/components/site/notification-bell", () => ({ NotificationBell: () => <button>Notifications</button> }));

import { SiteNav } from "@/components/site/site-nav";
import SubmitProjectPage from "@/app/showcase/submit/page";
import PostGigPage from "@/app/gigs/post/page";

afterEach(cleanup);
beforeEach(() => {
  state.profile = null;
  state.user = null;
  state.gigs = true;
  state.redirect.mockClear();
});

it.each([false, true])("keeps one Post in the header beside guest/account controls (member=%s)", async member => {
  if (member) state.profile = { name: "Example Builder", handle: "example", avatar_url: null };
  render(await SiteNav());
  const header = screen.getByRole("banner");
  expect(within(header).getAllByRole("button", { name: "Post", exact: true })).toHaveLength(1);
  if (member) expect(within(header).getByRole("button", { name: "Account menu" })).toBeTruthy();
  else expect(within(header).getByRole("link", { name: "Sign in" }).getAttribute("href")).toBe("/login");
  expect(within(header).getByRole("link", { name: "Explore" }).getAttribute("href")).toBe("/showcase");
  expect(screen.queryByRole("link", { name: "Events" })).toBeNull();
  expect(screen.queryByRole("link", { name: "Competitions" })).toBeNull();
  fireEvent.click(within(screen.getByRole("banner")).getByRole("button", { name: "Post", exact: true }));
  const dialog = screen.getByRole("dialog");
  expect(within(dialog).getByRole("link", { name: /Project/ }).getAttribute("href")).toBe("/showcase/submit");
  expect(within(dialog).getByRole("link", { name: /Gig/ }).getAttribute("href")).toBe("/gigs/post");
});

it("hides the gig navigation and post choice while the module is disabled", async () => {
  state.gigs = false;
  render(await SiteNav());
  expect(screen.queryByRole("link", { name: "Gigs" })).toBeNull();
  fireEvent.click(within(screen.getByRole("banner")).getByRole("button", { name: "Post", exact: true }));
  expect(within(screen.getByRole("dialog")).queryByRole("link", { name: /Gig/ })).toBeNull();
});

it.each([
  ["project", SubmitProjectPage, "/login?next=/showcase/submit"],
  ["gig", PostGigPage, "/login?next=/gigs/post"],
] as const)("preserves the guest %s return path", async (_name, page, destination) => {
  await expect(page()).rejects.toThrow(`REDIRECT:${destination}`);
  expect(state.redirect).toHaveBeenCalledExactlyOnceWith(destination);
});

it.each([
  ["project", SubmitProjectPage, "Project form"],
  ["gig", PostGigPage, "Gig form"],
] as const)("opens the %s form for an authenticated viewer", async (_name, page, label) => {
  state.user = { id: "example" };
  render(await page());
  expect(screen.getByRole("form", { name: label })).toBeTruthy();
  expect(state.redirect).not.toHaveBeenCalled();
});
