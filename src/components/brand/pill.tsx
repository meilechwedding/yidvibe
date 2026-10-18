import Link from "next/link";
import { cn } from "@/lib/utils";
import { type Accent, ACCENT_PILL } from "@/lib/design/accents";

type PillAccent = Accent | "neutral";

/** Full-round pill: tint background + deep-stop text (BRAND pattern). */
export function Pill({
  accent = "teal",
  className,
  children,
}: {
  accent?: PillAccent;
  className?: string;
  children: React.ReactNode;
}) {
  const styles =
    accent === "neutral"
      ? "bg-secondary text-muted-foreground"
      : ACCENT_PILL[accent];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-input px-3 py-1 text-xs font-medium",
        styles,
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * "Built-with" / tech chip — dusty-blue, monospace. One consistent color for every
 * tool so a developer can scan the tech at a glance.
 */
export function ToolPill({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const classes = cn(
    "inline-flex items-center rounded-input bg-blue-tint px-3 py-1 font-sans text-sm text-blue-deep",
    href && "transition-colors hover:bg-blue-mid hover:text-white",
    className,
  );
  return href ? (
    <Link href={href} className={classes}>
      {children}
    </Link>
  ) : (
    <span className={classes}>{children}</span>
  );
}

/**
 * "What it's about" / topic chip — teal. A different color family from the blue tool
 * pills so a non-technical visitor sees what a project *does*, separate from how it was built.
 */
export function TagPill({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const classes = cn(
    "inline-flex items-center rounded-input bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800",
    href && "transition-colors hover:bg-teal-100",
    className,
  );
  return href ? (
    <Link href={href} className={classes}>
      {children}
    </Link>
  ) : (
    <span className={classes}>{children}</span>
  );
}
