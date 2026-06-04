# Phase 1 Rebuild — Progress Log

Branch: `feat/phase1-rebuild` · Started 2026-06-03

Rules in force: work on the branch only · **no `git push`** (repo push-blocked) · **no prod DB migration** (apply on Supabase dev branch only) · **no Google OAuth changes**. Verify each phase with `npm run typecheck` / `npm run build` before committing.

| Phase | Status | Notes |
|---|---|---|
| 0 · Branch + docs | ✅ done | branch created, spec+plan+progress committed |
| 1 · Site config (nav/tags/tools) | ✅ done | typecheck clean, committed |
| 2 · Launch Control flags | ✅ done | migration + helper + admin UI; typecheck clean, committed |
| 3 · Flag-gate nav + routes | ✅ done | 6 route-group guards + flag-aware nav; typecheck clean, committed |
| 4 · Posting model | ✅ done | createProject guest/community/ownership logic, submit page un-gated, form reworked (ownership toggle + guest note, commercial/anon removed); typecheck clean, committed |
| 5 · Showcase board | ✅ done | single-column "mix" row-cards, featured-first ordering, by/community label, new copy; typecheck clean, committed |
| 6 · Project page | ✅ done | refactored to new model: removed commercial/anonymous/private-reply; "Reach out" = profile contact links; Claim button for community submissions; details/comments kept. ⚠️ immersive cover-hero + mobile sticky action bar deferred as visual polish (current header is the existing clean two-column). typecheck clean, committed |
| 9 · Claim flow (action) | ⏳ partial | claims.ts (requestClaim + reviewClaim) + ClaimButton built in Phase 6; admin /admin/claims queue page still pending |
| 7 · Threaded comments | ✅ done | getComments builds 1-level tree; new CommentThread client w/ Reply affordance; removed anon-comment + goPublic; typecheck clean, committed |
| 8 · Anonymous upvotes | pending | migration written (file) |
| 9 · Claim flow | pending | claim_requests migration written (file) |
| 10 · Profile page | pending | |
| 11 · Landing | pending | |
| 12 · How it works + copy | pending | |
| 13 · Cleanup | pending | |
| 14 · Verification + handoff | pending | |

### Migration files written (NOT applied — staged for dev-branch test → prod review)
- `20260603100000_phase1_posting_model.sql` — owner_id nullable, submitted_by, is_community, comments.parent_id, anon/auth insert RLS
- `20260603110000_anonymous_upvotes.sql` — device_id + partial unique indexes + anon RLS
- `20260603120000_claim_requests.sql` — claim queue table + RLS
- `20260603130000_feature_flags.sql` — Launch Control flags + seed (all OFF)

## Staged for "when you're back" (cannot finish unattended/safely)
1. **Apply migrations to PRODUCTION** Supabase (ref lqfqkivbxeexmrxuxefi) — esp. `owner_id` nullable + RLS. Exact SQL + RLS test steps will be in `HANDOFF-phase1.md`.
2. **Google OAuth** consent screen (external config).
3. **`git push`** — repo is push-blocked (403); branch stays local for review.

## Running notes
- (entries added per phase)
