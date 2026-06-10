/**
 * HTML-entity decoding for text scraped from other sites (project autofill) and
 * for safely rendering any text that may already hold encoded entities from
 * earlier saves. React escapes attribute values as *hex* entities (e.g. an
 * apostrophe becomes `&#x27;`), so a naive decimal-only decoder leaves them
 * showing as literal "weird letters". This handles hex, decimal, and the common
 * named entities in one left-to-right pass.
 */

/** Common named HTML entities seen in titles/descriptions. */
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
  nbsp: " ",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  trade: "™",
  copy: "©",
  reg: "®",
};

/**
 * Decode HTML entities in one pass. Handles decimal (`&#39;`), hex
 * (`&#x27;` — what React emits when escaping attributes), and common named
 * entities. A single pass avoids double-decoding (e.g. `&amp;#x27;` stays the
 * literal text `&#x27;` rather than collapsing to an apostrophe).
 */
export function decodeHtmlEntities(input: string): string {
  return input.replace(
    /&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi,
    (whole, body: string) => {
      if (body[0] === "#") {
        const code =
          body[1] === "x" || body[1] === "X"
            ? parseInt(body.slice(2), 16)
            : parseInt(body.slice(1), 10);
        if (!Number.isFinite(code) || code <= 0) return whole;
        try {
          return String.fromCodePoint(code);
        } catch {
          return whole;
        }
      }
      return NAMED_ENTITIES[body.toLowerCase()] ?? whole;
    },
  );
}
