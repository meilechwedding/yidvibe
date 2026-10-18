"use client";

import { useState } from "react";
import { siteScreenshotUrl } from "@/lib/site";
import { ACCENT_HERO, type Accent } from "@/lib/design/accents";
import { cn } from "@/lib/utils";

/**
 * Screenshot-led media for a project. Shows uploaded screenshots big inside a
 * soft browser frame on a neutral mat (object-contain, never cropped), with a
 * thumbnail strip for multiples. Falls back to an accent gradient + initial when
 * there's no image — or when a remote image / live screenshot fails to load.
 */
export function MediaGallery({
  name,
  coverImage,
  images = [],
  liveUrl,
  accent,
}: {
  name: string;
  coverImage?: string | null;
  images?: string[];
  liveUrl?: string | null;
  accent: Accent;
}) {
  const all = [coverImage, ...images].filter(Boolean) as string[];
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const markFailed = (src: string) =>
    setFailed((prev) => new Set(prev).add(src));

  const GradientFallback = (
    <div
      className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-card border border-border"
      style={{ background: ACCENT_HERO[accent] }}
    >
      <span className="select-none font-display text-[7rem] font-semibold leading-none text-white/15">
        {name.slice(0, 1).toUpperCase()}
      </span>
    </div>
  );

  // No uploaded screenshots, but the project has a live URL → show a live
  // screenshot of the site so the viewer still sees "how it looks".
  if (all.length === 0 && liveUrl) {
    const shot = siteScreenshotUrl(liveUrl);
    if (failed.has(shot)) return GradientFallback;
    return (
      <div className="rounded-card border border-border bg-secondary/60 p-2 shadow-[0_10px_30px_-14px_rgba(16,32,43,0.28)]">
        <div className="overflow-hidden rounded-input border border-teal-600/60 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shot}
            alt={`${name} — live site preview`}
            loading="lazy"
            decoding="async"
            onError={() => markFailed(shot)}
            className="max-h-[460px] w-full bg-white object-contain"
          />
        </div>
      </div>
    );
  }

  if (all.length === 0) return GradientFallback;

  const activeIndex = Math.min(active, all.length - 1);
  const current = all[activeIndex];

  return (
    <div className="rounded-card border border-border bg-secondary/60 p-2 shadow-[0_10px_30px_-14px_rgba(16,32,43,0.28)]">
      {failed.has(current) ? GradientFallback : (
        <div className="overflow-hidden rounded-input border border-teal-600/60 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current}
            alt={name}
            loading="lazy"
            decoding="async"
            onError={() => markFailed(current)}
            className="max-h-[460px] w-full bg-white object-contain"
          />
        </div>
      )}

      {all.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto p-1">
          {all.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              aria-label={`View ${name} image ${i + 1}`}
              aria-pressed={i === activeIndex}
              onClick={() => setActive(i)}
              className={cn(
                "h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition-colors",
                i === activeIndex ? "border-teal-600 ring-2 ring-teal-600/30" : "border-border hover:border-border-hover",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full bg-white object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
