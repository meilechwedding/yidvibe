"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CommentFormState = { error?: string; ok?: boolean };

/** Post a comment or a one-level reply (login required, public). `parent_id`
 *  isn't in the generated types yet, so the insert is cast. */
export async function addComment(
  projectId: string,
  _prev: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in to comment." };

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Write something first." };
  if (body.length > 2000) return { error: "That comment is too long." };

  const parentId = String(formData.get("parent_id") ?? "").trim() || null;

  const row: Record<string, unknown> = {
    project_id: projectId,
    author_id: user.id,
    body,
  };
  if (parentId) row.parent_id = parentId;

  const { error } = await (supabase as unknown as {
    from: (t: string) => {
      insert: (r: Record<string, unknown>) => Promise<{ error: unknown }>;
    };
  })
    .from("comments")
    .insert(row);
  if (error) return { error: "Couldn't post your comment. Please try again." };

  revalidatePath(`/showcase/${projectId}`);
  return { ok: true };
}

export async function deleteComment(commentId: string, projectId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("author_id", user.id);

  revalidatePath(`/showcase/${projectId}`);
}
