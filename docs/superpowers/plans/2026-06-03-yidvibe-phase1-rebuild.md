# YidVibe Phase 1 Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (inline, autonomous overnight run). Steps use `- [ ]` checkboxes. Work on branch `feat/phase1-rebuild`. **Never** `git push`, **never** apply structural migrations to the production Supabase DB, **never** touch Google OAuth config. Verify each phase with `npm run build` (or `npx tsc --noEmit`) before committing. Keep `docs/superpowers/plans/PROGRESS-phase1.md` updated each phase.

**Goal:** Transform the full YidVibe platform into the focused Phase 1 Showcase product: clean/friendly ProductHunt-style board, no-account posting, anonymous device-deduped upvotes, threaded comments, claim flow, opt-in profiles, and an admin "Launch Control" feature-flag system that hides the bigger site (Gigs/Competitions/Directory/Events/messaging) behind toggles.

**Architecture:** Next.js App Router + Supabase + Vercel. Nav is centralized in `src/lib/site.ts`. A new `feature_flags` table + `isFeatureEnabled()` helper gate nav items and routes. `projects.owner_id` becomes nullable (community submissions); `submitted_by` tracks the creator. Migrations are written as files and applied to a **Supabase dev branch** for verification — production apply is a reviewed, post-run step.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind, Supabase JS, lucide-react, sonner, zod.

**Reference:** Spec at `docs/superpowers/specs/2026-06-03-yidvibe-phase1-design.md`. Approved UI mockups at `.superpowers/brainstorm/6299-1780539900/content/*.html` (landing-c-refined, showcase-mix, project-page-v3, submit-form, profile-page). All real UI uses lucide-react icons + brand tokens (teal/clay), never emojis.

---

## File structure map

**Create:**
- `supabase/migrations/20260603100000_phase1_posting_model.sql` — owner_id nullable, submitted_by, comments.parent_id
- `supabase/migrations/20260603110000_anonymous_upvotes.sql` — device-deduped upvotes
- `supabase/migrations/20260603120000_claim_requests.sql` — claim queue
- `supabase/migrations/20260603130000_feature_flags.sql` — flags table + seed
- `src/lib/flags.ts` — `isFeatureEnabled()`, `getAllFlags()`, `FLAG_DEFS`
- `src/lib/actions/flags.ts` — admin toggle action
- `src/lib/actions/claims.ts` — request/approve/reject claim
- `src/lib/device-id.ts` — anonymous device token (cookie)
- `src/app/admin/launch/page.tsx` + `src/components/admin/launch-control.tsx` — flag toggles
- `src/app/admin/claims/page.tsx` + `src/components/admin/claim-actions.tsx` — claim queue
- `src/components/showcase/project-row-card.tsx` — the "mix" feed card
- `src/components/showcase/comment-thread.tsx` — threaded comments (1 level)

**Modify:** `src/lib/site.ts` (nav, tags, tools), `src/app/layout.tsx`, `src/components/site/{sidebar,mobile-bottom-nav,nav-links,site-footer}.tsx`, `src/lib/actions/projects.ts`, `src/lib/queries.ts`, `src/components/showcase/project-form.tsx`, `src/app/showcase/{page,submit/page}.tsx`, `src/app/showcase/[id]/page.tsx`, `src/app/u/[handle]/page.tsx`, `src/app/page.tsx`, `src/app/docs/page.tsx`, `src/components/brand/upvote-button.tsx`, `src/app/admin/{page,layout}.tsx`.

**Guard (flag-gate routes):** `src/app/{gigs,competitions,directory,events}/**`, `src/app/dashboard/inbox/**`, `src/app/builders/page.tsx` (remove browse).

---

## Phase 0 — Branch & groundwork

