"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectDef = {
  name: string;
  allLabel: string;
  value: string;
  options: string[];
};
export type ToggleDef = { name: string; label: string; value: boolean };
export type SortDef = {
  name: string;
  value: string;
  options: { value: string; label: string }[];
};

const controlClass =
  "h-11 rounded-input border border-border bg-canvas px-3 text-sm font-medium text-ink outline-none transition-colors hover:border-border-hover focus:border-teal-600 focus:bg-surface";

/**
 * Search + filters for list pages. Filters sit inline on desktop and collapse
 * into a bottom sheet on mobile (with an active-count badge). Changes apply
 * immediately (URL-driven); active filters render as removable chips.
 */
export function FilterBar({
  basePath,
  searchName = "q",
  searchValue,
  placeholder,
  selects = [],
  toggles = [],
  sort,
}: {
  basePath: string;
  searchName?: string;
  searchValue: string;
  placeholder: string;
  selects?: SelectDef[];
  toggles?: ToggleDef[];
  sort?: SortDef;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchValue);
  const [open, setOpen] = useState(false);
  const filterTrigger = useRef<HTMLButtonElement>(null);
  const serverValues: Record<string, string> = {
    [searchName]: searchValue,
    ...Object.fromEntries(selects.map((s) => [s.name, s.value])),
    ...Object.fromEntries(toggles.map((t) => [t.name, t.value ? "1" : ""])),
    ...(sort ? { [sort.name]: sort.value } : {}),
  };
  const signature = `${basePath}?${searchParams.toString()}|${JSON.stringify(serverValues)}`;
  const [committed, setCommitted] = useState(signature);
  const [values, setValues] = useState(serverValues);
  // Event handlers merge into the latest requested filters, including changes
  // made before the previous server navigation has finished.
  const requested = useRef(serverValues);
  if (committed !== signature) {
    setCommitted(signature);
    setValues(serverValues);
    setQ(searchValue);
    requested.current = serverValues;
  }

  const go = (overrides: Record<string, string | null>) => {
    const next = { ...requested.current, [searchName]: q.trim(), ...overrides };
    requested.current = Object.fromEntries(
      Object.entries(next).map(([key, value]) => [key, value ?? ""]),
    );
    setValues(requested.current);
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(next)) if (value) params.set(key, value);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  };

  const clearAll = () => {
    setQ("");
    requested.current = {};
    setValues({});
    router.push(basePath);
    setOpen(false);
  };

  const activeCount =
    selects.filter((s) => values[s.name]).length + toggles.filter((t) => values[t.name]).length;
  const hasFilterControls = selects.length > 0 || toggles.length > 0 || !!sort;

  const renderControls = (inSheet: boolean) => (
    <>
      {selects.map((s) => (
        <select
          key={s.name}
          value={values[s.name] ?? ""}
          aria-label={s.allLabel}
          onChange={(e) => go({ [s.name]: e.target.value || null })}
          className={cn(controlClass, inSheet && "w-full")}
        >
          <option value="">{s.allLabel}</option>
          {s.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ))}

      {toggles.map((t) => (
        <label
          key={t.name}
          className={cn(
            "inline-flex h-11 cursor-pointer items-center gap-2 whitespace-nowrap rounded-input border border-border bg-canvas px-4 text-sm text-ink",
            inSheet && "w-full justify-between",
          )}
        >
          {t.label}
          <input
            type="checkbox"
            checked={!!values[t.name]}
            onChange={(e) => go({ [t.name]: e.target.checked ? "1" : null })}
            className="h-4 w-4 rounded border-border accent-teal-600"
          />
        </label>
      ))}

      {sort && (
        <div
          className={cn(
            "inline-flex rounded-input border border-border bg-canvas p-1",
            inSheet && "w-full",
          )}
        >
          {sort.options.map((o) => (
            <button
              key={o.value}
              type="button"
              aria-pressed={values[sort.name] === o.value}
              onClick={() => go({ [sort.name]: o.value })}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                inSheet && "flex-1",
                values[sort.name] === o.value
                  ? "bg-teal-600 text-white"
                  : "text-muted-foreground hover:text-ink",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 rounded-card border border-border bg-surface p-3 shadow-[var(--shadow-sm)]">
        <form
          className="relative flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            go({});
          }}
        >
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            dir="auto"
            placeholder={placeholder}
            aria-label={placeholder}
            className="h-11 w-full rounded-input border border-transparent bg-canvas pl-12 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-muted-foreground focus:border-teal-600 focus:bg-surface"
          />
        </form>

        {hasFilterControls && (
          <div className="hidden items-center gap-3 lg:flex">
            {renderControls(false)}
          </div>
        )}

        {hasFilterControls && (
          <button
            ref={filterTrigger}
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-input border border-border bg-canvas px-4 text-sm font-medium text-ink hover:border-border-hover lg:hidden"
          >
            <SlidersHorizontal size={15} /> Filters
            {activeCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-teal-600 px-1 text-sm font-semibold text-white">
                {activeCount}
              </span>
            )}
          </button>
        )}
      </div>

      {(activeCount > 0 || !!values[searchName]) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {values[searchName] && (
            <Chip onClear={() => { setQ(""); go({ [searchName]: null }); }}>
              &ldquo;{values[searchName]}&rdquo;
            </Chip>
          )}
          {selects
            .filter((s) => values[s.name])
            .map((s) => (
              <Chip key={s.name} onClear={() => go({ [s.name]: null })}>
                {values[s.name]}
              </Chip>
            ))}
          {toggles
            .filter((t) => values[t.name])
            .map((t) => (
              <Chip key={t.name} onClear={() => go({ [t.name]: null })}>
                {t.label}
              </Chip>
            ))}
          <button
            type="button"
            onClick={clearAll}
            className="text-sm font-medium text-teal-800 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 lg:hidden" />
          <Dialog.Content aria-describedby={undefined} onCloseAutoFocus={(event) => { event.preventDefault(); filterTrigger.current?.focus(); }} className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-card border-t border-border bg-surface p-6 pb-8 shadow-float lg:hidden">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="font-display text-lg font-semibold text-ink">
                Filters
              </Dialog.Title>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="icon-btn"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col gap-3">{renderControls(true)}</div>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={clearAll} className="btn btn-ghost flex-1">
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn btn-primary flex-1"
              >
                Done
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function Chip({
  children,
  onClear,
}: {
  children: React.ReactNode;
  onClear: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-input bg-teal-50 px-3 py-1 text-sm text-teal-800">
      {children}
      <button
        type="button"
        onClick={onClear}
        aria-label="Remove filter"
        className="-mr-0.5 rounded-input text-teal-700 hover:text-teal-900"
      >
        <X size={13} />
      </button>
    </span>
  );
}
