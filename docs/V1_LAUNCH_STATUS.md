# URAI V1 Launch Status

## Current status

V1 demo spine is implemented and repo-wired. Release-gate hardening was updated on 2026-05-22 by PR #305, merged at `70badf8827f62c600252ebbb04e79886c927aec6`.

That merge added a clean working tree preflight before Firebase release commands, aligned stale-lockfile CI install steps to `npm install`, and stabilized Lighthouse CI Chrome launch flags. PR #305 was merged after green CI, UrAi CI/CD, Playwright Smoke, QA Lighthouse/A11y, URAI Vault CI, Assets CI, QA Local Script, Independent Release Verifier, and URAI Launch Gate.

V1 is still not production-closeout complete until staging/prod evidence, configured Firebase persistence proof, deployment proof, mobile/desktop visual proof, and the final demo recording are attached to the launch closeout issues.

## Implemented

- Home demo route at `/`
- Public constellation route at `/u/adamclamp`
- Companion narrator UI
- Companion API route
- Extracted companion engine
- Waitlist UI
- Waitlist API route
- Firebase Admin helper
- Waitlist Firestore persistence path
- Duplicate-safe waitlist writes
- Firestore rules and indexes wiring
- Demo seed JSON generation
- Optional Firestore seed command
- Waitlist CSV export command
- V1 sanity checker
- Lockfile staleness checker
- Clean working tree release preflight
- Firebase deploy target lock
- Tailwind config
- PostCSS config
- Playwright config
- V1 route smoke tests
- SEO/Open Graph metadata
- Robots and sitemap metadata routes
- Product, API, QA, deploy, privacy, consent, AI safety, and demo docs
- Ancient Signals runtime engine
- Ancient Signals HomeView body-weather overlay
- Ancient Signals Firestore collection, owner-scoped rules, and indexes
- Ancient Signals callable Functions and scheduled daily rollup
- Ancient Signals passive rollup adapter

## Known blocker

The lockfile refresh remains pending. Current CI workflows that need to validate runtime/build/smoke behavior use `npm install` instead of `npm ci` until `docs/LOCKFILE_REFRESH.md` is completed. Do not switch those workflows back to `npm ci` until `npm run check:lockfile` passes from a clean checkout.

Operational launch evidence is also still pending: staging smoke, production deploy approval, configured waitlist persistence proof, Firebase deploy proof, mobile/desktop visual proof, and final demo recording.

## Latest merged release-gate evidence

PR #305 merged at `70badf8827f62c600252ebbb04e79886c927aec6` after these checks passed on head `f29d747236a002118f1c98dda23dc006e005d774`:

- CI
- UrAi CI/CD
- Playwright Smoke
- QA Lighthouse/A11y
- URAI Vault CI
- Assets CI
- QA Local Script
- Independent Release Verifier
- URAI Launch Gate

Launch Gate evidence from the passing run included:

- `npm run preflight` passed
- Firebase target check passed for `urai-4dc1d/urai-4dc1d`
- V1 sanity check passed
- public copy boundary check passed
- completion audit passed
- typecheck passed
- lint passed
- unit tests passed: 21 suites, 90 tests
- build passed
- Tier 1 launch lock passed
- route audit passed
- console warning audit passed
- env readiness audit passed
- tier lock report passed
- smoke tests passed: 12 tests

## Required validation

Use `npm install` while the lockfile refresh is pending.

```bash
npm install
npm run check:clean-tree
npm run check:v1
npm run seed:demo
npm run test:unit
npm run check:types
npm run build
npm run preflight
npm run test:smoke
```

Run the lockfile check separately and treat failure as the reason `npm ci` cannot yet be restored:

```bash
npm run check:lockfile
```

## Functions validation

Ancient Signals added Firebase Functions modules, so validate Functions separately:

```bash
cd functions
npm install
npm run build
```

## Firebase validation

With Firebase Admin env vars configured:

```bash
npm run seed:firestore
npm run waitlist:export
firebase deploy --only firestore:rules,firestore:indexes,functions
```

## Ancient Signals validation

- [ ] HomeView renders the body-weather overlay in demo mode
- [ ] `GroundLayer` responds to Ancient Signals state, not a forced demo tier
- [ ] Signed-in test user uses latest persisted `ancientSignals` snapshot when present
- [ ] `generateAncientSignalsSnapshot` callable persists owner-scoped snapshots
- [ ] `rollupAncientSignalsDaily` callable persists a daily rollup
- [ ] `scheduledAncientSignalsDailyRollup` appears in deployed Functions
- [ ] Scheduled rollups skip explicit Ancient Signals or health/wellness opt-outs
- [ ] User-facing copy avoids diagnosis, lie-detection, and unsupported scent claims

## Launch readiness checklist

- [ ] `npm run check:lockfile` passes from a clean checkout
- [x] `npm run preflight` passes in PR #305 Launch Gate
- [x] `npm run test:smoke` passes in PR #305 Launch Gate and Playwright Smoke
- [ ] `/` checked on mobile and desktop with attached proof
- [ ] `/u/adamclamp` checked on mobile and desktop with attached proof
- [ ] Waitlist dry-run checked locally
- [ ] Waitlist Firestore write checked in configured environment
- [ ] Ancient Signals demo and persisted snapshot paths checked
- [ ] Firestore rules/indexes/functions deployed with evidence
- [ ] `NEXT_PUBLIC_SITE_URL` set for deployment
- [ ] Staging smoke proof attached
- [ ] Production deploy approval evidence attached
- [ ] Final demo recording attached
