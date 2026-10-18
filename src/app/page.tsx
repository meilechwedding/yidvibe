import { HOME_COPY } from "@/content/pages/home";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  Hammer,
  Briefcase,
  Compass,
  ChevronUp,
} from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/brand/layout";
import { Reveal } from "@/components/brand/reveal";
import { Sparkle } from "@/components/brand/sparkle";
import { BrowseBy } from "@/components/brand/browse-by";
import { RotatingRow } from "@/components/brand/rotating-row";
import { ProjectRowCard } from "@/components/showcase/project-row-card";
import { BuilderCard } from "@/components/brand/builder-card";
import { listProjects, listTopBuilders, getBrowseTags, getMyUpvotedProjectIds, getMySavedProjectIds } from "@/lib/queries";
import { getAuthUser } from "@/lib/current-user";
import { KNOWN_TOOLS } from "@/lib/site";

const AUDIENCE_PRESENTATION = [
  { tint: "tint-teal", Icon: Hammer },
  { tint: "tint-gold", Icon: Briefcase },
  { tint: "tint-blue", Icon: Compass },
] as const;

// Display-only casing fix (stored tool value stays "base44").
const toolLabel = (t: string) => (t === "base44" ? "Base44" : t);
const TOOL_STRIP = KNOWN_TOOLS.filter((t) => t !== "Other");

