import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { listProjects, listBuilders, getBrowseTags } from "@/lib/queries";

// Rebuild the sitemap hourly so new projects/builders get discovered.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/showcase",
    "/showcase/submit",
    "/builders",
    "/directory",
    "/docs",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.7,
  }));

  // Best-effort dynamic entries — never let a query failure break the sitemap.
  let dynamic: MetadataRoute.Sitemap = [];
  try {
    const [projects, builders, tags] = await Promise.all([
      listProjects({ sort: "new", limit: 1000 }),
      listBuilders({ limit: 1000 }),
      getBrowseTags(),
    ]);

    const projectUrls: MetadataRoute.Sitemap = projects.map((p) => ({
      url: `${SITE_URL}/showcase/${p.id}`,
      lastModified: p.created_at ? new Date(p.created_at) : now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    const builderUrls: MetadataRoute.Sitemap = builders
      .filter((b) => b.is_public)
      .map((b) => ({
        url: `${SITE_URL}/u/${b.handle}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.5,
      }));

    const tagUrls: MetadataRoute.Sitemap = tags.map((t) => ({
      url: `${SITE_URL}/showcase?tag=${encodeURIComponent(t)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.4,
    }));

    dynamic = [...projectUrls, ...builderUrls, ...tagUrls];
  } catch {
    dynamic = [];
  }

  return [...staticRoutes, ...dynamic];
}
