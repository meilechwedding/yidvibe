"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, UsersRound, BookOpen, Briefcase, type LucideIcon } from "lucide-react";
import { useMobileKeyboard } from "@/hooks/use-mobile-keyboard";
import { PostMenu } from "./post-menu";

const ICONS: Record<string, LucideIcon> = {
  "/showcase": Compass,
  "/builders": UsersRound,
  "/directory": BookOpen,
  "/gigs": Briefcase,
};

export function MobileBottomNav({ navLinks, enabledFlags }: {
  navLinks: { href: string; label: string }[];
  enabledFlags?: Record<string, boolean>;
}) {
  const pathname = usePathname();
  const keyboardOpen = useMobileKeyboard();
  const ref = useRef<HTMLElement>(null);
  // Measure the real bar so enlarged text and device safe areas cannot cover content.
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      const height = element.getBoundingClientRect().height;
      if (height > 0) document.documentElement.style.setProperty("--mobile-nav-height", `${height}px`);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--mobile-nav-height");
    };
  }, []);
  const links = navLinks.slice(0, 4);
  const middle = Math.ceil(links.length / 2);
  const link = ({ href, label }: typeof links[number]) => {
    const Icon = ICONS[href] ?? Compass;
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link key={href} href={href} className="mobile-nav-item" aria-current={active ? "page" : undefined}>
        <span className="mobile-nav-icon"><Icon size={20} strokeWidth={1.75} aria-hidden="true" /></span>
        <span>{label}</span>
      </Link>
    );
  };
  return (
    <nav ref={ref} aria-label="Mobile primary" className="mobile-bottom-nav" hidden={keyboardOpen} data-items={links.length + 1}
      style={{ "--nav-count": links.length + 1 } as CSSProperties}>
      {links.slice(0, middle).map(link)}
      <PostMenu variant="mobile" enabledFlags={enabledFlags} />
      {links.slice(middle).map(link)}
    </nav>
  );
}
