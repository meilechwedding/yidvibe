# Public route review

## Structure and changes

Next.js route entry points remain under `src/app`. No wrapper routes or mass moves were added.

- `src/config/site.ts` owns `SITE_NAME`, `SITE_TAGLINE`, `SITE_DESCRIPTION`, and `SITE_URL`. Root metadata, manifest, social card, robots, and sitemap use it directly.
- `src/content/pages/{showcase,builders,directory,events,gigs,competitions}.ts` owns feature metadata and browse-page headers. The shared result-empty copy and filter labels are in `browse.ts`; metadata and visible descriptions now share their existing identical values where applicable.
- `src/content/pages/home.ts` owns audience invitations and the shared tagline. Icons and tints remain in the route as presentation.
- `src/content/pages/docs.ts` owns help-page metadata, introduction, and section headings. Rich inline instructional markup remains beside its rendering rather than being flattened into unreadable string fragments.
- `src/content/pages/status.ts` owns error and not-found copy. Error retry behavior stays in the client route.

Copy values were preserved. No translation framework or runtime copy lookup was introduced.

## Source fixes

The featured-project detail already obtains the owner's profile and `is_public` flag. The contact panel now uses those existing values to explain unavailable private profiles, removes its misleading View CTA, and hides private contact values from guests. Public profiles retain contact/profile actions; an owner can still inspect their own profile. No publication flag is changed.

Profile metadata previously returned its biography before the body checked `is_public`. It now returns generic metadata for a private profile, so previews do not reveal the private biography or name.

The inbox profile link has an explicit accessible name because its visible label disappears at small widths. Gig status buttons expose their selected state with `aria-pressed`. Gig message text wraps long unbroken strings, matching the main inbox behavior.

## Verification

`tests/public-profile-boundaries.test.tsx` adds four mocked regressions: private guest contact/CTA behavior, public profile actions, private metadata, and public metadata. All server data/current-user/admin/action dependencies are mocked. No database queries or actions execute.

The four tests plus three existing homepage/shared-field tests passed. Typecheck and unstaged whitespace checks passed. Final integrated build, audit and full eligible test outcomes belong to the coordinator's final verification report.

This is source and jsdom review. It does not establish visual layout at any viewport, live OAuth behavior, production deployment parity, or backend authorization enforcement.

## Coverage and exceptions

Reviewed the following public and account route TS/TSX files for route structure, rendering states, metadata, links, accessible names, filter props, privacy-visible UI, and responsive class intent. Query/action implementation and backend enforcement were excluded; imported functions were treated as interfaces.

The initial broad output was followed by smaller reads of route families and dynamic/social-image files so review did not rely on a truncated aggregate. Feature-flagged shells were preserved. The existing private profile flag was reused rather than inventing data access.

Excluded: `src/app/admin/**`, `src/app/auth/callback/**`, database/Supabase/migrations/secrets, backend query/action implementations, and `globals.css` owned by the theme worker. `events/post/page.tsx` was identified as an admin-only entry shell and left unchanged. No `.agents` directory exists in this checkout.

Inspected files:
- `src/app/apple-icon.tsx`
- `src/app/builders/layout.tsx`
- `src/app/builders/page.tsx`
- `src/app/competitions/[slug]/opengraph-image.tsx`
- `src/app/competitions/[slug]/page.tsx`
- `src/app/competitions/layout.tsx`
- `src/app/competitions/page.tsx`
- `src/app/competitions/post/page.tsx`
- `src/app/dashboard/account/page.tsx`
- `src/app/dashboard/inbox/[conversationId]/page.tsx`
- `src/app/dashboard/inbox/layout.tsx`
- `src/app/dashboard/inbox/page.tsx`
- `src/app/dashboard/layout.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/posts/page.tsx`
- `src/app/dashboard/profile/page.tsx`
- `src/app/dashboard/saved/page.tsx`
- `src/app/directory/layout.tsx`
- `src/app/directory/list-me/page.tsx`
- `src/app/directory/list/page.tsx`
- `src/app/directory/page.tsx`
- `src/app/docs/page.tsx`
- `src/app/error.tsx`
- `src/app/events/layout.tsx`
- `src/app/events/page.tsx`
- `src/app/events/request/page.tsx`
- `src/app/gigs/[slug]/opengraph-image.tsx`
- `src/app/gigs/[slug]/page.tsx`
- `src/app/gigs/[slug]/thread/[threadId]/page.tsx`
- `src/app/gigs/layout.tsx`
- `src/app/gigs/page.tsx`
- `src/app/gigs/post/page.tsx`
- `src/app/layout.tsx`
- `src/app/login/page.tsx`
- `src/app/manifest.ts`
- `src/app/not-found.tsx`
- `src/app/notifications/page.tsx`
- `src/app/opengraph-image.tsx`
- `src/app/page.tsx`
- `src/app/robots.ts`
- `src/app/saved/page.tsx`
- `src/app/settings/notifications/page.tsx`
- `src/app/settings/profile/page.tsx`
- `src/app/showcase/[id]/edit/page.tsx`
- `src/app/showcase/[id]/opengraph-image.tsx`
- `src/app/showcase/[id]/page.tsx`
- `src/app/showcase/page.tsx`
- `src/app/showcase/submit/page.tsx`
- `src/app/signup/page.tsx`
- `src/app/sitemap.ts`
- `src/app/u/[handle]/page.tsx`
