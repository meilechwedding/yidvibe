"use server";

import { createClient } from "@/lib/supabase/server";
import { ensureDeviceId } from "@/lib/device-id";

export type UpvoteResult =
  | { ok: true; upvoted: boolean }
  | { ok: false; error: "auth" | "failed" };

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyClient = { from: (t: string) => any };

/**
 * Toggle an upvote on a project.
 *  - Signed-in: one vote per user (DB UNIQUE on project_id+user_id).
 *  - Signed-out: one vote per device token (cookie), DB UNIQUE on
 *    project_id+device_id where user_id is null.
 * `device_id` isn't in the generated types yet, so the anon path casts.
 */
export async function toggleUpvote(projectId: string): Promise<UpvoteResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: existing } = await supabase
      .from("upvotes")
      .select("id")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("upvotes")
        .delete()
        .eq("project_id", projectId)
        .eq("user_id", user.id);
      if (error) return { ok: false, error: "failed" };
      return { ok: true, upvoted: false };
    }

    const { error } = await supabase
      .from("upvotes")
      .insert({ project_id: projectId, user_id: user.id });
    if (error && error.code !== "23505") return { ok: false, error: "failed" };
    return { ok: true, upvoted: true };
  }

  // Anonymous: dedupe by device token.
  const deviceId = await ensureDeviceId();
  const client = supabase as unknown as AnyClient;

  const { data: existing } = await client
    .from("upvotes")
    .select("id")
    .eq("project_id", projectId)
    .is("user_id", null)
    .eq("device_id", deviceId)
    .maybeSingle();

  if (existing) {
    const { error } = await client
      .from("upvotes")
      .delete()
      .eq("project_id", projectId)
      .is("user_id", null)
      .eq("device_id", deviceId);
    if (error) return { ok: false, error: "failed" };
    return { ok: true, upvoted: false };
  }

  const { error } = await client
    .from("upvotes")
    .insert({ project_id: projectId, user_id: null, device_id: deviceId });
  if (error && error.code !== "23505") return { ok: false, error: "failed" };
  return { ok: true, upvoted: true };
}
