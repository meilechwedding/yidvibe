import { DOCS_COPY } from "@/content/pages/docs";
import Link from "next/link";
import {
  Rocket,
  LogIn,
  ChevronUp,
  MessageSquare,
  UserCircle,
  Hand,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { Container, Eyebrow } from "@/components/brand/layout";

export const metadata = { title: DOCS_COPY.title, description: DOCS_COPY.description };

function Section({
  id,
  title,
  icon: Icon,
  children,
}: {
  id?: string;
  title: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-border pt-8">
      <h2 className="flex items-center gap-3 font-display text-2xl font-semibold text-ink">
        {Icon && <Icon size={22} className="shrink-0 text-teal-600" />}
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink/90">
        {children}
      </div>
    </section>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 font-display text-lg font-semibold text-ink">{children}</h3>
  );
}

export default function DocsPage() {
  return (
    <Container className="max-w-2xl py-12 md:py-16">
      <Eyebrow>{DOCS_COPY.eyebrow}</Eyebrow>
      <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,3rem)] font-semibold leading-tight tracking-tight text-ink">
        {DOCS_COPY.title}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {DOCS_COPY.intro}
      </p>

      <div className="mt-12 space-y-8">
        <Section id="post" title={DOCS_COPY.sections.post} icon={Rocket}>
          <p>
            Sign in, hit <strong>Post your project</strong>, and add a link,
            description, cover image, the <strong>tools</strong> you built it
            with, and a <strong>category</strong>. It goes live right away.
          </p>
          <Sub>Choose how it appears</Sub>
          <p>
            A post defaults to <strong>&ldquo;I built this&rdquo;</strong> — it
            shows <em>by you</em> and appears on your profile. Posting something
            you only found? Flip the toggle to{" "}
            <strong>&ldquo;I found it on the web&rdquo;</strong> and it posts as a
            community submission instead.
          </p>
        </Section>

        <Section id="engage" title={DOCS_COPY.sections.engage} icon={ChevronUp}>
          <p>
            {DOCS_COPY.engagement}
          </p>
          <p>
            A <strong>Featured</strong> badge is hand-picked by our team to
            spotlight standout work — you can&apos;t buy it. Featured projects sit
            at the top of the Showcase and on the homepage.
          </p>
        </Section>

        <Section id="accounts" title={DOCS_COPY.sections.accounts} icon={UserCircle}>
          <p>
            {DOCS_COPY.accountRequirements}
          </p>
          <Sub>Your profile is yours to shape</Sub>
          <p>
            Show your full name, just a nickname — whatever you want. Add a bio,
            the tools you build with, and only the{" "}
            <strong>contact links</strong> you choose (website, email, WhatsApp,
            and so on). Your profile is private until you choose to make it public;
            once public, people can reach you through the work you&apos;ve posted.
          </p>
        </Section>

        <Section id="directory" title={DOCS_COPY.sections.directory} icon={UserCircle}>
          <p>
            <Link href="/signup?next=/directory/list-me" className="font-medium text-teal-700 hover:underline">Create a free account</Link>{" "}
            to add a listing using your profile details. Already signed in?{" "}
            <Link href="/directory/list-me" className="font-medium text-teal-700 hover:underline">Add yourself to the directory</Link>.
          </p>
          <p>
            You can also use the{" "}
            <Link href="/directory/list" className="font-medium text-teal-700 hover:underline">public listing form</Link>{" "}
            without an account. We review those submissions before they appear.
          </p>
        </Section>

        <Section id="claim" title={DOCS_COPY.sections.claim} icon={Hand}>
          <p>
            Did someone post a tool <em>you</em> made as a community submission?
            On the project page, hit{" "}
            <strong>&ldquo;Did you make this? Claim it.&rdquo;</strong> Our team
            reviews the claim, and once approved the project is attached to your
            profile with you credited as the maker.
          </p>
        </Section>

        <Section id="contact" title={DOCS_COPY.sections.contact} icon={MessageSquare}>
          <p>
            There are no public phone numbers or emails unless someone adds them.
            On a project by a signed-in builder, the{" "}
            <strong>Reach out</strong> panel shows exactly the contact links that
            person chose to share. No middle-man messaging — you connect directly.
          </p>
        </Section>

        <Section id="safety" title={DOCS_COPY.sections.safety} icon={ShieldCheck}>
          <p>
            See something that doesn&apos;t belong? Every project and comment has a
            quiet <strong>Report</strong> option in its menu — reports go to our
            team, who can hide or remove content.
          </p>
          <p>Keep it useful and respectful:</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>Post real work and honest information.</li>
            <li>No spam, scams, or misleading offers.</li>
            <li>Be respectful — no harassment or offensive content.</li>
            <li>Only share what you have the right to share.</li>
          </ul>
        </Section>

        <Section id="faq" title={DOCS_COPY.sections.faq} icon={HelpCircle}>
          <p className="font-medium text-ink">Does it cost anything?</p>
          <p>No. Browsing, posting, upvoting, and connecting are all free.</p>

          <p className="mt-3 font-medium text-ink">Do I need an account?</p>
          <p>
            {DOCS_COPY.accountFaq}
          </p>

          <p className="mt-3 font-medium text-ink">
            Can I post something I built with AI tools?
          </p>
          <p>
            Yes — that&apos;s the whole point. Tag the tools you used so others can
            see how it was made.
          </p>
        </Section>

        <Section id="start" title={DOCS_COPY.sections.start} icon={LogIn}>
          <p>Now you know how it works — go build something.</p>
          <div className="pt-2">
            <Link
              href="/showcase"
              className="btn-sweep inline-flex h-12 items-center justify-center rounded-input px-6 text-sm font-medium"
            >
              Explore the showcase
            </Link>
          </div>
        </Section>
      </div>
    </Container>
  );
}
