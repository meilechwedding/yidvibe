"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { setFlag } from "@/lib/actions/flags";
import { cn } from "@/lib/utils";

type Flag = {
  key: string;
  label: string;
  description: string;
  category: string;
  enabled: boolean;
};

const GROUPS: { key: string; title: string; hint: string }[] = [
  {
    key: "module",
    title: "Modules",
    hint: "Whole sections of the bigger site. Off = hidden from nav and the route 404s.",
  },
  {
    key: "feature",
    title: "Features",
    hint: "Smaller pieces you can switch on when the time is right.",
  },
];

export function LaunchControl({ flags }: { flags: Flag[] }) {
  return (
    <div className="space-y-8">
      {GROUPS.map((g) => {
        const items = flags.filter((f) => f.category === g.key);
        if (items.length === 0) return null;
        return (
          <section key={g.key}>
            <h2 className="font-display text-lg font-semibold text-ink">{g.title}</h2>
            <p className="mb-3 text-sm text-muted-foreground">{g.hint}</p>
            <div className="divide-y divide-border rounded-card border border-border bg-surface">
              {items.map((f) => (
                <FlagRow key={f.key} flag={f} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function FlagRow({ flag }: { flag: Flag }) {
  const [on, setOn] = useState(flag.enabled);
  const [pending, start] = useTransition();

  const toggle = () =>
    start(async () => {
      const next = !on;
      setOn(next);
      try {
        await setFlag(flag.key, next);
        toast.success(`${flag.label} ${next ? "is now live" : "hidden"}.`);
      } catch {
        setOn(!next);
        toast.error("Couldn't update that flag.");
      }
    });

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{flag.label}</p>
        <p className="text-xs text-muted-foreground">{flag.description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={`Toggle ${flag.label}`}
        disabled={pending}
        onClick={toggle}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          on ? "bg-teal-600" : "bg-border",
          pending && "opacity-70",
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
            on && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}
