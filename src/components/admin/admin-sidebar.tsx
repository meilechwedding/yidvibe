"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  LayoutGrid,
  Users,
  LayoutPanelLeft,
  Tag,
  Flag,
  MessageSquare,
  Trophy,
  Calendar,
  Compass,
  Rocket,
  Hand,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { lockAdmin } from "@/lib/actions/admin";

type NavItem = { href: string; label: string; icon: LucideIcon };

const PRIMARY: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutGrid },
  { href: "/admin/launch", label: "Launch Control", icon: Rocket },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/content", label: "Content", icon: LayoutPanelLeft },
  { href: "/admin/tags", label: "Tags", icon: Tag },
];

const MODERATION: NavItem[] = [
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/claims", label: "Claims", icon: Hand },
  { href: "/admin/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/admin/competitions", label: "Competition review", icon: Trophy },
  { href: "/admin/events", label: "Event requests", icon: Calendar },
  { href: "/admin/directory", label: "Directory review", icon: Compass },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className="flex shrink-0 items-center gap-3 rounded-input px-3 py-2 text-sm font-medium transition-colors"
      style={
        active
          ? { backgroundColor: "var(--color-mist)", color: "var(--color-petrol)" }
          : { color: "var(--color-mist)" }
      }
    >
      <Icon size={16} className="shrink-0" />
      <span className="whitespace-nowrap">{item.label}</span>
    </Link>
  );
}

export function AdminSidebar() {
  const pathname = usePathname() ?? "/admin";

  return (
    <nav
      aria-label="Admin"
      className="flex w-full shrink-0 flex-row items-center gap-1 overflow-x-auto px-3 py-3 md:w-[210px] md:flex-col md:items-stretch md:gap-1 md:overflow-x-visible md:px-4 md:py-6"
      style={{ backgroundColor: "var(--color-petrol)" }}
    >
      <div className="flex shrink-0 items-center gap-2 pr-3 md:mb-6 md:px-1 md:pr-0">
        <ShieldCheck size={18} style={{ color: "var(--color-citron)" }} className="shrink-0" />
        <span
          className="font-display whitespace-nowrap text-base text-white"
        >
          YidVibe Admin
        </span>
      </div>

      {PRIMARY.map((item) => (
        <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
      ))}

      <div
        className="mt-1 shrink-0 px-3 pt-1 text-sm font-semibold uppercase tracking-[0.1em] md:mt-4 md:px-1"
        style={{ color: "var(--color-mist)" }}
      >
        Moderation
      </div>

      {MODERATION.map((item) => (
        <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
      ))}

      <form action={lockAdmin} className="shrink-0 md:mt-auto md:pt-4">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-input px-3 py-2 text-sm font-medium transition-colors"
          style={{ color: "var(--color-mist)" }}
        >
          <Lock size={16} className="shrink-0" />
          <span className="whitespace-nowrap">Lock</span>
        </button>
      </form>
    </nav>
  );
}
