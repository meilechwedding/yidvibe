import { IMAGE_THEME } from "@/lib/design/image-theme";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Toaster } from "sonner";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { ContextBar } from "@/components/site/context-bar";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, SITE_TAGLINE } from "@/config/site";
import "./globals.css";

// Complete upstream webfont, self-hosted with its SIL Open Font License.
const spaceGrotesk = localFont({
  src: "../../public/fonts/space-grotesk-variable.woff2",
  weight: "400 600",
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — ${SITE_TAGLINE}`, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: IMAGE_THEME.primary,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={spaceGrotesk.variable}
    >
      <body className="flex min-h-dvh flex-col overflow-x-clip bg-canvas text-ink">
        <SiteNav />
        <ContextBar />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Toaster richColors position="top-center" />
        {/* Google Analytics (GA4) — direct gtag. G-CQZZR3R1TQ is the only
            provisioned/loadable stream (the G-XE27WHG02L stream 404s on
            gtag.js — "data collection isn't active" in GA). */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CQZZR3R1TQ"
          strategy="afterInteractive"
        />
        <Script id="ga-config" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-CQZZR3R1TQ');`}
        </Script>
      </body>
    </html>
  );
}
