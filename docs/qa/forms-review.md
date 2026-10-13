# Forms review

Reviewed every owned component below. Action implementations, database migrations, Supabase resources and secrets were excluded. Existing action imports and API contracts remain intact. All validation tests use mocks; no real uploads, messages, accounts or listings were submitted.

## Organization

Shared input/textarea styling now imports `src/lib/design/controls.ts`, preserving the original dimensions. Feature-owned copy lives in `src/content/forms/auth.ts`, `directory.ts`, `gigs.ts`, `projects.ts`, `profile.ts`, `events.ts`, and `competitions.ts`. Directory wording is shared between request and self-listing forms. Gig type labels and action wording share one feature definition. Project/Profile/Event/Competition form labels, hints, section descriptions, placeholders, buttons and request/entry success wording now live in their corresponding feature copy modules. Markup remains in its component. Field names, IDs, action error keys, dynamic values and server-returned error messages stay in components because these are API or state contracts rather than editable application wording. EventCalendar controls and ToolsSkills expansion text remain alongside those standalone widgets, outside these form-copy modules.

## Findings fixed

- Profile Tools/Skills pills previously linked to Directory, which does not accept tool or skill filters. They now link to Builders, whose route accepts both parameters.
- Project live-link label had no association with its input. Added a matching label/input ID. Project field errors and event-request errors now reference the relevant controls; custom project chip inputs have explicit names.
- Project ownership choices had no accessible selected state. Added aria-pressed to both choices.
- Grouped profile contact/link inputs and custom skill/tool inputs now have explicit accessible names.
- Auth input errors now set aria-invalid and associate the relevant error text. Notices and errors announce through status/alert roles; signup fields have appropriate autocomplete values.
- Message composer now rejects an empty submission through its existing native validation path. No server contract changes.

## Verification

Focused forms/auth/directory/dialog verification passed all 16 tests across 3 files, including 7 new review tests. Typecheck passed after feature-copy extraction. The coordinator runs the full eligible suite and build after integration. Initial test failures were test-environment scrollIntoView absence and a typographic apostrophe introduced during copy extraction; both were corrected, preserving the expected accessible name. The project-error test now matches the required marker in a visible label rather than assuming the label contains only its bare title.

## Inspection coverage

- auth/auth-forms.tsx
- directory/get-listed-form.tsx
- directory/self-listing-form.tsx
- profile/profile-form.tsx
- profile/cover-avatar-input.tsx
- profile/tools-skills.tsx
- gigs/gig-form.tsx
- gigs/apply-button.tsx
- gigs/message-composer.tsx
- competitions/competition-form.tsx
- competitions/submit-entry-form.tsx
- events/event-form.tsx
- events/event-request-form.tsx
- events/event-calendar.tsx
- showcase/project-form.tsx

Reviewed controlled/uncontrolled field state, input names and types, accessible names, action/pending/reset behavior, dirty changes, upload callbacks, ownership selection, safe preview URLs, month selection and feature links. Existing upload serialization/submit blocking and draft guards were preserved. No additional backend assumptions or changed budget/date semantics.

Cards, boards, calendar utilities and competition filtering belong to another reviewer. Actual rendered browser/mobile verification is outside this local jsdom review. Native browser history draft guarding still has the previously documented limitation.
