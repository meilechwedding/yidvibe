import { cn } from "@/lib/utils";

/**
 * The shared soft card used across the site: rounded, hairline border, surface
 * fill, soft shadow. One source of truth so every page reads as one product.
 */
export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "workspace-panel rounded-card border border-border bg-surface p-6 sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Section label that heads a panel. */
export function PanelLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-base font-medium text-ink", className)}>
      {children}
    </p>
  );
}
