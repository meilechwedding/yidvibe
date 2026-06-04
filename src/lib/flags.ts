import { cache } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin "Launch Control" feature flags.
 *
 * Phase 1 ships focused: the bigger site (Gigs, Competitions, Directory, Events,
 * messaging, People directory) and a few features sit behind flags that default
 * OFF. The admin flips them on from /admin/launch to roll out piece by piece.
 *
 * `feature_flags` isn't in the generated Supabase types until the migration is
 * applied, so reads cast the client to `any` (matching the codebase convention
 * for not-yet-migrated tables). The safe default everywhere is OFF/hidden.
 */

export type FlagCategory = "module" | "feature";
export type FlagDef = {
  key: string;
  label: string;
  description: string;
  category: FlagCategory;
};

/** Canonical flag list — mirrors the seed migration and drives the admin UI. */
export const FLAG_DEFS: FlagDef[] = [
  { key: "module.gigs", label: "Gigs", description: "Job board for builders.", category: "module" },
  { key: "module.competitions", label: "Competitions", description: "Build competitions.", category: "module" },
  { key: "module.directory", label: "Business Directory", description: "Get-listed business directory.", category: "module" },
  { key: "module.events", label: "Events", description: "Community events calendar.", category: "module" },
  { key: "module.messaging", label: "Private messaging", description: "Inbox + DMs between users.", category: "module" },
  { key: "module.people", label: "People directory", description: "Browsable directory of public profiles.", category: "module" },
  { key: "feature.homepage_stats", label: "Homepage stats", description: "Projects / builders counter on the landing.", category: "feature" },
];

type FlagRow = { key: string; enabled: boolean };

/** Read all flag rows once per request. Safe fallback: {} (everything OFF). */
const getFlagMap = cache(async (): Promise<Record<string, boolean>> => {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as unknown as {
      from: (t: string) => {
        select: (c: string) => Promise<{ data: FlagRow[] | null; error: unknown }>;
      };
    })
      .from("feature_flags")
      .select("key, enabled");
    if (error || !data) return {};
    const map: Record<string, boolean> = {};
    for (const row of data) map[row.key] = !!row.enabled;
    return map;
  } catch {
    return {};
  }
});

/** Is a module/feature enabled? Defaults to false (hidden) when unknown. */
export async function isFeatureEnabled(key: string): Promise<boolean> {
  const map = await getFlagMap();
  return map[key] ?? false;
}

/** All flags with current state, for the admin Launch Control screen. */
export async function getAllFlags(): Promise<Array<FlagDef & { enabled: boolean }>> {
  const map = await getFlagMap();
  return FLAG_DEFS.map((d) => ({ ...d, enabled: map[d.key] ?? false }));
}

/** Route guard: 404 a page/section whose module flag is off. Use in a layout. */
export async function requireFlag(key: string): Promise<void> {
  if (!(await isFeatureEnabled(key))) notFound();
}
