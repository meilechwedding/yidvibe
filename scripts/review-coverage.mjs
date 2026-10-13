import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, relative } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const path = resolve(dir, entry.name);
  return entry.isDirectory() ? walk(path) : [path];
});
const reports = ["routes", "forms", "interactions", "theme", "coordinator"]
  .map((name) => readFileSync(resolve(root, `docs/qa/${name}-review.md`), "utf8"));
const inspected = new Set();
for (const report of reports) for (const line of report.split(/\r?\n/)) {
  const path = /^- `([^`]+\.(?:ts|tsx|css))`/.exec(line)?.[1] ?? /^- ((?:auth|directory|profile|gigs|competitions|events|showcase)\/[^ ]+\.(?:ts|tsx))$/.exec(line)?.[1];
  if (path) inspected.add(path.startsWith("src/") ? path : `src/components/${path}`);
}
function exclusion(path) {
  if (path.includes("/admin/")) return "Privileged admin resources excluded by instruction.";
  if (path.startsWith("src/app/auth/callback/") || path === "src/middleware.ts") return "Authentication transport excluded from frontend review.";
  if (path === "src/app/events/post/page.tsx") return "Admin-only event posting entry, excluded from behavior edits.";
  if (path.startsWith("src/lib/supabase/") || path.startsWith("src/lib/actions/") || path === "src/lib/image/upload.ts") return "Database/storage/auth adapters excluded by instruction.";
  if (path.startsWith("src/lib/") && !/^src\/lib\/(domain\/|design\/|media\/|security\/|image\/compress\.ts$|display\.ts$|html\.ts$|utils\.ts$|og\.tsx$|site\.ts$)/.test(path)) return "Database-facing query/data adapter excluded by instruction.";
  return null;
}
const authored = /^src\/(config\/|content\/|styles\/|lib\/(domain|design|media)\/)/;
// Inventory records paths only for excluded code; it never reads that content.
const files = walk(resolve(root, "src")).map((path) => relative(root, path).replaceAll("\\", "/"))
  .filter((path) => /\.(?:ts|tsx|css|json)$/.test(path)).sort().map((path) => {
    const reason = exclusion(path);
    return { path, status: reason ? "excluded" : inspected.has(path) || authored.test(path) ? "reviewed" : "uncovered", ...(reason ? { reason } : {}) };
  });
const summary = Object.fromEntries(["reviewed", "excluded", "uncovered"].map((status) => [status, files.filter((file) => file.status === status).length]));
writeFileSync(resolve(root, "docs/qa/review-coverage.json"), JSON.stringify({ scope: "Source review only; no rendered-browser or backend coverage claim.", summary, files }, null, 2) + "\n");
process.stdout.write(JSON.stringify(summary) + "\n");
for (const file of files.filter((file) => file.status === "uncovered")) process.stdout.write(`UNCOVERED ${file.path}\n`);
if (summary.uncovered) process.exitCode = 1;
