import { BROWSE_COPY } from "@/content/pages/browse";
import { BUILDERS_COPY } from "@/content/pages/builders";
import { listBuilders, countBuilders, getBuilderFacets } from "@/lib/queries";
import { Container } from "@/components/brand/layout";
import { PageHeader } from "@/components/brand/page-header";
import { BuilderCard } from "@/components/brand/builder-card";
import { EmptyState } from "@/components/brand/empty-state";
import { FilterBar } from "@/components/brand/filter-bar";
import { Pagination } from "@/components/brand/pagination";

export const metadata = BUILDERS_COPY.metadata;

const PER_PAGE = 24;

export default async function BuildersPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    tool?: string;
    skill?: string;
    available?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const tool = sp.tool ?? "";
  const skill = sp.skill ?? "";
  const availableOnly = sp.available === "1";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const filtering = Boolean(q || tool || skill || availableOnly);

  const filterOpts = {
    q: q || undefined,
    tool: tool || undefined,
    skill: skill || undefined,
    availableOnly,
  };
  const [facets, total, builders] = await Promise.all([
    getBuilderFacets(),
    countBuilders(filterOpts),
    listBuilders({ ...filterOpts, sort: "followers", page, perPage: PER_PAGE }),
  ]);
  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <Container className="py-12 md:py-16">
      <PageHeader
        accent="blue"
        eyebrow={BUILDERS_COPY.eyebrow}
        title={BUILDERS_COPY.title}
        subtitle={BUILDERS_COPY.subtitle}
      />

      <FilterBar
        basePath="/builders"
        searchValue={q}
        placeholder="Search builders…"
        selects={[
          { name: "tool", allLabel: BROWSE_COPY.allTools, value: tool, options: facets.tools },
          { name: "skill", allLabel: "All skills", value: skill, options: facets.skills },
        ]}
        toggles={[
          { name: "available", label: "Available for hire", value: availableOnly },
        ]}
      />

      {builders.length === 0 ? (
        <EmptyState
          className="mt-8"
          title={filtering ? "No builders found" : "No builders yet"}
          description={
            filtering
              ? BROWSE_COPY.noResults
              : "Be the first to set up a builder profile and show what you build."
          }
          actionHref={filtering ? "/builders" : "/dashboard/profile"}
          actionLabel={filtering ? BROWSE_COPY.clearFilters : "Create your profile"}
        />
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {builders.map((b, i) => (
              <BuilderCard
                key={b.id}
                builder={b}
                rank={
                  !filtering && page === 1 && i < 3
                    ? ((i + 1) as 1 | 2 | 3)
                    : undefined
                }
              />
            ))}
          </div>
          <Pagination
            pathname="/builders"
            searchParams={sp}
            page={page}
            totalPages={totalPages}
          />
        </>
      )}
    </Container>
  );
}
