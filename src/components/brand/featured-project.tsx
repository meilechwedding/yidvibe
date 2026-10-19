import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AvatarCircle } from "./avatar-circle";
import { ProjectCover } from "./project-cover";
import { displayName } from "@/lib/display";
import type { ProjectWithOwner } from "@/lib/queries";

export function FeaturedProject({ project }: { project: ProjectWithOwner }) {
  const href = `/showcase/${project.id}`;
  return (
    <article className="featured-project">
      <div className="feature-heading">
        <p className="font-medium">
          {project.featured ? "Featured project" : "Fresh from the community"}
        </p>
        <Link href="/showcase" className="link-arrow">
          All projects <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <Link href={href} aria-label={`View ${project.name}`}>
        <ProjectCover name={project.name} src={project.image_url} priority />
      </Link>
      <h2 className="feature-title">
        <Link href={href}>{project.name}</Link>
      </h2>
      <p className="feature-description">{project.description}</p>
      <div className="feature-footer">
        {project.owner ? (
          <Link href={`/u/${project.owner.handle}`} className="maker-credit">
            <AvatarCircle
              name={displayName(project.owner)}
              src={project.owner.avatar_url}
              size={48}
            />
            <span>
              Made by <strong>{displayName(project.owner)}</strong>
            </span>
          </Link>
        ) : (
          <span className="text-sm text-muted-foreground">
            Community submission
          </span>
        )}
        <Link href={href} className="btn btn-ghost">
          View project <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
