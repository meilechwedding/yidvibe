// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { ProjectForm } from "@/components/showcase/project-form";
import { GalleryInput } from "@/components/brand/gallery-input";

const mocks = vi.hoisted(() => ({
  upload: vi.fn(),
  error: vi.fn(),
  message: vi.fn(),
}));
vi.mock("@/lib/image/upload", () => ({ uploadImage: mocks.upload }));
vi.mock("sonner", () => ({
  toast: { error: mocks.error, message: mocks.message },
}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/showcase/submit",
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function fillDetails() {
  fireEvent.change(screen.getByLabelText(/^Project name/), {
    target: { value: "Community project" },
  });
  fireEvent.change(screen.getByLabelText(/^Description/), {
    target: { value: "A useful project for our community." },
  });
}

it("retains all project fields across steps and recovers from a server field error", async () => {
  const action = vi.fn(async () => ({
    error: "Please revise the name.",
    fieldErrors: { name: "This name is unavailable." },
  }));
  const { container } = render(<ProjectForm action={action} isLoggedIn />);
  fillDetails();
  fireEvent.change(screen.getByLabelText(/Project link/), {
    target: { value: "https://example.com/project" },
  });
  fireEvent.change(screen.getByLabelText("Add another category"), {
    target: { value: "Local category" },
  });
  fireEvent.keyDown(screen.getByLabelText("Add another category"), {
    key: "Enter",
  });
  fireEvent.change(screen.getByLabelText("Add another tool"), {
    target: { value: "Local tool" },
  });
  fireEvent.keyDown(screen.getByLabelText("Add another tool"), {
    key: "Enter",
  });
  fireEvent.click(
    screen.getByRole("button", { name: /I found it on the web/ }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  fireEvent.change(screen.getByLabelText("Image URL"), {
    target: { value: "https://example.com/cover.png" },
  });
  fireEvent.change(screen.getByLabelText(/Video \/ demo URL/), {
    target: { value: "https://example.com/demo" },
  });
  mocks.upload.mockResolvedValue({ url: "https://example.com/screenshot.png" });
  await act(async () =>
    fireEvent.change(container.querySelectorAll('input[type="file"]')[1], {
      target: {
        files: [new File(["fixture"], "screen.png", { type: "image/png" })],
      },
    }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  expect(screen.getByRole("button", { name: "Publish project" })).toBeTruthy();
  expect(action).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Edit details" }));
  expect(
    (screen.getByLabelText(/^Project name/) as HTMLInputElement).value,
  ).toBe("Community project");
  fireEvent.click(screen.getByRole("button", { name: "Review", exact: true }));
  const form = container.querySelector("form")!;
  const values = new FormData(form);
  expect(Object.fromEntries(values)).toMatchObject({
    name: "Community project",
    description: "A useful project for our community.",
    url: "https://example.com/project",
    image_url: "https://example.com/cover.png",
    video_url: "https://example.com/demo",
    images: "https://example.com/screenshot.png",
    ownership: "found",
  });
  expect(values.getAll("tools")).toEqual(["Local tool"]);
  expect(values.getAll("tags")).toEqual(["Local category"]);
  fireEvent.submit(form);
  await screen.findByRole("alert");
  await waitFor(() =>
    expect(document.activeElement).toBe(screen.getByRole("alert")),
  );
  expect(action).toHaveBeenCalledOnce();
  expect(
    (screen.getByLabelText(/^Project name/) as HTMLInputElement).value,
  ).toBe("Community project");
  expect(new FormData(form).get("images")).toBe(
    "https://example.com/screenshot.png",
  );
  fireEvent.click(
    screen.getByRole("button", { name: /Project name: This name/ }),
  );
  await waitFor(() =>
    expect(document.activeElement).toBe(screen.getByLabelText(/^Project name/)),
  );
});

it("routes a missing cover or link to Media and associates its error with the editable control", async () => {
  const action = vi.fn(async () => ({}));
  render(<ProjectForm action={action} />);
  fillDetails();
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  const image = screen.getByLabelText("Image URL");
  expect(image.getAttribute("aria-invalid")).toBe("true");
  expect(
    document.getElementById(image.getAttribute("aria-describedby")!)
      ?.textContent,
  ).toMatch(/Add a cover image/);
  fireEvent.click(screen.getByRole("button", { name: /Cover image:/ }));
  await waitFor(() => expect(document.activeElement).toBe(image));
  expect(action).not.toHaveBeenCalled();
});

it("recovers a failed gallery upload and never counts it as a successful addition", async () => {
  const changed = vi.fn();
  mocks.upload.mockResolvedValueOnce({ error: "Try again" });
  const { container } = render(
    <GalleryInput name="images" max={1} onValueChange={changed} />,
  );
  const input = container.querySelector('input[type="file"]')!;
  const file = new File(["fixture"], "screen.png", { type: "image/png" });
  await act(async () =>
    fireEvent.change(input, { target: { files: [file, file] } }),
  );
  expect(changed).not.toHaveBeenCalled();
  expect(mocks.message.mock.calls.flat().join(" ")).not.toContain("Added 1");
  expect(
    (screen.getByRole("button", { name: "Add" }) as HTMLButtonElement).disabled,
  ).toBe(false);
  mocks.upload.mockResolvedValueOnce({ url: "https://example.com/retry.png" });
  await act(async () => fireEvent.change(input, { target: { files: [file] } }));
  expect(changed).toHaveBeenLastCalledWith(["https://example.com/retry.png"]);
});
