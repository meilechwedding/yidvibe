import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AvatarCircle } from "./avatar-circle";
import { ProjectCover } from "./project-cover";
import { UpvoteButton } from "./upvote-button";
import { SaveButton } from "./save-button";
import { displayName } from "@/lib/display";
import type { ProjectWithOwner } from "@/lib/queries";

export function ProjectCard({
  project,
  isAuthed,
  upvoted,
  saved = false,
  showBuilder = true,
  topRank = false,
}: {
  project: ProjectWithOwner;
  isAuthed: boolean;
  upvoted: boolean;
  saved?: boolean;
  highlight?: boolean;
  showBuilder?: boolean;
  topRank?: boolean;
}) {
  const href = `/showcase/${project.id}`;
  return (
    <article className="project-card">
      <Link href={href} aria-label={`View ${project.name}`}>
        <ProjectCover name={project.name} src={project.image_url} />
      </Link>
      <div className="pc-body">
        <div className="pc-meta">
          <span>
            {project.tags[0] || project.tools[0] || "Community project"}
          </span>
          {project.featured && <span className="chip gold">Featured</span>}
          {topRank && <span className="chip">Most upvoted</span>}
        </div>
        <h2 className="pc-title">
          <Link href={href}>{project.name}</Link>
        </h2>
        <p className="pc-desc">{project.description}</p>
        <div className="pc-foot">
          {showBuilder &&
            (project.owner ? (
              <Link
                href={`/u/${project.owner.handle}`}
                className="maker-credit min-w-0 flex-1"
              >
                <AvatarCircle
                  name={displayName(project.owner)}
                  src={project.owner.avatar_url}
                  size={44}
                />
                <span className="min-w-0 break-words">
                  <strong>{displayName(project.owner)}</strong>
                  <small>Project maker</small>
                </span>
              </Link>
            ) : (
              <span className="flex-1 text-sm text-muted-foreground">
                Community submission
              </span>
            ))}
          <div className="pc-actions">
            <SaveButton
              projectId={project.id}
              initialSaved={saved}
              isAuthed={isAuthed}
              redirectTo={href}
              variant="inline"
            />
            <UpvoteButton
              projectId={project.id}
              initialCount={project.upvote_count}
              initialUpvoted={upvoted}
              isAuthed={isAuthed}
              redirectTo={href}
            />
            <Link
              href={href}
              aria-label={`Open ${project.name}`}
              className="round-arrow"
            >
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
