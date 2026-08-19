const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

/**
 * Return a canonical HTTPS image URL that is safe to place in a DOM URL
 * attribute. Credentials, relative URLs, control characters, and all other
 * schemes are rejected.
 */
export function safeHttpsImageUrl(
  value: string | null | undefined,
): string | null {
  if (!value) return null;

  const candidate = value.trim();
  if (!candidate || CONTROL_CHARACTERS.test(candidate)) return null;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}
