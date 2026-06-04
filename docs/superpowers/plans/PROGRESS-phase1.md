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
| 9 · Claim flow | ✅ done | claims.ts (requestClaim + reviewClaim) + ClaimButton (Phase 6); admin /admin/claims queue + ClaimActions + sidebar entry + adminListClaims query; typecheck clean, committed |
| 7 · Threaded comments | ✅ done | getComments builds 1-level tree; new CommentThread client w/ Reply affordance; removed anon-comment + goPublic; typecheck clean, committed |
| 8 · Anonymous upvotes | ✅ done | device-id cookie helper; toggleUpvote anon branch; getMyUpvotedProjectIds device-aware; upvote button sign-in gate removed; typecheck clean, committed |
| 9 · Claim flow | pending | claim_requests migration written (file) |
| 10 · Profile page | ✅ done | opt-in (404 if private); banner+avatar+@handle+bio+contact buttons+"Builds with" tools+their projects as row cards; removed follows/messaging/directory/hiring pills; typecheck clean, committed |
| 11 · Landing | ✅ done | C-refined: new hero copy + search + tool strip; Featured spotlight (row card); Just shipped; Post-your-project band; Who-it's-for 3-up; Ready-to-vibe; removed Top Creators; stats only behind feature.homepage_stats; typecheck clean, committed |
| 12 · How it works + copy | ✅ done | docs page rewritten as short Phase 1 explainer (post/upvote/comment/claim/profile/contact/report); layout meta uses SITE_DESCRIPTION; typecheck clean, committed |
| 13 · Cleanup | ✅ done | project-card.tsx stripped of commercial badges + anonymous handling + available pill (now by/community); landing stats already gated; typecheck clean, committed |
| 14 · Verification + handoff | ✅ done | `npm run build` PASSES (full app compiles, all routes); HANDOFF-phase1.md written; loop complete |

**ALL PHASES COMPLETE.** `npm run typecheck` ✅ and `npm run build` ✅. Branch `feat/phase1-rebuild`, ~14 commits, not pushed. Next steps for the human: see HANDOFF-phase1.md (apply migrations on a dev branch → prod, Google OAuth, push, flip Launch Control flags).

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
