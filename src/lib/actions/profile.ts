"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { safeHttpsImageUrl } from "@/lib/security/image-urls";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

const httpsImageUrl = z
  .string()
  .trim()
  .refine((value) => safeHttpsImageUrl(value) !== null, "Use an HTTPS image URL");

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  handle: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$/,
      "2–32 chars: lowercase letters, numbers, dashes",
    ),
  bio: z.string().trim().max(600).optional(),
  location: z.string().trim().max(80).optional(),
  avatar_url: httpsImageUrl.optional().or(z.literal("")),
  cover_url: httpsImageUrl.optional().or(z.literal("")),
});

function normUrl(value: FormDataEntryValue | null): string | undefined {
  const s = String(value ?? "").trim();
  if (!s) return undefined;
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

export async function updateProfile(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to sign in first." };

  const parsed = schema.safeParse({
    name: formData.get("name"),
    handle: String(formData.get("handle") ?? "").toLowerCase(),
    bio: String(formData.get("bio") ?? "") || undefined,
    location: String(formData.get("location") ?? "") || undefined,
    avatar_url: String(formData.get("avatar_url") ?? ""),
    cover_url: String(formData.get("cover_url") ?? ""),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key])
        fieldErrors[key] = issue.message;
    }
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  const v = parsed.data;
  const tools = formData.getAll("tools").map(String).filter(Boolean);
  const skills = formData.getAll("skills").map(String).filter(Boolean);

  const links: Record<string, string> = {};
  const website = normUrl(formData.get("link_website"));
  const github = normUrl(formData.get("link_github"));
  const x = normUrl(formData.get("link_x"));
  const linkedin = normUrl(formData.get("link_linkedin"));
  if (website) links.website = website;
  if (github) links.github = github;
  if (x) links.x = x;
  if (linkedin) links.linkedin = linkedin;

  // Direct contact channels — stored raw (rendered as mailto:/tel:/wa.me/instagram).
  const raw = (key: string) => String(formData.get(key) ?? "").trim();
  const email = raw("link_email");
  const phone = raw("link_phone");
  const whatsapp = raw("link_whatsapp");
  const instagram = raw("link_instagram");
  if (email) links.email = email;
  if (phone) links.phone = phone;
  if (whatsapp) links.whatsapp = whatsapp;
  if (instagram) links.instagram = instagram;

  const isPublic = formData.get("is_public") != null;

  const { error } = await supabase
    .from("profiles")
    .update({
      name: v.name,
      handle: v.handle,
      bio: v.bio ?? null,
      location: v.location ?? null,
      avatar_url: v.avatar_url ? v.avatar_url : null,
      cover_url: v.cover_url ? v.cover_url : null,
      show_real_name: formData.get("show_real_name") != null,
      available_for_hire: formData.get("available_for_hire") != null,
      is_public: isPublic,
      tools,
      skills,
      links,
    })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505")
      return {
        error: "That handle is already taken — try another.",
        fieldErrors: { handle: "Already taken" },
      };
    return { error: "Couldn't save your profile. Please try again." };
  }

  revalidatePath(`/u/${v.handle}`);
  revalidatePath("/dashboard");
  redirect(isPublic ? `/u/${v.handle}` : "/dashboard");
}
