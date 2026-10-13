# Shared UI and pure utility review

The coordinator inspected the following source files in full, in addition to integration review of the new config/content/design/domain modules and the other reviewers' reports:

- `src/components/ui/avatar.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/separator.tsx`
- `src/components/ui/skeleton.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/brand/action-card.tsx`
- `src/components/brand/browse-by.tsx`
- `src/components/brand/empty-state.tsx`
- `src/components/brand/form-field.tsx`
- `src/components/brand/form-help-link.tsx`
- `src/components/brand/form-section.tsx`
- `src/components/brand/layout.tsx`
- `src/components/brand/official-author.tsx`
- `src/components/brand/page-header.tsx`
- `src/components/brand/panel.tsx`
- `src/components/brand/section-crumb.tsx`
- `src/components/brand/sparkle.tsx`
- `src/components/brand/stat-grid.tsx`
- `src/components/events/event-card.tsx`
- `src/lib/display.ts`
- `src/lib/html.ts`
- `src/lib/utils.ts`
- `src/lib/og.tsx`
- `src/lib/site.ts`
- `src/lib/image/compress.ts`
- `src/lib/security/image-urls.ts`
- `src/lib/security/redirects.ts`

Radix primitive exports preserve their original server/client boundaries and caller props. Shared Dialog close controls now have a 44px target and visible keyboard focus. FormField communicates required/error semantics without adding native validation behavior. The tag marquee's visual duplicates are hidden from assistive and keyboard traversal. Page headers wrap long titles. Accent text/rule/icon mappings and the approved star path are shared rather than repeated.

Palette values are maintained in `src/styles/palette.json`. `scripts/sync-theme.mjs` emits deterministic Tailwind color declarations into `palette.css`; theme.css owns semantic aliases, dimensions and motion. Predev/prebuild synchronize the generated declarations, and theme:check detects drift. Social image/icon renderers and manifest/viewport metadata import the same JSON through image-theme.ts, preserving their original serialized colors. Static public SVG assets remain untouched.

The site compatibility module is necessary for unchanged excluded server-side imports. It contains no definitions or behavior, and preserves existing imports while config, content, domain and design modules supply the implementation. No extra framework route wrappers were added.

Docs incorrectly claimed anonymous voting, while UpvoteButton routes signed-out users to login. Account and engagement help now describe the implemented gate. No authentication behavior was changed to make the docs true.

No broad visual redesign was attempted without rendered evidence. Native browser draft-history traversal, all site contrast, touch layout and actual screen-reader behavior remain unverified. The source review does not certify WCAG conformance or backend authorization.
