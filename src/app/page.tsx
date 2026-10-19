import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Container, Section } from "@/components/brand/layout";
import { BrowseBy } from "@/components/brand/browse-by";
import { ProjectRowCard } from "@/components/showcase/project-row-card";
import { BuilderCard } from "@/components/brand/builder-card";
import { listProjects, listTopBuilders, getBrowseTags, getMyUpvotedProjectIds, getMySavedProjectIds } from "@/lib/queries";
import { getAuthUser } from "@/lib/current-user";
import { isFeatureEnabled } from "@/lib/flags";

export default async function Home() {
  const [recent, builders, tags, user, upvoted, saved, showBuilders] = await Promise.all([
    listProjects({ sort: "new", limit: 6 }),
    listTopBuilders(4),
    getBrowseTags(),
    getAuthUser(),
    getMyUpvotedProjectIds(),
    getMySavedProjectIds(),
    isFeatureEnabled("module.people"),
  ]);

  return (
    <>
      <section>
        <Container className="py-12 md:py-16">
          <p className="text-sm font-medium text-teal-800">The home for frum builders</p>
          <h1 className="mt-4 max-w-[20ch] font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1.08] tracking-tight text-ink">
            See what the community is building.
          </h1>
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-muted-foreground">
            Discover useful apps, meet their makers, and share what you make with AI.
          </p>
          <form action="/showcase" method="get" className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-input border border-border bg-surface p-2 pl-4">
            <Search size={18} aria-hidden="true" className="shrink-0 text-muted-foreground" />
            <input name="q" dir="auto" placeholder="Search projects or tools" aria-label="Search projects or tools" className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ink outline-none placeholder:text-muted-foreground" />
            <button type="submit" className="btn btn-primary btn-sm min-h-11">Search</button>
          </form>
          <div className="mt-6"><BrowseBy tags={tags} /></div>
        </Container>
      </section>

      <Section className="pt-0">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-tight text-ink">Latest projects</h2>
            <Link href="/showcase" className="link-arrow min-h-11">Explore all <ArrowRight size={16} /></Link>
          </div>
          {recent.length ? (
            <div className="mt-6 flex flex-col gap-3">
              {recent.map(project => <ProjectRowCard key={project.id} project={project} isAuthed={!!user} upvoted={upvoted.has(project.id)} saved={saved.has(project.id)} />)}
            </div>
          ) : (
            <div className="mt-6 rounded-card border border-border bg-surface p-8">
              <h3 className="font-display text-xl font-semibold text-ink">No projects yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">Have something to share? Add the first project.</p>
              <Link href="/showcase/submit" className="link-arrow mt-4 min-h-11">Post a project <ArrowRight size={16} /></Link>
            </div>
          )}
        </Container>
      </Section>

      {showBuilders && builders.length > 0 && (
        <Section className="pt-12 md:pt-16">
          <Container>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-tight text-ink">Meet the builders</h2>
              <Link href="/builders" className="link-arrow min-h-11">All builders <ArrowRight size={16} /></Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{builders.map(builder => <BuilderCard key={builder.id} builder={builder} />)}</div>
          </Container>
        </Section>
      )}
    </>
  );
}
