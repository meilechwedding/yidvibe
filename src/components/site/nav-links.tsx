"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function NavLinks({ links = NAV_LINKS, className }: { links?: { href: string; label: string }[]; className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className={cn("desktop-nav-links", className)}>
      {links.map((l) => {
        const active =
          pathname === l.href || pathname.startsWith(l.href + "/");
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "desktop-nav-link",
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
