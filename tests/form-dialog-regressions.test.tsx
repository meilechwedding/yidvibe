// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ProjectForm } from "@/components/showcase/project-form";
import { ProfileForm } from "@/components/profile/profile-form";
import { PostMenu } from "@/components/site/post-menu";
import { FeedbackWidget } from "@/components/site/feedback-widget";

const mocks = vi.hoisted(() => ({ upload: vi.fn(), feedback: vi.fn(), profile: vi.fn() }));
vi.mock("@/lib/image/upload", () => ({ uploadImage: mocks.upload }));
vi.mock("@/lib/actions/feedback", () => ({ createFeedback: mocks.feedback }));
vi.mock("@/lib/actions/profile", () => ({ updateProfile: mocks.profile }));
vi.mock("next/navigation", () => ({ usePathname: () => "/showcase", useRouter: () => ({ back: vi.fn(), push: vi.fn() }) }));
vi.mock("next/link", () => ({ default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a> }));
vi.mock("@/components/brand/cancel-button", () => ({ CancelButton: ({ dirty }: { dirty: boolean }) => <button type="button">{dirty ? "Discard draft" : "Cancel"}</button> }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe("form and dialog regressions", () => {
  it("marks a project chip-only edit dirty", () => {
    render(<ProjectForm action={async () => ({})} />);
    const chip = document.querySelector<HTMLButtonElement>('button[aria-pressed="false"]')!;
    fireEvent.click(chip);
    expect(screen.getByText("Discard draft")).toBeTruthy();
    expect(chip.getAttribute("aria-pressed")).toBe("true");
  });

  it("blocks both project submit and implicit submit during an upload, then includes the final URL", async () => {
    let finish!: (value: { url: string }) => void;
    mocks.upload.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
    const { container } = render(<ProjectForm action={async () => ({})} />);
    fireEvent.change(container.querySelector('input[type="file"]')!, { target: { files: [new File(["image"], "cover.png", { type: "image/png" })] } });
    expect((container.querySelector('button[type="submit"]') as HTMLButtonElement).disabled).toBe(true);
    expect(fireEvent.submit(container.querySelector("form")!)).toBe(false);
    await act(async () => { finish({ url: "https://example.com/cover.png" }); });
    expect((container.querySelector('button[type="submit"]') as HTMLButtonElement).disabled).toBe(false);
    expect((container.querySelector('input[name="image_url"]') as HTMLInputElement).value).toBe("https://example.com/cover.png");
  });

  it("keeps project submission blocked until both cover and gallery uploads settle", async () => {
    const finishes: Array<(value: { url: string }) => void> = [];
    mocks.upload.mockImplementation(() => new Promise(resolve => finishes.push(resolve)));
    const { container } = render(<ProjectForm action={async () => ({})} />);
    const files = container.querySelectorAll('input[type="file"]');
    for (const input of files) {
      fireEvent.change(input, { target: { files: [new File(["image"], "image.png")] } });
    }
    await act(async () => { finishes[0]({ url: "https://example.com/cover.png" }); });
    expect((container.querySelector('button[type="submit"]') as HTMLButtonElement).disabled).toBe(true);
    expect(fireEvent.submit(container.querySelector("form")!)).toBe(false);
    await act(async () => { finishes[1]({ url: "https://example.com/gallery.png" }); });
    expect((container.querySelector('button[type="submit"]') as HTMLButtonElement).disabled).toBe(false);
    expect((container.querySelector('input[name="images"]') as HTMLInputElement).value).toBe("https://example.com/gallery.png");
  });

  it("blocks profile saves and concurrent avatar uploads while a cover upload is pending", async () => {
    let finish!: (value: { url: string }) => void;
    mocks.upload.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
    const { container } = render(<ProfileForm profile={{ name: "Builder", handle: "builder", tools: [], skills: [] } as never} />);
    fireEvent.change(container.querySelector('input[type="file"]')!, { target: { files: [new File(["image"], "cover.png")] } });
    expect((screen.getByLabelText("Change photo") as HTMLButtonElement).disabled).toBe(true);
    expect(fireEvent.submit(container.querySelector("form")!)).toBe(false);
    await act(async () => { finish({ url: "https://example.com/cover.png" }); });
    expect((container.querySelector('button[type="submit"]') as HTMLButtonElement).disabled).toBe(false);
    expect(screen.getByText("Discard draft")).toBeTruthy();
  });

  it("portals the Post dialog out of its nav and closes with Escape, restoring focus", async () => {
    const { container } = render(<nav><PostMenu variant="mobile" /></nav>);
    const trigger = screen.getByRole("button", { name: "Post" });
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "What do you want to post?" });
    expect(container.contains(dialog)).toBe(false);
    fireEvent.keyDown(dialog, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("names the feedback dialog and restores trigger focus after Escape", async () => {
    render(<FeedbackWidget />);
    const trigger = screen.getByRole("button", { name: "Send feedback" });
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Send feedback" });
    fireEvent.keyDown(dialog, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it("starts a fresh feedback form after a successful session is closed", async () => {
    mocks.feedback.mockResolvedValue({ ok: true });
    render(<FeedbackWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Send feedback" }));
    fireEvent.change(screen.getByLabelText("Feedback message"), { target: { value: "Local mocked feedback" } });
    fireEvent.submit(screen.getByLabelText("Feedback message").closest("form")!);
    await screen.findByText(/we read every note/);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.click(screen.getByRole("button", { name: "Send feedback" }));
    expect(screen.getByLabelText("Feedback message")).toBeTruthy();
    expect(screen.queryByText(/we read every note/)).toBeNull();
    expect(mocks.feedback).toHaveBeenCalledTimes(1);
  });
});
