import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, test } from "vitest";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(join(root, path), "utf8");
function filesUnder(path: string): string[] {
  if (!existsSync(path)) return [];
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const child = join(path, entry.name);
    return entry.isDirectory() ? filesUnder(child) : [child];
  });
}

describe("redirect boundaries", () => {
  test("provides a shared same-origin redirect validator", async () => {
    const helper = join(root, "src/lib/security/redirects.ts");
    expect(existsSync(helper)).toBe(true);
    const modulePath = "../src/lib/security/redirects";
    const { safeRedirectPath } = await import(/* @vite-ignore */ modulePath);

    expect(safeRedirectPath("/dashboard?tab=work#new")).toBe(
      "/dashboard?tab=work#new",
    );
    expect(safeRedirectPath("https://evil.example/phish")).toBe("/");
    expect(safeRedirectPath("//evil.example/phish")).toBe("/");
    expect(safeRedirectPath("/\\evil.example/phish")).toBe("/");
    expect(safeRedirectPath("javascript:alert(1)")).toBe("/");
    expect(safeRedirectPath("login")).toBe("/");
    expect(safeRedirectPath("/\r\nLocation: https://evil.example")).toBe("/");
  });

  test("all auth continuations use the shared validator", () => {
    const action = read("src/lib/actions/auth.ts");
    const callback = read("src/app/auth/callback/route.ts");
    expect(action.match(/safeRedirectPath\(/g)?.length).toBeGreaterThanOrEqual(3);
    expect(callback).toContain("safeRedirectPath(");
  });
});

describe("server-side request boundaries", () => {
  test("the public project form cannot make the server fetch arbitrary URLs", () => {
    expect(existsSync(join(root, "src/lib/actions/url-metadata.ts"))).toBe(false);
    expect(read("src/components/showcase/project-form.tsx")).not.toContain(
      "fetchUrlMetadata",
    );
  });
});

describe("database authorization boundaries", () => {
  const migrationDir = join(root, "supabase/migrations");
  const migrations = () =>
    readdirSync(migrationDir)
      .filter((file) => file.endsWith(".sql"))
      .sort()
      .map((file) => readFileSync(join(migrationDir, file), "utf8"))
      .join("\n");

  test("private conversations are created and marked read through guarded RPCs", () => {
    const sql = migrations();
    expect(sql).toContain("function public.get_or_create_conversation");
    expect(sql).toContain("function public.mark_conversation_read");
    expect(sql).toContain("target.dm_privacy = 'none'");
    expect(sql).toContain("target.dm_privacy = 'followers'");
    expect(sql).toContain('drop policy if exists "conversations update participant"');
    expect(sql).toContain('drop policy if exists "cmessages update participant"');
    expect(sql).toContain("revoke update on public.conversations from authenticated");
    expect(sql).toContain(
      "revoke update on public.conversation_messages from authenticated",
    );
    expect(sql.match(/security definer\s+set search_path = ''/gi)).toHaveLength(2);
    expect(sql).toContain(
      "revoke all on function public.get_or_create_conversation(uuid, text, uuid)",
    );
    expect(sql).toContain(
      "revoke all on function public.mark_conversation_read(uuid)",
    );
  });

  test("anonymous project and vote writes are revoked", () => {
    const sql = migrations();
    expect(sql).toContain("revoke insert, delete on public.upvotes from anon");
    expect(sql).toContain('drop policy if exists "upvotes anon insert"');
    expect(sql).toContain('drop policy if exists "upvotes anon delete"');
    expect(sql).toContain("revoke insert on public.projects from anon");
    expect(read("src/lib/actions/upvotes.ts")).toContain(
      'return { ok: false, error: "auth" }',
    );
    expect(read("src/app/showcase/submit/page.tsx")).toContain(
      'redirect("/login?next=/showcase/submit")',
    );
  });

  test("public image buckets restrict type and size", () => {
    const sql = migrations();
    expect(sql).toContain("file_size_limit = 5242880");
    expect(sql).toContain(
      "allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']",
    );
  });

  test("admin status is never assigned from a user-claimable handle", () => {
    expect(migrations()).not.toMatch(
      /update public\.profiles set is_admin = true where handle\s*=/i,
    );
  });

  test("a competition can only select one of its own submissions", () => {
    const action = read("src/lib/actions/competitions.ts");
    expect(action).toContain('.from("competition_submissions")');
    expect(action).toContain('.eq("competition_id", competitionId)');
    expect(action).toContain("if (!submission) return");
  });
});

describe("repository hygiene", () => {
  test("raw AI planning artifacts and personal email are absent from the public tree", () => {
    expect(filesUnder(join(root, "docs/superpowers"))).toHaveLength(0);
    const oauth = read("docs/GOOGLE_OAUTH_SETUP.md");
    expect(oauth).not.toMatch(/@gmail\.com/i);
  });
});
