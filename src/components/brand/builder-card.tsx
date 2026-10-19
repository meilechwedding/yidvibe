import Link from "next/link";
import { ArrowRight, BadgeCheck, Star } from "lucide-react";
import { AvatarCircle } from "./avatar-circle";
import { ToolPill, Pill } from "./pill";
import { builderProjectCount, type BuilderListItem } from "@/lib/queries";
import { displayName } from "@/lib/display";

export function BuilderCard({
  builder,
  rank,
}: {
  builder: BuilderListItem;
  rank?: 1 | 2 | 3;
}) {
  const count = builderProjectCount(builder);
  const name = displayName(builder);
  // is_featured ships in the row at runtime but may be missing from generated types.
  const isFeatured = !!(builder as { is_featured?: boolean }).is_featured;

  return (
    <Link
      href={`/u/${builder.handle}`}
      className="builder-card group flex flex-col rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 motion-reduce:transition-none motion-reduce:hover:translate-y-0 border border-border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-border-hover"
    >
      <div className="flex items-center gap-3">
        {rank ? (
          <span className="relative inline-flex shrink-0">
            <AvatarCircle
              name={name}
              src={builder.avatar_url}
              size={48}
              accent="blue"
              className={rank === 1 ? "yv-ring-gold" : undefined}
            />
            <span className={`yv-medal yv-medal-${rank}`}>{rank}</span>
          </span>
        ) : (
          <AvatarCircle
            name={name}
            src={builder.avatar_url}
            size={48}
            accent="blue"
          />
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="break-words font-display text-xl font-semibold text-ink">
              {name}
            </p>
            {builder.is_verified && (
              <span aria-label="Verified" title="Verified" className="shrink-0">
                <BadgeCheck size={15} className="text-gold-700" />
              </span>
            )}
            {isFeatured && (
              <span aria-label="Featured" title="Featured" className="shrink-0">
                <Star size={15} className="fill-current text-teal-700" />
              </span>
            )}
            {builder.available_for_hire && <Pill accent="sage">Available</Pill>}
          </div>
          <p className="truncate text-sm text-muted-foreground">
            @{builder.handle}
            {builder.location ? ` · ${builder.location}` : ""}
          </p>
        </div>
      </div>

      {builder.bio && (
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
          {builder.bio}
        </p>
      )}

      {builder.tools.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {builder.tools.slice(0, 4).map((t) => (
            <ToolPill key={t}>{t}</ToolPill>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">
          {count} {count === 1 ? "project" : "projects"}
        </span>
        <ArrowRight
          size={15}
          className="text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
        />
      </div>
    </Link>
  );
}
