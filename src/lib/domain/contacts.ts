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
