// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { AvatarCircle } from "@/components/brand/avatar-circle";
import { DetailHero } from "@/components/brand/detail-hero";
afterEach(cleanup);
it("names initial-only avatars with the full name", () => {
  render(<AvatarCircle name="Mendy Cohen" />);
  expect(screen.getByRole("img", { name: "Mendy Cohen" }).textContent).toBe("MC");
});
it("keeps the avatar name consistent when a photo is supplied", () => {
  render(<AvatarCircle name="Mendy Cohen" src="/avatar.png" />);
  expect(screen.getAllByRole("img")).toHaveLength(1);
  expect(screen.getByRole("img", { name: "Mendy Cohen" }).querySelector("img")?.alt).toBe("");
});
it("keeps long detail titles readable on the solid brand cover", () => {
  const { container } = render(<DetailHero accent="gold" title="Averylongprojectnamewithoutspaces" />);
  expect(screen.getByRole("heading", { level: 1 }).className).toContain("break-words");
  expect(container.firstElementChild?.getAttribute("style")).toContain("background: var(--color-petrol)");
  expect(screen.getByRole("heading", { level: 1 }).className).toContain("text-white");
});
