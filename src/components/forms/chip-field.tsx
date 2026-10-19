"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { FORM_INPUT_CLASS } from "@/lib/design/controls";
import { cn } from "@/lib/utils";

/**
 * Multi-select chip field with suggestions + custom entries. Carries each value
 * in a hidden input named `name`. `activeClass` controls the selected-chip color
 * so tools (blue) and tags (teal) stay visually distinct.
 */
export function ChipField({
  name,
  suggestions,
  values,
  setValues,
  activeClass,
  placeholder,
  onValueChange,
  addLabel,
}: {
  name: string;
  suggestions: string[];
  values: string[];
  setValues: React.Dispatch<React.SetStateAction<string[]>>;
  activeClass: string;
  placeholder: string;
  onValueChange: () => void;
  addLabel: string;
}) {
  const [custom, setCustom] = useState("");
  const toggle = (t: string) => {
    onValueChange();
    setValues((cur) =>
      cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t],
    );
  };
  const addCustom = () => {
    const t = custom.trim();
    if (t && !values.includes(t)) { setValues((cur) => [...cur, t]); onValueChange(); }
    setCustom("");
  };
  const chips = [...new Set([...suggestions, ...values])];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {chips.map((t) => {
          const on = values.includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              aria-pressed={on}
              className={cn(
                "rounded-input border px-3 py-1 text-sm font-medium transition-colors",
                on
                  ? activeClass
                  : "border-border bg-surface text-muted-foreground hover:border-border-hover",
              )}
            >
              {t}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          aria-label={placeholder}
          placeholder={placeholder}
          className={cn(FORM_INPUT_CLASS, "h-9 max-w-xs")}
        />
        <button
          type="button"
          onClick={addCustom}
          className="inline-flex h-9 items-center gap-1 rounded-input border border-border bg-surface px-3 text-sm text-ink hover:bg-secondary"
        >
          <Plus size={15} />{addLabel}</button>
      </div>
      {values.map((t) => (
        <input key={t} type="hidden" name={name} value={t} />
      ))}
    </div>
  );
}
