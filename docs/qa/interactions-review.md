# Interaction and domain review

## Central homes
- `src/hooks/navigation/history.ts`: safe app history tracking.
- `src/hooks/navigation/unsaved.ts`: active draft registry and link guard.
- `src/lib/domain/calendar.ts`: pure local-date grouping/calendar calculations.
- `src/lib/domain/competition.ts`: pure status filtering.
- `src/lib/domain/money.ts`: inclusive budget-band overlap and band presets.
- `src/content/interactions.ts`: shared share/feedback/message copy; common actions and draft copy use `content/common.ts`.

Framework route entries and server adapters remain in place. Types imported with `import type` remain erased; no backend implementation or database files were inspected.

## Confirmed source defects fixed
- Share incorrectly treated every native-share rejection as dismissal. Platform failure now falls back to copy; AbortError cancellation does not. Reset timer is canceled on unmount.
- Note composer lacked an accessible name and intercepted Enter while IME composition was active. Added name/required field and composition guard; action error is announced.
- RotatingRow left offscreen linked cards keyboard reachable. Inactive slides are inert and hidden from accessibility traversal. Focus pauses independently of hover; reduced-motion disables slide transitions.
- Board FilterShell still used a hand-built fixed dialog without focus management/Escape/name. Radix portal handles dialog behavior; content has bounded viewport scrolling.
- Save/follow allowed repeated mutations while an existing transition was pending. Buttons now disable while pending.
- Cancel treated any browser history as safe app history and could send a fresh direct-entry user off-site. Uses shared safe app history with route fallback.

## Coverage and limitations
Reviewed interaction implementations for share, message composer, rotating row, reveal, pagination, save/follow/upvote, cancellation/confirmation, comment thread/form, board filters, notification dropdown and dashboard tabs/mobile navigation; reviewed navigation helper and domain extraction consumers. Existing source review from the prior patch covers site navigation, feedback, Post and mobile Explore dialogs, FilterBar and upload coordination. No claim of exhaustive backend coverage or rendered visual review is made. Sidebar/dashboard data assembly, image upload transport, server actions and database adapters were not executed; backend implementations were excluded. Follow-up review read every remaining assigned component in full; exact paths are listed below. This is a comprehensive source review of the assigned slice, not a claim that every behavior has a runtime test.

Six mocked DOM regressions pass in `tests/interaction-recovery.test.tsx`: share failure fallback, canceled share, named composer IME/Shift Enter behavior, carousel active-slide exposure, named board sheet Escape dismissal, and thrown upload recovery. These are jsdom tests, not browser screenshots, mobile rendering or production interactions. No messages, uploads, feedback or public changes were submitted. Coordinator performs consolidated eligible-suite/typecheck/build verification before publication.

## Follow-up findings
- ImageInput/GalleryInput now catch thrown upload failures while releasing busy state; ImageInput pasted-URL control and ReportMenu details have explicit names.
- Error-scroll hook skips hidden and disabled inputs and respects reduced motion.
- Sort buttons expose selected state; mobile URL filter sheet has bounded scrolling.
- Primary/sidebar links expose the active page.
- Competition prizes reuse shared money bands, removing duplicate presets without changing inclusive endpoint semantics.

## Exact fully inspected source paths
- `src/components/brand/back-link.tsx`
- `src/components/brand/cancel-button.tsx`
- `src/components/brand/confirm-dialog.tsx`
- `src/components/brand/filter-bar.tsx`
- `src/components/brand/follow-button.tsx`
- `src/components/brand/gallery-input.tsx`
- `src/components/brand/image-input.tsx`
- `src/components/brand/kebab-menu.tsx`
- `src/components/brand/pagination.tsx`
- `src/components/brand/posted-share-card.tsx`
- `src/components/brand/report-menu.tsx`
- `src/components/brand/reveal.tsx`
- `src/components/brand/rotating-row.tsx`
- `src/components/brand/save-button.tsx`
- `src/components/brand/share-button.tsx`
- `src/components/brand/upvote-button.tsx`
- `src/components/competitions/competitions-board.tsx`
- `src/components/dashboard/dashboard-hub.tsx`
- `src/components/dashboard/dashboard-mobile-bar.tsx`
- `src/components/dashboard/dashboard-tabs.tsx`
- `src/components/dashboard/glance-row.tsx`
- `src/components/events/event-calendar.tsx`
- `src/components/events/events-board.tsx`
- `src/components/filters/filter-shell.tsx`
- `src/components/gigs/gigs-board.tsx`
- `src/components/messaging/note-button.tsx`
- `src/components/messaging/note-composer.tsx`
- `src/components/showcase/add-comment-form.tsx`
- `src/components/showcase/claim-button.tsx`
- `src/components/showcase/comment-thread.tsx`
- `src/components/showcase/comments-card.tsx`
- `src/components/showcase/delete-project-button.tsx`
- `src/components/showcase/interest-button.tsx`
- `src/components/site/context-bar.tsx`
- `src/components/site/feedback-widget.tsx`
- `src/components/site/logo.tsx`
- `src/components/site/mark-read-on-view.tsx`
- `src/components/site/mobile-bottom-nav.tsx`
- `src/components/site/nav-links.tsx`
- `src/components/site/nav-shell.tsx`
- `src/components/site/notification-bell.tsx`
- `src/components/site/post-menu.tsx`
- `src/components/site/sidebar.tsx`
- `src/components/site/site-footer.tsx`
- `src/components/site/site-nav.tsx`
- `src/components/site/user-menu.tsx`
- `src/hooks/navigation/history.ts`
- `src/hooks/navigation/unsaved.ts`
- `src/hooks/use-scroll-to-error.ts`
- `src/hooks/use-unsaved-changes.ts`
- `src/lib/domain/calendar.ts`
- `src/lib/domain/competition.ts`
- `src/lib/domain/money.ts`
