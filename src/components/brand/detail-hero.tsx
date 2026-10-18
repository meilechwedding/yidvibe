import Link from "next/link";
import { ACCENT_HERO, type Accent } from "@/lib/design/accents";

export type HeroTag = { label: string; href?: string };

/**
 * Shared detail-page cover: a petrol surface (or cover image) with the title,
 * an optional badge row, and tags overlaid in white — plus a faint watermark
 * glyph and a top-right slot (e.g. a save-star). Used by project / gig /
 * competition detail pages so every inside page leads with the same signature.
 */
export function DetailHero({
  accent,
  title,
  badge,
  tags = [],
  watermark,
  watermarkIcon,
  coverImage,
  topRight,
}: {
  accent: Accent;
  title: string;
  badge?: React.ReactNode;
  tags?: HeroTag[];
  watermark?: string;
  watermarkIcon?: React.ReactNode;
  coverImage?: string | null;
  topRight?: React.ReactNode;
}) {
  return (
    <div
      className="relative flex min-h-[210px] flex-col justify-end overflow-hidden rounded-card border border-border p-6 sm:min-h-[240px] sm:p-8"
      style={{ background: ACCENT_HERO[accent] }}
    >
      {coverImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-petrol/80" />
        </>
      ) : watermark ? (
        <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 select-none font-display text-[9rem] font-semibold leading-none text-white/10 sm:text-[12rem]">
          {watermark}
        </span>
      ) : watermarkIcon ? (
        <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-white/15 [&>svg]:h-28 [&>svg]:w-28 sm:[&>svg]:h-36 sm:[&>svg]:w-36">
          {watermarkIcon}
        </span>
      ) : null}

      {topRight && <div className="absolute right-4 top-4 z-10">{topRight}</div>}

      <div className="relative z-[1]">
        {badge && (
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-white/90">
            {badge}
          </div>
        )}
        <h1
          className="font-display text-[clamp(1.75rem,4.5vw,3rem)] font-semibold leading-tight tracking-tight text-white break-words"
          dir="auto"
        >
          {title}
        </h1>
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((t) =>
              t.href ? (
                <Link
                  key={t.label}
                  href={t.href}
                  className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-white/25"
                >
                  {t.label}
                </Link>
              ) : (
                <span
                  key={t.label}
                  className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur"
                >
                  {t.label}
                </span>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
