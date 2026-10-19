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
import { AvatarCircle } from "@/components/brand/avatar-circle";
import { MediaGallery } from "@/components/brand/media-gallery";
import { CommentsCard } from "@/components/showcase/comments-card";
import {
  accentFor,
  CONTACT_KEYS,
  contactHref,
  type ContactKey,
} from "@/lib/site";
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
  return {
    title: project.name,
    description: project.description.slice(0, 155),
  };
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
  const canViewOwnerProfile =
    !!ownerProfile && (ownerProfile.is_public || isOwner);
  const links = ((canViewOwnerProfile ? ownerProfile?.links : null) ??
    {}) as Record<string, string | undefined>;
  const contacts = CONTACT_KEYS.filter(
    (k) => links[k] && String(links[k]).trim(),
  );

  const postedDate = new Date(project.created_at).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <Container className="detail-page">
      <nav aria-label="Breadcrumb" className="page-breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/showcase">Projects</Link>
        <span>/</span>
        <span className="min-w-0 break-words">{project.name}</span>
      </nav>
      <header className="detail-intro">
        <div className="min-w-0">
          {project.tags.length > 0 && (
            <p className="mb-4 text-sm font-medium text-muted-foreground">
              {project.tags.join(" · ")}
            </p>
          )}
          <h1 dir="auto">{project.name}</h1>
          <p className="detail-summary" dir="auto">
            {project.description}
          </p>
          <p className="mt-5 text-sm text-muted-foreground">
            {owner ? (
              <>
                Made by{" "}
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
          </p>
        </div>
        <div className="detail-actions">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Visit project <ExternalLink size={18} aria-hidden="true" />
            </a>
          )}
          <ShareButton
            path={`/showcase/${id}`}
            title={project.name}
            label="Share"
          />
          <SaveButton
            projectId={id}
            initialSaved={saved.has(id)}
            isAuthed={isAuthed}
            redirectTo={`/showcase/${id}`}
            variant="inline"
          />
          <UpvoteButton
            projectId={id}
            initialCount={project.upvote_count}
            initialUpvoted={upvoted.has(id)}
            isAuthed={isAuthed}
            redirectTo={`/showcase/${id}`}
          />
        </div>
      </header>

      {justPosted && (
        <div className="mb-8">
          <PostedShareCard
            path={`/showcase/${id}`}
            title={project.name}
            caption={`Check out ${project.name} on YidVibe`}
          />
        </div>
      )}

      <div className="connected-panel detail-connected">
        <div className="detail-media">
          <MediaGallery
            name={project.name}
            coverImage={project.image_url}
            images={project.images}
            liveUrl={project.url}
            accent={accent}
          />
        </div>
        <section className="detail-about">
          <h2>About {project.name}</h2>
          <p dir="auto">{project.description}</p>
          {project.video_url && (
            <a
              href={project.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost mt-6"
            >
              <Play size={18} aria-hidden="true" /> Watch demo
            </a>
          )}
        </section>
        <aside className="connected-aside detail-maker">
          <h2>Meet the maker</h2>
          {owner ? (
            <>
              <div className="mt-6 flex items-center gap-4">
                <AvatarCircle
                  name={displayName(owner)}
                  src={owner.avatar_url}
                  size={64}
                />
                <div className="min-w-0">
                  <p className="break-words text-xl font-semibold">
                    {displayName(owner)}
                  </p>
                  <p className="break-words text-sm text-muted-foreground">
                    @{owner.handle}
                  </p>
                </div>
              </div>
              {canViewOwnerProfile && ownerProfile?.bio && (
                <p className="mt-5 whitespace-pre-line text-base text-muted-foreground">
                  {ownerProfile.bio}
                </p>
              )}
              {canViewOwnerProfile ? (
                <Link
                  href={`/u/${owner.handle}`}
                  className="btn btn-primary mt-6 w-full"
                >
                  View profile <ArrowRight size={18} />
                </Link>
              ) : (
                <p className="mt-5 text-sm text-muted-foreground">
                  This builder has not made their profile public yet. Contact
                  details are unavailable.
                </p>
              )}
              {canViewOwnerProfile && contacts.length === 0 && (
                <p className="mt-5 text-sm text-muted-foreground">
                  This builder has not shared contact details.
                </p>
              )}
              {contacts.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {contacts.map((key) => {
                    const { label, Icon } = CONTACT_META[key];
                    return (
                      <a
                        key={key}
                        href={contactHref(key, String(links[key]))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm"
                      >
                        <Icon size={16} aria-hidden="true" />
                        {label}
                      </a>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="mt-5 space-y-5">
              <p className="text-muted-foreground">
                This project was shared by the community. Are you the maker?
              </p>
              <ClaimButton projectId={id} />
            </div>
          )}
          <dl className="project-facts">
            {project.tools.length > 0 && (
              <div>
                <dt>Built with</dt>
                <dd>
                  {project.tools.map((tool) => (
                    <Link
                      key={tool}
                      href={`/showcase?tool=${encodeURIComponent(tool)}`}
                      className="chip"
                    >
                      {tool}
                    </Link>
                  ))}
                </dd>
              </div>
            )}
            {project.tags.length > 0 && (
              <div>
                <dt>Category</dt>
                <dd>
                  {project.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/showcase?tag=${encodeURIComponent(tag)}`}
                      className="chip"
                    >
                      {tag}
                    </Link>
                  ))}
                </dd>
              </div>
            )}
            <div>
              <dt>Posted</dt>
              <dd>{postedDate}</dd>
            </div>
            {project.featured && (
              <div>
                <dt>Community pick</dt>
                <dd>Featured project</dd>
              </div>
            )}
          </dl>
          {(isOwner || adminUnlocked || isAuthed) && (
            <div className="detail-management">
              {isOwner && (
                <>
                  <Link
                    href={`/showcase/${id}/edit`}
                    className="btn btn-ghost btn-sm"
                  >
                    <Pencil size={16} />
                    Edit project
                  </Link>
                  <DeleteProjectButton action={deleteThis} />
                </>
              )}
              {adminUnlocked && (
                <FeatureToggle projectId={id} featured={!!project.featured} />
              )}
              {isAuthed && !isOwner && (
                <ReportMenu targetType="project" targetId={id} />
              )}
            </div>
          )}
        </aside>
      </div>
      <div className="detail-comments">
        <CommentsCard
          projectId={id}
          comments={comments}
          meId={me?.id ?? null}
          isAuthed={isAuthed}
        />
      </div>
    </Container>
  );
}
