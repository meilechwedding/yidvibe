import type { ReactNode } from "react";
import { ACCENT_TEXT, ACCENT_RULE, type Accent } from "@/lib/design/accents";


/** Consistent branded page header: label, geometric title, subtitle, accent rule. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  accent = "teal",
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  accent?: Accent;
  action?: ReactNode;
}) {
  const a = { fg: ACCENT_TEXT[accent], rule: ACCENT_RULE[accent] };
  return (
    <div className="border-b-2 pb-4" style={{ borderBottomColor: a.rule }}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <div className="text-sm font-medium tracking-normal" style={{ color: a.fg }}>{eyebrow}</div>
          )}
          <h1 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight break-words text-ink">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0 pb-1">{action}</div>}
      </div>
    </div>
  );
}
