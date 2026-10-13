// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeAll, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ToolsSkills } from "@/components/profile/tools-skills";
import { ProjectForm } from "@/components/showcase/project-form";
import { ProfileForm } from "@/components/profile/profile-form";
import { AuthForms } from "@/components/auth/auth-forms";
import { CoverAvatarInput } from "@/components/profile/cover-avatar-input";
import { MessageComposer } from "@/components/gigs/message-composer";

const mocks = vi.hoisted(() => ({ auth: vi.fn(), upload: vi.fn(), toast: vi.fn() }));
vi.mock("@/lib/actions/auth", () => ({ signInWithGoogle: vi.fn(), signInWithPassword: mocks.auth, signUpWithPassword: vi.fn() }));
vi.mock("@/lib/actions/profile", () => ({ updateProfile: vi.fn() }));
vi.mock("@/lib/actions/gigs", () => ({ sendMessage: vi.fn() }));
vi.mock("@/lib/image/upload", () => ({ uploadImage: mocks.upload }));
vi.mock("sonner", () => ({ toast: { error: mocks.toast } }));
vi.mock("next/navigation", () => ({ usePathname: () => "/showcase", useRouter: () => ({ back: vi.fn(), push: vi.fn() }) }));
vi.mock("next/link", () => ({ default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a> }));
vi.mock("@/components/brand/cancel-button", () => ({ CancelButton: () => <button type="button">Cancel</button> }));
vi.mock("@/components/brand/sparkle", () => ({ LogoMark: () => null }));
beforeAll(() => { HTMLElement.prototype.scrollIntoView = vi.fn(); });
afterEach(() => { cleanup(); vi.clearAllMocks(); });

it("profile tool and skill links target the route that accepts these filters", () => {
  render(<ToolsSkills tools={["Claude Code"]} skills={["UI design"]} />);
  expect(screen.getByRole("link", { name: "Claude Code" }).getAttribute("href")).toBe("/builders?tool=Claude%20Code");
  expect(screen.getByRole("link", { name: "UI design" }).getAttribute("href")).toBe("/builders?skill=UI%20design");
});

it("names the project URL and exposes ownership choice state", () => {
  render(<ProjectForm action={async () => ({})} isLoggedIn />);
  expect(screen.getByLabelText(/Project link/).getAttribute("name")).toBe("url");
  const mine = screen.getByRole("button", { name: /I built this/ });
  const found = screen.getByRole("button", { name: /I found it on the web/ });
  expect(mine.getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(found);
  expect(mine.getAttribute("aria-pressed")).toBe("false");
  expect(found.getAttribute("aria-pressed")).toBe("true");
});

it("names every grouped profile contact and link control", () => {
  render(<ProfileForm profile={{ name: "Builder", handle: "builder", tools: [], skills: [] } as never} />);
  for (const name of ["Email", "Phone", "WhatsApp number", "Instagram handle", "Website", "GitHub", "X / Twitter", "LinkedIn", "Add another tool", "Add a skill"]) {
    expect(screen.getByLabelText(name)).toBeTruthy();
  }
});

it("associates an auth error with its input and announces global failure", async () => {
  mocks.auth.mockResolvedValue({ error: "Check your details", fieldErrors: { email: "Use a valid email" } });
  render(<AuthForms next="/" />);
  fireEvent.submit(screen.getByLabelText("Email").closest("form")!);
  await screen.findByRole("alert");
  const email = screen.getByLabelText("Email");
  expect(email.getAttribute("aria-invalid")).toBe("true");
  expect(document.getElementById(email.getAttribute("aria-describedby")!)?.textContent).toBe("Use a valid email");
});

it("recovers the media controls and reports a rejected upload without submitting", async () => {
  mocks.upload.mockRejectedValue(new Error("mock transport failure"));
  const uploading = vi.fn();
  const { container } = render(<CoverAvatarInput fallbackInitial="B" onUploadingChange={uploading} />);
  const file = container.querySelector('input[type="file"]')!;
  fireEvent.change(file, { target: { files: [new File(["mock"], "cover.png", { type: "image/png" })] } });
  await waitFor(() => expect(mocks.toast).toHaveBeenCalledWith("Upload failed."));
  expect(uploading.mock.calls.map(call => call[0])).toEqual([true, false]);
  expect((screen.getByRole("button", { name: "Add cover" }) as HTMLButtonElement).disabled).toBe(false);
});

it("requires a nonempty message in the composer native validation path", () => {
  render(<MessageComposer threadId="mock" slug="mock" />);
  const message = screen.getByLabelText("Message") as HTMLTextAreaElement;
  expect(message.checkValidity()).toBe(false);
  fireEvent.change(message, { target: { value: "Local fixture only" } });
  expect(message.checkValidity()).toBe(true);
});


it("associates project field validation errors with the affected controls", async () => {
  render(<ProjectForm action={async () => ({ fieldErrors: { name: "Give your project a name", description: "Describe your project", url: "Use a valid URL" } })} />);
  fireEvent.submit(screen.getByLabelText(/Project link/).closest("form")!);
  await screen.findByText("Give your project a name");
  for (const label of [/^Name/, /^Description/, /Project link/]) {
    const input = screen.getByLabelText(label);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(document.getElementById(input.getAttribute("aria-describedby")!)?.textContent).toBeTruthy();
  }
  expect(screen.getByLabelText("Add another tool")).toBeTruthy();
  expect(screen.getByLabelText("Add another category")).toBeTruthy();
});
