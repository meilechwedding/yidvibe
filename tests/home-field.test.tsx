// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { FormField } from "@/components/brand/form-field";

const mocks = vi.hoisted(() => ({ votes: vi.fn(), saves: vi.fn() }));
vi.mock("@/lib/queries", () => ({
  listProjects: async () => [{ id: "existing", name: "Featured", featured: true }],
  listTopBuilders: async () => [],
  getBrowseTags: async () => [],
  getMyUpvotedProjectIds: mocks.votes,
  getMySavedProjectIds: mocks.saves,
}));
vi.mock("@/lib/flags", () => ({ isFeatureEnabled: async () => false }));
vi.mock("@/lib/current-user", () => ({ getAuthUser: async () => ({ id: "viewer" }) }));
vi.mock("@/components/showcase/project-row-card", () => ({
  ProjectRowCard: ({ upvoted, saved }: { upvoted: boolean; saved: boolean }) => <div data-testid="featured" data-upvoted={upvoted} data-saved={saved} />,
}));
vi.mock("@/components/brand/reveal", () => ({ Reveal: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));
vi.mock("@/components/brand/browse-by", () => ({ BrowseBy: () => null }));
vi.mock("next/link", () => ({ default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a> }));
afterEach(cleanup);

test("homepage project card retains the viewer's existing vote and save", async () => {
  mocks.votes.mockResolvedValue(new Set(["existing"]));
  mocks.saves.mockResolvedValue(new Set(["existing"]));
  render(await Home());
  expect(screen.getByTestId("featured").getAttribute("data-upvoted")).toBe("true");
  expect(screen.getByTestId("featured").getAttribute("data-saved")).toBe("true");
});

test("shared field associates the visible label, error and existing control ID", () => {
  render(<FormField label="Website" error="Use a valid URL"><input id="website" /></FormField>);
  const control = screen.getByLabelText("Website");
  const label = screen.getByText("Website") as HTMLLabelElement;
  expect(label.htmlFor).toBe("website");
  expect(control.getAttribute("aria-invalid")).toBe("true");
  expect(document.getElementById(control.getAttribute("aria-describedby")!)?.textContent).toBe("Use a valid URL");
});

test("shared field names a group without pointing its label at a hidden input", () => {
  render(<FormField label="Tools"><input type="hidden" /><div><button type="button">Codex</button></div></FormField>);
  expect(screen.getByRole("group", { name: "Tools" })).toBeTruthy();
});
