import Link from "next/link";
import { getCurrentProfile } from "@/lib/current-user";
import { getAdminContext } from "@/lib/admin";
import { NAV_LINKS_ALL } from "@/lib/site";
import { isFeatureEnabled } from "@/lib/flags";
import {
  getNotificationSummary,
  describeNotification,
} from "@/lib/notifications";
import { Container } from "@/components/brand/layout";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";
import { NavShell } from "./nav-shell";
import { UserMenu } from "./user-menu";
import { Sidebar } from "./sidebar";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { NotificationBell, type BellItem } from "./notification-bell";
import { PostMenu } from "./post-menu";

export async function SiteNav() {
  const profile = await getCurrentProfile();

  const admin = profile ? await getAdminContext() : null;

  // Flag-aware nav: always-on links plus whichever modules the admin has launched.
  const navLinks: { href: string; label: string }[] = [];
  for (const l of NAV_LINKS_ALL) {
    if (!l.flag || (await isFeatureEnabled(l.flag))) {
      navLinks.push({ href: l.href, label: l.label });
    }
  }

  // Flag state for the "Post" entry points (post menu + user menu). These links
  // target flag-gated sections, so hide them until the module is launched —
  // otherwise they'd land on a 404. Reads are request-cached, so this is cheap.
  const postFlags: Record<string, boolean> = {
    "module.gigs": await isFeatureEnabled("module.gigs"),
    "module.competitions": await isFeatureEnabled("module.competitions"),
  };
  const showGig = postFlags["module.gigs"];

  let bellItems: BellItem[] = [];
  let unread = 0;
  if (profile) {
    const summary = await getNotificationSummary();
    unread = summary.unread;
    bellItems = summary.items.map((n) => {
      const { text, href } = describeNotification(n);
      return {
        id: n.id,
        text,
        href,
        read: n.read_at != null,
        createdAt: n.created_at,
        actorName: n.actor?.name ?? null,
        actorAvatar: n.actor?.avatar_url ?? null,
      };
    });
  }

  const sidebarProfile = profile
    ? { handle: profile.handle, name: profile.name, avatar_url: profile.avatar_url }
    : null;

  return (
    <>
      <Sidebar
        profile={sidebarProfile}
        bellItems={bellItems}
        unread={unread}
        isAdmin={!!admin}
        navLinks={navLinks}
        showGig={showGig}
      />
      <NavShell className="lg:hidden">
        <Container className="flex h-16 items-center gap-4">
          <Logo />
          <div className="hidden flex-1 lg:block">
            <NavLinks />
          </div>
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2 lg:gap-3">
            {profile && <NotificationBell items={bellItems} unread={unread} />}
            <div className="hidden lg:block">
              <PostMenu enabledFlags={postFlags} />
            </div>
            {profile ? (
              <UserMenu
                profile={{
                  handle: profile.handle,
                  name: profile.name,
                  avatar_url: profile.avatar_url,
                }}
                isAdmin={!!admin}
                showGig={showGig}
              />
            ) : (
              <Link href="/login" className="btn btn-ghost btn-sm">
                Sign in
              </Link>
            )}
          </div>
        </Container>
      </NavShell>

      <MobileBottomNav navLinks={navLinks} enabledFlags={postFlags} isAuthed={!!profile} />
    </>
  );
}
