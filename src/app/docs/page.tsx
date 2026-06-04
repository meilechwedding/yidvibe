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

export const metadata = {
  title: "How YidVibe works",
  description:
    "How to post a project, upvote, comment, claim, and set up a profile on YidVibe — the home for frum builders. Free.",
};

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
      <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold text-ink">
        {Icon && <Icon size={22} className="shrink-0 text-teal-600" />}
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink/90">
        {children}
      </div>
    </section>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-5 font-display text-lg font-semibold text-ink">{children}</h3>
  );
}

export default function DocsPage() {
  return (
    <Container className="max-w-2xl py-12 md:py-16">
      <Eyebrow>How it works</Eyebrow>
      <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,3rem)] font-bold leading-tight tracking-tight text-ink">
        The home for frum builders
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        YidVibe is a curated board of AI projects and tools built by frum
        builders — Torah apps, community tools, business software, personal
        productivity. Browse it, upvote what you like, and post your own. Always
        free.
      </p>

      <div className="mt-10 space-y-8">
        <Section id="post" title="Posting a project" icon={Rocket}>
          <p>
            Hit <strong>Post your project</strong> from anywhere. Paste a link and
            tap <strong>Autofill</strong> — we pull in the title, description, and
            cover image for you to tidy up. Add the <strong>tools</strong> you
            built it with and a <strong>category</strong>, and post. It goes live
            right away.
          </p>
          <Sub>You don&apos;t need an account to post</Sub>
          <p>
            Anyone can post — your own build, or a cool AI tool you found on the
            web that the community would enjoy. Posts without an account appear as
            a <strong>community submission</strong> (no maker attached).
          </p>
          <Sub>If you&apos;re signed in</Sub>
          <p>
            A post defaults to <strong>&ldquo;I built this&rdquo;</strong> — it
            shows <em>by you</em> and appears on your profile. Posting something
            you only found? Flip the toggle to{" "}
            <strong>&ldquo;I found it on the web&rdquo;</strong> and it posts as a
            community submission instead.
          </p>
        </Section>

        <Section id="engage" title="Upvotes & comments" icon={ChevronUp}>
          <p>
            <strong>Upvoting</strong> works without an account — it&apos;s how good
            work rises to the top. To <strong>comment or reply</strong>,
            you&apos;ll need a free account; conversations are public so everyone
            can follow along.
          </p>
          <p>
            A <strong>Featured</strong> badge is hand-picked by our team to
            spotlight standout work — you can&apos;t buy it. Featured projects sit
            at the top of the Showcase and on the homepage.
          </p>
        </Section>

        <Section id="accounts" title="Accounts & profiles" icon={UserCircle}>
          <p>
            You can browse, post, and upvote without an account. Make a free one
            (Google, or email &amp; password) to comment, save projects, and have
            a profile.
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

        <Section id="claim" title="Claiming a project" icon={Hand}>
          <p>
            Did someone post a tool <em>you</em> made as a community submission?
            On the project page, hit{" "}
            <strong>&ldquo;Did you make this? Claim it.&rdquo;</strong> Our team
            reviews the claim, and once approved the project is attached to your
            profile with you credited as the maker.
          </p>
        </Section>

        <Section id="contact" title="Reaching makers" icon={MessageSquare}>
          <p>
            There are no public phone numbers or emails unless someone adds them.
            On a project by a signed-in builder, the{" "}
            <strong>Reach out</strong> panel shows exactly the contact links that
            person chose to share. No middle-man messaging — you connect directly.
          </p>
        </Section>

        <Section id="safety" title="Reporting & guidelines" icon={ShieldCheck}>
          <p>
            See something that doesn&apos;t belong? Every project and comment has a
            quiet <strong>Report</strong> option in its menu — reports go to our
            team, who can hide or remove content.
          </p>
          <p>Keep it useful and respectful:</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>Post real work and honest information.</li>
            <li>No spam, scams, or misleading offers.</li>
            <li>Be respectful — no harassment or offensive content.</li>
            <li>Only share what you have the right to share.</li>
          </ul>
        </Section>

        <Section id="faq" title="FAQ" icon={HelpCircle}>
          <p className="font-medium text-ink">Does it cost anything?</p>
          <p>No. Browsing, posting, upvoting, and connecting are all free.</p>

          <p className="mt-3 font-medium text-ink">Do I need an account?</p>
          <p>
            Not to browse, post, or upvote. You need one to comment, save
            projects, claim a project, or have a profile.
          </p>

          <p className="mt-3 font-medium text-ink">
            Can I post something I built with AI tools?
          </p>
          <p>
            Yes — that&apos;s the whole point. Tag the tools you used so others can
            see how it was made.
          </p>
        </Section>

        <Section id="start" title="Ready?" icon={LogIn}>
          <p>Now you know how it works — go build something.</p>
          <div className="pt-2">
            <Link
              href="/showcase"
              className="btn-sweep inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold"
            >
              Explore the showcase
            </Link>
          </div>
        </Section>
      </div>
    </Container>
  );
}
