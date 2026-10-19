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
import { ProjectCard } from "@/components/brand/project-card";
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
  if (!profile.is_public)
    return {
      title: "Builder profile",
      description: "This builder has not made their profile public yet.",
    };
  const shown = displayName(profile);
  return {
    title: shown,
    description: profile.bio ?? `${shown} on YidVibe`,
  };
}

const BANNER: Record<Accent, string> = {
  teal: "var(--color-mist)",
  blue: "var(--color-mist)",
  orange: "var(--color-mist)",
  clay: "var(--color-mist)",
  sage: "var(--color-mist)",
  gold: "var(--color-mist)",
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
      className={cn(
        "btn btn-sm",
        variant === "primary" ? "btn-primary" : "btn-ghost",
      )}
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
      <Container className="py-8 md:py-12">
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Profile not public yet
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
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
    <Container className="profile-page">
      <nav aria-label="Breadcrumb" className="page-breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/builders">Builders</Link>
        <span>/</span>
        <span>{displayName(profile)}</span>
      </nav>
      {!profile.is_public && isOwner && (
        <p role="status" className="mb-6 rounded-input bg-mist p-4 text-sm">
          Your profile is not public yet. Only you can see this preview.
        </p>
      )}
      <div className="connected-panel profile-connected">
        <section className="profile-intro">
          {profile.cover_url && (
            <div className="profile-cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.cover_url} alt="" />
            </div>
          )}
          <div className="profile-heading">
            <AvatarCircle
              name={displayName(profile)}
              src={profile.avatar_url}
              size={96}
            />
            <div className="min-w-0">
              <h1>
                {displayName(profile)}{" "}
                {profile.is_verified && (
                  <span title="Verified">
                    <Sparkle size={22} />
                  </span>
                )}
              </h1>
              <p className="mt-3 text-muted-foreground">
                {profile.show_real_name !== false && (
                  <span>@{profile.handle}</span>
                )}
                {profile.location && (
                  <span className="ml-3 inline-flex items-center gap-1">
                    <MapPin size={15} />
                    {profile.location}
                  </span>
                )}
              </p>
            </div>
          </div>
          {profile.bio && (
            <p className="profile-bio" dir="auto">
              {profile.bio}
            </p>
          )}
          {profile.tools.length > 0 && (
            <div className="profile-skills">
              <h2>Builds with</h2>
              <div className="flex flex-wrap gap-2">
                {profile.tools.map((tool) => (
                  <span key={tool} className="chip">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
          <p className="mt-6 text-sm text-muted-foreground">Joined {joined}</p>
        </section>
        <aside className="connected-aside profile-connect">
          <h2>
            {isOwner ? "Your place in the community." : "Start a conversation."}
          </h2>
          {profile.available_for_hire && (
            <p className="mt-5">
              <span className="chip gold">Available for hire</span>
            </p>
          )}
          <p className="mt-5 text-muted-foreground">
            {isOwner
              ? "Keep your profile and projects up to date so people can get to know your work."
              : hasContact
                ? "Like what you see? Reach out through the links this builder has shared."
                : "Explore this builder's work below. They haven't shared contact details yet."}
          </p>
          {hasContact && (
            <div className="profile-contact-links">
              {links.website && (
                <LinkButton
                  href={links.website}
                  variant="primary"
                  icon={<Globe size={17} />}
                >
                  Website
                </LinkButton>
              )}
              {links.email && (
                <LinkButton
                  href={contactHref("email", links.email)}
                  icon={<Mail size={17} />}
                >
                  Email
                </LinkButton>
              )}
              {links.phone && (
                <LinkButton
                  href={contactHref("phone", links.phone)}
                  icon={<Phone size={17} />}
                >
                  Call
                </LinkButton>
              )}
              {links.whatsapp && (
                <LinkButton
                  href={contactHref("whatsapp", links.whatsapp)}
                  icon={<MessageCircle size={17} />}
                >
                  WhatsApp
                </LinkButton>
              )}
              {links.instagram && (
                <LinkButton
                  href={contactHref("instagram", links.instagram)}
                  icon={<Instagram size={17} />}
                >
                  Instagram
                </LinkButton>
              )}
              {links.github && (
                <LinkButton href={links.github} icon={<Github size={17} />}>
                  GitHub
                </LinkButton>
              )}
              {links.x && (
                <LinkButton href={links.x} icon={<Twitter size={17} />}>
                  X
                </LinkButton>
              )}
              {links.linkedin && (
                <LinkButton href={links.linkedin} icon={<Linkedin size={17} />}>
                  LinkedIn
                </LinkButton>
              )}
            </div>
          )}
          <div className="mt-6">
            {isOwner ? (
              <Link href="/dashboard/profile" className="btn btn-primary">
                <Pencil size={17} />
                Edit profile
              </Link>
            ) : (
              isAuthed && (
                <ReportMenu targetType="profile" targetId={profile.id} />
              )
            )}
          </div>
        </aside>
      </div>
      <section className="profile-projects">
        <div className="section-heading">
          <h2>{isOwner ? "Your projects" : "Projects"}</h2>
          {withOwner.length > 0 && (
            <span className="text-muted-foreground">
              {withOwner.length} shared
            </span>
          )}
        </div>
        {withOwner.length === 0 ? (
          <EmptyState
            className="mt-6"
            title="No projects yet"
            description={
              isOwner
                ? "Post something you built. It will appear here."
                : "This builder hasn't shared a project yet."
            }
            actionHref={isOwner ? "/showcase/submit" : undefined}
            actionLabel={isOwner ? "Post a project" : undefined}
          />
        ) : (
          <div className="project-grid mt-8">
            {withOwner.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isAuthed={isAuthed}
                upvoted={upvoted.has(project.id)}
                saved={saved.has(project.id)}
              />
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}
