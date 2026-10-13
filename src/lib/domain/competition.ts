export type CompetitionFilterItem = {
  id: string;
  title: string;
  description: string;
  prize_amount: number;
  deadline: string;
  status: string;
  hasWinner: boolean;
  tags: string[];
};

const WEEK_MS = 7 * 86_400_000;

export function competitionMatchesStatus(c: CompetitionFilterItem, status: string, now: number): boolean {
  const remaining = new Date(c.deadline).getTime() - now;
  const open = c.status === "open" && !c.hasWinner && remaining > 0;
  switch (status) {
    case "open": return open;
    case "ending": return open && remaining <= WEEK_MS;
    case "ended": return !c.hasWinner && (c.status !== "open" || remaining <= 0);
    case "winner": return c.hasWinner;
    default: return true;
  }
}
