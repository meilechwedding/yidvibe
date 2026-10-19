import { BROWSE_COPY } from "@/content/pages/browse";
import { SHOWCASE_COPY } from "@/content/pages/showcase";
import { Rocket } from "lucide-react";
import {
  listProjects,
  countProjects,
  getProjectFacets,
  getMyUpvotedProjectIds,
  getMySavedProjectIds,
} from "@/lib/queries";
import { getAuthUser } from "@/lib/current-user";
import { Container } from "@/components/brand/layout";
import { PageHeader } from "@/components/brand/page-header";
import Link from "next/link";
import { ProjectCard } from "@/components/brand/project-card";
import { isFeatureEnabled } from "@/lib/flags";
import { EmptyState } from "@/components/brand/empty-state";
import { FilterBar } from "@/components/brand/filter-bar";
import { Pagination } from "@/components/brand/pagination";

export const metadata = SHOWCASE_COPY.metadata;

const PER_PAGE = 24;

export default async function ShowcasePage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    tool?: string;
    tag?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const tool = sp.tool ?? "";
  const tag = sp.tag ?? "";
  const sort: "top" | "new" = sp.sort === "new" ? "new" : "top";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const filtering = Boolean(q || tool || tag);

  const filterOpts = {
    q: q || undefined,
    tool: tool || undefined,
    tag: tag || undefined,
  };
  const [facets, total, projects, upvoted, saved, user] = await Promise.all([
    getProjectFacets(),
    countProjects(filterOpts),
    listProjects({ ...filterOpts, sort, page, perPage: PER_PAGE }),
    getMyUpvotedProjectIds(),
    getMySavedProjectIds(),
    getAuthUser(),
  ]);
  const isAuthed = !!user;
  const showBuilders = await isFeatureEnabled("module.people");
  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <Container className="catalog-page">
      <nav aria-label="Breadcrumb" className="page-breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>Explore</span>
      </nav>
      <PageHeader
        accent="teal"
        title="Explore projects"
        subtitle="Find an idea, a useful tool, or your next collaborator."
        action={
          showBuilders ? (
            <nav aria-label="Explore type" className="browse-tabs">
              <Link href="/showcase" aria-current="page">
                Projects
              </Link>
              <Link href="/builders">Builders</Link>
            </nav>
          ) : undefined
        }
      />

      <FilterBar
        basePath="/showcase"
        searchValue={q}
        placeholder="Search projects or tools…"
        selects={[
          {
            name: "tool",
            allLabel: BROWSE_COPY.allTools,
            value: tool,
            options: facets.tools,
          },
          {
            name: "tag",
            allLabel: BROWSE_COPY.allCategories,
            value: tag,
            options: facets.tags,
          },
        ]}
        sort={{
          name: "sort",
          value: sort,
          options: [
            { value: "top", label: "Top" },
            { value: "new", label: "Latest" },
          ],
        }}
      />

      {projects.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={<Rocket size={22} />}
          title={filtering ? "No projects found" : "No projects yet"}
          description={
            filtering ? BROWSE_COPY.noResults : "Be the first to post."
          }
          actionHref={filtering ? "/showcase" : "/showcase/submit"}
          actionLabel={
            filtering ? BROWSE_COPY.clearFilters : "Post your project"
          }
        />
      ) : (
        <>
          <div className="project-grid mt-8">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                isAuthed={isAuthed}
                upvoted={upvoted.has(p.id)}
                saved={saved.has(p.id)}
              />
            ))}
          </div>
          <Pagination
            pathname="/showcase"
            searchParams={sp}
            page={page}
            totalPages={totalPages}
          />
        </>
      )}
    </Container>
  );
}
