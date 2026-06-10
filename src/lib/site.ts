export const SITE_NAME = "YidVibe";
export const SITE_TAGLINE = "the home for frum builders";
export const SITE_DESCRIPTION =
  "Where frum builders show what they're making with AI.";

/** Warm accent shelf — one accent per section (see BRAND.md). */
export type Accent = "teal" | "blue" | "orange" | "clay" | "sage" | "gold";

/**
 * Full nav set across the whole platform. Phase 1 hides most of these behind
 * admin Launch Control flags; this list is the source for deriving which
 * flag-gated extras to surface (see `src/lib/flags.ts`).
 */
export const NAV_LINKS_ALL: { href: string; label: string; flag?: string }[] = [
  { href: "/showcase", label: "Showcase" },
  { href: "/builders", label: "Builders", flag: "module.people" },
  { href: "/directory", label: "Directory", flag: "module.directory" },
  { href: "/gigs", label: "Gigs", flag: "module.gigs" },
  { href: "/competitions", label: "Competitions", flag: "module.competitions" },
  { href: "/events", label: "Events", flag: "module.events" },
  { href: "/docs", label: "How it works" },
];

/**
 * Phase 1 focused nav (always on). Flag-gated extras from NAV_LINKS_ALL are
 * appended at render time by the server nav shell.
 */
export const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/showcase", label: "Showcase" },
  { href: "/docs", label: "How it works" },
];

export const FOOTER_LINKS: { href: string; label: string }[] = [
  { href: "/showcase", label: "Showcase" },
  { href: "/showcase/submit", label: "Submit a project" },
  { href: "/docs", label: "How it works" },
];

/** Final Phase 1 tool set (suggestions + custom allowed). Order is intentional. */
export const KNOWN_TOOLS = [
  "Lovable",
  "base44",
  "Bolt",
  "v0",
  "Replit",
  "Cursor",
  "Claude Code",
  "Codex",
  "Windsurf",
  "Other",
];

/**
 * Final Phase 1 category set ("what it's about"). Suggestions + custom allowed.
 * Render in the teal pill family, distinct from the blue tool pills.
 */
export const KNOWN_TAGS = [
  "Torah",
  "Community",
  "Business",
  "Productivity",
  "Education",
  "Finance",
  "Health",
  "Design",
  "Developer Tools",
  "Automation",
  "AI",
];

/** Phase 1 calls these "categories" — alias for clarity at call sites. */
export const KNOWN_CATEGORIES = KNOWN_TAGS;

/** Categories offered in the Directory (filter chips + the apply form). */
export const DIRECTORY_CATEGORIES = [
  "Developer",
  "Designer",
  "Agency",
  "Marketing",
  "Service",
  "Product",
  "Content",
  "Other",
];

/** Notification types the user can toggle in settings (default: all on). */
export const NOTIFICATION_TYPES: {
  key: string;
  label: string;
  description: string;
}[] = [
  { key: "comment", label: "Comments", description: "Someone comments on your project." },
  { key: "upvote", label: "Upvotes", description: "Someone upvotes your project." },
];

/** Project-level commercial intents → badge label + accent. All optional. */
export const PROJECT_COMMERCIAL: {
  key: "seeking_funding" | "for_sale" | "open_to_partners";
  label: string;
  accent: Accent;
}[] = [
  { key: "for_sale", label: "For sale", accent: "blue" },
  { key: "open_to_partners", label: "Open to partners", accent: "teal" },
];

/** Public contact channels stored in profiles.links (user chooses what to fill). */
export const CONTACT_KEYS = [
  "email",
  "phone",
  "whatsapp",
  "instagram",
  "website",
  "github",
  "x",
  "linkedin",
] as const;
export type ContactKey = (typeof CONTACT_KEYS)[number];

/** True when a profile exposes at least one way to be reached. */
export function hasAnyContact(
  links: Record<string, string | undefined> | null | undefined,
): boolean {
  if (!links) return false;
  return CONTACT_KEYS.some((k) => !!(links[k] && String(links[k]).trim()));
}

/** Build a clickable href for a stored contact value. */
export function contactHref(key: ContactKey, value: string): string {
  const v = value.trim();
  switch (key) {
    case "email":
      return `mailto:${v}`;
    case "phone":
      return `tel:${v.replace(/[^\d+]/g, "")}`;
    case "whatsapp":
      return `https://wa.me/${v.replace(/[^\d]/g, "")}`;
    case "instagram":
      return /^https?:\/\//i.test(v)
        ? v
        : `https://instagram.com/${v.replace(/^@/, "")}`;
    default:
      return /^https?:\/\//i.test(v) ? v : `https://${v}`;
  }
}

/**
 * Live screenshot of a site, for covers/previews when a project has a URL but no
 * uploaded image. Keyless (WordPress mShots) — the first hit may serve a
 * placeholder while it renders, then caches the real shot. Swap this one line to
 * change providers (e.g. thum.io, microlink, urlbox).
 */
export function siteScreenshotUrl(
  url: string,
  { w = 1200, h = 900 }: { w?: number; h?: number } = {},
): string {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=${w}&h=${h}`;
}

/** Deep accent gradient (header icons, covers). Mirrors DetailHero's HERO map. */
export const ACCENT_HERO: Record<Accent, string> = {
  teal: "linear-gradient(135deg, var(--teal-400) 0%, var(--teal-800) 100%)",
  blue: "linear-gradient(135deg, var(--blue-mid) 0%, var(--blue-deep) 100%)",
  orange: "linear-gradient(135deg, var(--orange-mid) 0%, var(--orange-deep) 100%)",
  clay: "linear-gradient(135deg, var(--clay-mid) 0%, var(--clay-deep) 100%)",
  sage: "linear-gradient(135deg, var(--sage-mid) 0%, var(--sage-deep) 100%)",
  gold: "linear-gradient(135deg, var(--gold-500) 0%, var(--gold-700) 100%)",
};

/** tint background + deep-stop text — the BRAND pill pattern. */
export const ACCENT_PILL: Record<Accent, string> = {
  teal: "bg-teal-50 text-teal-800",
  blue: "bg-blue-tint text-blue-deep",
  orange: "bg-orange-tint text-orange-deep",
  clay: "bg-clay-tint text-clay-deep",
  sage: "bg-sage-tint text-sage-deep",
  gold: "bg-gold-tint text-gold-deep",
};

/** Solid-ish avatar/initials fill per accent. */
export const ACCENT_AVATAR: Record<Accent, string> = {
  teal: "bg-teal-100 text-teal-800",
  blue: "bg-blue-tint text-blue-deep",
  orange: "bg-orange-tint text-orange-deep",
  clay: "bg-clay-tint text-clay-deep",
  sage: "bg-sage-tint text-sage-deep",
  gold: "bg-gold-tint text-gold-deep",
};

/** Stable accent pick from a string (so a builder keeps the same avatar color). */
export function accentFor(seed: string): Accent {
  const accents: Accent[] = ["teal", "blue", "orange", "clay", "sage", "gold"];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return accents[h % accents.length];
}
