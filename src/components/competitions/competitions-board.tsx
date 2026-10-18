"use client";

import { useMemo, useState } from "react";
import { Trophy } from "lucide-react";
import { BUDGET_BANDS as PRIZE_BANDS } from "@/lib/domain/money";
import { competitionMatchesStatus, type CompetitionFilterItem } from "@/lib/domain/competition";
import { EmptyState } from "@/components/brand/empty-state";
import {
  FilterShell,
  fieldClass,
  type ActiveChip,
} from "@/components/filters/filter-shell";

export type { CompetitionFilterItem } from "@/lib/domain/competition";

/** Entry availability, deadline and winner filters. */
const STATUS_OPTIONS: {
  value: string;
  label: string;
}[] = [
  {
    value: "open",
    label: "Open",
  },
  {
    value: "ending",
    label: "Ending soon",
  },
  {
    value: "ended",
    label: "Ended",
  },
  {
    value: "winner",
    label: "Winner picked",
  },
];

export function CompetitionsBoard({
  items,
  cards,
}: {
  items: CompetitionFilterItem[];
  /** Server-rendered <CompetitionCard> per id. */
  cards: Record<string, React.ReactNode>;
}) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [band, setBand] = useState("");
  const [tag, setTag] = useState("");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const c of items) for (const t of c.tags) set.add(t);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const now = Date.now();
    const statusDef = STATUS_OPTIONS.find((s) => s.value === status);
    const bandDef = PRIZE_BANDS.find((b) => b.value === band);
    return items.filter((c) => {
      if (
        needle &&
        !(
          c.title.toLowerCase().includes(needle) ||
          c.description.toLowerCase().includes(needle) ||
          c.tags.some((t) => t.toLowerCase().includes(needle))
        )
      )
        return false;
      if (statusDef && !competitionMatchesStatus(c, statusDef.value, now)) return false;
      if (bandDef && !(c.prize_amount >= bandDef.min && c.prize_amount <= bandDef.max))
        return false;
      if (tag && !c.tags.includes(tag)) return false;
      return true;
    });
  }, [items, q, status, band, tag]);

  const activeCount = (status ? 1 : 0) + (band ? 1 : 0) + (tag ? 1 : 0);

  const chips: ActiveChip[] = [];
  if (q.trim())
    chips.push({ key: "q", label: `“${q.trim()}”`, onClear: () => setQ("") });
  if (status)
    chips.push({
      key: "status",
      label: STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status,
      onClear: () => setStatus(""),
    });
  if (band)
    chips.push({
      key: "band",
      label: PRIZE_BANDS.find((b) => b.value === band)?.label ?? band,
      onClear: () => setBand(""),
    });
  if (tag) chips.push({ key: "tag", label: tag, onClear: () => setTag("") });

  const clearAll = () => {
    setQ("");
    setStatus("");
    setBand("");
    setTag("");
  };

  const controls = (stacked: boolean) => (
    <>
      <select
        aria-label="Filter by status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className={stacked ? fieldClass : `${fieldClass} lg:w-auto`}
      >
        <option value="">Any status</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by prize"
        value={band}
        onChange={(e) => setBand(e.target.value)}
        className={stacked ? fieldClass : `${fieldClass} lg:w-auto`}
      >
        <option value="">Any prize</option>
        {PRIZE_BANDS.map((b) => (
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
      ? `${total} ${total === 1 ? "competition" : "competitions"}`
      : `${shown} of ${total} competitions`;

  return (
    <>
      <FilterShell
        searchValue={q}
        onSearchChange={setQ}
        placeholder="Search competitions by title, description, tag…"
        searchAriaLabel="Search competitions"
        controls={controls}
        activeCount={activeCount}
        chips={chips}
        onClearAll={clearAll}
        resultLabel={resultLabel}
      />

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={<Trophy size={22} />}
          title="No competitions match"
          description="Try a broader keyword or clear a filter to see more competitions."
        />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div key={c.id}>{cards[c.id]}</div>
          ))}
        </div>
      )}
    </>
  );
}
