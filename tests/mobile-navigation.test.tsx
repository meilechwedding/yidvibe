// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";

vi.mock("next/navigation", () => ({ usePathname: () => "/showcase" }));
vi.mock("@/components/site/post-menu", () => ({ PostMenu: () => null }));
vi.mock("@/lib/actions/auth", () => ({ signOut: vi.fn() }));
vi.mock("@/components/brand/avatar-circle", () => ({ AvatarCircle: () => null }));
import { MobileBottomNav } from "@/components/site/mobile-bottom-nav";
import { UserMenu } from "@/components/site/user-menu";

afterEach(cleanup);

it("portals the named Explore dialog, closes with Escape, and restores trigger focus", async () => {
  const { container } = render(<MobileBottomNav navLinks={[{ href: "/showcase", label: "Showcase" }, { href: "/directory", label: "Directory" }]} />);
  const trigger = screen.getByRole("button", { name: "Explore" });
  trigger.focus();
  fireEvent.click(trigger);
  const dialog = screen.getByRole("dialog", { name: "Explore" });
  expect(container.contains(dialog)).toBe(false);
  expect(dialog.contains(document.activeElement)).toBe(true);
  expect(within(dialog).getByRole("link", { name: "Directory" })).toBeTruthy();
  fireEvent.keyDown(document.activeElement!, { key: "Escape" });
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  await waitFor(() => expect(document.activeElement).toBe(trigger));
  fireEvent.click(trigger);
  fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Close" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
});

it("names the account menu even when its avatar has no text", () => {
  render(<UserMenu profile={{ handle: "dummy", name: "Dummy User", avatar_url: null }} />);
  expect(screen.getByRole("button", { name: "Account menu" })).toBeTruthy();
});
