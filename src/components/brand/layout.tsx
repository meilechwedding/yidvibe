import { cn } from "@/lib/utils";

/** Centered page column — the shared max width + responsive gutters. */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("page-container mx-auto w-full max-w-[1440px]", className)}
    >
      {children}
    </div>
  );
}

/** Airy vertical-rhythm section. Top padding follows the brand section scale. */
export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("pt-[var(--space-section)]", className)}>
      {children}
    </section>
  );
}

/** Small section label that sits above a section heading. */
export function Eyebrow({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={cn("eyebrow", className)} style={style}>
      {children}
    </span>
  );
}
