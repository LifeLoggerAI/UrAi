# URAI V1 Launch Status

## Current status

V1 demo spine is implemented and repo-wired, including the merged Ancient Signals layer and LifeMap scene transition. Lockfiles are expected to be current and CI now validates the V1 wiring, lockfile, demo seed, types, lint, tests, rules, integration tests, and production build.

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
- LifeMap scene entry from HomeScene
- Reduced-motion-aware LifeMap transition state

## Known blocker

No repo-level blocker is currently documented after the lockfile refresh. Runtime/build/deploy validation must still pass before launch.

## CI validation

The primary CI workflow runs:

```bash
npm ci
npm run check:v1
npm run check:lockfile
npm run seed:demo
npm run check:types
npm run lint
npm run test:unit -- --runInBand
npm run test:rules -- --runInBand
npm run test:integration -- --runInBand
npm run build
```

## Required local validation

```bash
npm run check:v1
npm run check:lockfile
npm run seed:demo
npm run test:unit -- --runInBand
npm run test:rules -- --runInBand
npm run test:integration -- --runInBand
npm run check:types
npm run lint
npm run build
npm run preflight
npm run test:smoke
```

## Functions validation

Ancient Signals added Firebase Functions modules, so validate Functions separately:

```bash
cd functions
npm ci
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

## LifeMap validation

- [ ] HomeScene opens LifeMap via the sky trigger
- [ ] HomeScene opens LifeMap via the visible `Open Life Map` button
- [ ] Reduced-motion users skip the animated transition
- [ ] `Return home` exits LifeMap scene state
- [ ] Home page content remains clickable above the invisible sky trigger

## Launch readiness checklist

- [ ] `npm run check:lockfile` passes
- [ ] Primary CI workflow passes
- [ ] `npm run preflight` passes
- [ ] `npm run test:smoke` passes
- [ ] `/` checked on mobile and desktop
- [ ] `/u/adamclamp` checked on mobile and desktop
- [ ] Waitlist dry-run checked locally
- [ ] Waitlist Firestore write checked in configured environment
- [ ] Ancient Signals demo and persisted snapshot paths checked
- [ ] LifeMap transition checked on mobile and desktop
- [ ] Firestore rules/indexes/functions deployed
- [ ] `NEXT_PUBLIC_SITE_URL` set for deployment
