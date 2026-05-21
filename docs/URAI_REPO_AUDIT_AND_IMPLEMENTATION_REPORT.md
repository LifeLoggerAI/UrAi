# URAI Repo Audit and Implementation Report

Status: implementation branch report
Branch: `urai-spatial-sacred-tech-polish`
Canonical repo: `LifeLoggerAI/UrAi`

## Assumptions

- `LifeLoggerAI/UrAi` is the canonical production source.
- URAI V1 remains a conservative public demo spine, not a full passive sensing, therapy, marketplace, AR/VR, B2B, or export system unless explicitly implemented and verified.
- Changes should preserve Firebase/data contracts, tier-lock checks, launch scripts, and existing demo routes.
- Visual implementation should be lightweight CSS/React and should not add heavy assets or new dependencies.

## Project purpose

URAI V1 is a public demo spine for a future passive emotional operating system. The current launch-critical product includes:

- Cinematic home scene
- Public constellation demo
- Deterministic companion narrator endpoint with safety boundaries
- Waitlist endpoint and form
- Seeded demo data for memory blooms, timeline stars, mood forecast, and weekly reflection
- Firebase rules/index scaffolding for V1 launch collections

## Tech stack observed

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 3
- Firebase client and Firebase Admin
- Jest for unit/rules tests
- Playwright for smoke/e2e browser coverage
- Framer Motion, Three, and React Three Fiber already present
- npm scripts and Node 20 engine requirement

## Architecture observed

- App Router routes under `src/app`
- Reusable components under `src/components`
- URAI-specific home/world components under `src/components/urai`
- Shared contracts, demo data, home state, companion, Firebase, and waitlist utilities under `src/lib`
- Firebase rules and indexes at repo root
- Launch and validation scripts under `scripts`
- Tests under `tests/unit`, `tests/rules`, and `tests/e2e`

## Main implemented flows

- `/` renders the canonical home/demo entry via `src/app/home/page.tsx`
- `/home` is redirected to `/` by `next.config.mjs`
- `/u/[handle]` renders a public-safe constellation demo
- `/api/companion` returns deterministic companion replies through the local companion engine
- `/api/waitlist` validates/rate-limits waitlist signup requests and writes via Firebase Admin when configured, otherwise supports dry-run mode
- Firebase rules protect owner-scoped collections, protected user fields, waitlist/admin access, and homeWorld shape

## Current implementation status

### Working / implemented

- V1 README and route scope are clear.
- Package scripts include doctor, typecheck, lint, unit tests, rules tests, build, preflight, smoke/e2e, and tier-lock gates.
- Environment template separates public `NEXT_PUBLIC_*` values from private server credentials.
- Waitlist route has rate limiting, email normalization, dry-run fallback, duplicate handling, and Firestore write behavior.
- Companion route rejects empty messages and uses deterministic local behavior.
- Firestore rules include owner checks, admin checks, protected user field checks, and V1 homeWorld validation.
- Public constellation route uses demo data and public-safe copy.
- Home scene and URAI world components already have a large sacred-tech visual foundation.

### Gaps / risks found

- README states V1 is intentionally conservative; final Tier 1-5/platform completion should not be claimed from this repo alone.
- `TODO_SYSTEMS.md` says final status is blocked until fresh command evidence exists for install, typecheck, lint, tests, build, smoke, release gate, deploy, and post-deploy browser evidence.
- Some product maturity items remain open: Storybook/state catalog, analytics observability, full keyboard/screen-reader QA evidence, visual regression evidence, replay provenance, and persistent focus/replay hardening.
- `/home` redirects to `/`, while tests and docs still reference both routes. This may be intentional but should remain watched during browser smoke.
- TypeScript config is not globally strict, though `strictNullChecks` is enabled. Do not introduce loose typing or broad `any`.
- Full command verification was not run from this connector context; CI/local checkout must provide fresh evidence.

## Implementation completed in this branch

### 1. Added sacred-tech visual system CSS

File: `src/styles/urai-sacred-tech-system.css`

Adds lightweight, reusable CSS primitives and tokens:

- `--urai-void`, `--urai-midnight`, `--urai-indigo`, `--urai-violet`, `--urai-moon`, `--urai-cyan`, `--urai-gold`, `--urai-glass`, `--urai-stone`, `--urai-mist`, `--urai-orb`, `--urai-seal`
- `.urai-sacred-background`
- `.urai-star-mist-layer`
- `.urai-reflective-floor`
- `.urai-sacred-content`
- `.urai-sacred-card`
- `.urai-orb-artifact`
- `.urai-cosmic-divider`
- `.urai-chip`
- `.urai-premium-cta`
- `.urai-field-input`
- `.urai-loading-signal`
- `.urai-success-signal`
- `.urai-error-signal`

The CSS uses gradients and shadows only. No heavy assets or new dependencies were added. Motion is guarded by `prefers-reduced-motion`.

### 2. Wired visual system into root layout

File: `src/app/layout.tsx`

Imported the new visual system stylesheet alongside the existing URAI style layers.

### 3. Polished public constellation cards

Files:

- `src/components/ForecastCard.tsx`
- `src/components/WeeklyReflectionCard.tsx`
- `src/components/WaitlistForm.tsx`

Changes:

- Reused sacred glass card styling.
- Added orb-artifact visual anchors.
- Kept existing props, forms, validation, API calls, aria attributes, and button semantics.
- Preserved waitlist disabled state and status live region.
- Changed loading/success copy to fit URAI tone while keeping meaning clear.

### 4. Polished public constellation route

File: `src/app/u/[handle]/page.tsx`

Changes:

- Applied sacred moonlit background, mist, reflective floor, chips, cards, dividers, and orb artifacts.
- Preserved metadata generation, public-safe demo data, memory blooms, star timeline, forecast, reflection, and waitlist CTA.
- Preserved visible smoke-test text: `Public Constellation`, `Demo data · public-safe view`, `@adamclamp`, `Memory Blooms`, `Star Timeline`, and `Join Early Access`.

## Commands to run for final verification

These must be run in a real checkout or CI environment:

```bash
npm install
npm run doctor
npm run check:v1
npm run check:tier2-access
npm run check:types
npm run typecheck
npm run lint
npm run test:unit
npm run test:rules
npm run build
npm run preflight
npm run launch:p0
npm run urai:tier1
npm run urai:tier2
npm run urai:tier3
```

## Verification status

Not run in this connector-only implementation context. No command is claimed as passed.

## Prioritized next implementation plan

1. Run fresh validation commands and fix any issues caused by this branch.
2. Confirm `/home` redirect behavior against Playwright smoke expectations.
3. Add visual regression screenshots for `/`, `/u/adamclamp`, mobile, and reduced-motion views.
4. Add a small component/state catalog for sacred card, orb artifact, sealed state, loading state, success state, and error state.
5. Continue applying the sacred-tech primitives to other launch-safe routes only after smoke stays green.
6. Add analytics/observability evidence for waitlist, companion, and public constellation interactions.
7. Keep Tier 1-5/full-platform completion claims blocked until fresh evidence exists.

## Reviewer notes

This branch intentionally makes small, reviewable changes. It does not alter Firebase rules, API contracts, env files, package scripts, launch gates, routing config, or data schemas. It strengthens the canonical URAI sacred-tech identity on the public demo surfaces without adding assets, dependencies, or broad rewrites.
