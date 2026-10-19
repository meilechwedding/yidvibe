import Link from "next/link";
import { isFeatureEnabled } from "@/lib/flags";
import { FeedbackWidget } from "./feedback-widget";
import { Container } from "@/components/brand/layout";
import { Logo } from "./logo";

export async function SiteFooter() {
  const showBuilders = await isFeatureEnabled("module.people");
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-main">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm text-muted-foreground">
              Good work starts a conversation.
            </p>
          </div>
          <nav aria-label="Footer" className="footer-links">
            <div>
              <p className="font-medium text-ink">Discover</p>
              <Link href="/showcase">Projects</Link>
              {showBuilders && <Link href="/builders">Builders</Link>}
              <Link href="/showcase/submit">Post a project</Link>
            </div>
            <div>
              <p className="font-medium text-ink">YidVibe</p>
              <Link href="/docs">How it works</Link>
              <FeedbackWidget />
            </div>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} YidVibe</span>
          <span>Made for people who make things.</span>
        </div>
      </Container>
    </footer>
  );
}
