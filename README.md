# YidVibe

A community for frum AI builders to share projects, meet collaborators and find paid work.

[Visit YidVibe](https://yidvibe.com/)

![YidVibe homepage](docs/screenshots/home.png)

## The problem

Independent AI builders often ship in public but lack one place to present their work, find collaborators or paid opportunities, and participate in a focused local community. YidVibe brings those activities into one product instead of scattering them across chat groups, social feeds, and generic job boards.

## The product

YidVibe is a multi-sided marketplace built around builder identity and shipped work:

- **Showcase** — publish projects, browse by tool or tag, upvote, and discuss
- **Builder profiles** — maintain a public portfolio, skills, tools, and availability
- **Directory** — search and filter community members
- **Gigs** — post work, apply, review applicants, and use private message threads
Events and Competitions are retired from public navigation. Their stored records and guarded administration tools are preserved.

## Architecture

    Next.js 15 application
    ├─ Server Components and route handlers
    ├─ Supabase SSR authentication
    ├─ Postgres data model and migrations
    ├─ Row Level Security policies
    ├─ Supabase Storage for uploaded media
    └─ Tailwind CSS and reusable UI components

The application uses the Next.js App Router with TypeScript and React 19. Supabase provides Postgres, Google authentication, and storage; server and browser clients are separated through @supabase/ssr.

## Security model

- Row Level Security is enabled at the database layer.
- Authorization-sensitive actions are scoped to the signed-in user or resource owner.
- Gig conversations are limited to the poster and the relevant applicant.
- Privileged admin operations are isolated from browser clients.
- Environment-specific values are loaded from local or deployment configuration and are not committed.

The repository documents setup patterns; production security still depends on applying the migrations, configuring OAuth redirect allowlists, protecting server-only credentials, and reviewing Supabase security advisories for the deployed project.

## Core stack

- Next.js 15 and React 19
- TypeScript
- Supabase Postgres, Auth, Storage, and SSR helpers
- Tailwind CSS 4
- Radix UI primitives
- React Hook Form and Zod
- Vercel-compatible deployment

## Local setup

    npm ci
    cp .env.example .env.local
    npm run dev

Configure the values documented in .env.example, then follow [Google OAuth setup](docs/GOOGLE_OAUTH_SETUP.md) for Google sign-in.

## Verification

    npm run typecheck
    npm run theme:check
    npm run test:eligible
    npm run build

Run these checks from a clean install before deployment. The repository's current verification result should be taken from a fresh run, not from historical build notes.

`test:eligible` runs UI regressions and source-only boundary checks. Four migration-reading checks are excluded from that command; `npm test` retains the original complete suite for authorized database-source review. Tests use mocked actions and do not submit production data.

## Where to make changes

See the [repository map](docs/REPOSITORY_MAP.md) for layer responsibilities, dependency direction and the main product journeys.

| Change | Location |
| --- | --- |
| Colors | `src/styles/palette.json`; `npm run theme:sync` updates generated CSS |
| Typography, spacing, motion and semantic tokens | `src/styles/theme.css` |
| Base styles, component classes and motion | `src/styles/base.css`, `components.css`, `motion.css` |
| Shared UI primitives and composed product UI | `src/components/ui` and `src/components/brand` |
| Accent maps, form-control styling and serialized image colors | `src/lib/design` |
| Public identity and feature/navigation catalogs | `src/config` |
| Page, form and interaction text | `src/content` |
| Interaction hooks and navigation/draft behavior | `src/hooks`, especially `src/hooks/navigation` |
| Pure calendar, contact, competition and budget functions | `src/lib/domain` |
| Feature UI | Feature folders under `src/components` |
| Next.js routes and metadata entry points | `src/app`; required framework filenames stay here |
| Existing server actions and data adapters | `src/lib/actions` and existing server-only `src/lib` modules |

The palette is shared by CSS, manifest metadata and server-rendered social images. Generated `palette.css` is committed and synchronized before dev/build; edit the JSON source, not the generated file. Rich instructional JSX and user-provided/dynamic text remain with their rendering rather than becoming string fragments. `src/lib/site.ts` is a compatibility export surface for unchanged existing imports; it owns no definitions or behavior.

Review scope and exceptions are recorded in [the repository review](docs/qa/2026-10-13-organization.md). `npm run review:coverage` checks the explicit source inventory; it does not certify runtime, visual or backend coverage.

## AI-assisted workflow

The project was developed with an AI-first, human-directed workflow: requirements and architecture were decided intentionally, changes were reviewed in small scopes, and security-sensitive behavior was validated against the database and application boundaries. The reusable process is documented in [docs/AI_WORKFLOW.md](docs/AI_WORKFLOW.md).

## Deployment

The application is designed for Vercel with Supabase as its managed backend. Production configuration requires:

- Public Supabase URL and anonymous key
- Production site URL
- Matching Supabase and Google OAuth redirect URLs
- Applied database migrations and reviewed Row Level Security policies

## Repository note

This is a portfolio project and application source. No open-source license is granted by this repository.