export default async function Home() {
  const [topList, recent, builders, tags, user, upvoted, saved] = await Promise.all([
    listProjects({ sort: "top", limit: 1 }),
    listProjects({ sort: "new", limit: 8 }),
    listTopBuilders(8),
    getBrowseTags(),
    getAuthUser(),
    getMyUpvotedProjectIds(),
    getMySavedProjectIds(),
  ]);
  const isAuthed = !!user;
  // Featured-first ordering means topList[0] is the editorial pick if one exists.
  const spotlight = topList[0]?.featured ? topList[0] : null;

  return (
    <>
      {/* ───── Hero ───── */}
      <section className="relative isolate overflow-hidden">
        <Container className="flex flex-col items-center py-16 text-center md:py-24">
          <span className="badge-pill">
            <Sparkle size={14} />
            {HOME_COPY.tagline}
          </span>

          <h1 className="mt-6 max-w-[16ch] font-display text-[clamp(2.25rem,6.5vw,4.5rem)] font-semibold leading-[1.06] tracking-tight text-ink">
            Discover what frum builders are making with{" "}
            <span className="text-teal-600">AI</span>
          </h1>

          <p className="mt-6 max-w-[52ch] text-base md:text-lg leading-relaxed text-muted-foreground">
            Torah apps, community tools, business, productivity — built by frum
            builders, from first-time vibe coders to seasoned pros. Post yours,
            browse the rest, get discovered.
          </p>

          <form
            action="/showcase"
            method="get"
            className="mt-8 flex w-full max-w-[560px] items-center gap-2 rounded-input border border-border bg-surface p-2 pl-4"
          >
            <Search size={18} className="shrink-0 text-muted-foreground" />
            <input
              name="q"
              dir="auto"
              placeholder="Search projects or tools…"
              aria-label="Search"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted-foreground"
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </form>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/showcase" className="btn btn-primary btn-lg">
              Explore the showcase <ArrowRight size={18} />
            </Link>
            <Link href="/showcase/submit" className="btn btn-ghost btn-lg">
              Post your project
            </Link>
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            Built with{" "}
            {TOOL_STRIP.map((t, i) => (
              <span key={t}>
                <span className="font-semibold text-ink">{toolLabel(t)}</span>
                {i < TOOL_STRIP.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </Container>
      </section>

      {/* ───── Browse by category ───── */}
      <Container className="pt-2">
        <BrowseBy tags={tags} />
      </Container>

      {/* ───── Featured spotlight ───── */}
      {spotlight && (
        <Section className="pt-12">
          <Container>
            <Reveal>
              <Eyebrow>★ Featured</Eyebrow>
              <div className="mt-6">
                <ProjectRowCard project={spotlight} isAuthed={isAuthed} upvoted={upvoted.has(spotlight.id)} saved={saved.has(spotlight.id)} />
              </div>
            </Reveal>
          </Container>
        </Section>
      )}

      {/* ───── Just shipped ───── */}
      <Section>
        <Container>
          <Reveal className="flex items-end justify-between gap-6">
            <div>
              <Eyebrow>Fresh from the community</Eyebrow>
              <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight text-ink">
                Just shipped
              </h2>
            </div>
            <Link href="/showcase" className="link-arrow shrink-0">
              Browse all projects <ArrowRight size={16} />
            </Link>
          </Reveal>

          {recent.length > 0 ? (
            <Reveal className="mt-12">
              <RotatingRow>
                {recent.map((p) => {
                  const external = !!p.url;
                  const href = p.url || `/showcase/${p.id}`;
                  return (
                    <div
                      key={p.id}
                      className="h-full overflow-hidden rounded-card border border-border bg-surface"
                    >
                      {p.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image_url}
                          alt={p.name}
                          loading="lazy"
                          decoding="async"
                          className="h-32 w-full object-cover"
                        />
                      ) : (
                        <div
                          className="flex h-32 w-full items-center justify-center font-display text-4xl font-semibold text-teal-700"
                          style={{ background: "var(--color-mist)" }}
                        >
                          {p.name.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-2 p-3">
                        <Link
                          href={href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                          className="truncate font-display font-semibold text-ink hover:text-teal-700"
                        >
                          {p.name}
                        </Link>
                        <span className="inline-flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-input border border-teal-100 bg-teal-50 text-xs font-medium leading-none text-teal-800">
                          <ChevronUp size={12} />
                          {p.upvote_count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </RotatingRow>
            </Reveal>
          ) : (
            <Reveal className="mt-12">
              <div className="flex flex-col items-center rounded-card border border-dashed border-border bg-surface px-6 py-16 text-center">
                <Sparkle size={26} color="var(--teal-400)" />
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">No projects yet</h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Be the first to post — your project lands here and on the Showcase.
                </p>
                <Link href="/showcase/submit" className="btn btn-primary mt-6">
                  Post your project
                </Link>
              </div>
            </Reveal>
          )}
        </Container>
      </Section>

      {/* ───── Meet the builders ───── */}
      {builders.length > 0 && (
        <Section>
          <Container>
            <Reveal className="flex items-end justify-between gap-6">
              <div>
                <Eyebrow>The people behind it</Eyebrow>
                <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight text-ink">
                  Meet the builders
                </h2>
              </div>
              <Link href="/builders" className="link-arrow shrink-0">
                Browse all builders <ArrowRight size={16} />
              </Link>
            </Reveal>
            <Reveal className="mt-12">
              <RotatingRow>
                {builders.map((b) => (
                  <BuilderCard key={b.id} builder={b} />
                ))}
              </RotatingRow>
            </Reveal>
          </Container>
        </Section>
      )}

      {/* ───── Who it's for ───── */}
      <Section>
        <Container>
          <Reveal>
            <Eyebrow>However you show up</Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight text-ink">
              Who it&apos;s for
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {HOME_COPY.audiences.map((a, i) => {
              const { Icon, tint } = AUDIENCE_PRESENTATION[i]!;
              return (
                <Reveal key={a.tag} delay={i * 80}>
                  <div className="group flex h-full flex-col rounded-card border border-border bg-surface p-8 transition-all hover:-translate-y-0.5 hover:border-border-hover hover:shadow-[var(--shadow-md)]">
                    <span className={`grid h-12 w-12 place-items-center rounded-[14px] ${tint}`}>
                      <Icon size={22} />
                    </span>
                    <span className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {a.tag}
                    </span>
                    <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                      {a.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {a.body}
                    </p>
                    <Link href={a.href} className="link-arrow mt-6">
                      {a.cta} <ArrowRight size={16} />
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ───── Ready to vibe? ───── */}
      <Section className="pb-4">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-card bg-teal-700 px-6 py-16 text-center md:py-16">
              <h2 className="relative font-display text-[clamp(1.75rem,5vw,3rem)] font-semibold text-white">
                Ready to vibe?
              </h2>
              <p className="relative mx-auto mt-4 max-w-md text-base text-white/80">
                Show what you built, or see what the community&apos;s making.
                Always free.
              </p>
              <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/showcase/submit"
                  className="btn btn-lg bg-white text-teal-800 hover:bg-white/90"
                >
                  Post your project
                </Link>
                <Link href="/showcase" className="btn btn-gold btn-lg">
                  Explore <ArrowRight size={18} />
                </Link>
              </div>
              <p className="relative mt-6 text-sm text-white/75">
                New here?{" "}
                <Link
                  href="/docs"
                  className="font-semibold text-white underline underline-offset-4"
                >
                  See how YidVibe works
                </Link>
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
