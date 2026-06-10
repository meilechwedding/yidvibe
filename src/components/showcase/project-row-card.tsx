import Link from "next/link";
import { Sparkles } from "lucide-react";
import { UpvoteButton } from "@/components/brand/upvote-button";
import { SaveButton } from "@/components/brand/save-button";
import { accentFor, type Accent } from "@/lib/site";
import { displayName } from "@/lib/display";
import { cn } from "@/lib/utils";
import type { ProjectWithOwner } from "@/lib/queries";

/** Deep accent gradient for the cover thumbnail fallback. */
const COVER: Record<Accent, string> = {
  teal: "linear-gradient(135deg, var(--teal-400), var(--teal-800))",
  blue: "linear-gradient(135deg, var(--blue-mid), var(--blue-deep))",
  orange: "linear-gradient(135deg, var(--orange-mid), var(--orange-deep))",
  clay: "linear-gradient(135deg, var(--clay-mid), var(--clay-deep))",
  sage: "linear-gradient(135deg, var(--sage-mid), var(--sage-deep))",
  gold: "linear-gradient(135deg, var(--gold-500), var(--gold-700))",
};

/**
 * The Showcase "mix" feed card: one roomy horizontal row — cover thumbnail
 * (the visual part) + scannable details + a prominent upvote (the list part).
 * Featured rows get a soft amber halo. A community submission shows no builder.
 */
export function ProjectRowCard({
  project,
  isAuthed,
  upvoted,
  saved = false,
}: {
  project: ProjectWithOwner;
  isAuthed: boolean;
  upvoted: boolean;
  saved?: boolean;
}) {
  const href = `/showcase/${project.id}`;
  const featured = !!project.featured;
  const owner = project.owner;
  const initial = project.name.slice(0, 1).toUpperCase();
  const cover = COVER[accentFor(project.name)];

  return (
    <div
      className={cn(
        "relative flex items-stretch gap-4 rounded-2xl border bg-surface p-3.5 shadow-sm transition-colors sm:gap-5",
        featured
          ? "border-gold-deep/30 ring-2 ring-gold-tint"
          : "border-border hover:border-border-hover",
      )}
    >
      <Link
        href={href}
        className="relative block h-[72px] w-24 shrink-0 overflow-hidden rounded-xl sm:h-[92px] sm:w-[132px]"
        style={{ background: cover }}
        aria-hidden
      >
        {project.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image_url}
            alt={project.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-white/90">
            {initial}
          </span>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link
            href={href}
            className="truncate font-display text-[15px] font-bold text-ink transition-colors hover:text-teal-700 sm:text-base"
          >
            {project.name}
          </Link>
          {featured && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-gold-deep/20 bg-gold-tint px-2 py-0.5 text-[10px] font-semibold text-gold-deep">
              <Sparkles size={10} /> Featured
            </span>
          )}
        </div>

        <div className="mt-0.5 truncate text-xs text-muted-foreground">
          {owner ? (
            <>
              by{" "}
              <Link
                href={`/u/${owner.handle}`}
                className="font-medium text-teal-700 hover:underline"
              >
                {displayName(owner)}
              </Link>
            </>
          ) : (
            <span>Community submission</span>
          )}
        </div>

        <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {project.tags.slice(0, 1).map((t) => (
            <span
              key={t}
              className="rounded-full border border-teal-100 bg-teal-50 px-2.5 py-0.5 text-[11px] font-medium text-teal-800"
            >
              {t}
            </span>
          ))}
          {project.tools.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-full border border-blue-tint bg-blue-tint px-2.5 py-0.5 text-[11px] font-medium text-blue-deep"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between">
        <SaveButton
          projectId={project.id}
          initialSaved={saved}
          isAuthed={isAuthed}
          redirectTo={href}
        />
        <UpvoteButton
          projectId={project.id}
          initialCount={project.upvote_count}
          initialUpvoted={upvoted}
          isAuthed={isAuthed}
          redirectTo={href}
        />
      </div>
    </div>
  );
}
