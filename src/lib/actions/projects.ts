"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeTag } from "@/lib/queries";
import { goPublic } from "@/lib/visibility";

type SupabaseServer = Awaited<ReturnType<typeof createClient>>;

/** Feed each project tag into the admin-managed `tags` table. Best-effort:
 *  never let a tag-upsert failure break the project save. `tags` isn't in the
 *  generated Supabase types yet, so cast to `any`. */
async function feedBrowseTags(
  supabase: SupabaseServer,
  tags: string[],
): Promise<void> {
  const client = supabase as unknown as {
    from: (t: string) => {
      upsert: (
        row: Record<string, unknown>,
        opts: { onConflict: string; ignoreDuplicates: boolean },
      ) => Promise<unknown>;
    };
  };
  await Promise.all(
    tags.map((t) =>
      client.from("tags").upsert(
        { label: t.trim(), slug: normalizeTag(t), source: "auto" },
        { onConflict: "slug", ignoreDuplicates: true },
      ),
    ),
  ).catch(() => {});
}

export type ProjectFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  description: z.string().trim().min(1, "Description is required").max(2000),
  url: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  image_url: z.string().trim().url().optional().or(z.literal("")),
  video_url: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
});

function multi(formData: FormData, key: string): string[] {
  return formData.getAll(key).map(String).map((s) => s.trim()).filter(Boolean);
}

function parse(formData: FormData) {
  return schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    url: String(formData.get("url") ?? ""),
    image_url: String(formData.get("image_url") ?? ""),
    video_url: String(formData.get("video_url") ?? ""),
  });
}

function fieldErrors(parsed: z.SafeParseError<unknown>): ProjectFormState {
  const fe: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fe[key]) fe[key] = issue.message;
  }
  return { error: "Please fix the highlighted fields.", fieldErrors: fe };
}

/**
 * Create a project. Phase 1 posting model:
 *  - Guest (no account)  → community submission (no builder, no contact).
 *  - Signed-in "I built this" (default) → attached to the poster.
 *  - Signed-in "I found it" → community submission, but tracked under their
 *    account (submitted_by) so it shows in their dashboard.
 * No login required. Goes live instantly (moderation = report + admin hide).
 * `submitted_by` / `is_community` aren't in the generated types yet → cast.
 */
export async function createProject(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const parsed = parse(formData);
  if (!parsed.success) return fieldErrors(parsed);
  const v = parsed.data;
  if (!v.image_url && !v.url) {
    return { error: "Add a cover image or a live link so people can see it." };
  }

  const foundIt = !user || String(formData.get("ownership") ?? "mine") === "found";
  const tags = multi(formData, "tags");

  const row = {
    owner_id: user && !foundIt ? user.id : null,
    submitted_by: user ? user.id : null,
    is_community: foundIt,
    name: v.name,
    description: v.description,
    url: v.url || null,
    image_url: v.image_url || null,
    video_url: v.video_url || null,
    images: multi(formData, "images").slice(0, 5),
    tools: multi(formData, "tools"),
    tags,
  };

  const { data, error } = await (supabase as unknown as {
    from: (t: string) => {
      insert: (r: Record<string, unknown>) => {
        select: (c: string) => {
          single: () => Promise<{ data: { id: string } | null; error: unknown }>;
        };
      };
    };
  })
    .from("projects")
    .insert(row)
    .select("id")
    .single();

  if (error || !data) {
    return { error: "Couldn't submit your project. Please try again." };
  }

  // Posting a project you built is a non-anonymous public action: flip the
  // poster's profile public (idempotent) so they're discoverable on /builders
  // and their name links from the project. "Found it" community submissions
  // don't represent the poster's own work, so they stay as-is.
  if (user && !foundIt) {
    await goPublic(supabase, user.id);
    revalidatePath("/builders");
  }

  await feedBrowseTags(supabase, tags);

  revalidatePath("/showcase");
  revalidatePath("/");
  redirect(`/showcase/${data.id}?posted=1`);
}

/** Edit a project you own. Community submissions (no owner) aren't editable
 *  here — the maker claims them first (admin-approved). */
export async function updateProject(
  projectId: string,
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in." };

  const parsed = parse(formData);
  if (!parsed.success) return fieldErrors(parsed);
  const v = parsed.data;
  if (!v.image_url && !v.url) {
    return { error: "Add a cover image or a live link so people can see it." };
  }

  const tags = multi(formData, "tags");
  const { error } = await supabase
    .from("projects")
    .update({
      name: v.name,
      description: v.description,
      url: v.url || null,
      image_url: v.image_url || null,
      video_url: v.video_url || null,
      images: multi(formData, "images").slice(0, 5),
      tools: multi(formData, "tools"),
      tags,
    })
    .eq("id", projectId)
    .eq("owner_id", user.id);

  if (error) return { error: "Couldn't save your changes. Please try again." };

  await feedBrowseTags(supabase, tags);

  revalidatePath(`/showcase/${projectId}`);
  revalidatePath("/showcase");
  redirect(`/showcase/${projectId}`);
}

/** Delete a project you own or submitted. */
export async function deleteProject(projectId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await (supabase as unknown as {
    from: (t: string) => {
      delete: () => {
        eq: (c: string, v: string) => { or: (f: string) => Promise<unknown> };
      };
    };
  })
    .from("projects")
    .delete()
    .eq("id", projectId)
    .or(`owner_id.eq.${user.id},submitted_by.eq.${user.id}`);

  revalidatePath("/showcase");
  redirect("/showcase");
}
