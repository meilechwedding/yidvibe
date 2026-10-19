"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Container } from "@/components/brand/layout";
import { BackLink } from "@/components/brand/back-link";
import { hasSafeAppHistory, recordAppNavigation } from "@/hooks/navigation/history";

/** Top-level destinations + hubs that never show a Back affordance. */
const NO_BACK = new Set([
  "/",
  "/showcase",
  "/builders",
  "/directory",
  "/docs",
  "/dashboard",
  "/notifications",
  "/login",
  "/signup",
]);

/** Real section roots a deep-linked sub-page can safely fall back to. */
const SECTION_ROOTS = new Set([
  "/showcase",
  "/builders",
  "/directory",
  "/docs",
]);

function sectionRoot(path: string): string {
  const parts = path.split("/").filter(Boolean);
  if (parts.length <= 1) return "/";
  parts.pop();
  return "/" + parts.join("/");
}

/** A known-good fallback for this path, or undefined if none. */
function fallbackFor(pathname: string): string | undefined {
  if (pathname.startsWith("/settings/")) return "/dashboard";
  const root = sectionRoot(pathname);
  return SECTION_ROOTS.has(root) ? root : undefined;
}

/** True when there's same-origin in-app history we can safely return to. */
/**
 * Slim bar carrying the branded Back link on inner/detail pages. The bar only
 * renders when Back has somewhere real to go — a known section fallback or
 * genuine same-origin history — so it never shows a guessed/dead destination.
 */
export function ContextBar() {
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);
  const previousUrl = useRef<string | null>(null);
  useEffect(() => {
    previousUrl.current = recordAppNavigation(previousUrl.current);
    setCanGoBack(hasSafeAppHistory());
  }, [pathname]);

  if (NO_BACK.has(pathname) || pathname.startsWith("/dashboard")) return null;

  const fallback = fallbackFor(pathname);
  const show = fallback != null || canGoBack;
  if (!show) return null;

  return (
    <div className="border-b border-border/60 bg-canvas/80 backdrop-blur">
      <Container className="flex h-12 items-center">
        <BackLink fallbackHref={fallback} />
      </Container>
    </div>
  );
}
