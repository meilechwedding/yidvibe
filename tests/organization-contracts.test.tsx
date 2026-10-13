// @vitest-environment jsdom
import React from "react";
import { spawnSync } from "node:child_process";
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import DocsPage from "@/app/docs/page";
import { BrowseBy } from "@/components/brand/browse-by";
import { FormField } from "@/components/brand/form-field";
import { IMAGE_THEME } from "@/lib/design/image-theme";
import palette from "@/styles/palette.json";
import { contactHref, hasAnyContact } from "@/lib/domain/contacts";
import * as legacy from "@/lib/site";
import { SITE_NAME } from "@/config/site";

vi.mock("next/link", () => ({ default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a> }));
afterEach(cleanup);

test("serialized metadata colors and generated CSS share one palette source", () => {
  expect(IMAGE_THEME.primary).toBe(palette.colors["teal-600"]);
  expect(IMAGE_THEME.canvas).toBe(palette.colors.canvas);
  const result = spawnSync(process.execPath, ["scripts/sync-theme.mjs", "--check"], { encoding: "utf8" });
  expect(result.status, result.stderr).toBe(0);
});

test("compatibility imports retain original identity and contact contracts", () => {
  expect(legacy.SITE_NAME).toBe(SITE_NAME);
  expect(legacy.contactHref).toBe(contactHref);
  expect(contactHref("email", " builder@example.com ")).toBe("mailto:builder@example.com");
  expect(contactHref("whatsapp", "+1 (555) 555-0101")).toBe("https://wa.me/15555550101");
  expect(hasAnyContact({ email: "   " })).toBe(false);
});

test("marquee's visual clones do not double keyboard or screen reader links", () => {
  render(<BrowseBy tags={["Torah", "Community"]} />);
  expect(screen.getAllByRole("link")).toHaveLength(2);
  for (const clone of document.querySelectorAll('a[aria-hidden="true"]')) expect(clone.getAttribute("tabindex")).toBe("-1");
});

test("shared required field communicates requirement without changing form validation", () => {
  render(<FormField label="Project name" required><input /></FormField>);
  const control = screen.getByRole("textbox", { name: "Project name" });
  expect(control.getAttribute("aria-required")).toBe("true");
  expect(control.hasAttribute("required")).toBe(false);
});

test("help copy matches the implemented account gate for votes", () => {
  render(<DocsPage />);
  expect(screen.getByText(/Sign in to upvote, comment or reply/)).toBeTruthy();
  expect(screen.queryByText(/upvote without an account|Upvoting works without an account/)).toBeNull();
});
