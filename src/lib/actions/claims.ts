"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdminUnlocked } from "@/lib/admin";

type AnyClient = {
  from: (t: string) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

/** A signed-in user claims a community submission as their own. Admin-reviewed;
 *  idempotent per (project, claimant). `claim_requests` isn't in the generated
 *  types yet, so the client is cast. */
export async function requestClaim(projectId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/showcase/${projectId}`);

  await (supabase as unknown as AnyClient)
    .from("claim_requests")
    .upsert(
      { project_id: projectId, claimant_id: user.id, status: "pending" },
      { onConflict: "project_id,claimant_id" },
    );

  revalidatePath(`/showcase/${projectId}`);
}

/** Admin: approve (attach the project to the claimant) or reject a claim. */
export async function reviewClaim(
  claimId: string,
  decision: "approved" | "rejected",
) {
  const ctx = await requireAdminUnlocked();
  const supabase = await createClient();

  const { data: claim } = await (supabase as unknown as AnyClient)
    .from("claim_requests")
    .select("*")
    .eq("id", claimId)
    .maybeSingle();
  if (!claim) return;

  if (decision === "approved") {
    await supabase
      .from("projects")
      .update({ owner_id: claim.claimant_id, is_community: false } as never)
      .eq("id", claim.project_id);
  }

  await (supabase as unknown as AnyClient)
    .from("claim_requests")
    .update({
      status: decision,
      reviewed_by: ctx.userId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", claimId);

  revalidatePath("/admin/claims");
  revalidatePath("/admin");
  revalidatePath(`/showcase/${claim.project_id}`);
}
