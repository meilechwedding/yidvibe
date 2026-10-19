# YidVibe Brand System v8 — Option C

The supplied ten-page Brand System v8 PDF and approved Connected canvas handoff were located in Downloads, inspected, and verified on 19 October 2026. The four original PNG extracts match the handoff manifest; unchanged source artwork and provenance are in `public/brand/v8/source` and `public/brand/v8/README.md`. Web variants only crop transparent margins; the mark has not been redrawn.

## Interface

- Petrol `#103D39`, citron `#E5E86A`, mineral `#43987E`, mist `#E3EDE7`, canvas `#F3F5EE`, white. Body copy uses petrol or accessible muted petrol `#4B6764`; mineral is decorative.
- Self-hosted Space Grotesk 400/500/600, from the complete upstream font, not a PDF subset. Font provenance and license remain in `public/fonts`.
- The later approved Option C geometry supersedes the original PDF's 10/20px radii: 18px controls, 24px media/search, 32px major frames, pill chips. Content uses 80px desktop, 32px tablet, 20px mobile gutters, reduced to 16px below 360px.
- Centered petrol homepage hero; one real featured/recent project connected to the existing flag-aware builder panel; spacious two-column catalog; connected project/profile pages. Responsive layouts retain the same data and actions.
- Desktop has a filled Post project beside account controls; mobile retains the existing primary bottom navigation. Gigs, Events and Competitions have no visible navigation or creation choices. Existing stored records are preserved.
- The project wizard retains every schema field and mounted upload value through Details, Media and Review. Publishing remains an explicit separate action. No draft persistence or extra visibility control is promised.

`palette.json` and generated `palette.css` own canonical colors. `theme.css` owns semantic typography, radius and spacing tokens. Shared composition rules live in `connected.css`. Reduced-motion styles disable nonessential transforms and entrance animation.

## Scope and release

No authentication, database, security policy, server action or query implementation changes are part of this refresh. Existing profiles, projects, media and retired-module records must remain intact. Public catalog filter parameters and pagination remain unchanged. Independent runtime and visual review gates production publication; `design-qa.md` records the evidence and remaining checks.
