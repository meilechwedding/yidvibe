// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { FilterBar } from "@/components/brand/filter-bar";
import { BackLink } from "@/components/brand/back-link";
import {
  recordAppNavigation,
  hasSafeAppHistory,
} from "@/hooks/navigation/history";

const nav = vi.hoisted(() => ({
  push: vi.fn(),
  back: vi.fn(),
  query: "q=Family",
  pathname: "/showcase/item",
}));
vi.mock("next/navigation", () => ({
  useRouter: () => nav,
  usePathname: () => nav.pathname,
  useSearchParams: () => new URLSearchParams(nav.query),
}));

function Filters({ q = "Family", tool = "", available = false }) {
  return (
    <FilterBar
      basePath="/builders"
      searchValue={q}
      placeholder="Search builders"
      selects={[
        {
          name: "tool",
          allLabel: "All tools",
          value: tool,
          options: ["Claude Code", "Codex"],
        },
      ]}
      toggles={[
        { name: "available", label: "Available for hire", value: available },
      ]}
    />
  );
}

afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  nav.query = "q=Family";
});

describe("URL filters", () => {
  test("Back and empty-state clear reconcile search, chips and controlled selections", () => {
    const view = render(<Filters />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "Mendy" },
    });
    fireEvent.submit(screen.getByRole("searchbox").closest("form")!);
    nav.query = "q=Mendy&tool=Claude+Code";
    view.rerender(<Filters q="Mendy" tool="Claude Code" />);
    nav.query = "q=Family";
    view.rerender(<Filters />);
    expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe(
      "Family",
    );
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("");
    expect(screen.queryByText(/Mendy/)).toBeNull();
    nav.query = "";
    view.rerender(<Filters q="" />);
    expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("");
    expect(screen.queryByText("Clear all")).toBeNull();
  });

  test("rapid filter changes merge before server navigation commits", () => {
    render(<Filters q="Mendy" />);
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Claude Code" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    const url = new URL(nav.push.mock.calls.at(-1)![0], "https://yidvibe.com");
    expect(url.searchParams.get("q")).toBe("Mendy");
    expect(url.searchParams.get("tool")).toBe("Claude Code");
    expect(url.searchParams.get("available")).toBe("1");
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe(
      "Claude Code",
    );
    fireEvent.click(screen.getByText("Clear all"));
    expect(nav.push).toHaveBeenLastCalledWith("/builders");
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("");
    expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(
      false,
    );
  });

  test("draft text is not displayed as an applied filter until submitted", () => {
    nav.query = "";
    render(<Filters q="" />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "Unsubmitted" },
    });
    expect(screen.queryByText("Clear all")).toBeNull();
  });

  test("filter sheet is a named portal dialog and Escape dismisses it", () => {
    render(<Filters />);
    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    const dialog = screen.getByRole("dialog", { name: "Filters" });
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("branded Back", () => {
  test("fresh filtered list entry followed by detail uses real history", () => {
    window.history.replaceState(null, "", "/showcase?q=Family");
    const list = recordAppNavigation(null);
    expect(hasSafeAppHistory()).toBe(false);
    window.history.pushState(null, "", "/showcase/item");
    recordAppNavigation(list);
    render(<BackLink fallbackHref="/showcase" />);
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(nav.back).toHaveBeenCalledOnce();
    expect(nav.push).not.toHaveBeenCalled();
  });

  test("direct detail entry uses the safe section fallback", () => {
    window.history.replaceState(null, "", "/showcase/direct");
    recordAppNavigation(null);
    render(<BackLink fallbackHref="/showcase" />);
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(nav.push).toHaveBeenCalledWith("/showcase");
    expect(nav.back).not.toHaveBeenCalled();
  });
});
