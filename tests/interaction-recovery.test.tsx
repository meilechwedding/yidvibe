// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ShareButton } from "@/components/brand/share-button";
import { NoteComposer } from "@/components/messaging/note-composer";
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/lib/actions/conversations", () => ({ sendMessage: vi.fn().mockResolvedValue({}) }));
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
test("native share failure falls back to clipboard", async () => {
  const copy = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "share", { configurable: true, value: vi.fn().mockRejectedValue(new Error("unavailable")) });
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: copy } });
  render(<ShareButton path="/showcase/test" />);
  fireEvent.click(screen.getByRole("button", { name: "Share" }));
  await waitFor(() => expect(copy).toHaveBeenCalledWith(expect.stringContaining("/showcase/test")));
});
test("canceling native share never copies without intent", async () => {
  const copy = vi.fn();
  Object.defineProperty(navigator, "share", { configurable: true, value: vi.fn().mockRejectedValue(new DOMException("Canceled", "AbortError")) });
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: copy } });
  render(<ShareButton path="/showcase/test" />);
  fireEvent.click(screen.getByRole("button", { name: "Share" }));
  await Promise.resolve();
  expect(copy).not.toHaveBeenCalled();
});
test("message composer names its input and respects composing Enter and Shift Enter", () => {
  render(<NoteComposer conversationId="fixture" />);
  const input = screen.getByRole("textbox", { name: "Message" });
  const submit = vi.spyOn(HTMLFormElement.prototype, "requestSubmit").mockImplementation(() => {});
  fireEvent.keyDown(input, { key: "Enter", isComposing: true });
  fireEvent.keyDown(input, { key: "Enter", shiftKey: true });
  expect(submit).not.toHaveBeenCalled();
  fireEvent.keyDown(input, { key: "Enter" });
  expect(submit).toHaveBeenCalledOnce();
  expect(input.hasAttribute("required")).toBe(true);
});
import { RotatingRow } from "@/components/brand/rotating-row";
test("carousel only exposes the active slide to keyboard and assistive technology", () => {
  Object.defineProperty(window, "matchMedia", { configurable: true, value: vi.fn().mockReturnValue({ matches: true }) });
  Object.defineProperty(window, "innerWidth", { configurable: true, value: 1200 });
  const view = render(<RotatingRow>{[1,2,3,4].map((id) => <a key={id} href={`#${id}`}>Card {id}</a>)}</RotatingRow>);
  expect(view.container.querySelectorAll('[inert]')).toHaveLength(1);
  expect(screen.queryByRole("link", { name: "Card 4" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Go to slide 2" }));
  expect(screen.queryByRole("link", { name: "Card 1" })).toBeNull();
  expect(screen.getByRole("link", { name: "Card 4" })).toBeTruthy();
});
import { FilterShell } from "@/components/filters/filter-shell";
test("board filter sheet has a name and closes with Escape", async () => {
  render(<FilterShell searchValue="" onSearchChange={vi.fn()} placeholder="Search" searchAriaLabel="Search fixtures" controls={() => <select aria-label="Fixture type"><option>All</option></select>} activeCount={0} chips={[]} onClearAll={vi.fn()} resultLabel="Showing fixtures" />);
  fireEvent.click(screen.getByRole("button", { name: "Filters" }));
  expect(screen.getByRole("dialog", { name: "Filters" })).toBeTruthy();
  fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
});
import { ImageInput } from "@/components/brand/image-input";
import { uploadImage } from "@/lib/image/upload";
vi.mock("@/lib/image/upload", () => ({ uploadImage: vi.fn() }));
test("thrown upload failure clears busy state and preserves image URL", async () => {
  vi.mocked(uploadImage).mockRejectedValueOnce(new Error("offline"));
  const busy = vi.fn();
  const view = render(<ImageInput name="cover" bucket="project-media" defaultValue="https://example.com/old.jpg" onUploadingChange={busy} />);
  fireEvent.change(view.container.querySelector('input[type="file"]')!, { target: { files: [new File(["fixture"], "image.png", { type: "image/png" })] } });
  await waitFor(() => expect(busy).toHaveBeenLastCalledWith(false));
  expect((screen.getByRole("textbox", { name: "Image URL" }) as HTMLInputElement).value).toBe("https://example.com/old.jpg");
});
