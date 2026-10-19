# Repository map

YidVibe separates presentation, interaction state, server operations and data rules while preserving Next.js App Router conventions. Start with the layer that owns the requested change.

## Responsibility boundaries

| Layer | Location | Owns |
| --- | --- | --- |
| Routes | `src/app` | Framework entry points, metadata, existing access checks, assembling data and screen components |
| UI primitives | `src/components/ui` | Buttons, inputs, dialogs and accessible Radix wrappers |
| Shared product UI | `src/components/brand` | Page containers, panels, cards, fields, media and reusable product controls |
| App shell | `src/components/site` | Desktop header, mobile bottom navigation, account/Post menus, footer and contextual navigation |
| Shared form controls | `src/components/forms` | Controlled selections and inputs shared by feature workflows |
| Feature screens | `src/components/showcase`, `profile`, `gigs`, `dashboard`, `admin`, etc. | Feature presentation and composition |
| Interaction state | `src/hooks` | Form navigation, unsaved changes, error focus and reusable browser behavior |
| Design tokens | `src/styles/palette.json`, `theme.css` | Canonical colors, semantic tokens, typography, spacing, geometry and timing |
| Global styles | `src/styles/base.css`, `components.css`, `navigation.css`, `motion.css` | Document defaults, shared component classes, animations and reduced-motion behavior |
| Design utilities | `src/lib/design` | Shared form classes, accent maps and social-image assets/fonts |
| Content | `src/content/pages`, `forms`, `navigation.ts`, `interactions.ts` | Product-owned copy; real user content stays in the data layer |
| Configuration | `src/config` | Public site identity, navigation and known feature catalogs |
| Pure rules | `src/lib/domain` | Calendar, contact, competition and money logic without React or database dependencies |
| Form contracts | `src/lib/contracts` | Browser-safe action state shared between forms and servers |
| Validation | `src/lib/validation` | Shared project parsing rules; server actions still enforce them on submission |
| Server actions | `src/lib/actions` | Authoritative validation invocation, identity/ownership checks and mutations |
| Read services | `src/lib/queries.ts`, `gigs.ts`, `directory.ts`, `dashboard.ts`, etc. | Existing database reads and normalized results |
| Infrastructure | `src/lib/supabase`, `src/lib/security`, `src/middleware.ts` | Client boundaries, session handling and URL/image safety |
| Database | `supabase` | Existing migrations and policies; outside the UI redesign scope |
| Verification | `tests`, `docs/qa` | Behavioral regressions, boundary checks and dated review evidence |

`src/app/globals.css` is the stylesheet entry point. Edit the named style module rather than adding unrelated rules there. `palette.css` is generated: edit `palette.json`, then run `npm run theme:sync`.

`src/lib/site.ts` remains a compatibility export surface. New code should import the owning config, content or domain module directly. Do not move framework filenames or server authorization checks for cosmetic folder consistency.

## Main journeys

- Discover: `app/page.tsx` → `app/showcase/page.tsx` → `app/showcase/[id]/page.tsx`.
- Meet a builder: `app/builders/page.tsx` → `app/u/[handle]/page.tsx`.
- Post a project: `app/showcase/submit/page.tsx` → `components/showcase/project-form.tsx` → `lib/actions/projects.ts`.
- Post work: `app/gigs/post/page.tsx` → `components/gigs/gig-form.tsx` → `lib/actions/gigs.ts`.
- Account: `app/login` and `signup` use `components/auth`; account/dashboard pages compose shared forms and controls.
- Moderation: `app/admin` retains existing access checks before reading protected records or invoking actions.
- Retired public Events/Competitions destinations redirect to Explore. Stored records and guarded admin tools remain.

## Dependency direction

Routes compose UI and call existing server services. UI receives data and action contracts; it does not embed database credentials or recreate authorization rules. Hooks own reusable browser state. Pure rules have no UI imports. Product copy and design tokens can be consumed by UI without importing server modules.

Server validation remains authoritative even when a posting step validates for immediate feedback. A client check must not weaken or replace the server schema. Keep mutations at the existing final submit boundary.

## Motion and accessibility

Route transitions use `app/template.tsx` and CSS, so they add no animation library or client navigation delay. Shared motion lives in `styles/motion.css` and respects `prefers-reduced-motion`. Content must remain readable without JavaScript or animation. Dialogs retain keyboard dismissal/focus return; forms retain error association and unsaved-change protection.

Petrol and dark muted petrol supply normal text contrast. Mineral is an accent, not a body-text color. Validate every text/surface pairing when introducing new styles.

## Validation before release

Run `npm run test:frontend`, `npm run test:boundaries`, `npm run typecheck`, `npm run theme:check`, and `npm run build`. Compare rendered desktop/mobile screens with the approved references, exercise the core journeys, and inspect server output. Build success alone does not establish runtime or visual correctness.
