import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Designed empty state — friendly, intentional, never a blank void (BRAND).
 * Optional faint ghost cards behind the message so the layout reads full.
 */
export function EmptyState({
  icon,
  title,
  description,
  actionHref,
  actionLabel,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-card border border-border bg-surface px-6 py-16 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-card bg-teal-50 text-teal-600">
          {icon}
        </div>
      )}
      <h3 className="font-display text-2xl font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-base text-muted-foreground">
        {description}
      </p>
      {actionHref && actionLabel && (
        <Link href={actionHref} className="btn btn-primary mt-6">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
