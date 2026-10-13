# Theme and shared card review

The review inspected these application files in full:

- `src/app/globals.css`
- `src/lib/site.ts` for existing shared accent declarations, with changes owned by the coordinator
- `src/components/brand/detail-hero.tsx`
- `src/components/brand/media-gallery.tsx`
- `src/components/brand/avatar-circle.tsx`
- `src/components/brand/pill.tsx`
- `src/components/brand/gig-card.tsx`
- `src/components/brand/competition-card.tsx`
- `src/components/brand/builder-card.tsx`
- `src/components/brand/listing-card.tsx`
- `src/components/brand/project-card.tsx`
- `src/components/showcase/project-row-card.tsx`

No checkout AGENTS.md, BRAND.md or .agents skill file was found by the scoped filename search. The review did not inspect database implementations, migrations, admin resources or secrets.

## Where shared definitions live

`src/styles/theme.css` owns palette values, typography, radii, elevation, durations and compatibility aliases. `globals.css` imports it and retains component classes and global behavior. Compatibility aliases reference the canonical palette instead of repeating hex values. The palette itself is unchanged.

`src/lib/design/accents.ts` owns the Accent type, deterministic accent selection and hero, pill, avatar and soft cover maps. DetailHero, MediaGallery and both project cards reuse these definitions. Client components can import this module without importing feature or server code.

## Changes grounded in source

White text on the original orange button and sage Live badge backgrounds had insufficient small-text contrast. Existing deeper orange and sage tones now supply those backgrounds. Gold medals, flags and buttons use ink text. Gold-tint pills use amber900. Contrast regression tests calculate luminance from theme tokens, including gold, silver and bronze medal backgrounds. These checks cover selected corrected pairs, not all site contrast.

Gradient-only DetailHero backgrounds now have the same kind of dark text-supporting overlay already used over photos. Warm gradient stops otherwise place white title and small tag text over light colors. Long titles wrap. Avatar initials and photos share the full person's accessible name. Builder verification/featured icons have accessible labels, and the name/status row can wrap.

Linked gig, competition and builder cards have visible keyboard focus. Reduced-motion rules stop card/button transformations and their transitions. The tag marquee pauses when focus enters it, as it already does for pointer hover. Existing gallery error recovery and thumbnail labels remain intact.

The ListingCard contact affordances are named in text and already wrap. No structural rewrite was necessary. Existing responsive sizing in the project row card was retained pending actual mobile testing.

## Verification and limits

`tests/theme.test.ts` checks canonical aliases, complete shared accent maps and selected WCAG AA small-text contrast pairs. The existing gallery/competition regressions are rerun alongside it. These source and jsdom tests cannot establish visual layout, mobile usability or screen-reader output. Actual browser verification remains the coordinator's tracked runtime blocker.

Targeted verification passed 15 tests across `theme.test.ts`, `design-components.test.tsx` and `media-competition.test.tsx`. `npm.cmd run typecheck` passed after these changes. The coordinator owns the final aggregate suite and production build.
