import { describe, expect, it } from "vitest";
import { competitionMatchesStatus, type CompetitionFilterItem } from "@/lib/domain/competition";

const now = Date.parse("2026-10-13T12:00:00Z");
const competition: CompetitionFilterItem = {
  id: "one", title: "Build", description: "A challenge", prize_amount: 100,
  deadline: "2026-10-14T12:00:00Z", status: "open", hasWinner: false, tags: [],
};

describe("competition status filters", () => {
  it("excludes a closed future competition from open and ending-soon results", () => {
    const closed = { ...competition, status: "closed" };
    expect(competitionMatchesStatus(closed, "open", now)).toBe(false);
    expect(competitionMatchesStatus(closed, "ending", now)).toBe(false);
    expect(competitionMatchesStatus(closed, "ended", now)).toBe(true);
  });
  it("includes an accepting competition in open and ending-soon results", () => {
    expect(competitionMatchesStatus(competition, "open", now)).toBe(true);
    expect(competitionMatchesStatus(competition, "ending", now)).toBe(true);
    expect(competitionMatchesStatus(competition, "ended", now)).toBe(false);
  });
  it("treats the exact deadline as ended", () => {
    const ended = { ...competition, deadline: new Date(now).toISOString() };
    expect(competitionMatchesStatus(ended, "open", now)).toBe(false);
    expect(competitionMatchesStatus(ended, "ended", now)).toBe(true);
  });
  it("keeps winner-picked results separate from ended and open", () => {
    const winner = { ...competition, hasWinner: true, status: "closed" };
    expect(competitionMatchesStatus(winner, "winner", now)).toBe(true);
    expect(competitionMatchesStatus(winner, "ended", now)).toBe(false);
    expect(competitionMatchesStatus(winner, "open", now)).toBe(false);
  });
  it("does not label a distant deadline as ending soon", () => {
    expect(competitionMatchesStatus({ ...competition, deadline: "2026-11-13T12:00:00Z" }, "ending", now)).toBe(false);
  });
});
