// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";

const state = vi.hoisted(() => ({
  profile: null as null | { handle: string; name: string; avatar_url: null },
  user: null as null | { id: string },
  redirect: vi.fn((path: string) => { throw new Error(`REDIRECT:${path}`); }),
}));
vi.mock("next/navigation", () => ({ usePathname: () => "/showcase", redirect: state.redirect }));
vi.mock("@/lib/current-user", () => ({ getCurrentProfile: async () => state.profile, getAuthUser: async () => state.user }));
vi.mock("@/lib/admin", () => ({ getAdminContext: async () => null }));
vi.mock("@/lib/flags", () => ({ isFeatureEnabled: async () => true }));
vi.mock("@/lib/notifications", () => ({ getNotificationSummary: async () => ({ items: [], unread: 0 }), describeNotification: vi.fn() }));
vi.mock("@/lib/actions/auth", () => ({ signOut: vi.fn() }));
vi.mock("@/lib/actions/projects", () => ({ createProject: vi.fn() }));
vi.mock("@/components/showcase/project-form", () => ({ ProjectForm: () => <form aria-label="Project form" /> }));
vi.mock("@/components/site/notification-bell", () => ({ NotificationBell: () => <button>Notifications</button> }));

import { SiteNav } from "@/components/site/site-nav";
import SubmitProjectPage from "@/app/showcase/submit/page";

afterEach(cleanup);
beforeEach(() => {
  state.profile = null;
  state.user = null;
  state.redirect.mockClear();
});

it.each([false, true])("keeps one Post in the header beside guest/account controls (member=%s)", async member => {
  if (member) state.profile = { name: "Example Builder", handle: "example", avatar_url: null };
  render(await SiteNav());
  const header = screen.getByRole("banner");
  expect(within(header).getAllByRole("link", { name: "Post", exact: true })).toHaveLength(1);
  if (member) expect(within(header).getByRole("button", { name: "Account menu" })).toBeTruthy();
  else expect(within(header).getByRole("link", { name: "Sign in" }).getAttribute("href")).toBe("/login");
  expect(within(header).getByRole("link", { name: "Explore" }).getAttribute("href")).toBe("/showcase");
  expect(screen.queryByRole("link", { name: "Events" })).toBeNull();
  expect(screen.queryByRole("link", { name: "Competitions" })).toBeNull();
  expect(screen.queryByRole("link", { name: "Gigs" })).toBeNull();
  expect(within(header).getByRole("link", { name: "Post", exact: true }).getAttribute("href")).toBe("/showcase/submit");
  expect(screen.queryByRole("dialog")).toBeNull();
});

it.each([
  ["project", SubmitProjectPage, "/login?next=/showcase/submit"],
] as const)("preserves the guest %s return path", async (_name, page, destination) => {
  await expect(page()).rejects.toThrow(`REDIRECT:${destination}`);
  expect(state.redirect).toHaveBeenCalledExactlyOnceWith(destination);
});

it.each([
  ["project", SubmitProjectPage, "Project form"],
] as const)("opens the %s form for an authenticated viewer", async (_name, page, label) => {
  state.user = { id: "example" };
  render(await page());
  expect(screen.getByRole("form", { name: label })).toBeTruthy();
  expect(state.redirect).not.toHaveBeenCalled();
});
