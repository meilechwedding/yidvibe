import { cn } from "@/lib/utils";

/**
 * A titled group of form fields. Forms read as a few labelled sections
 * (The basics / Media / …) rather than one long flat column — a number badge
 * plus a title and optional one-line description heads each block, and the
 * fields stack inside with consistent rhythm.
 */
export function FormSection({
  step,
  title,
  description,
  children,
  className,
}: {
  step?: number;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-card border border-border bg-surface p-6 shadow-[var(--shadow-sm)] md:p-6",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {step != null && (
          <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-input bg-teal-50 font-display text-xs font-medium text-teal-800">
            {step}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="font-display text-base font-semibold tracking-tight text-ink">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}
