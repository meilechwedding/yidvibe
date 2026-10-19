// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";

vi.mock("next/navigation", () => ({ usePathname: () => "/showcase" }));
vi.mock("@/lib/actions/auth", () => ({ signOut: vi.fn() }));
vi.mock("@/components/brand/avatar-circle", () => ({ AvatarCircle: () => null }));
import { MobileBottomNav } from "@/components/site/mobile-bottom-nav";
import { NavLinks } from "@/components/site/nav-links";
import { PostLink } from "@/components/site/post-link";
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
  expect(screen.queryByRole("link", { name: "Gigs" })).toBeNull();
});

it("provides three labeled destinations and direct project posting on mobile", () => {
  render(<MobileBottomNav navLinks={NAV_LINKS_ALL} />);
  const nav = screen.getByRole("navigation", { name: "Mobile primary" });
  expect(within(nav).getAllByRole("link").map(link => link.textContent)).toEqual(["Explore", "Builders", "Post", "Directory"]);
  expect(Array.from(nav.children).map(child => child.textContent)).toEqual(["Explore", "Builders", "Post", "Directory"]);
  expect(within(nav).getByRole("link", { name: "Explore" }).getAttribute("aria-current")).toBe("page");
  expect(within(nav).getByRole("link", { name: "Post" }).className).toContain("mobile-nav-post");
});

it("keeps project posting available when optional destinations are disabled", () => {
  render(<MobileBottomNav navLinks={NAV_LINKS_ALL.filter(link => !link.flag)} />);
  const nav = screen.getByRole("navigation", { name: "Mobile primary" });
  expect(within(nav).getAllByRole("link").map(link => link.textContent)).toEqual(["Explore", "Post"]);
  expect(within(nav).getByRole("link", { name: "Post" }).getAttribute("href")).toBe("/showcase/submit");
});

it("provides a normal project link without a posting chooser", () => {
  render(<PostLink />);
  const post = screen.getByRole("link", { name: "Post" });
  expect(post.getAttribute("href")).toBe("/showcase/submit");
  expect(post.className).toContain("nav-post");
  expect(post.className).not.toContain("fixed");
  expect(screen.queryByRole("dialog")).toBeNull();
});

it("removes retired posting choices from the account menu", () => {
  render(<UserMenu profile={{ handle: "dummy", name: "Dummy User", avatar_url: null }} />);
  fireEvent.keyDown(screen.getByRole("button", { name: "Account menu" }), { key: "ArrowDown" });
  expect(screen.getByRole("menuitem", { name: "Post your project" }).getAttribute("href")).toBe("/showcase/submit");
  expect(screen.queryByRole("menuitem", { name: /gig/i })).toBeNull();
});

it("names the account menu even when its avatar has no text", () => {
  render(<UserMenu profile={{ handle: "dummy", name: "Dummy User", avatar_url: null }} />);
  expect(screen.getByRole("button", { name: "Account menu" })).toBeTruthy();
});