- [ ] **Step 1:** Create branch off main.
```bash
git checkout -b feat/phase1-rebuild
```
- [ ] **Step 2:** Create `docs/superpowers/plans/PROGRESS-phase1.md` with a checklist mirroring these phases (status: pending). Commit.
```bash
git add docs/superpowers/plans/ && git commit -m "docs(phase1): add rebuild plan + progress log"
```

---

## Phase 1 — Site config + nav rework (pure code, no DB)

**Files:** Modify `src/lib/site.ts`.

- [ ] **Step 1:** Replace `KNOWN_TOOLS` with the final tool set (exact order): `Lovable, base44, Bolt, v0, Replit, Cursor, Claude Code, Codex, Windsurf, Other`.
- [ ] **Step 2:** Replace `KNOWN_TAGS` with the final categories: `Torah, Community, Business, Productivity, Education, Finance, Health, Design, Developer Tools, Automation, AI`. Export as `KNOWN_CATEGORIES` alias too (keep `KNOWN_TAGS` name to avoid breaking imports; value = categories).
- [ ] **Step 3:** Add `NAV_LINKS_BASE` = only `[{href:"/showcase",label:"Showcase"},{href:"/docs",label:"How it works"}]`. Keep the full list as `NAV_LINKS_ALL` (used to derive flag-gated extras). `NAV_LINKS` is computed at render from flags (Phase 2) — for now set `NAV_LINKS = NAV_LINKS_BASE`.
- [ ] **Step 4:** `FOOTER_LINKS` = `[{/showcase, Showcase},{/showcase/submit, Submit a project},{/docs, How it works}]`. `SITE_TAGLINE = "the home for frum builders"`.
- [ ] **Step 5:** `npx tsc --noEmit` — fix any import breakages (e.g. components referencing removed nav entries). Expected: passes.
- [ ] **Step 6:** Commit `feat(phase1): focus nav + final tag/tool label sets`.

---

## Phase 2 — Feature-flag "Launch Control" system

**Files:** Create migration `..._feature_flags.sql`, `src/lib/flags.ts`, `src/lib/actions/flags.ts`, `src/app/admin/launch/page.tsx`, `src/components/admin/launch-control.tsx`.

- [ ] **Step 1:** Migration `20260603130000_feature_flags.sql`:
```sql
create table if not exists public.feature_flags (
  key text primary key,
  enabled boolean not null default false,
  label text not null,
  description text,
  category text not null default 'module',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
alter table public.feature_flags enable row level security;
-- anyone may read flags (nav/routes need them server-side, anon included)
create policy "flags readable" on public.feature_flags for select using (true);
-- only admins may write (uses existing is_admin() SECURITY DEFINER helper)
create policy "flags admin write" on public.feature_flags for all
  using (public.is_admin()) with check (public.is_admin());
insert into public.feature_flags (key,label,description,category,enabled) values
  ('module.gigs','Gigs','Job board for builders','module',false),
  ('module.competitions','Competitions','Build competitions','module',false),
  ('module.directory','Business Directory','Get-listed business directory','module',false),
  ('module.events','Events','Community events calendar','module',false),
  ('module.messaging','Private messaging','Inbox + DMs between users','module',false),
  ('feature.homepage_stats','Homepage stats','Projects/builders counter on the landing','feature',false)
on conflict (key) do nothing;
```
- [ ] **Step 2:** `src/lib/flags.ts` — `FLAG_DEFS` (mirror seed for fallback), `isFeatureEnabled(key)` reads `feature_flags`; if the query errors (table missing) OR no row, return `false` (safe default = hidden). `getAllFlags()` for admin UI. Cache per-request with React `cache()`.
- [ ] **Step 3:** `src/lib/actions/flags.ts` — `setFlag(key, enabled)` server action: assert admin (reuse existing admin check), upsert, `revalidatePath("/", "layout")`.
- [ ] **Step 4:** `src/components/admin/launch-control.tsx` — grouped toggle list (Modules / Features) using existing `feature-toggle`/switch pattern; calls `setFlag`. `src/app/admin/launch/page.tsx` renders it (admin-guarded like other admin pages). Add "Launch Control" to `src/components/admin/admin-sidebar.tsx`.
- [ ] **Step 5:** Apply this migration to a **Supabase dev branch** via MCP `create_branch` + `apply_migration`; verify `getAllFlags()` returns rows. (Do NOT apply to prod.)
- [ ] **Step 6:** `npm run build`. Commit `feat(admin): Launch Control feature-flag system`.

