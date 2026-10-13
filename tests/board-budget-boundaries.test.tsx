// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { GigsBoard } from "@/components/gigs/gigs-board";
import { CompetitionsBoard } from "@/components/competitions/competitions-board";

afterEach(cleanup);

it("includes a $250 gig in the inclusive first budget band and excludes $251", () => {
  const items = [250, 251].map((amount) => ({
    id: String(amount), title: `Gig ${amount}`, description: "Test gig", type: "task" as const,
    budget_min: amount, budget_max: amount, hourly_rate: null, tags: [],
  }));
  render(<GigsBoard items={items} cards={{ "250": <article>Gig at boundary</article>, "251": <article>Gig above boundary</article> }} />);
  const budget = screen.getByRole("combobox", { name: "Filter by budget" });
  expect(screen.getByRole("option", { name: "Up to $250" }).getAttribute("value")).toBe("0-250");
  fireEvent.change(budget, { target: { value: "0-250" } });
  expect(screen.getByText("Gig at boundary")).toBeTruthy();
  expect(screen.queryByText("Gig above boundary")).toBeNull();
  fireEvent.change(budget, { target: { value: "" } });
  expect(screen.getByText("Gig above boundary")).toBeTruthy();
});

it("includes a $250 competition in the inclusive first prize band and excludes $251", () => {
  const items = [250, 251].map((amount) => ({
    id: String(amount), title: `Competition ${amount}`, description: "Test competition",
    prize_amount: amount, deadline: "2099-01-01T00:00:00Z", status: "open", hasWinner: false, tags: [],
  }));
  render(<CompetitionsBoard items={items} cards={{ "250": <article>Prize at boundary</article>, "251": <article>Prize above boundary</article> }} />);
  const prize = screen.getByRole("combobox", { name: "Filter by prize" });
  expect(screen.getByRole("option", { name: "Up to $250" }).getAttribute("value")).toBe("0-250");
  fireEvent.change(prize, { target: { value: "0-250" } });
  expect(screen.getByText("Prize at boundary")).toBeTruthy();
  expect(screen.queryByText("Prize above boundary")).toBeNull();
  fireEvent.change(prize, { target: { value: "" } });
  expect(screen.getByText("Prize above boundary")).toBeTruthy();
});
