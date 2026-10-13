import { BRAND_STAR_PATH as STAR_PATH } from "@/lib/design/logo";
import { cn } from "@/lib/utils";

/** The YidVibe brand star path (4-point rounded sparkle), drawn in a 0..134 box. */


/**
 * Brand sparkle — the YidVibe star motif. Defaults to amber-gold; pass `color`
 * to recolor it for context (e.g. teal on a tint).
 */
export function Sparkle({
  size = 16,
  color = "var(--gold-500)",
  className,
  style,
}: {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 134 134"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d={STAR_PATH} fill={color} />
    </svg>
  );
}

/**
 * The full YidVibe logo mark (crossing strokes + star) — served from
 * /public/brand/logo.svg so its teal/gold/white colors stay intact.
 */
export function LogoMark({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/logo.svg"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={cn("w-auto shrink-0", className)}
      style={{ height: size }}
    />
  );
}
