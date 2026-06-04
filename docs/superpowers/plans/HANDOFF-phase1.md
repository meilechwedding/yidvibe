# YidVibe Phase 1 — Handoff

**Branch:** `feat/phase1-rebuild` (local only — repo push is 403-blocked).
**Status:** All 14 plan phases complete. `npm run typecheck` and `npm run build` both pass. UI is **compile-verified, not runtime-verified** — nothing has been run against a database with the new schema yet (by design).

Do these together when you're back, roughly in order.

---

## 1. Apply the database migrations (the big one)

Four new migration files in `supabase/migrations/` (none applied yet):

| Order | File | What it does |
|---|---|---|
| 1 | `20260603100000_phase1_posting_model.sql` | `projects.owner_id` → **nullable**, `+submitted_by`, `+is_community`, `comments.parent_id`, anon/auth insert RLS |
| 2 | `20260603110000_anonymous_upvotes.sql` | `upvotes.device_id` + partial unique indexes + anon RLS |
| 3 | `20260603120000_claim_requests.sql` | claim queue table + RLS |
| 4 | `20260603130000_feature_flags.sql` | Launch Control flags + seed (all OFF) |

**Safe path (recommended):**
1. Create a Supabase **dev branch** (MCP `create_branch` or the dashboard).
2. Apply the four files **in order** on the branch.
3. **Test RLS** on the branch as both roles (this is where our past outage came from — a `projects` policy must never re-query `projects`):
   - anon: insert a project with `is_community=true, owner_id=null, submitted_by=null` → should succeed; insert with a non-null `owner_id` → should fail.
   - authenticated: insert with `owner_id = auth.uid(), submitted_by = auth.uid()` → succeeds; "found" post `owner_id=null, is_community=true` → succeeds.
   - anon upvote insert with `user_id=null, device_id='x'` → succeeds; second identical → blocked by the unique index.
   - read a `projects` row as anon → still works (no recursion / no "infinite recursion detected in policy").
4. **Watch-outs flagged in the files:**
   - `20260603110000`: if `upvotes` has a PRIMARY KEY on `(user_id, project_id)`, `alter column user_id drop not null` will fail — drop/recreate that PK as a unique index first.
   - `20260603100000`: the base `projects`/`comments` policies predate the repo's migrations, so these files **add** permissive policies rather than editing unknown ones. Eyeball the live policy set for conflicts.
   - Confirm the `upvote_count` trigger still increments on **anonymous** inserts (user_id null).
5. Once green on the branch, merge/apply to **production** (ref `lqfqkivbxeexmrxuxefi`).
6. Regenerate Supabase types (`supabase gen types` / MCP `generate_typescript_types`) and drop the `as any`/`as unknown as` casts where the columns now exist (search the diff for "not in the generated types yet").

## 2. Google OAuth
The consent screen was a prior blocker. Email/password works regardless. Confirm Google sign-in end-to-end before leaning on it; if it's still not configured, the login page's Google button will fail — leave it or hide it until the consent screen is approved.

## 3. Push / deploy
Repo push is 403-blocked, so the branch is local. Decide how to get it up (fix push access, or open the PR from a fork). Do **not** force anything. Vercel deploy is downstream of that.

## 4. Flip on what you want — Admin → Launch Control
Everything beyond the Showcase ships **OFF**. Go to **`/admin/launch`** and toggle modules on when you're ready: Gigs, Competitions, Business Directory, Events, Private messaging, People directory, and the homepage stats counter. A flag controls both the nav item and the route (off = hidden + 404). Admin writes require the `ADMIN_PASSCODE` step-up (still pending in Vercel per earlier notes).

## 5. Deferred visual polish (not blockers)
- **Project page**: the approved mockup had an **immersive full-bleed cover hero** + a **mobile sticky action bar** (upvote + Visit). I shipped the clean two-column with the new model wired up; the immersive hero/sticky bar are a visual pass to add. (Logged in PROGRESS.)
- Pre-existing **anonymous** projects (`is_anonymous=true`) will now render attributed to their owner, since anonymity is removed. Decide if any should be converted to community submissions (set `owner_id=null, is_community=true`) before launch (spec open-question #3).

## What was built (all committed on the branch)
Launch Control flags + nav/route gating · no-account posting (guest community submissions + "I built this/found it") · Showcase "mix" feed (featured-first) · Project page (Reach-out via profile contacts + Claim) · one-level threaded comments · anonymous device-deduped upvotes · admin claims queue · opt-in Profile · C-refined Landing · short How-it-works · cleanup. Migrations written for all of it.
