// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { FormField } from "@/components/brand/form-field";

const mocks = vi.hoisted(() => ({ projects: vi.fn(), people: false }));
vi.mock("@/lib/queries", () => ({
  listProjects: mocks.projects,
  listTopBuilders: async () => [],
  getBrowseTags: async () => [],
}));
vi.mock("@/lib/flags", () => ({ isFeatureEnabled: async () => mocks.people }));
vi.mock("@/components/brand/reveal", () => ({
  Reveal: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
vi.mock("@/components/brand/browse-by", () => ({ BrowseBy: () => null }));
vi.mock("next/link", () => ({
  default: ({
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
}));
afterEach(cleanup);

test("homepage features actual work and links to the full project", async () => {
  mocks.projects.mockResolvedValue([
    { id: "latest", name: "Newest", featured: false },
    {
      id: "existing",
      name: "Existing project",
      description: "Useful work",
      featured: true,
    },
  ]);
  render(await Home());
  expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
    "Good work starts",
  );
  expect(
    screen
      .getByRole("link", { name: "View Existing project" })
      .getAttribute("href"),
  ).toBe("/showcase/existing");
  expect(screen.getByText("Featured project")).toBeTruthy();
  expect(screen.queryByRole("link", { name: "Find a builder" })).toBeNull();
});

test("homepage handles an empty community without invented projects", async () => {
  mocks.projects.mockResolvedValue([]);
  render(await Home());
  expect(screen.getByText("Every project starts somewhere.")).toBeTruthy();
  expect(
    screen.getByRole("link", { name: "Post a project" }).getAttribute("href"),
  ).toBe("/showcase/submit");
});

test("shared field associates the visible label, error and existing control ID", () => {
  render(
    <FormField label="Website" error="Use a valid URL">
      <input id="website" />
    </FormField>,
  );
  const control = screen.getByLabelText("Website");
  const label = screen.getByText("Website") as HTMLLabelElement;
  expect(label.htmlFor).toBe("website");
  expect(control.getAttribute("aria-invalid")).toBe("true");
  expect(
    document.getElementById(control.getAttribute("aria-describedby")!)
      ?.textContent,
  ).toBe("Use a valid URL");
});

test("shared field names a group without pointing its label at a hidden input", () => {
  render(
    <FormField label="Tools">
      <input type="hidden" />
      <div>
        <button type="button">Codex</button>
      </div>
    </FormField>,
  );
  expect(screen.getByRole("group", { name: "Tools" })).toBeTruthy();
});
