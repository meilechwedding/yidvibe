import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ExternalLink,
  Play,
  Pencil,
  ArrowRight,
  Mail,
  Phone,
  MessageCircle,
  Instagram,
  Globe,
  Github,
  Twitter,
  Linkedin,
  type LucideIcon,
} from "lucide-react";
import {
  getProjectById,
  getProfileByHandle,
  getComments,
  getMyUpvotedProjectIds,
  getMySavedProjectIds,
} from "@/lib/queries";
import { getCurrentProfile } from "@/lib/current-user";
import { getAdminContext, isAdminUnlocked } from "@/lib/admin";
import { Container } from "@/components/brand/layout";
import { SectionCrumb } from "@/components/brand/section-crumb";
import { Sparkle } from "@/components/brand/sparkle";
import { AvatarCircle } from "@/components/brand/avatar-circle";
import { Panel, PanelLabel } from "@/components/brand/panel";
import { MediaGallery } from "@/components/brand/media-gallery";
import { CommentsCard } from "@/components/showcase/comments-card";
import { accentFor, ACCENT_HERO, CONTACT_KEYS, contactHref, type ContactKey } from "@/lib/site";
import { UpvoteButton } from "@/components/brand/upvote-button";
import { SaveButton } from "@/components/brand/save-button";
import { ShareButton } from "@/components/brand/share-button";
import { ReportMenu } from "@/components/brand/report-menu";
import { DeleteProjectButton } from "@/components/showcase/delete-project-button";
import { ClaimButton } from "@/components/showcase/claim-button";
import { PostedShareCard } from "@/components/brand/posted-share-card";
import { FeatureToggle } from "@/components/admin/feature-toggle";
import { deleteProject } from "@/lib/actions/projects";
import { displayName } from "@/lib/display";

