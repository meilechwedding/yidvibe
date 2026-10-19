"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function NavLinks({ links = NAV_LINKS, className }: { links?: { href: string; label: string }[]; className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className={cn("flex min-w-0 items-center gap-0.5 overflow-x-auto sm:gap-1", className)}>
      {links.map((l) => {
        const active =
          pathname === l.href || pathname.startsWith(l.href + "/");
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 shrink-0 items-center rounded-input px-2 py-2 sm:px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
              active
                ? "bg-teal-50 text-teal-800"
                : "text-muted-foreground hover:text-ink",
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
