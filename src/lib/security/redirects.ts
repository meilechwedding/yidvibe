/**
 * Accept only an application-local path for post-authentication redirects.
 * Network-path references, backslashes, control characters, and absolute URLs
 * all fall back to the home page.
 */
export function safeRedirectPath(value: unknown): string {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  if (value.includes("\\") || /[\u0000-\u001f\u007f]/.test(value)) return "/";

  try {
    const base = new URL("https://yidvibe.invalid");
    const target = new URL(value, base);
    return target.origin === base.origin ? value : "/";
  } catch {
    return "/";
  }
}
