import { z } from "zod";
import { safeHttpsImageUrl } from "@/lib/security/image-urls";
import type { ProjectFormState } from "@/lib/contracts/project";

/** Shared parsing rules. Server actions remain the authoritative submit boundary. */
const httpsImageUrl = z
  .string()
  .trim()
  .refine((value) => safeHttpsImageUrl(value) !== null, "Use an HTTPS image URL");

export const projectSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  description: z.string().trim().min(1, "Description is required").max(2000),
  url: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  image_url: httpsImageUrl.optional().or(z.literal("")),
  video_url: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
});

export function readFormValues(formData: FormData, key: string): string[] {
  return formData.getAll(key).map(String).map((s) => s.trim()).filter(Boolean);
}

export function parseProjectForm(formData: FormData) {
  return projectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    url: String(formData.get("url") ?? ""),
    image_url: String(formData.get("image_url") ?? ""),
    video_url: String(formData.get("video_url") ?? ""),
  });
}

export function projectFieldErrors(parsed: z.SafeParseError<unknown>): ProjectFormState {
  const fe: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fe[key]) fe[key] = issue.message;
  }
  return { error: "Please fix the highlighted fields.", fieldErrors: fe };
}
