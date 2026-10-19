import { NAVIGATION_COPY as COPY } from "@/content/navigation";


export const NAV_LINKS_ALL: { href: string; label: string; flag?: string }[] = [
  { href: "/showcase", label: COPY.showcase },
  { href: "/builders", label: COPY.builders, flag: "module.people" },
  { href: "/directory", label: COPY.directory, flag: "module.directory" },
];

export const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/showcase", label: COPY.showcase },
  { href: "/builders", label: COPY.builders },
  { href: "/directory", label: COPY.directory },
];

export const FOOTER_LINKS: { href: string; label: string }[] = [
  { href: "/showcase", label: COPY.showcase },
  { href: "/showcase/submit", label: COPY.postProject },
  { href: "/docs", label: COPY.docs },
];
