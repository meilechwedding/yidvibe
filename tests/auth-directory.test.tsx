// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

vi.mock("@/lib/actions/auth", () => ({
  signInWithGoogle: vi.fn(),
  signInWithPassword: vi.fn(),
  signUpWithPassword: vi.fn(),
}));
vi.mock("@/lib/actions/directory", () => ({ createDirectoryListing: vi.fn() }));
vi.mock("@/components/brand/sparkle", () => ({ LogoMark: () => null }));
import { AuthForms } from "@/components/auth/auth-forms";
import { GetListedForm } from "@/components/directory/get-listed-form";

afterEach(cleanup);

describe("auth mode changes", () => {
  it("never reuses login credentials as plaintext signup fields", () => {
    render(<AuthForms next="/showcase/submit" />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "dummy@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "dummy-password" } });
    fireEvent.click(screen.getByRole("button", { name: "Create an account" }));
    for (const label of ["Your name", "Username", "Email", "Password"]) {
      expect((screen.getByLabelText(label) as HTMLInputElement).value).toBe("");
    }
    expect((screen.getByLabelText("Password") as HTMLInputElement).type).toBe("password");
    fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "Dummy Name" } });
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "dummy-user" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect((screen.getByLabelText("Email") as HTMLInputElement).value).toBe("");
    expect((screen.getByLabelText("Password") as HTMLInputElement).value).toBe("");
  });
});

it("names each public directory submission control for assistive technology", () => {
  render(<GetListedForm />);
  for (const label of ["Name / business", "Category", "What you do", "What you're looking for", "Contact email", "Contact phone", "Contact website"]) {
    expect(screen.getByLabelText(label)).toBeTruthy();
  }
});