---

## Phase 3 — Make nav + routes flag-aware

**Files:** Modify `src/components/site/{sidebar,mobile-bottom-nav}.tsx`, add server wrapper that passes enabled nav links; add route guards.

- [ ] **Step 1:** In the server component that renders `SiteNav` (find via `site-nav.tsx`/`nav-shell.tsx`), compute `navLinks = NAV_LINKS_BASE + enabled module links` using `isFeatureEnabled`. Pass to Sidebar/MobileBottomNav as props (replace their direct `NAV_LINKS` import).
- [ ] **Step 2:** Mobile bottom nav: replace tabs with `Home · Showcase · ＋Post · Saved · You` (drop Inbox unless `module.messaging`). Use lucide icons.
- [ ] **Step 3:** Add a shared guard `await requireFlag("module.gigs")` (calls `notFound()` if disabled) at the top of each gated route group: `/gigs`, `/competitions`, `/directory`, `/events`, `/dashboard/inbox`. 
- [ ] **Step 4:** `/builders/page.tsx` → remove from nav already; make it `notFound()` (browse cut) but keep `/u/[handle]`.
- [ ] **Step 5:** `npm run build`. Commit `feat(phase1): flag-gate bigger-site nav + routes`.

---

## Phase 4 — Posting model (data + actions + form)

**Files:** migration `..._phase1_posting_model.sql`, `src/lib/actions/projects.ts`, `src/components/showcase/project-form.tsx`, `src/app/showcase/submit/page.tsx`, `src/lib/queries.ts`.

- [ ] **Step 1:** Migration: `alter table projects alter column owner_id drop not null; add column if not exists submitted_by uuid references auth.users(id); add column if not exists is_community boolean not null default false;` Update RLS so inserts are allowed for anon (community) + auth; selects already filter `hidden=false`. **Carefully review existing projects RLS** (no self-reference) before editing; test as anon + authenticated on the dev branch.
- [ ] **Step 2:** `createProject`: drop login requirement. If no user → `is_community=true`, `owner_id=null`, `submitted_by=null`. If user + "I built this" → `owner_id=user, submitted_by=user`. If user + "I found it" → `owner_id=null, submitted_by=user, is_community=true`. Remove `commercialFrom`, `contactErrorIfCommercial`, `is_anonymous`, `goPublic` calls. Keep autofill + tag feed.
- [ ] **Step 2:** `project-form.tsx`: remove "Looking for…" (step 4) and "Visibility/anonymous" (step 5). Add logged-in-only ownership toggle ("I built this" default / "I found it on the web"). Rebuild to the `submit-form.html` mockup (sectioned cards, Autofill hero). Submit label "Post project". Guest: omit ownership section, show amber community-submission note.
- [ ] **Step 3:** `submit/page.tsx`: remove `redirect("/login")`; render for guests + users.
- [ ] **Step 4:** Apply migration to dev branch; manually post as anon + as user (both modes); verify rows. `npm run build`. Commit `feat(showcase): no-account posting + community submissions`.

---

## Phase 5 — Showcase board rebuild
**Files:** `src/app/showcase/page.tsx`, create `src/components/showcase/project-row-card.tsx`, `src/lib/queries.ts`.
- [ ] Build the friendly horizontal "mix" feed (one card/row) per `showcase-mix.html`: header + Post button, search, Latest/Top, tool dropdown, category chip row, featured-first ordering with amber badge, upvote + comment counts, "by X" vs "Community submission". `listProjects` already supports sort/q/tag/tool; add `is_community`/owner handling. `npm run build`. Commit.

