import Link from "next/link";
import type { Metadata } from "next";
import { Rocket, ArrowUpRight, FolderOpen } from "lucide-react";
import { getCurrentProfile } from "@/lib/current-user";
import { getDashboardStats } from "@/lib/dashboard";
import { getProjectsByOwner } from "@/lib/queries";
import { Panel, PanelLabel } from "@/components/brand/panel";
import { GlanceRow } from "@/components/dashboard/glance-row";
import { getAdminContext } from "@/lib/admin";
import { DashboardHub } from "@/components/dashboard/dashboard-hub";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardOverview() {
  const profile = await getCurrentProfile();
  if (!profile) return null; // layout already redirects

  const [stats, projects, admin] = await Promise.all([
    getDashboardStats(profile.id),
    getProjectsByOwner(profile.id),
    getAdminContext(),
  ]);
  const recent = projects.slice(0, 6);

  return (
    <>
      {/* Mobile: drill-down hub. Desktop: full overview below. */}
      <DashboardHub
        posts={stats.projects}
        upvotes={stats.upvotes}
        saved={stats.saved}
        isPublic={profile.is_public}
        isAdmin={!!admin}
      />

      <div className="hidden space-y-8 lg:block">
        {/* At a glance */}
        <section>
          <PanelLabel className="mb-3">At a glance</PanelLabel>
          <GlanceRow
            stats={[
              { value: stats.projects, label: "Projects", href: "/dashboard/posts" },
              { value: stats.upvotes, label: "Upvotes", href: "/dashboard/posts" },
              { value: stats.saved, label: "Saved", href: "/dashboard/saved" },
            ]}
          />
        </section>

        {/* Profile visibility nudge — only when still private */}
        {!profile.is_public && (
          <Panel className="flex flex-wrap items-center gap-3">
            <span
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
              style={{ background: "var(--teal-50)", color: "var(--teal-700)" }}
            >
              <Rocket size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-ink">Your profile is private</p>
              <p className="text-sm text-muted-foreground">
                Make it public so people can see your work and reach you.
              </p>
            </div>
            <Link href="/dashboard/profile" className="btn btn-primary btn-sm shrink-0">
              Edit profile
            </Link>
          </Panel>
        )}

        {/* Primary action — post a project */}
        <section>
          <Panel className="flex flex-wrap items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal-50 text-teal-700">
              <Rocket size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-bold text-ink">
                Post a project
              </p>
              <p className="text-sm text-muted-foreground">
                Show the community what you built — or a great AI tool you found.
              </p>
            </div>
            <Link href="/showcase/submit" className="btn btn-primary shrink-0">
              Post your project
            </Link>
          </Panel>
        </section>

        {/* Recent projects */}
        <Panel className="flex flex-col">
          <div className="flex items-center justify-between">
            <PanelLabel>Your projects</PanelLabel>
            {recent.length > 0 && (
              <Link
                href="/dashboard/posts"
                className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 hover:underline"
              >
                View all <ArrowUpRight size={13} />
              </Link>
            )}
          </div>
          {recent.length === 0 ? (
            <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-canvas/50 px-4 py-8 text-center">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-700">
                <FolderOpen size={18} />
              </span>
              <p className="mt-3 text-sm font-medium text-ink">No projects yet</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Your projects will show up here.
              </p>
              <Link href="/showcase/submit" className="btn btn-primary btn-sm mt-4">
                Post your first project
              </Link>
            </div>
          ) : (
            <ul className="mt-3 -mx-1 space-y-0.5">
              {recent.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/showcase/${p.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-teal-50/60"
                  >
                    <span className="truncate text-sm font-medium text-ink">
                      {p.name}
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                      {p.upvote_count} upvotes
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
