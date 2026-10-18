"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Bookmark,
  User,
  LogIn,
  LayoutGrid,
  Users,
  Briefcase,
  Trophy,
  Calendar,
  HelpCircle,
  MessageSquarePlus,
} from "lucide-react";
import { PostMenu } from "./post-menu";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const MORE_ICONS: Record<string, typeof LayoutGrid> = {
  "/showcase": LayoutGrid,
  "/builders": Users,
  "/directory": Compass,
  "/gigs": Briefcase,
  "/competitions": Trophy,
  "/events": Calendar,
  "/docs": HelpCircle,
};

/**
 * App-style bottom tab bar for phones + tablets (`lg:hidden`):
 * Home · Explore (boards sheet) · ＋ post · {Saved · You | Showcase · Sign in}.
 * The last two tabs adapt to auth state so signed-out visitors never get a
 * surprise login bounce.
 */
export function MobileBottomNav({
  navLinks,
  enabledFlags = {},
  isAuthed = false,
}: {
  navLinks: { href: string; label: string }[];
  enabledFlags?: Record<string, boolean>;
  isAuthed?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-surface/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Primary"
      >
        <Tab href="/" label="Home" Icon={Home} active={pathname === "/"} />
        <DialogTrigger asChild>
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-1 py-2 text-muted-foreground"
            aria-label="Explore"
          >
            <Compass size={20} />
            <span className="text-sm font-medium">Explore</span>
          </button>
        </DialogTrigger>

        <PostMenu variant="fab" enabledFlags={enabledFlags} />

        {isAuthed ? (
          <>
            <Tab
              href="/dashboard/saved"
              label="Saved"
              Icon={Bookmark}
              active={isActive("/dashboard/saved")}
            />
            <Tab
              href="/dashboard"
              label="You"
              Icon={User}
              active={pathname === "/dashboard"}
            />
          </>
        ) : (
          <>
            <Tab
              href="/showcase"
              label="Showcase"
              Icon={LayoutGrid}
              active={isActive("/showcase")}
            />
            <Tab
              href="/login"
              label="Sign in"
              Icon={LogIn}
              active={pathname === "/login"}
            />
          </>
        )}
      </nav>

      <DialogContent aria-describedby={undefined} className="inset-x-0 bottom-0 left-0 top-auto max-w-none translate-x-0 translate-y-0 rounded-t-card border-t border-border bg-surface p-6 pb-8 shadow-float lg:hidden">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />
        <DialogTitle className="mb-3 font-display text-lg font-semibold text-ink">Explore</DialogTitle>
        <div className="grid grid-cols-2 gap-2">
          {navLinks.map((l) => {
            const Icon = MORE_ICONS[l.href] ?? Compass;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-card border px-4 py-3 text-sm",
                  isActive(l.href)
                    ? "border-teal-100 bg-teal-50 text-teal-800"
                    : "border-border text-ink hover:bg-secondary",
                )}
              >
                <Icon size={18} className="shrink-0 opacity-80" />
                {l.label}
              </Link>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            window.dispatchEvent(new Event("yv:open-feedback"));
          }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-card border border-border px-4 py-3 text-sm text-ink hover:bg-secondary"
        >
          <MessageSquarePlus size={18} className="opacity-80" /> Send feedback
        </button>
      </DialogContent>
    </Dialog>
  );
}

function Tab({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex flex-col items-center justify-center gap-1 py-2",
        active ? "text-teal-700" : "text-muted-foreground",
      )}
    >
      <Icon size={20} />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
