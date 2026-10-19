"use client";
import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProjectCover({
  name,
  src,
  className,
  priority = false,
}: {
  name: string;
  src?: string | null;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  return (
    <div className={cn("project-cover", className)}>
      {src && failed !== src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${name} preview`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(src)}
        />
      ) : (
        <div className="project-cover-empty">
          <ImageIcon size={28} aria-hidden="true" />
          <span>{name}</span>
          <small>Project preview</small>
        </div>
      )}
    </div>
  );
}
