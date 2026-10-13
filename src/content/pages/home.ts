import { SITE_TAGLINE } from "@/config/site";

export const HOME_COPY = {
  tagline: SITE_TAGLINE,
  audiences: [
  {
    "tag": "I build",
    "title": "Show what you made",
    "body": "Post an app, tool, or MVP. Add a link or screenshot, tag how you built it, and let the community find it.",
    "cta": "Post your project",
    "href": "/showcase/submit"
  },
  {
    "tag": "I'm hiring",
    "title": "Find a builder through their work",
    "body": "Browse the projects and reach the maker through YidVibe — to hire, buy, or partner. No tech background needed.",
    "cta": "Browse builders",
    "href": "/builders"
  },
  {
    "tag": "I'm curious",
    "title": "Just look around",
    "body": "New to all of this? Explore freely — no account required. See what the community's making with AI.",
    "cta": "Explore the showcase",
    "href": "/showcase"
  }
],
} as const;
