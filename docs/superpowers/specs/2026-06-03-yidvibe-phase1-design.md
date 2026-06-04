# YidVibe — Phase 1 Design & Migration Plan

**Status:** Draft for review · **Date:** 2026-06-03
**Owner:** Meilech / YidVibe
**Source brief:** `yidvibe-phase1-brief.md` (refined heavily during brainstorming — see "Departures from the brief")

---

## 1. Vision

YidVibe Phase 1 is a **curated, ProductHunt-style board of AI projects and tools built by frum builders** — but with a clean, friendly, warm look (our own teal/clay brand), **not** ProductHunt's dense aesthetic. We take the *idea* of ProductHunt, not its visual style.

The launch is **focused**: the Showcase board and the few pages that support it. Everything from the larger platform we've already built (Gigs, Competitions, Directory, Events, private messaging) is **hidden behind admin-controlled feature flags**, ready to be switched on piece by piece as demand appears. Almost nothing is deleted.

Audience: frum builders (first-time vibe coders → seasoned pros). Output is broad: Torah apps, community tools, business software, personal productivity — not Torah-first.

---

## 2. Current-state audit

Stack confirmed: **Next.js (App Router) + Supabase (Postgres + Auth + Storage) + Vercel**. Auth is Supabase (not Clerk — the brief's guess was wrong). Brand system already exists (`src/components/brand/*`, teal/clay tokens, lucide icons).

### 2.1 Routes that exist today (`src/app`)
- **Landing:** `/` (`page.tsx`)
- **Showcase:** `/showcase`, `/showcase/[id]`, `/showcase/[id]/edit`, `/showcase/submit`
- **Builders:** `/builders`, profiles at `/u/[handle]`
- **Directory (business):** `/directory`, `/directory/list`, `/directory/list-me`
- **Gigs:** `/gigs`, `/gigs/[slug]`, `/gigs/[slug]/thread/[threadId]`, `/gigs/post`
- **Competitions:** `/competitions`, `/competitions/[slug]`, `/competitions/post`
- **Events:** `/events`, `/events/post`, `/events/request`
- **Docs:** `/docs` ("How it works")
- **Dashboard:** `/dashboard`, `/dashboard/posts`, `/dashboard/profile`, `/dashboard/saved`, `/dashboard/account`, `/dashboard/inbox`, `/dashboard/inbox/[conversationId]`
- **Account/settings:** `/settings/profile`, `/settings/notifications`, `/saved`, `/notifications`
- **Auth:** `/login`, `/signup`, `/auth/callback`
- **Admin:** `/admin`, `/admin/users`, `/admin/content`, `/admin/content/post`, `/admin/reports`, `/admin/competitions`, `/admin/directory`, `/admin/events`, `/admin/feedback`, `/admin/tags`, `/admin/unlock`

### 2.2 Posting flow today
- **Requires login.** `src/app/showcase/submit/page.tsx` redirects to `/login` if no user; `createProject` in `src/lib/actions/projects.ts` returns an error if not signed in.
- **Every project is attached to its poster** (`owner_id`, non-null), and auto-surfaces on that user's profile.
- The form (`src/components/showcase/project-form.tsx`) has a 5-step structure: basics → media → tags/tools → **"Looking for…" (commercial badges)** → **Visibility (anonymous toggle)**. Posts go **live instantly** (no approval gate). A `hidden` flag exists for after-the-fact moderation only.
- Autofill from a pasted link already exists (`src/lib/actions/url-metadata.ts`).

### 2.3 Data model (`projects`, from `src/lib/queries.ts` + migrations)
`projects`: `id`, `owner_id` (FK → `profiles`, **NOT NULL**), `name`, `description`, `url`, `image_url`, `video_url`, `images[]`, `tools[]`, `tags[]`, `is_anonymous`, `for_sale`, `open_to_partners`, `seeking_funding`, `upvote_count`, `hidden`, `is_featured`, `created_at`.
Related: `profiles` (handle, name, avatar, bio, links, tools, skills, is_builder, is_public, available_for_hire, is_featured, is_verified, is_admin, show_real_name), `comments` (`author_id`, `hidden`, flat — no replies), `upvotes` (`user_id`+`project_id`), `saves`, `follows`, `tags` (admin-managed), plus `gigs`, `competitions`, `events`, `directory_listings`, `reports`, `notifications`, `private_conversations`, `interests`.
Migrations run through `20260602140000_admin_panel.sql`.

### 2.4 Conflicts with the Phase 1 model
- `owner_id` is required → blocks standalone "community submission" listings.
- No `status`/queue, but we **don't want one** (instant publish) — so this is fine; we lean on `reports` + `hidden`.
- `is_anonymous`, commercial flags, "Looking for…" step → removed from the new model.
- Tag input allows free-form and renders the list twice (junk tags) → needs cleanup.
- `getLandingStats()` (builders/projects/gigs) → counter to be flag-gated off.
- Private messaging (`private_conversations`, `/dashboard/inbox`, gig threads) → hidden (no DMs in Phase 1).

---

## 3. Target Phase 1 design

### 3.1 Pages (final IA)
| Page | Notes |
|---|---|
| **Landing** | New layout (direction "C-refined"). |
| **Showcase** | The board. Friendly horizontal "mix" cards, one per row. |
| **Project detail** | Dedicated full page, immersive cover hero. |
| **Submit** | Single scrolling sectioned form; guest vs logged-in. |
| **Profile** | Public, **opt-in**, **click-through only** (no browse directory). |
| **Account dashboard** | Manage posts, edit/publish profile, saved, settings, claim status. |
| **How it works** | Kept; rewritten as a short explainer. |
| **Auth** | `/login`, `/signup` (Google + email/password). |
| **Admin** | Moderation, reports, claims queue, featured, tags, **Launch Control**. |

**App shell:** sidebar on desktop, bottom bar on mobile. Nav = logo · **Submit** · **Showcase** · **How it works** · **Account/Login**.

### 3.2 Posting model
- **Guest (no account):** posts only as a **community submission** — no builder attribution, no contact. Goes live instantly. Claimable later.
- **Logged-in:** defaults to **"I built this"** (attaches to profile, shows "by [name]"); a toggle flips to **"I found it on the web"** (community submission — still tracked in their dashboard, but no public attribution).
- **Autofill** (paste link → title/image/description) is the centerpiece of the form.
- **No approval queue** — instant publish. Moderation = **report → admin remove** (existing `reports` + `hidden`).
- **Claim** a community submission → request → **admin approves** → sets the project's `owner_id` to the claimer.
- **Admins** can post directly (to seed the board).

### 3.3 Interactions & login gates
- **Upvote:** no account required, **deduped by device** (cookie token + IP). Logged-in upvotes also dedupe by user.
- **Comment + reply** (one level deep, public): **login required**.
- Also login-gated: **save/bookmark**, **claim a project**, **having a public profile**.
- **No private chats / DMs / relay** anywhere. Contact happens only via the public links a builder chooses to put on their profile.
- **Auth:** Google **and** email/password (depends on Google OAuth consent screen working — see risks).

### 3.4 Tags
- **Fixed lists + allow custom** (suggest official labels, allow typed additions).
- **Categories (11):** Torah · Community · Business · Productivity · Education · Finance · Health · Design · Developer Tools · Automation · AI
- **Tools (10 + Other):** Lovable · base44 · Bolt · v0 · Replit · Cursor · Claude Code · Codex · Windsurf · Other
- Fix the **double-render** bug and purge junk tags ("directory", "kehila", "Finder", "Map", "Events").

### 3.5 Featured
Admin hand-pick (`is_featured`, already exists). Featured projects get a **highlight on the landing** and **sort first on the Showcase** with a soft amber "★ Featured" badge.

### 3.6 Admin Launch Control (feature flags) — NEW
A first-class admin screen listing **every gateable page/feature** with an on/off toggle, so the admin launches the bigger site **piece by piece**.

- A `feature_flags` table: `key` (e.g. `module.gigs`), `enabled` (bool), `label`, `description`, `category`, `updated_at`, `updated_by`.
- A server helper `isFeatureEnabled(key)` (cached) used by **nav rendering**, **route guards** (disabled → `notFound()`/redirect), and **feature points** (e.g., homepage stats).
- **Flags shipped OFF at launch:** `module.gigs`, `module.competitions`, `module.directory` (business), `module.events`, `module.messaging` (private inbox/DMs), `feature.homepage_stats`. Framework supports adding more (e.g., a future People browse directory).
- Admin UI: grouped toggles (Modules · Features), each with label + description + last-changed; flipping a flag takes effect immediately (revalidate).

### 3.7 What changes for existing data / modules
- **Hidden behind flags (dormant, not deleted):** Gigs, Competitions, Business Directory, Events, private messaging/inbox. All tables, routes, components preserved.
- **Removed/deprecated (conflict with the new model):** anonymous posting (`is_anonymous` path), commercial badges (`for_sale`/`open_to_partners`/`seeking_funding`) and the "Looking for…" step, the always-on landing stats counter (becomes a flag, default off). Columns can remain in the DB to avoid a destructive migration; they're just dropped from the UI and write paths.
- **Kept (reversing the brief):** profiles (as opt-in, click-through — no browse page) and How it works.

### 3.8 Visual / UX design (approved in the visual companion)
Saved mockups in `.superpowers/brainstorm/` (gitignored). Approved directions:
- **Landing = "C-refined":** compact hero (H1 + sub + Explore/Post buttons) + hero search + "Built with [tools]" strip → **Featured spotlight** → live **"Just shipped"** grid (Latest/Top + category chips) → "Post your project — no account needed" callout → light "Who it's for" 3-up → "Ready to vibe?" close.
- **Showcase = friendly "mix" feed:** roomy **horizontal cards**, one per row (thumbnail + title/by/desc/chips + big upvote). Featured-first with amber halo. Search + Latest/Top + tool dropdown + category chip row. "by [name]" vs "Community submission" both visible.
- **Project = immersive:** full-bleed cover hero (title/by/chips overlaid, floating upvote) → action bar (Visit · Demo · Share · Claim · Report) → desktop two-column (About + Comments cards on the left; sticky "Reach out" + "More from" on the right). **Mobile:** edge-to-edge hero + scrollable cards + **sticky bottom action bar** (upvote + Visit). Comments are in their own card, one level of replies, sign-in to comment.
- **Submit:** single scrolling sectioned form — ① Paste link + Autofill ② Basics ③ Media ④ Tags & tools (fixed + "add your own") ⑤ "Whose project is this?" toggle (logged-in only). Guest view omits ⑤ and shows an amber note. Button = **"Post project"** (instant).
- **Profile:** header card with soft brand banner + avatar + name/@nickname + contact buttons + bio + "Builds with" tools, then their projects in feed-style cards. Desktop + mobile both designed.

All real UI uses **lucide-react icons + brand tokens** (no emojis; mockup emojis were placeholders).

---

## 4. Migration to-do list

### 4.1 COPY changes (page by page — target text)
- **Global:** title **YidVibe**; meta description *"Where frum builders show what they're making with AI."*; footer tagline *"YidVibe — the home for frum builders"*; footer links **Showcase · Submit a project** (+ How it works).
- **Landing:** H1 **"Discover what frum builders are making with AI"**; sub + "Why now" + "Who it's for" (I build / I'm hiring / I'm curious) + "Just shipped" + "Ready to vibe?" — verbatim from the brief, minus the old "Top Creators" builders section.
- **Showcase:** H1 **"Showcase"**, sub *"Every app, tool, and MVP frum builders are shipping with AI. Browse it, upvote it, reach the maker."*, search placeholder *"Search projects or tools…"*, Latest/Top, category + tool filters, empty state *"Nothing here yet. Be the first to post."*
- **Submit:** title **"Post a project"**, autofill microcopy, fields per §3.8; **"Submit for review" → "Post project"** (instant); success *"Your project is live."* (replaces "we'll review it").
- **Remove** all copy referencing: gigs, competitions, directory, builders-as-section, "Reach out via YidVibe" relay, commercial intent.

### 4.2 FUNCTIONALITY — Cut / Hide (behind flags)
- Add `feature_flags` table + `isFeatureEnabled()` helper + admin Launch Control UI (§3.6).
- Gate nav items (`src/components/site/nav-links.tsx`, `sidebar.tsx`, `mobile-bottom-nav.tsx`) and routes for: `/gigs/*`, `/competitions/*`, `/directory/*`, `/events/*`, `/dashboard/inbox/*` behind their flags (OFF by default).
- Remove `/builders` browse page and the "Top Creators" landing section (`listTopBuilders`); keep `/u/[handle]` profiles (opt-in).
- Flag-gate the homepage stats counter (`getLandingStats`).

### 4.3 FUNCTIONALITY — Change
- **`projects.owner_id` → nullable**; add `submitted_by` (nullable). Update `createProject`/`updateProject`/`deleteProject` (`src/lib/actions/projects.ts`) and all `projects` queries (`src/lib/queries.ts`) to handle null owner + community submissions.
- **Submit gate:** `/showcase/submit` no longer requires login; `createProject` accepts guest submissions.
- **Project form:** remove "Looking for…" (commercial) and "Visibility/anonymous" steps; add the logged-in "Whose project is this?" toggle; guest variant note.
- **Tags:** enforce category vs tool fixed sets + custom; fix double-render/dedupe; seed clean `tags`; purge junk.
- **Comments:** add `parent_id` (one-level replies) — schema + `getComments` + comment UI (`src/components/showcase/comments-card.tsx`, `add-comment-form.tsx`).
- **Upvotes:** support anonymous device-deduped votes (cookie token + IP) alongside account votes (`src/components/brand/upvote-button.tsx` + action + table/columns).
- **Project "Reach out":** read contact links from the owner's profile (no inline project contact).
- Rebuild the **Landing**, **Showcase**, **Project**, **Submit**, **Profile** pages to the approved layouts.

### 4.4 FUNCTIONALITY — Add
- **Claim flow:** `claim_requests` table (project_id, claimant_id, status, created_at, reviewed_by); "Claim this project" on the project page; admin review queue; on approve set `owner_id`.
- **Admin Launch Control** screen (§3.6).
- **Saved/bookmarks** retained in dashboard (login-gated).
- Friendly empty/guest states and the "Post your project — no account needed" callout.

---

## 5. Open questions / risks
1. **Google OAuth** was a prior blocker (consent screen). Email/password is the safe path; Google depends on that being resolved. Confirm before relying on it at launch.
2. **Anonymous upvote abuse:** device+IP dedupe is gameable. Acceptable for launch; revisit if vote-stuffing appears.
3. **Existing data:** projects with `is_anonymous = true` or commercial flags — decide display (treat anonymous as standard attributed? or convert to community submissions?). Proposed: keep attribution, ignore the deprecated flags in UI.
4. **Pushing to the partner-owned repo** was previously 403-blocked; confirm the deploy/push path before implementation.
5. **Keeping dormant module code** means their tests/types must keep compiling even while flagged off — budget for that vs. the cost of deletion.
6. **Claim verification:** admin approves, but how does the admin verify a claimant truly made it? Manual judgement for launch; may need a proof step later.
7. **`owner_id` nullability** touches RLS policies and many queries — needs careful migration + re-test as authenticated/anon (per our RLS "no self-reference / test after DDL" rule).

---

## 6. Departures from the original brief (so they're explicit)
- **Keep + rename Builders → profiles** (opt-in, click-through) instead of cutting. **No browse directory page.**
- **No "Reach out via YidVibe" relay / private messaging.** Public contact only, from the builder's profile.
- **No approval queue** — instant publish + report/remove (brief wanted a queue).
- **Upvotes work without an account** (device-deduped); comments require login.
- **Events hidden behind a flag**, not replaced with "Coming soon."
- **Keep "How it works"** (brief cut it).
- **Everything cut is flag-toggleable** ("Launch Control"), not deleted — launch the bigger site piece by piece.
