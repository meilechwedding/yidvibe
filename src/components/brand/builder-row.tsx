import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AvatarCircle } from "./avatar-circle";
import { displayName } from "@/lib/display";
import { builderProjectCount, type BuilderListItem } from "@/lib/queries";

export function BuilderRow({ builder }: { builder: BuilderListItem }) {
  const count = builderProjectCount(builder);
  return (
    <Link href={`/u/${builder.handle}`} className="builder-row">
      <AvatarCircle
        name={displayName(builder)}
        src={builder.avatar_url}
        size={56}
      />
      <div className="min-w-0 flex-1">
        <p className="break-words font-medium text-ink">
          {displayName(builder)}
        </p>
        <p className="builder-row-summary">
          {builder.bio ||
            (builder.tools.length
              ? builder.tools.slice(0, 2).join(" · ")
              : `${count} ${count === 1 ? "project" : "projects"}`)}
        </p>
      </div>
      <span className="round-arrow">
        <ArrowRight size={19} aria-hidden="true" />
      </span>
    </Link>
  );
}
