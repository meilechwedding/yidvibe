"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/**
 * Auto-advancing row of cards. Pauses on hover, on focus-within, and via an
 * explicit play/pause control (so touch users — who can't hover — can stop it).
 * Static under reduced-motion.
 */
export function RotatingRow({ children }: { children: React.ReactNode[] }) {
  const items = Array.isArray(children) ? children : [children];
  const [idx, setIdx] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const paused = hoverPaused || userPaused;

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 4500);
    return () => clearInterval(t);
  }, [paused, items.length]);

  return (
    <div
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocusCapture={() => setHoverPaused(true)}
      onBlurCapture={() => setHoverPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {items.map((c, i) => (
            <div key={i} className="w-full shrink-0 px-1 sm:w-1/2 lg:w-1/3">
              {c}
            </div>
          ))}
        </div>
      </div>
      {items.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? "Play" : "Pause"}
            aria-pressed={userPaused}
            className="grid h-7 w-7 place-items-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:border-border-hover hover:text-ink"
          >
            {userPaused ? <Play size={13} /> : <Pause size={13} />}
          </button>
          <div className="flex items-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to ${i + 1}`}
                aria-current={i === idx}
                onClick={() => setIdx(i)}
                className={
                  i === idx
                    ? "h-1.5 w-4 rounded-full bg-teal-600"
                    : "h-1.5 w-1.5 rounded-full bg-border"
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
