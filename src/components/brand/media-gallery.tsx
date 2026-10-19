"use client";
import { useState } from "react";
import { siteScreenshotUrl } from "@/lib/site";
import { ProjectCover } from "./project-cover";
import type { Accent } from "@/lib/design/accents";

export function MediaGallery({
  name,
  coverImage,
  images = [],
  liveUrl,
}: {
  name: string;
  coverImage?: string | null;
  images?: string[];
  liveUrl?: string | null;
  accent: Accent;
}) {
  const all = Array.from(
    new Set([coverImage, ...images].filter(Boolean) as string[]),
  );
  const [active, setActive] = useState(0);
  const index = Math.min(active, Math.max(0, all.length - 1));
  const src = all[index] || (liveUrl ? siteScreenshotUrl(liveUrl) : null);
  return (
    <div className="media-gallery">
      <ProjectCover name={name} src={src} priority />
      {all.length > 1 && (
        <div className="media-thumbnails" aria-label="Project images">
          {all.map((url, i) => (
            <button
              key={url}
              type="button"
              aria-label={`View ${name} image ${i + 1}`}
              aria-pressed={i === index}
              onClick={() => setActive(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
