"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * Mobile-only top strip for the dashboard. On the hub root it shows the
 * greeting; on a section sub-page it shows a "‹ Dashboard" back link so the
 * Direction-C drill-down always has a clear way home. Desktop uses the tab rail.
 */
export function DashboardMobileBar({ firstName }: { firstName: string }) {
  const pathname = usePathname();
  const onHub = pathname === "/dashboard";

  if (onHub) {
    return (
      <div className="lg:hidden">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
          Your dashboard
        </p>
        <h1 className="mt-1 font-display text-[22px] font-semibold tracking-tight text-ink">
          Hi, {firstName}
        </h1>
      </div>
    );
  }

  return (
    <Link
      href="/dashboard"
      className="-ml-2 inline-flex items-center gap-2 rounded-input px-2 py-2 text-sm font-medium text-teal-800 transition-colors hover:bg-teal-50 lg:hidden"
    >
      <ArrowLeft size={16} /> Dashboard
    </Link>
  );
}
