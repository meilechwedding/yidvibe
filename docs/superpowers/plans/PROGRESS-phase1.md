# Phase 1 Rebuild — Progress Log

Branch: `feat/phase1-rebuild` · Started 2026-06-03

Rules in force: work on the branch only · **no `git push`** (repo push-blocked) · **no prod DB migration** (apply on Supabase dev branch only) · **no Google OAuth changes**. Verify each phase with `npm run typecheck` / `npm run build` before committing.

| Phase | Status | Notes |
|---|---|---|
| 0 · Branch + docs | ✅ done | branch created, spec+plan+progress committed |
| 1 · Site config (nav/tags/tools) | ⏳ in progress | |
| 2 · Launch Control flags | pending | migration is a file; apply to dev branch only |
| 3 · Flag-gate nav + routes | pending | |
| 4 · Posting model | pending | owner_id nullable = highest-risk DB change |
| 5 · Showcase board | pending | |
| 6 · Project page | pending | |
| 7 · Threaded comments | pending | |
| 8 · Anonymous upvotes | pending | |
| 9 · Claim flow | pending | |
| 10 · Profile page | pending | |
| 11 · Landing | pending | |
| 12 · How it works + copy | pending | |
| 13 · Cleanup | pending | |
| 14 · Verification + handoff | pending | |

## Staged for "when you're back" (cannot finish unattended/safely)
1. **Apply migrations to PRODUCTION** Supabase (ref lqfqkivbxeexmrxuxefi) — esp. `owner_id` nullable + RLS. Exact SQL + RLS test steps will be in `HANDOFF-phase1.md`.
2. **Google OAuth** consent screen (external config).
3. **`git push`** — repo is push-blocked (403); branch stays local for review.

## Running notes
- (entries added per phase)