## Phase 6 — Project detail rebuild
**Files:** `src/app/showcase/[id]/page.tsx`, `upvote-button.tsx`, reach-out + claim/report.
- [ ] Build immersive hero + desktop two-column + mobile sticky action bar per `project-page-v3.html`. "Reach out" reads owner profile `links` (via `contactHref`); community submissions show "Did you make this? Claim it". Wire Report (existing `report-menu`). `npm run build`. Commit.

## Phase 7 — Threaded comments
**Files:** migration adds `comments.parent_id uuid references comments(id)`, `src/lib/queries.ts` `getComments` (assemble 1-level tree), create `comment-thread.tsx`, update `add-comment-form.tsx` (reply target). Login required to post. Build. Commit.

## Phase 8 — Anonymous device-deduped upvotes
**Files:** migration `..._anonymous_upvotes.sql` (`upvotes.device_id text`, unique partial index `(project_id, device_id) where user_id is null`; allow anon insert via RLS), `src/lib/device-id.ts` (httpOnly cookie uuid), `upvote-button.tsx` + action. Build. Commit.

## Phase 9 — Claim flow
**Files:** migration `..._claim_requests.sql`, `src/lib/actions/claims.ts`, `src/app/admin/claims/page.tsx`, `claim-actions.tsx`. Project page "Claim" (login required) → insert request; admin approve sets `projects.owner_id = claimant`. Build. Commit.

## Phase 10 — Profile page rebuild
**Files:** `src/app/u/[handle]/page.tsx`. Per `profile-page.html`: soft banner, avatar, name/@handle, contact buttons (from `links`), bio, "Builds with" tools, their projects. Respect opt-in (`is_public`); 404 if not public. Build. Commit.

## Phase 11 — Landing rebuild
**Files:** `src/app/page.tsx`. Per `landing-c-refined.html`: hero (H1 "Discover what frum builders are making with AI" + sub + Explore/Post) + search + tool strip → Featured spotlight → "Just shipped" grid (Latest/Top + category chips) → "Post — no account needed" band → "Who it's for" 3-up → "Ready to vibe?". Remove Top Creators. Stats only if `feature.homepage_stats`. Build. Commit.

## Phase 12 — How it works + global copy/meta
**Files:** `src/app/docs/page.tsx` (short explainer: post w/ or w/o account, upvote/comment/claim, get a profile), `src/lib/site.ts` meta description "Where frum builders show what they're making with AI." Build. Commit.

## Phase 13 — Cleanup pass
- [ ] Remove dead imports, the commercial/anonymous UI remnants, `getLandingStats` gating, Top Creators. Ensure cut-module code still compiles behind flags. `npm run build` + `npx tsc --noEmit` clean. Commit.

## Phase 14 — Final verification & handoff
- [ ] Full `npm run build`. Update `PROGRESS-phase1.md` with done/blocked. Write `docs/superpowers/plans/HANDOFF-phase1.md`: the 3 staged items (prod migration apply with the exact SQL + RLS test steps, Google OAuth, push), and how to apply migrations from the dev branch to prod safely. Commit. **Do not push.**

---

## Self-review notes
- **Spec coverage:** every §3/§4 item maps to a phase (flags→P2/3, posting→P4, showcase→P5, project→P6, comments→P7, upvotes→P8, claim→P9, profile→P10, landing→P11, copy/how-it-works→P12, cut/hide→P3/13). ✓
- **Risk:** P4 (owner_id nullable + RLS) is the highest-risk DB change — applied/tested on a dev branch only, never prod unattended (per RLS-outage history). ✓
- **UI tasks** intentionally reference the approved mockup HTML rather than transcribing every style line — the mockups are the visual source of truth and the executor (me) has full context. Logic-heavy tasks are fully specified.
