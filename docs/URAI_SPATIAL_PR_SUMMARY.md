# URAI Spatial PR Summary

## Summary

This change adds launch-owner documentation for URAI Spatial V1 and defines the boundary between public-demo readiness, private-beta readiness, and production-live readiness.

## Files added

- `docs/URAI_SPATIAL_LAUNCH_AUDIT.md`
- `docs/URAI_SPATIAL_COMPLETION_PLAN.md`
- `docs/URAI_SPATIAL_FILE_CHECKLIST.md`
- `docs/URAI_SPATIAL_V1_DEFINITION_OF_DONE.md`
- `docs/URAI_SPATIAL_READINESS_MATRIX.md`
- `docs/URAI_SPATIAL_PR_SUMMARY.md`

## What this locks

- URAI Spatial V1 must ship as a truthful public demo unless live-provider proof exists.
- Ground, orb, sky, portal, companion/chat, and memory/spatial previews are V1 requirements.
- XR, passive sensing, location/audio/device capture, biometrics/wearables, private asset pipeline/export, marketplace, enterprise/admin, and clinical claims are not live in V1.
- `/api/spatial/health` must report readiness and blockers honestly.
- Public copy must remain gated and safe.

## Known remaining code work

- Patch `scripts/check-public-copy.mjs` to use readable regex literals instead of encoded regex construction.
- Include Spatial public routes and accessibility text in public-copy scanning.
- Add tests or fixtures for risky claim detection.
- Verify `/spatial` and `/api/spatial/health` smoke tests.
- Verify Firestore rules and indexes cover Spatial collections.
- Run the full launch command set before release.

## Commands required before merge/release

```bash
npm install
npm run check:v1
npm run check:firestore-contract
npm run check:public-copy
npm run check:types
npm run lint
npm run test:unit
npm run test:rules
npm run build
npm run release:p1
```

## Launch decision

Current state should be treated as `staged-public-demo-pending-verification`, not `production-live-ready`.
