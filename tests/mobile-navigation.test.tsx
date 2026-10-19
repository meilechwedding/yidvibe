// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";

vi.mock("next/navigation", () => ({ usePathname: () => "/showcase" }));
vi.mock("@/lib/actions/auth", () => ({ signOut: vi.fn() }));
vi.mock("@/components/brand/avatar-circle", () => ({ AvatarCircle: () => null }));
import { MobileBottomNav } from "@/components/site/mobile-bottom-nav";
import { NavLinks } from "@/components/site/nav-links";
import { PostMenu } from "@/components/site/post-menu";
import { UserMenu } from "@/components/site/user-menu";
import { NAV_LINKS_ALL } from "@/config/navigation";

afterEach(cleanup);

it("provides direct Explore navigation with active state and no retired modules", () => {
  render(<NavLinks links={NAV_LINKS_ALL} />);
  expect(screen.getByRole("navigation", { name: "Primary" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Explore" }).getAttribute("href")).toBe("/showcase");
  expect(screen.getByRole("link", { name: "Explore" }).getAttribute("aria-current")).toBe("page");
  expect(screen.getByRole("link", { name: "Builders" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Directory" })).toBeTruthy();
  expect(screen.queryByRole("link", { name: "Competitions" })).toBeNull();
  expect(screen.queryByRole("link", { name: "Events" })).toBeNull();
});

it.each([false, true])("removes the duplicate bottom navigation for auth state %s", isAuthed => {
  const { container } = render(<MobileBottomNav navLinks={NAV_LINKS_ALL} isAuthed={isAuthed} />);
  expect(container.childElementCount).toBe(0);
});

it("keeps Post understated and preserves the project and enabled gig destinations", async () => {
  const { container } = render(<PostMenu enabledFlags={{ "module.gigs": true, "module.competitions": true }} />);
  const trigger = screen.getByRole("button", { name: "Post" });
  expect(trigger.className).toContain("btn-ghost");
  expect(trigger.className).not.toContain("fixed");
  fireEvent.click(trigger);
  const dialog = screen.getByRole("dialog", { name: "What do you want to post?" });
  expect(container.contains(dialog)).toBe(false);
  expect(within(dialog).getByRole("link", { name: /Project/ }).getAttribute("href")).toBe("/showcase/submit");
  expect(within(dialog).getByRole("link", { name: /Gig/ }).getAttribute("href")).toBe("/gigs/post");
  expect(within(dialog).queryByRole("link", { name: /Competition/ })).toBeNull();
  fireEvent.keyDown(dialog, { key: "Escape" });
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect(document.activeElement).toBe(trigger);
});

it("names the account menu even when its avatar has no text", () => {
  render(<UserMenu profile={{ handle: "dummy", name: "Dummy User", avatar_url: null }} />);
  expect(screen.getByRole("button", { name: "Account menu" })).toBeTruthy();
});
