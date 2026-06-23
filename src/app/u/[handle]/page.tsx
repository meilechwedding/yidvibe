import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Globe,
  Github,
  Twitter,
  Linkedin,
  Pencil,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Instagram,
  CalendarDays,
  Star,
} from "lucide-react";
import { contactHref, accentFor, type Accent } from "@/lib/site";
import {
  getProfileByHandle,
  getProjectsByOwner,
  getMyUpvotedProjectIds,
  getMySavedProjectIds,
  type ProjectWithOwner,
} from "@/lib/queries";
import { getCurrentProfile } from "@/lib/current-user";
import { Container } from "@/components/brand/layout";
import { AvatarCircle } from "@/components/brand/avatar-circle";
import { ProjectRowCard } from "@/components/showcase/project-row-card";
import { Sparkle } from "@/components/brand/sparkle";
import { EmptyState } from "@/components/brand/empty-state";
import { ReportMenu } from "@/components/brand/report-menu";
import { cn } from "@/lib/utils";
import { displayName } from "@/lib/display";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const profile = await getProfileByHandle(handle);
  if (!profile) return { title: "Profile not found" };
  const shown = displayName(profile);
  return {
    title: shown,
    description: profile.bio ?? `${shown} on YidVibe`,
  };
}

const BANNER: Record<Accent, string> = {
  teal: "linear-gradient(135deg, var(--teal-50) 0%, var(--teal-400) 100%)",
  blue: "linear-gradient(135deg, var(--blue-bg) 0%, var(--blue-mid) 100%)",
  orange: "linear-gradient(135deg, var(--orange-bg) 0%, var(--orange-mid) 100%)",
  clay: "linear-gradient(135deg, var(--clay-bg) 0%, var(--clay-mid) 100%)",
  sage: "linear-gradient(135deg, var(--sage-bg) 0%, var(--sage-mid) 100%)",
  gold: "linear-gradient(135deg, var(--gold-50) 0%, var(--gold-500) 100%)",
};

