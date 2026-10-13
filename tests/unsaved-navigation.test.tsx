// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { BackLink } from "@/components/brand/back-link";

const router = vi.hoisted(() => ({ push: vi.fn(), back: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router, usePathname: () => "/showcase/submit" }));
const navigate = vi.fn();
function Draft({ dirty = true }: { dirty?: boolean }) {
  useUnsavedChanges(dirty);
  return <>
    <a href="/builders" onClick={(event) => { event.preventDefault(); navigate(); }}>Builders</a>
    <a href="#tools" onClick={(event) => event.preventDefault()}>Tools</a>
    <a href="/builders" target="_blank" onClick={(event) => event.preventDefault()}>New tab</a>
    <BackLink fallbackHref="/showcase" />
  </>;
}
beforeEach(() => {
  vi.clearAllMocks();
  window.history.replaceState(null, "", "/showcase/submit");
  vi.spyOn(window, "confirm").mockReturnValue(false);
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

test("canceling discard keeps an internal navigation from reaching its router handler", () => {
  render(<Draft />);
  fireEvent.click(screen.getByText("Builders"));
  expect(window.confirm).toHaveBeenCalledOnce();
  expect(navigate).not.toHaveBeenCalled();
});

test("accepting discard allows the original link navigation", () => {
  vi.mocked(window.confirm).mockReturnValue(true);
  render(<Draft />);
  fireEvent.click(screen.getByText("Builders"));
  expect(navigate).toHaveBeenCalledOnce();
});

test("clean forms and forms unmounted after navigation leave no global guard", () => {
  const view = render(<Draft />);
  view.rerender(<Draft dirty={false} />);
  fireEvent.click(screen.getByText("Builders"));
  expect(window.confirm).not.toHaveBeenCalled();
  expect(navigate).toHaveBeenCalledOnce();
  view.unmount();
  render(<Draft dirty={false} />);
  fireEvent.click(screen.getByText("Builders"));
  expect(window.confirm).not.toHaveBeenCalled();
});

test("hash links, new tabs and modified clicks do not discard the current draft", () => {
  render(<Draft />);
  fireEvent.click(screen.getByText("Tools"));
  fireEvent.click(screen.getByText("New tab"));
  fireEvent.click(screen.getByText("Builders"), { ctrlKey: true });
  expect(window.confirm).not.toHaveBeenCalled();
});

test("branded Back asks before leaving, and navigates only after confirmation", () => {
  render(<Draft />);
  fireEvent.click(screen.getByRole("button", { name: "Back" }));
  expect(router.push).not.toHaveBeenCalled();
  expect(router.back).not.toHaveBeenCalled();
  vi.mocked(window.confirm).mockReturnValue(true);
  fireEvent.click(screen.getByRole("button", { name: "Back" }));
  expect(router.push).toHaveBeenCalledWith("/showcase");
});

test("multiple dirty forms share a single confirmation listener", () => {
  render(<><Draft /><Draft /></>);
  fireEvent.click(screen.getAllByText("Builders")[0]);
  expect(window.confirm).toHaveBeenCalledOnce();
  expect(navigate).not.toHaveBeenCalled();
});
