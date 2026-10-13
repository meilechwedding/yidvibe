/** Compatibility imports for existing feature/server code. New definitions live
 * in config, content, domain and design modules; this file owns no behavior. */
export { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, SITE_URL } from "@/config/site";
export { NAV_LINKS_ALL, NAV_LINKS, FOOTER_LINKS } from "@/config/navigation";
export { KNOWN_TOOLS, KNOWN_TAGS, KNOWN_CATEGORIES, DIRECTORY_CATEGORIES, NOTIFICATION_TYPES, PROJECT_COMMERCIAL } from "@/config/catalog";
export { CONTACT_KEYS, hasAnyContact, contactHref, type ContactKey } from "@/lib/domain/contacts";
export { siteScreenshotUrl } from "@/lib/media/site-screenshot";
export { type Accent, ACCENT_HERO, ACCENT_PILL, ACCENT_AVATAR, accentFor } from "@/lib/design/accents";
