type BudgetItem = { type: string; budget_min: number | null; budget_max: number | null; hourly_rate: number | null };

/** Preset budget bands (USD). A gig matches a band if its budget OR hourly
 *  rate overlaps the band — simpler + faster to scan than a dual slider. */
export const BUDGET_BANDS: { value: string; label: string; min: number; max: number }[] =
  [
    { value: "0-250", label: "Up to $250", min: 0, max: 250 },
    { value: "250-1000", label: "$250 – $1k", min: 250, max: 1000 },
    { value: "1000-5000", label: "$1k – $5k", min: 1000, max: 5000 },
    { value: "5000-inf", label: "$5k+", min: 5000, max: Infinity },
  ];

/** Hourly rate or stated fixed-budget endpoints for inclusive overlap. */
function gigMoneyPoints(g: BudgetItem): number[] {
  if (g.type === "hourly" && g.hourly_rate != null) return [g.hourly_rate];
  const pts: number[] = [];
  if (g.budget_min != null) pts.push(g.budget_min);
  if (g.budget_max != null) pts.push(g.budget_max);
  return pts;
}

export function matchesBand(g: BudgetItem, bandValue: string): boolean {
  const band = BUDGET_BANDS.find((b) => b.value === bandValue);
  if (!band) return true;
  const pts = gigMoneyPoints(g);
  if (pts.length === 0) return false; // no stated budget can't match a band
  // Overlap: any point within the band, or the gig's [min,max] straddles it.
  const lo = Math.min(...pts);
  const hi = Math.max(...pts);
  return lo <= band.max && hi >= band.min;
}
