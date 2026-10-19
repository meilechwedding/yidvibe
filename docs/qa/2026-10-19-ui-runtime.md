# UI simplification and homepage runtime repair

Continues the existing `brand/yidvibe-v8` worktree from `ba13c5a`, preserving and completing its uncommitted navigation edits.

## Changes

- Post is a quiet top-right header control beside Sign in/account. The duplicate mobile bottom bar and desktop rail are retired. The header stays reachable while scrolling and keyboard navigation restores focus after closing Post.
- Explore goes directly to the project list. The homepage has a short introduction, search, stationary category shortcuts, project rows, and enabled builder browsing. Repeated promotional sections and large bottom posting prompts are removed. Project vote/save state remains intact.
- Explore retains URL-driven search, category/tool filters, sorting, pagination, and empty states, with a simpler heading and no duplicate large Post action.
- Public Events and Competitions list, detail, posting/request, layout, and competition social-image entry points redirect to Explore before reading module data. Navigation and posting choices exclude those modules even when their old feature flags are enabled. Database records, migrations, actions, and admin tools are unchanged.
- Existing v8 colors, self-hosted Space Grotesk, 10px controls, and 20px cards remain the design foundation. Mobile controls have at least 44px header hit targets.

## Runtime diagnosis

The old protected preview `yidvibe-p32u73tcs-meilechweddings-projects.vercel.app` returned HTTP 200 while its HTML contained `data-dgst="3503866744"`, matching the reported Vercel request. Status-only monitoring and build success did not catch the failed metadata render.

The root Open Graph module imported a font helper that read three TTF files at module evaluation. Next imports image modules while resolving page metadata. The homepage and Explore page trace manifests contain no TTF files; the image route manifests contain all three. This made ordinary page metadata depend on assets absent from page function bundles.

A local production server probe used a separate working directory with no `public/fonts` (without moving or deleting checkout files). It captured `ENOENT` for `SpaceGrotesk-Regular.ttf` with a stack through the compiled social-font module and `children.metadata.openGraph` in the homepage. The page returned HTTP 200 with an error template. The local digest differs because the missing path/build differs. A Windows Node assertion happened during probe shutdown after the response was captured; the follow-up probe was left running until explicitly stopped.

The helper now lazily reads and caches fonts only when an image is rendered. Repeating the missing-assets probe after rebuilding returned HTTP 200, the expected homepage content, **no error templates**, and no font-read failure. No catch-all fallback or authentication change hides the error. The root, project, and gig image trace manifests still include all three TTF faces.

## Verification

- `npm.cmd run test:frontend -- --pool=forks --maxWorkers=1 --testTimeout=20000 --hookTimeout=20000`: **97 passed, 20 files**.
- `npm.cmd run test:boundaries -- --pool=forks --maxWorkers=1`: **6 passed**; the four migration-reading tests remain excluded under the existing scope.
- `npm.cmd run typecheck`, `npm.cmd run theme:check`, production `npm.cmd run build`, and `git diff --check`: passed.
- Redirect tests now use a setup hook with no returned cleanup function. The previous concise hook returned the redirect mock, so Vitest called it as cleanup and threw `REDIRECT:undefined`.
- Fixed inherited optional/default route props that violated Next's generated page types.
- New regressions render the header for guest/member states, verify module choices and project/gig login return URLs, and ensure metadata imports do not read image-only fonts. Existing filter, navigation, form, media, and boundary regressions remain covered.
- Local Chrome production-build check: header Post opens the dialog, Escape restores focus to Post, and Project navigates to `/login?next=/showcase/submit`. Local data requests rendered empty-state content; real-data preview checks are recorded separately in the handoff.

## Release gates

Authentic v8 logo/favicon/social mark artwork is still unavailable. A narrow Downloads PDF filename check found no matching YidVibe/v8 brand PDF. The Library transfer helper was not bypassed and no substitute logo was drawn. Existing marks remain.

Production remains blocked on authentic artwork and independent runtime/visual review. No production deployment, database migration, auth/security setting change, account creation, or production test-data mutation is part of this update. Member UI behavior is tested with mocks; live authenticated flows still require the independent reviewer or an authorized test session.

## Browser and deployment follow-up

The `c350f41` preview (`yidvibe-fg3hhkjfz-meilechweddings-projects.vercel.app`) renders real project and builder data. Its homepage returns HTTP 200 with no error template. Live guest Post offers Project and enabled Gig; Gig leads to `/login?next=/gigs/post`. Search, no-results messaging, clearing search, category filtering, and combined category/sort URL state were exercised in Chrome. The browser error/warning log was empty and scoped Vercel error logs returned no entries during this check.

Local production HTTP checks confirmed 200 without error templates for homepage and Explore; 307 redirects for all seven retired public page/image routes; the correct guest project return URL; and 200 `image/png` for the root social image.

Responsive review found header actions wrapped at 320px. A final spacing correction keeps the unchanged 32px symbol, uses a smaller mobile wordmark/gap and compact horizontal button padding, and narrows mobile nav link padding. At 320px, Post and Sign in are on the same top row as the logo, both 44px tall, with no document overflow. The 12 header/navigation tests and production build passed again after this correction. Mobile filters open and Escape restores focus. Desktop and 390px layouts were also inspected.

The final immutable preview and remaining independent-review gate are supplied in the task handoff. Live member sessions and production publication remain outside the verification performed here.
