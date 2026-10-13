import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ACCENT_ICON, ACCENT_BORDER, type Accent } from "@/lib/design/accents";
import { cn } from "@/lib/utils";


/** Top-border accent via confirmed CSS vars (see detail-hero). */

/**
 * Big branded action tile — icon, title, one-line description, accent top-border.
 * Used for the dashboard "Post something" row and reusable elsewhere.
 */
export function ActionCard({
  href,
  label,
  description,
  icon,
  accent,
}: {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  accent: Accent;
}) {
  return (
    <Link
      href={href}
      style={{ borderTopColor: ACCENT_BORDER[accent] }}
      className="group flex flex-col gap-3 rounded-2xl border border-t-[3px] border-border bg-surface p-4 shadow-[var(--shadow-sm)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
    >
      <span
        className={cn(
          "grid h-11 w-11 place-items-center rounded-xl",
          ACCENT_ICON[accent],
        )}
      >
        {icon}
      </span>
      <div>
        <div className="flex items-center gap-1 font-display text-[15px] font-bold text-ink">
          {label}
          <ArrowRight
            size={15}
            className="opacity-0 transition-opacity group-hover:opacity-60"
          />
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
