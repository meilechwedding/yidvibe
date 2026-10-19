import type { ReactNode } from "react";
import type { Accent } from "@/lib/design/accents";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  accent?: Accent;
  action?: ReactNode;
}) {
  return (
    <div className="page-intro">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-3 text-sm text-muted-foreground">{eyebrow}</p>
        )}
        <h1>{title}</h1>
        {subtitle && <p className="page-intro-description">{subtitle}</p>}
      </div>
      {action && <div className="page-intro-action">{action}</div>}
    </div>
  );
}
