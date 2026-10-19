// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { useMobileKeyboard } from "@/hooks/use-mobile-keyboard";

let viewport: EventTarget & { height: number; scale: number };
function Fixture() {
  const hidden = useMobileKeyboard();
  return <><input aria-label="Search" /><input type="checkbox" aria-label="Check" /><button>Done</button><nav aria-label="Mobile" hidden={hidden} /></>;
}
function resize(height: number) {
  act(() => { viewport.height = height; viewport.dispatchEvent(new Event("resize")); });
}
beforeEach(() => {
  viewport = Object.assign(new EventTarget(), { height: 800, scale: 1 });
  vi.stubGlobal("visualViewport", viewport);
  vi.stubGlobal("innerHeight", 800);
  vi.stubGlobal("innerWidth", 375);
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("hides the bar for a text keyboard and restores it on dismissal", () => {
  render(<Fixture />);
  const nav = screen.getByRole("navigation");
  act(() => screen.getByRole("textbox").focus());
  expect(nav.hidden).toBe(false);
  resize(480);
  expect(nav.hidden).toBe(true);
  resize(800);
  expect(nav.hidden).toBe(false);
});
it("restores navigation when focus leaves the editor", () => {
  render(<Fixture />);
  const nav = screen.getByRole("navigation");
  act(() => screen.getByRole("textbox").focus());
  resize(480);
  act(() => screen.getByRole("button").focus());
  expect(nav.hidden).toBe(false);
});
it("does not confuse pinch zoom or checkbox focus with a keyboard", () => {
  render(<Fixture />);
  const nav = screen.getByRole("navigation");
  act(() => screen.getByRole("checkbox").focus());
  resize(480);
  expect(nav.hidden).toBe(false);
  viewport.scale = 2;
  act(() => screen.getByRole("textbox").focus());
  expect(nav.hidden).toBe(false);
});
it("resets its height baseline after rotating to landscape", () => {
  render(<Fixture />);
  const nav = screen.getByRole("navigation");
  act(() => screen.getByRole("textbox").focus());
  vi.stubGlobal("innerWidth", 800);
  vi.stubGlobal("innerHeight", 375);
  resize(375);
  expect(nav.hidden).toBe(false);
});
