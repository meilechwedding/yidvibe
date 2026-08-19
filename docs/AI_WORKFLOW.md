# AI-assisted development workflow

YidVibe was built with AI as an implementation partner, not as an autonomous product owner. The workflow keeps product judgment, architecture, security decisions, and release approval with a human.

## 1. Define the outcome

Start with the user problem, the actors involved, the action each actor needs to complete, and the acceptance checks that prove the feature works. Convert large ideas into bounded slices that can be reviewed independently.

## 2. Design the boundaries

Decide which responsibilities belong in the browser, the Next.js server layer, and the database. Authorization rules are expressed at the lowest dependable layer—especially Postgres Row Level Security—rather than relying only on prompts or UI state.

## 3. Implement a vertical slice

Build the smallest end-to-end path through schema, server behavior, and interface. AI can accelerate repetitive implementation and explore alternatives, but generated changes remain subject to human review and the project's existing conventions.

## 4. Review the risky paths

For each feature, explicitly check:

- unauthenticated and wrong-user access
- ownership and role transitions
- direct database access under Row Level Security
- server-only versus browser-safe configuration
- validation, empty states, and error handling
- mobile and keyboard behavior

## 5. Verify before release

Run the TypeScript compiler and a production build from a clean dependency install. When a feature changes authorization or data rules, exercise the corresponding database policies with both allowed and denied identities.

## 6. Keep the repository intentional

Commit durable product documentation and setup guidance. Keep local model settings, editor configuration, raw build logs, private MCP configuration, credentials, and machine-specific artifacts out of the public branch.

## Principles

- **AI-first:** use AI to shorten the path from idea to working software.
- **Human-directed:** a person owns requirements, tradeoffs, and release decisions.
- **Tested:** claims are based on current checks, not old logs.
- **Security-conscious:** authorization and secrets are treated as system design concerns.
- **Approval-gated:** consequential changes are reviewed before they reach production.
