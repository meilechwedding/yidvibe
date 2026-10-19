# Option C design and verification

The approved Option C refresh uses authentic v8 artwork and preserves the existing data, server actions, query contracts and permissions. Release evidence, candidate SHAs, deployment IDs and the independent acceptance decision are recorded in the task checkpoint and review report.

## Sources and artwork

The approved handoff contains ten inspected desktop/mobile references and four authentic lossless PNGs extracted from Brand System v8. Their SHA256 values match the supplied manifest. Source artwork remains unchanged; derived web images remove transparent margins only. Shared identity, app icons and social images use the authentic mark.

## Verified on 19 October 2026

- 127 frontend tests pass, including retained wizard FormData, server-error focus, media/link validation and upload retry. Six boundary tests pass; four unrelated security-migration checks remain outside the UI-only scope. Typecheck, synchronized theme palette, production build and diff whitespace checks pass.
- Homepage widths320,360,390,768,1024 and1440 have no document overflow. The mobile headline scales from32px and keeps "a conversation." together at320px; desktop composition remains unchanged.
- Independent browser review covers populated home, Explore, real project detail and builder profile; protected profile editor, dashboard and admin layouts use explicitly isolated fixtures. The narrow admin navigation scrolls focused links into view.
- The actual project form reaches Review at320px with zero publish attempts. Back and Edit preserve values. Only explicit Publish invokes the isolated handler; its intentional error receives focus and retains the entered values. Primary final actions are48px high and wrap within the narrow form. Long no-image previews retain the full adjacent title without clipping their label.
- Inbox conversation and empty states render at320px and desktop. Long names and handles keep the intended ellipsis instead of being overridden by the general paragraph-wrapping rule.
- Hosted guest access to Dashboard redirects to Sign in with its return path. Email and password have visible associated labels; keyboard order moves from email to password; primary sign-in controls are48px high. The mobile sign-in page has no horizontal overflow.
- Source palette contrast ratios: petrol/canvas10.93:1, citron/petrol9.20:1, muted-petrol/canvas5.58:1, white/petrol12.01:1. Reduced-motion rules disable nonessential animation; that mode was inspected in source, not toggled in the operating system.
- Public production and initial Option C preview expose identical72project IDs across three pages and12builder handles. Public filters, pagination, profile projects and detail media are preserved. No profiles, projects, images or retired-module records were deleted or mutated during verification.
- Initial hosted Option C home, catalog, detail/profile and directory return200 without Server Component error templates; root and project share images return200image/png. Recent error/fatal runtime logs were clear. Local retired public routes redirect and retired admin routes retain their guard.

## Evidence and limits

Screenshots are saved outside the repository in the task's `option-c-screenshots` directory, including final-home-320, final-post-review-320-full, final-post-error-320, final-inbox-row-320, final-inbox-empty-320 and final-signin-320. The old `independent-post-review-320.jpg` contains Media and is not Review evidence.

Protected fixtures import the actual UI components but use labeled test data, no account/database access and disabled publication/uploads. They are not deployed. No live YidVibe member/admin session was available, so real account writes, message delivery and uploads were not exercised. Browser zoom keystrokes did not change the measured viewport/DPR; actual200%zoom, physical-device and screen-reader checks remain unverified. Catalog comparison is public coverage evidence, not a private database inventory or backup audit.

Production requires independent acceptance of the exact candidate preview, followed by live runtime and public-catalog verification. Do not treat a successful build as evidence of runtime success.
