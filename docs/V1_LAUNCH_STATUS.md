# URAI V1 Launch Status

## Current status

URAI V1 is a public demo spine, not live in V1 as a passive sensing, diagnostic, or production clinical product.

## Launch commands

```bash
npm install
npm run check:lockfile
npm run preflight
npm run test:smoke
npm run launch:p0
```

## Deploy commands

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
- [ ] User-facing copy avoids diagnosis, lie-detection, and unsupported scent claims; this is a safety boundary for a non-diagnostic V1 public demo.

## Launch readiness checklist

- [ ] `npm run check:lockfile` passes
- [ ] `npm run preflight` passes
- [ ] `npm run test:smoke` passes
- [ ] `/` checked on mobile and desktop
- [ ] `/u/adamclamp` checked on mobile and desktop
