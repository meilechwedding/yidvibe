import Link from "next/link";
import {
  FolderOpen,
  Bookmark,
  UserCog,
  Settings,
  ShieldCheck,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

function HubRow({
  href,
  icon: Icon,
  label,
  gold,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  gold?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3.5 px-4 py-3.5 transition-colors active:bg-teal-50/60"
    >
      <span
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
          gold ? "bg-gold-50 text-gold-700" : "bg-teal-50 text-teal-700",
        )}
      >
        <Icon size={17} />
      </span>
      <span className="flex-1 text-[15px] font-semibold text-ink">{label}</span>
      <ChevronRight size={17} className="shrink-0 text-muted-foreground/50" />
    </Link>
  );
}

/** Mobile-only (`lg:hidden`) dashboard hub — drill-down list. */
export function DashboardHub({
  posts,
  upvotes,
  saved,
  isPublic,
  isAdmin,
}: {
  posts: number;
  upvotes: number;
  saved: number;
  isPublic: boolean;
  isAdmin: boolean;
}) {
  return (
    <div className="lg:hidden">
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { value: posts, label: "Posts" },
          { value: upvotes, label: "Upvotes" },
          { value: saved, label: "Saved" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-surface px-3 py-3 text-center shadow-[var(--shadow-xs)]"
          >
            <p className="font-display text-xl font-bold text-ink">{s.value}</p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {!isPublic && (
        <Link
          href="/dashboard/profile"
          className="mt-4 flex items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-ink">
              Your profile is private
            </span>
            <span className="block text-xs text-muted-foreground">
              Make it public so people can find your work.
            </span>
          </span>
          <ChevronRight size={17} className="shrink-0 text-teal-700" />
        </Link>
      )}

      <div className="mt-5 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-xs)]">
        <HubRow href="/dashboard/posts" icon={FolderOpen} label="My posts" />
        <HubRow href="/dashboard/saved" icon={Bookmark} label="Saved" />
        <HubRow href="/dashboard/profile" icon={UserCog} label="Profile" />
        <HubRow href="/dashboard/account" icon={Settings} label="Account" />
        {isAdmin && (
          <HubRow href="/admin" icon={ShieldCheck} label="Admin" gold />
        )}
      </div>
    </div>
  );
}
