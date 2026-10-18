/** Shared brand presentation, safe in server and client components. */
export type Accent = "teal" | "blue" | "orange" | "clay" | "sage" | "gold";

/** Solid petrol cover treatment; feature keys remain stable. */
export const ACCENT_HERO: Record<Accent, string> = {
  teal: "var(--color-petrol)",
  blue: "var(--color-petrol)",
  orange: "var(--color-petrol)",
  clay: "var(--color-petrol)",
  sage: "var(--color-petrol)",
  gold: "var(--color-petrol)",
};

/** tint background + deep-stop text — the BRAND pill pattern. */
export const ACCENT_PILL: Record<Accent, string> = {
  teal: "bg-teal-50 text-teal-800",
  blue: "bg-blue-tint text-blue-deep",
  orange: "bg-orange-tint text-orange-deep",
  clay: "bg-mist text-petrol",
  sage: "bg-sage-tint text-sage-deep",
  gold: "bg-gold-tint text-amber-900",
};

/** Solid-ish avatar/initials fill per accent. */
export const ACCENT_AVATAR: Record<Accent, string> = {
  teal: "bg-teal-100 text-teal-800",
  blue: "bg-blue-tint text-blue-deep",
  orange: "bg-orange-tint text-orange-deep",
  clay: "bg-mist text-petrol",
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
  clay: { bg: "var(--color-mist)", fg: "var(--color-petrol)" },
  sage: { bg: "var(--sage-bg)", fg: "var(--sage-deep)" },
  gold: { bg: "var(--gold-50)", fg: "var(--gold-700)" },
};

export const ACCENT_TEXT: Record<Accent, string> = {
  teal: "var(--teal-700)", blue: "var(--blue-deep)", orange: "var(--orange-deep)",
  clay: "var(--color-petrol)", sage: "var(--sage-deep)", gold: "var(--gold-900)",
};
export const ACCENT_RULE: Record<Accent, string> = {
  teal: "var(--teal-600)", blue: "var(--blue-mid)", orange: "var(--orange-mid)",
  clay: "var(--color-mineral)", sage: "var(--sage-mid)", gold: "var(--gold-500)",
};
export const ACCENT_BORDER: Record<Accent, string> = { ...ACCENT_RULE, teal: "var(--teal-400)" };
export const ACCENT_ICON: Record<Accent, string> = { ...ACCENT_PILL, teal: "bg-teal-50 text-teal-700" };
