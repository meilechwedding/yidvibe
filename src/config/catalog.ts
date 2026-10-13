import type { Accent } from "@/lib/design/accents";

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

export const NOTIFICATION_TYPES: {
  key: string;
  label: string;
  description: string;
}[] = [
  { key: "comment", label: "Comments", description: "Someone comments on your project." },
  { key: "upvote", label: "Upvotes", description: "Someone upvotes your project." },
];

export const PROJECT_COMMERCIAL: {
  key: "seeking_funding" | "for_sale" | "open_to_partners";
  label: string;
  accent: Accent;
}[] = [
  { key: "for_sale", label: "For sale", accent: "blue" },
  { key: "open_to_partners", label: "Open to partners", accent: "teal" },
];

export const KNOWN_CATEGORIES = KNOWN_TAGS;
