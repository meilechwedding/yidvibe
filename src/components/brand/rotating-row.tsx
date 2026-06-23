"use client";
import { useEffect, useRef, useState } from "react";

/** Visible cards per slide, by breakpoint: phone 1 · tablet 2 · desktop 3. */
function usePerPage() {
  const [perPage, setPerPage] = useState(3);
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setPerPage(w < 640 ? 1 : w < 1024 ? 2 : 3);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return perPage;
}

/**
 * Auto-advancing carousel that shows a few cards at a time and pages through the
 * rest. One dot per *page* (not per card). Auto-rotates every 4.5s; pauses while
 * hovered/focused, and pauses for 12s after the viewer taps a dot. Static under
 * reduced-motion (dots still work).
 */
export function RotatingRow({ children }: { children: React.ReactNode[] }) {
  const items = Array.isArray(children) ? children : [children];
  const perPage = usePerPage();

  // Group the cards into pages of `perPage`.
  const pages: React.ReactNode[][] = [];
  for (let i = 0; i < items.length; i += perPage) {
    pages.push(items.slice(i, i + perPage));
  }
  const pageCount = pages.length;

  const [page, setPage] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [holdPaused, setHoldPaused] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the active page valid when the layout (perPage) changes.
  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, pageCount - 1)));
  }, [pageCount]);

  useEffect(() => {
    if (hoverPaused || holdPaused || pageCount <= 1) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setPage((p) => (p + 1) % pageCount), 4500);
    return () => clearInterval(t);
  }, [hoverPaused, holdPaused, pageCount]);

  // Clear the hold timer on unmount.
  useEffect(
    () => () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
    },
    [],
  );

  // Tap a dot → jump there and hold (stop auto-rotating) for 12 seconds.
  const goTo = (i: number) => {
    setPage(i);
    setHoldPaused(true);
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = setTimeout(() => setHoldPaused(false), 12000);
  };

  return (
    <div
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocusCapture={() => setHoverPaused(true)}
      onBlurCapture={() => setHoverPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {pages.map((group, pi) => (
            <div key={pi} className="w-full shrink-0 px-0.5">
              <div
                className="grid gap-5"
                style={{
                  gridTemplateColumns: `repeat(${perPage}, minmax(0, 1fr))`,
                }}
              >
                {group}
              </div>
            </div>
          ))}
        </div>
      </div>

      {pageCount > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === page}
              onClick={() => goTo(i)}
              className={
                i === page
                  ? "h-2.5 w-6 rounded-full bg-teal-600 transition-all"
                  : "h-2.5 w-2.5 rounded-full bg-border transition-all hover:bg-border-hover"
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
