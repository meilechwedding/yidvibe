import { createClient } from "@/lib/supabase/server";
import { getProfileStats } from "@/lib/queries";

export type DashboardStats = {
  projects: number;
  upvotes: number;
  saved: number;
};

/** Counts for the dashboard overview (the signed-in user's own activity).
 *  Phase 1: projects, upvotes received, and saved/bookmarked items. */
export async function getDashboardStats(
  profileId: string,
): Promise<DashboardStats> {
  const supabase = await createClient();
  const [base, saved] = await Promise.all([
    getProfileStats(profileId),
    supabase
      .from("saves")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profileId),
  ]);

  return {
    projects: base.projects,
    upvotes: base.upvotes,
    saved: saved.count ?? 0,
  };
}
