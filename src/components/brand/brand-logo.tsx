import { cn } from "@/lib/utils";

/** Authentic v8 artwork. Original exports and provenance live in public/brand/v8. */
export function BrandLogo({
  className,
  symbol = false,
  decorative = false,
}: {
  className?: string;
  symbol?: boolean;
  decorative?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={symbol ? "/brand/v8/symbol.png" : "/brand/v8/horizontal.png"}
      width={symbol ? 1500 : 2683}
      height={symbol ? 1390 : 533}
      alt={decorative ? "" : "YidVibe"}
      aria-hidden={decorative || undefined}
      className={cn(symbol ? "brand-symbol" : "brand-logo", className)}
    />
  );
}
