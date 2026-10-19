import Link from "next/link";
import { ArrowUpRight, Compass, MessageCircle, Plus } from "lucide-react";
import { Container, Section } from "@/components/brand/layout";
import { SearchField } from "@/components/brand/search-field";
import { FeaturedProject } from "@/components/brand/featured-project";
import { BuilderRow } from "@/components/brand/builder-row";
import { listProjects, listTopBuilders, getBrowseTags } from "@/lib/queries";
import { isFeatureEnabled } from "@/lib/flags";

export default async function Home() {
  const [recent, builders, tags, showBuilders] = await Promise.all([
    listProjects({ sort: "new", limit: 6 }),
    listTopBuilders(3),
    getBrowseTags(),
    isFeatureEnabled("module.people"),
  ]);
  const project = recent.find((item) => item.featured) ?? recent[0];
  return (
    <>
      <section className="home-hero">
        <Container>
          <p className="hero-kicker">The home for frum builders</p>
          <h1>
            Good work starts
            <br />
            <span>a conversation.</span>
          </h1>
          <p className="hero-description">
            Discover AI projects. Meet the people behind them.
          </p>
          <SearchField className="hero-search" />
          <nav aria-label="Discover projects" className="hero-categories">
            {(tags.length
              ? tags.slice(0, 3)
              : ["AI tools", "Design", "Productivity"]
            ).map((tag) => (
              <Link key={tag} href={`/showcase?tag=${encodeURIComponent(tag)}`}>
                {tag}
              </Link>
            ))}
          </nav>
        </Container>
      </section>
      <Container>
        <section
          className={`connected-panel home-feature${showBuilders ? "" : " is-single"}`}
          aria-label="From the community"
        >
          {project ? (
            <FeaturedProject project={project} />
          ) : (
            <div className="featured-project feature-empty">
              <h2>Every project starts somewhere.</h2>
              <p>Share something you built and start the first conversation.</p>
              <Link href="/showcase/submit" className="btn btn-primary">
                Post a project <Plus size={18} />
              </Link>
            </div>
          )}
          {showBuilders && (
            <aside className="connected-aside home-builders">
              <h2>Find your people.</h2>
              <p className="text-muted-foreground">
                Good ideas go further together.
              </p>
              <div className="builder-rows">
                {builders.length ? (
                  builders.map((builder) => (
                    <BuilderRow key={builder.id} builder={builder} />
                  ))
                ) : (
                  <p className="py-8 text-muted-foreground">
                    Meet the community as builders share their work.
                  </p>
                )}
              </div>
              <Link href="/builders" className="btn btn-primary w-full">
                Find a builder <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
            </aside>
          )}
        </section>
      </Container>
      <Section className="home-how">
        <Container>
          <h2>From an idea to something useful.</h2>
          <div className="how-columns">
            <div>
              <Compass size={26} aria-hidden="true" />
              <h3>Discover good work</h3>
              <p>
                Explore what people are building and find a fresh perspective.
              </p>
            </div>
            <div>
              <MessageCircle size={26} aria-hidden="true" />
              <h3>Meet the people</h3>
              <p>
                Get to know the maker behind a project that catches your eye.
              </p>
            </div>
            <div>
              <Plus size={26} aria-hidden="true" />
              <h3>Share what you make</h3>
              <p>Bring your work to the community and see where it goes.</p>
            </div>
          </div>
        </Container>
      </Section>
      <Section className="pt-12 md:pt-16">
        <Container>
          <div className="share-work">
            <div>
              <h2>Working on something good?</h2>
              <p>Share your project. Find your people.</p>
            </div>
            <Link href="/showcase/submit" className="btn btn-gold">
              Share your work <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
