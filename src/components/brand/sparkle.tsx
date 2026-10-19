import { Sparkles } from "lucide-react";
import { BrandLogo } from "./brand-logo";
import { cn } from "@/lib/utils";

/** Decorative UI icon; this is not a brand mark. */
export function Sparkle({
  size = 16,
  color = "var(--ink)",
  className,
  style,
}: {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Sparkles
      size={size}
      color={color}
      className={className}
      style={style}
      aria-hidden="true"
    />
  );
}

/** Compatibility wrapper for places that need the authentic symbol alone. */
export function LogoMark({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <BrandLogo symbol decorative />
    </span>
  );
}
