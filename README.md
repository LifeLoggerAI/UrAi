# URAI

URAI V1 is a public demo for the simplest version of the product promise: show how one sample memory can become the first scene of a symbolic world.

This repository is launch-focused and intentionally conservative. Full passive sensing, therapy/diagnosis, marketplace, AR/VR, B2B, studio/export systems, autonomous jobs, outbound communications, provider integrations, user-derived intelligence, and automated life-logging are **not live in V1** unless they are explicitly implemented, consent-gated, tested, deployed, and documented with production evidence.

The current V1 repo focus is the **sample memory-to-world demo spine**:

- `/` public demo entry scene with launch-safe copy and real CTAs
- `/system` product-facing system status route backed by `system/urai-system-registry.json` once deployed
- `/home` redirect/compatibility route for the public demo shell
- `/life-map` symbolic Life Map demo surface
- `/dashboard`, `/login`, and `/signup` gated pages until private-account evidence passes
- `/waitlist` early-access capture page
- `/privacy` and `/terms` public trust pages
- `/u/adamclamp` public constellation demo
- `/api/companion` deterministic mocked companion narrator endpoint with safety boundaries
- `/api/waitlist` early-access capture endpoint
- seeded demo data for memory blooms, timeline stars, mood forecast, and weekly reflection
- Firebase rules/index scaffolding for V1 launch collections

## Current launch posture

The repo contains production-lock and launch evidence docs, but the app must not be called production-ready until checks, deploy evidence, smoke evidence, visual screenshots, rollback evidence, monitoring evidence, and privacy gate evidence pass.

The latest evidence state is tracked in:

- `docs/FINAL_LAUNCH_REPORT.md`
- `docs/URAI_FINAL_DONE_DONE_STATUS.md`
- `docs/PRODUCTION_LOCK.md`
- `system/urai-system-registry.json`

## Quick start

Use Node 20, then install and run the V1 app:

```bash
npm install
npm run check:v1
npm run seed:demo
npm run dev
```

Then open:

```txt
http://localhost:3014
http://localhost:3014/system
http://localhost:3014/home
http://localhost:3014/u/adamclamp
```

## Validation

Run the V1 validation path before deploying or sharing the demo:

```bash
npm run check:system-registry
npm run check:production-lock
npm run smoke:production
npm run smoke:genesis-spine
npm run check:v1
npm run check:firestore-contract
npm run seed:demo
npm run test:unit
npm run check:types
npm run lint
npm run build
npm run preflight
```

Run browser coverage for the core demo paths:

```bash
npx playwright install --with-deps chromium
npm run test:smoke
npm run test:e2e
```

`npm run test:smoke` covers the launch-critical memory-world root route, deeper home route, public constellation route, waitlist happy path, waitlist invalid-email state, companion happy path, and companion empty-input guard.

## Utility commands

| Command | Purpose |
| --- | --- |
| `npm run check:v1` | Verifies the required V1 files, scripts, dependencies, and Firebase config exist |
| `npm run check:system-registry` | Verifies the canonical system registry and blocks invalid production, staging, sandbox, legacy, and privacy-gate claims |
| `npm run check:production-lock` | Verifies launch modes, production claims, custom domains, blockers, and evidence gates |
| `npm run smoke:production` | Checks only configured safe public URLs and does not imply production readiness by itself |
| `npm run check:firestore-contract` | Verifies required Firestore rule matches and server-only waitlist posture; warns on remaining `userId` index drift |
| `npm run seed:demo` | Writes `tmp/urai-demo-seed.json` |
| `npm run seed:firestore` | Writes demo seed data to Firestore when Firebase Admin env vars are configured |
| `npm run waitlist:export` | Exports `waitlistSignups` to `tmp/waitlist-export.csv` or a dry-run sample row locally |
| `npm run test:smoke` | Runs launch-critical Playwright smoke tests |
| `npm run test:e2e` | Runs the full Playwright suite across configured desktop and mobile projects |
| `npm run preflight` | Runs V1 sanity check, Firestore contract audit, typecheck, lint, unit tests, and build |

## Important lockfile note

`package.json` has recently changed to include `firebase-admin`, `tailwindcss`, `postcss`, and `autoprefixer`.

Run:

```bash
npm install
```

Then commit the refreshed `package-lock.json`. See `docs/LOCKFILE_REFRESH.md` for the exact steps.

## Firebase configuration

The app expects a consistent set of Firebase environment variables that share the
`NEXT_PUBLIC_FIREBASE_` prefix. Populate these keys in your `.env.local` file by copying
`env.local.template`:

```bash
cp env.local.template .env.local
```

Public web config:

```txt
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

Server-side Firebase Admin access requires:

```txt
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

The waitlist route works in local dry-run mode without Admin credentials. With Admin credentials configured, `/api/waitlist` writes to `waitlistSignups/{normalizedEmail}`.

## Demo routes

| Route | Purpose |
| --- | --- |
| `/` | Public demo entry where sample memory/world language is framed as launch-safe and evidence-gated |
| `/system` | Public/demo-safe URAI system status surface backed by the canonical registry once deployed |
| `/home` | Redirect/compatibility route for the public demo shell |
| `/life-map` | Symbolic Life Map demo surface |
| `/dashboard` | Gated page until private dashboard evidence passes |
| `/login` | Gated page until private account release evidence passes |
| `/signup` | Waitlist-first signup gate |
| `/waitlist` | Early-access waitlist capture |
| `/u/adamclamp` | Public constellation demo with blooms, timeline stars, forecast, reflection, and waitlist CTA |
| `/api/companion` | POST endpoint for deterministic mocked companion narrator responses with safety boundaries |
| `/api/waitlist` | POST endpoint for early-access signups |

## Firebase deploy

Deploy rules and indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## Canonical system docs

URAI production claims must be backed by registry evidence, passing checks, live deploy proof, privacy gate proof, rollback proof, monitoring proof, visual QA, and smoke evidence.

- `/system`
- `docs/SYSTEM_OF_SYSTEMS_WIRING_MATRIX.md`
- `docs/REPO_CANONICAL_STATUS.md`
- `docs/CROSS_REPO_DEPENDENCIES.md`
- `docs/PRODUCTION_EVIDENCE_REQUIREMENTS.md`
- `docs/STAGING_INTEGRATION_PLAN.md`
- `docs/DO_NOT_OVERCLAIM.md`
- `docs/NEXT_WIRING_TASKS.md`
- `system/urai-system-registry.json`

See:

- `docs/API_V1.md`
- `docs/REPO_SYSTEM_MAP.md`
- `docs/ENV_REGISTRY.md`
- `docs/FEATURE_STATUS_MATRIX.md`
- `docs/LAUNCH_CHECKLIST.md`
- `docs/PRIORITY_BACKLOG.md`
- `docs/PRIVACY_SECURITY_CHECKLIST.md`
- `docs/V1_DEPLOY_CHECKLIST.md`
- `docs/V1_QA_CHECKLIST.md`
- `docs/V1_MANUAL_TESTS.md`
- `docs/FIRESTORE_V1_COLLECTIONS.md`
- `docs/IMPLEMENTATION_NEXT.md`
- `docs/URAI_MASTER_COMPLETION_PROMPT.md`