function LinkButton({
  href,
  icon,
  variant = "ghost",
  children,
}: {
  href: string;
  icon: React.ReactNode;
  variant?: "primary" | "ghost";
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("btn btn-sm", variant === "primary" ? "btn-primary" : "btn-ghost")}
    >
      {icon}
      {children}
    </a>
  );
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const profile = await getProfileByHandle(handle);
  if (!profile) notFound();

  const me = await getCurrentProfile();
  const isOwner = me?.id === profile.id;
  const isAuthed = !!me;

  if (!profile.is_public && !isOwner) {
    return (
      <Container className="py-8 md:py-10">
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <h1 className="font-display text-2xl font-bold text-ink">Profile not public yet</h1>
          <p className="mt-3 text-[15px] text-muted-foreground">
            This builder hasn&apos;t made their profile public yet.
          </p>
          <Link href="/builders" className="btn btn-ghost mt-6">
            Browse builders
          </Link>
        </div>
      </Container>
    );
  }

  const [projects, upvoted, saved] = await Promise.all([
    getProjectsByOwner(profile.id),
    getMyUpvotedProjectIds(),
    getMySavedProjectIds(),
  ]);

  const links = (profile.links ?? {}) as Record<string, string | undefined>;
  const accent = accentFor(profile.handle);
  const joined = new Date(profile.created_at).toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });

  const owner = {
    handle: profile.handle,
    name: profile.name,
    avatar_url: profile.avatar_url,
    available_for_hire: profile.available_for_hire,
    show_real_name: profile.show_real_name,
  };
  const withOwner: ProjectWithOwner[] = projects.map((p) => ({ ...p, owner }));

  const hasContact =
    links.email ||
    links.phone ||
    links.whatsapp ||
    links.instagram ||
    links.website ||
    links.github ||
    links.x ||
    links.linkedin;

  return (
    <Container className="max-w-3xl py-8 md:py-10">
      {/* Profile header card */}
      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-sm)]">
        {profile.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.cover_url} alt="" className="h-28 w-full object-cover sm:h-36" />
        ) : (
          <div className="h-28 sm:h-36" style={{ backgroundImage: BANNER[accent] }} />
        )}
        <div className="px-5 pb-5 sm:px-7">
          <div className="flex flex-wrap items-end gap-4">
            <AvatarCircle
              name={displayName(profile)}
              src={profile.avatar_url}
              size={96}
              accent={accent}
              className="-mt-12 border-4 border-surface shadow-[0_6px_18px_rgba(0,0,0,0.14)]"
            />
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  {displayName(profile)}
                </h1>
                {profile.is_verified && (
                  <span title="Verified">
                    <Sparkle size={18} color="var(--gold-500)" />
                  </span>
                )}
                {(profile as { is_featured?: boolean }).is_featured && (
                  <span title="Featured" className="shrink-0">
                    <Star size={16} className="fill-current text-teal-700" />
                  </span>
                )}
              </div>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                {profile.show_real_name !== false && <span>@{profile.handle}</span>}
                {profile.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={13} /> {profile.location}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={13} /> Joined {joined}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 pb-1">
              {isOwner ? (
                <Link href="/dashboard/profile" className="btn btn-gold btn-sm">
                  <Pencil size={15} /> Edit profile
                </Link>
              ) : (
                isAuthed && <ReportMenu targetType="profile" targetId={profile.id} />
              )}
            </div>
          </div>

          {profile.bio && (
            <p className="mt-4 max-w-xl whitespace-pre-line text-[15px] leading-relaxed text-ink/90">
              {profile.bio}
            </p>
          )}

          {hasContact && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {links.website && (
                <LinkButton href={links.website} variant="primary" icon={<Globe size={15} />}>
                  Website
                </LinkButton>
              )}
              {links.email && (
                <LinkButton href={contactHref("email", links.email)} icon={<Mail size={15} />}>
                  Email
                </LinkButton>
              )}
              {links.phone && (
                <LinkButton href={contactHref("phone", links.phone)} icon={<Phone size={15} />}>
                  Call
                </LinkButton>
              )}
              {links.whatsapp && (
                <LinkButton href={contactHref("whatsapp", links.whatsapp)} icon={<MessageCircle size={15} />}>
                  WhatsApp
                </LinkButton>
              )}
              {links.instagram && (
                <LinkButton href={contactHref("instagram", links.instagram)} icon={<Instagram size={15} />}>
                  Instagram
                </LinkButton>
              )}
              {links.github && (
                <LinkButton href={links.github} icon={<Github size={15} />}>
                  GitHub
                </LinkButton>
              )}
              {links.x && (
                <LinkButton href={links.x} icon={<Twitter size={15} />}>
                  X
                </LinkButton>
              )}
              {links.linkedin && (
                <LinkButton href={links.linkedin} icon={<Linkedin size={15} />}>
                  LinkedIn
                </LinkButton>
              )}
            </div>
          )}

          {profile.tools.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                Builds with
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {profile.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-blue-tint bg-blue-tint px-2.5 py-0.5 text-xs font-medium text-blue-deep"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Projects */}
      <section className="mt-8">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {isOwner ? "Your projects" : "Projects"}
            {withOwner.length > 0 && (
              <span className="ml-2 text-sm font-medium text-muted-foreground">
                · {withOwner.length}
              </span>
            )}
          </h2>
        </div>
        {withOwner.length === 0 ? (
          <EmptyState
            className="mt-4"
            title="No projects yet"
            description={
              isOwner
                ? "Post something you built — it shows up here automatically."
                : "This person hasn't posted a project yet."
            }
            actionHref={isOwner ? "/showcase/submit" : undefined}
            actionLabel={isOwner ? "Post your project" : undefined}
          />
        ) : (
          <div className="mt-5 flex flex-col gap-3">
            {withOwner.map((p) => (
              <ProjectRowCard
                key={p.id}
                project={p}
                isAuthed={isAuthed}
                upvoted={upvoted.has(p.id)}
                saved={saved.has(p.id)}
              />
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}
