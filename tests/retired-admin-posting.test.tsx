// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

const mocks = vi.hoisted(() => ({ guard: vi.fn(), from: vi.fn(), post: vi.fn() }));
vi.mock("@/lib/admin", () => ({ requireAdminUnlocked: mocks.guard }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ from: mocks.from }) }));
vi.mock("@/lib/actions/admin", () => ({ adminPostContent: mocks.post }));
vi.mock("@/components/admin/content-manager", () => ({ ContentManager: ({ type }: { type: string }) => <div data-testid="content-type">{type}</div> }));
vi.mock("@/components/admin/post-as-control", () => ({ PostAsControl: () => null }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
import AdminContentPage from "@/app/admin/content/page";
import { AdminPostForm } from "@/components/admin/admin-post-form";
import { FLAG_DEFS } from "@/lib/flags";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.guard.mockResolvedValue({});
  mocks.from.mockReturnValue({ select: () => ({ order: () => ({ limit: async () => ({ data: [] }) }) }) });
});
afterEach(cleanup);

it("normalizes a stale admin tab to projects without reading retired records", async () => {
  render(await AdminContentPage({ searchParams: Promise.resolve({ type: "gigs" }) }));
  expect(mocks.from).toHaveBeenCalledExactlyOnceWith("projects");
  expect(mocks.guard.mock.invocationCallOrder[0]).toBeLessThan(mocks.from.mock.invocationCallOrder[0]);
  expect(screen.getByTestId("content-type").textContent).toBe("projects");
  expect(screen.queryByRole("link", { name: /gigs/i })).toBeNull();
});

it("preserves the admin guard before loading any content", async () => {
  mocks.guard.mockRejectedValueOnce(new Error("ADMIN_DENIED"));
  await expect(AdminContentPage({ searchParams: Promise.resolve({ type: "gigs" }) })).rejects.toThrow("ADMIN_DENIED");
  expect(mocks.from).not.toHaveBeenCalled();
});

it("removes the retired creation choice and launch control without posting anything", () => {
  render(<AdminPostForm users={[]} />);
  expect(screen.queryByRole("button", { name: /^gig$/i })).toBeNull();
  expect(screen.getByRole("button", { name: "Competition", exact: true })).toBeTruthy();
  expect(FLAG_DEFS.some(flag => flag.key === "module.gigs")).toBe(false);
  expect(mocks.post).not.toHaveBeenCalled();
});