const CONTACT_META: Record<ContactKey, { label: string; Icon: LucideIcon }> = {
  email: { label: "Email", Icon: Mail },
  phone: { label: "Call", Icon: Phone },
  whatsapp: { label: "WhatsApp", Icon: MessageCircle },
  instagram: { label: "Instagram", Icon: Instagram },
  website: { label: "Website", Icon: Globe },
  github: { label: "GitHub", Icon: Github },
  x: { label: "X", Icon: Twitter },
  linkedin: { label: "LinkedIn", Icon: Linkedin },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) return { title: "Project not found" };
  return { title: project.name, description: project.description.slice(0, 155) };
}

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ posted?: string }>;
}) {
  const { id } = await params;
  const justPosted = (await searchParams)?.posted === "1";
  const project = await getProjectById(id);
  if (!project) notFound();

  const [comments, me, upvoted, saved, admin] = await Promise.all([
    getComments(id),
    getCurrentProfile(),
    getMyUpvotedProjectIds(),
    getMySavedProjectIds(),
    getAdminContext(),
  ]);
  const isAuthed = !!me;
  const owner = project.owner;
  const isOwner = !!me && me.id === project.owner_id;
  const adminUnlocked = admin ? await isAdminUnlocked(admin.userId) : false;
  const accent = accentFor(project.name);
  const deleteThis = deleteProject.bind(null, id);

  // Pull the builder's chosen public contact links (community posts have none).
  const ownerProfile = owner ? await getProfileByHandle(owner.handle) : null;
  const links = (ownerProfile?.links ?? {}) as Record<string, string | undefined>;
  const contacts = CONTACT_KEYS.filter((k) => links[k] && String(links[k]).trim());

  const postedDate = new Date(project.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const badge = project.featured ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-tint px-2.5 py-0.5 text-xs font-semibold text-gold-deep">
      <Sparkle size={12} color="var(--gold-500)" /> Featured
    </span>
  ) : project.url ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-tint px-2.5 py-0.5 text-xs font-semibold text-sage-deep">
      <span className="yv-live-dot h-1.5 w-1.5 rounded-full bg-sage-deep" /> Live
    </span>
  ) : null;

  return (
    <Container className="max-w-6xl py-8">
      <SectionCrumb section="Showcase" href="/showcase" name={project.name} accent="teal" />

      <header className="flex flex-wrap items-start gap-3.5 border-b border-border pb-5">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl font-display text-lg font-bold text-white"
          style={{ backgroundImage: ACCENT_HERO[accent] }}
        >
          {project.name.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1
              className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
              dir="auto"
            >
              {project.name}
            </h1>
            {badge}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {owner ? (
              <>
                by{" "}
                <Link
                  href={`/u/${owner.handle}`}
                  className="font-medium text-ink hover:underline"
                >
                  {displayName(owner)}
                </Link>
              </>
            ) : (
              "Community submission"
            )}
            {" · posted "}
            {postedDate}
          </p>
        </div>
        <SaveButton
          projectId={id}
          initialSaved={saved.has(id)}
          isAuthed={isAuthed}
          redirectTo={`/showcase/${id}`}
        />
      </header>

      {justPosted && (
        <div className="mt-5">
          <PostedShareCard
            path={`/showcase/${id}`}
            title={project.name}
            caption={`Check out "${project.name}" on YidVibe →`}
          />
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr] lg:items-start">
        {/* LEFT */}
        <div className="space-y-5">
          <MediaGallery
            name={project.name}
            coverImage={project.image_url}
            images={project.images}
            liveUrl={project.url}
            accent={accent}
          />

          <Panel>
            <PanelLabel>About</PanelLabel>
            <p
              className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink/90"
              dir="auto"
            >
              {project.description}
            </p>
          </Panel>

          <CommentsCard
            projectId={id}
            comments={comments}
            meId={me?.id ?? null}
            isAuthed={isAuthed}
          />
        </div>

        {/* RIGHT rail */}
        <div className="space-y-4 lg:sticky lg:top-16">
          <Panel>
            <div className="flex items-stretch gap-3">
              <UpvoteButton
                projectId={project.id}
                initialCount={project.upvote_count}
                initialUpvoted={upvoted.has(project.id)}
                isAuthed={isAuthed}
                redirectTo={`/showcase/${id}`}
                className="upvote-lg"
              />
              <div className="flex flex-1 flex-col justify-center gap-2">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm w-full justify-center"
                  >
                    <ExternalLink size={15} /> Visit site
                  </a>
                )}
                <ShareButton
                  path={`/showcase/${id}`}
                  title={project.name}
                  label="Share"
                  className="btn-sm w-full justify-center"
                />
                {project.video_url && (
                  <a
                    href={project.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm w-full justify-center"
                  >
                    <Play size={15} /> Watch demo
                  </a>
                )}
                {isOwner && (
                  <>
                    <Link
                      href={`/showcase/${id}/edit`}
                      className="btn btn-ghost btn-sm w-full justify-center"
                    >
                      <Pencil size={15} /> Edit
                    </Link>
                    <DeleteProjectButton action={deleteThis} />
                  </>
                )}
                {adminUnlocked && (
                  <FeatureToggle projectId={id} featured={!!project.featured} />
                )}
                {isAuthed && !isOwner && (
                  <div className="flex justify-center pt-0.5">
                    <ReportMenu targetType="project" targetId={id} />
                  </div>
                )}
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelLabel>Reach out</PanelLabel>
            {owner ? (
              <>
                <div className="mt-3 flex items-center gap-3">
                  <AvatarCircle
                    name={displayName(owner)}
                    src={owner.avatar_url}
                    size={40}
                    accent="blue"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">
                      {displayName(owner)}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      @{owner.handle}
                    </p>
                  </div>
                  <Link
                    href={`/u/${owner.handle}`}
                    className="btn btn-ghost btn-sm shrink-0"
                  >
                    View <ArrowRight size={15} />
                  </Link>
                </div>
                {contacts.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-border/60 pt-3">
                    {contacts.map((k) => {
                      const { label, Icon } = CONTACT_META[k];
                      return (
                        <a
                          key={k}
                          href={contactHref(k, String(links[k]))}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-[10px] border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:bg-secondary"
                        >
                          <Icon size={14} /> {label}
                        </a>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="mt-3 space-y-2.5">
                <p className="text-sm text-muted-foreground">
                  This is a community submission — no builder attached yet.
                </p>
                <ClaimButton projectId={id} />
              </div>
            )}
          </Panel>

          <Panel>
            <PanelLabel>Details</PanelLabel>
            <div className="mt-2">
              {project.tools.length > 0 && (
                <DetailRow k="Built with">
                  {project.tools.map((t) => (
                    <ChipLink
                      key={t}
                      href={`/showcase?tool=${encodeURIComponent(t)}`}
                      tone="bg-blue-tint text-blue-deep"
                    >
                      {t}
                    </ChipLink>
                  ))}
                </DetailRow>
              )}
              {project.tags.length > 0 && (
                <DetailRow k="Category">
                  {project.tags.map((t) => (
                    <ChipLink
                      key={t}
                      href={`/showcase?tag=${encodeURIComponent(t)}`}
                      tone="bg-teal-50 text-teal-800"
                    >
                      {t}
                    </ChipLink>
                  ))}
                </DetailRow>
              )}
              <DetailRow k="Posted">{postedDate}</DetailRow>
              {(project.featured || project.url) && (
                <DetailRow k="Status">
                  {project.featured ? "Featured" : "Live"}
                </DetailRow>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </Container>
  );
}

function DetailRow({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/60 py-2 text-sm last:border-0">
      <span className="shrink-0 font-medium text-muted-foreground">{k}</span>
      <span className="flex flex-wrap justify-end gap-1.5 text-right text-ink">
        {children}
      </span>
    </div>
  );
}

function ChipLink({
  href,
  tone,
  children,
}: {
  href: string;
  tone: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tone}`}
    >
      {children}
    </Link>
  );
}
