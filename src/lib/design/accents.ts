/** Shared brand presentation, safe in server and client components. */
export type Accent = "teal" | "blue" | "orange" | "clay" | "sage" | "gold";

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
  gold: "bg-gold-tint text-amber-900",
};

/** Solid-ish avatar/initials fill per accent. */
export const ACCENT_AVATAR: Record<Accent, string> = {
  teal: "bg-teal-100 text-teal-800",
  blue: "bg-blue-tint text-blue-deep",
  orange: "bg-orange-tint text-orange-deep",
  clay: "bg-clay-tint text-clay-deep",
  sage: "bg-sage-tint text-sage-deep",
  gold: "bg-gold-tint text-amber-900",
};

/** Stable accent pick from a string (so a builder keeps the same avatar color). */
export function accentFor(seed: string): Accent {
  const accents: Accent[] = ["teal", "blue", "orange", "clay", "sage", "gold"];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return accents[h % accents.length];
}

/** Soft cover colors for initials and screenshot mats. */
export const ACCENT_COVER: Record<Accent, { bg: string; fg: string }> = {
  teal: { bg: "var(--teal-50)", fg: "var(--teal-700)" },
  blue: { bg: "var(--blue-bg)", fg: "var(--blue-deep)" },
  orange: { bg: "var(--orange-bg)", fg: "var(--orange-deep)" },
  clay: { bg: "var(--clay-bg)", fg: "var(--clay-deep)" },
  sage: { bg: "var(--sage-bg)", fg: "var(--sage-deep)" },
  gold: { bg: "var(--gold-50)", fg: "var(--gold-700)" },
};

export const ACCENT_TEXT: Record<Accent, string> = {
  teal: "var(--teal-700)", blue: "var(--blue-deep)", orange: "var(--orange-deep)",
  clay: "var(--clay-deep)", sage: "var(--sage-deep)", gold: "var(--gold-900)",
};
export const ACCENT_RULE: Record<Accent, string> = {
  teal: "var(--teal-600)", blue: "var(--blue-mid)", orange: "var(--orange-mid)",
  clay: "var(--clay-mid)", sage: "var(--sage-mid)", gold: "var(--gold-500)",
};
export const ACCENT_BORDER: Record<Accent, string> = { ...ACCENT_RULE, teal: "var(--teal-400)" };
export const ACCENT_ICON: Record<Accent, string> = { ...ACCENT_PILL, teal: "bg-teal-50 text-teal-700" };
