"use client";

import { useMemo, useState } from "react";
import { Briefcase } from "lucide-react";
import { EmptyState } from "@/components/brand/empty-state";
import {
  FilterShell,
  fieldClass,
  type ActiveChip,
} from "@/components/filters/filter-shell";
import { BUDGET_BANDS, matchesBand } from "@/lib/domain/money";
import type { Gig } from "@/lib/gigs";

/** The fields the board needs to filter on — kept plain so this client
 *  component never imports the server-only gigs lib. */
export type GigFilterItem = {
  id: string;
  title: string;
  description: string;
  type: Gig["type"];
  budget_min: number | null;
  budget_max: number | null;
  hourly_rate: number | null;
  tags: string[];
};

const TYPE_OPTIONS: { value: Gig["type"]; label: string }[] = [
  { value: "task", label: "Task" },
  { value: "build", label: "Build" },
  { value: "hourly", label: "Hourly" },
];

export function GigsBoard({
  items,
  cards,
}: {
  items: GigFilterItem[];
  /** Server-rendered <GigCard> per id, so card rendering stays on the server
   *  while filtering runs here on the client. */
  cards: Record<string, React.ReactNode>;
}) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [band, setBand] = useState("");
  const [tag, setTag] = useState("");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const g of items) for (const t of g.tags) set.add(t);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((g) => {
      if (
        needle &&
        !(
          g.title.toLowerCase().includes(needle) ||
          g.description.toLowerCase().includes(needle) ||
          g.tags.some((t) => t.toLowerCase().includes(needle))
        )
      )
        return false;
      if (type && g.type !== type) return false;
      if (band && !matchesBand(g, band)) return false;
      if (tag && !g.tags.includes(tag)) return false;
      return true;
    });
  }, [items, q, type, band, tag]);

  const activeCount =
    (type ? 1 : 0) + (band ? 1 : 0) + (tag ? 1 : 0);

  const chips: ActiveChip[] = [];
  if (q.trim())
    chips.push({ key: "q", label: `“${q.trim()}”`, onClear: () => setQ("") });
  if (type)
    chips.push({
      key: "type",
      label: TYPE_OPTIONS.find((t) => t.value === type)?.label ?? type,
      onClear: () => setType(""),
    });
  if (band)
    chips.push({
      key: "band",
      label: BUDGET_BANDS.find((b) => b.value === band)?.label ?? band,
      onClear: () => setBand(""),
    });
  if (tag) chips.push({ key: "tag", label: tag, onClear: () => setTag("") });

  const clearAll = () => {
    setQ("");
    setType("");
    setBand("");
    setTag("");
  };

  const controls = (stacked: boolean) => (
    <>
      <select
        aria-label="Filter by type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className={stacked ? fieldClass : `${fieldClass} lg:w-auto`}
      >
        <option value="">All types</option>
        {TYPE_OPTIONS.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by budget"
        value={band}
        onChange={(e) => setBand(e.target.value)}
        className={stacked ? fieldClass : `${fieldClass} lg:w-auto`}
      >
        <option value="">Any budget</option>
        {BUDGET_BANDS.map((b) => (
          <option key={b.value} value={b.value}>
            {b.label}
          </option>
        ))}
      </select>

      {allTags.length > 0 && (
        <select
          aria-label="Filter by tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className={stacked ? fieldClass : `${fieldClass} lg:w-auto`}
        >
          <option value="">All tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      )}
    </>
  );

  const total = items.length;
  const shown = filtered.length;
  const resultLabel =
    shown === total
      ? `${total} ${total === 1 ? "gig" : "gigs"}`
      : `${shown} of ${total} gigs`;

  return (
    <>
      <FilterShell
        searchValue={q}
        onSearchChange={setQ}
        placeholder="Search gigs by title, description, tag…"
        searchAriaLabel="Search gigs"
        controls={controls}
        activeCount={activeCount}
        chips={chips}
        onClearAll={clearAll}
        resultLabel={resultLabel}
      />

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={<Briefcase size={22} />}
          title="No gigs match"
          description="Try a broader keyword or clear a filter to see more gigs."
        />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <div key={g.id}>{cards[g.id]}</div>
          ))}
        </div>
      )}
    </>
  );
}
