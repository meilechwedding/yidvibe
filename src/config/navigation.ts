export const NAV_LINKS_ALL: { href: string; label: string; flag?: string }[] = [
  { href: "/showcase", label: COPY.showcase },
  { href: "/builders", label: COPY.builders, flag: "module.people" },
  { href: "/directory", label: COPY.directory, flag: "module.directory" },
  { href: "/gigs", label: COPY.gigs, flag: "module.gigs" },
  { href: "/competitions", label: COPY.competitions, flag: "module.competitions" },
  { href: "/events", label: COPY.events, flag: "module.events" },
  { href: "/docs", label: COPY.docs },
];

export const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/showcase", label: COPY.showcase },
  { href: "/docs", label: COPY.docs },
];

export const FOOTER_LINKS: { href: string; label: string }[] = [
  { href: "/showcase", label: COPY.showcase },
  { href: "/showcase/submit", label: COPY.postProject },
  { href: "/docs", label: COPY.docs },
];
import { NAVIGATION_COPY as COPY } from "@/content/navigation";
