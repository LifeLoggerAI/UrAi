# URAI Spatial Completion Plan

Status: V1 hardening plan.

## Priority 1: Make launch checks trustworthy

1. Replace `scripts/check-public-copy.mjs` encoded patterns with readable regex literals.
2. Include Spatial public routes, V1 docs, page metadata, public copy constants, and accessibility text in the scan.
3. Add fixture coverage proving risky ungated claims fail and properly gated claims pass.
4. Run `npm run check:public-copy` in `preflight`, `ci`, and `release:p1`.

## Priority 2: Lock Spatial V1 gates

1. Define public demo, private beta, and production-live modes.
2. Ensure `/api/spatial/health` reports current mode, enabled providers, disabled providers, blockers, and next checks.
3. Ensure XR, room semantics, sensing, location, private asset pipeline, export, marketplace, and enterprise/admin surfaces stay disabled unless flags plus server checks pass; these are not live in V1.
4. Keep public copy aligned with staged capability status.

## Priority 3: Secure auth, consent, and data boundaries

1. Replace production header-only uid/tenant trust with verified Firebase Auth or server session identity.
2. Owner-scope spatialScenes, xrAnchors, roomSemantics, dreamPlanetariumScenes, spatialConsentZones, spatialAssetLinks, memoryBlooms, timelineEvents, moodForecasts, companionMessages, narratorInsights, rituals, relationshipSignals, passiveSignals, symbolicStates, and related user-owned collections.
3. Add consent persistence for any sensitive spatial feature.
4. Add delete/export hooks or keep them explicitly blocked behind launch gates.
5. Add emulator tests proving unauthorized access is denied.

## Priority 4: Complete the magical home/spatial shell

1. Ground layer.
2. Orb.
3. Sky/moonlit atmosphere.
4. Portal transition.
5. Companion/chat overlay.
6. Memory/spatial preview layers.
7. Loading, empty, error, offline, XR-disabled, XR-unsupported, auth-missing, and feature-disabled states.
8. Reduced-motion dissolve path.
9. Mobile LoD budgets and safe-area layout.
10. Keyboard and screen-reader accessible summaries.

## Priority 5: Stabilize spatial engine behavior

1. Use deterministic state-machine transitions for home to Life Map to focus to replay.
2. Avoid frame-rate dependent interpolation.
3. Add adaptive render quality and pause render loops when hidden.
4. Lazy-load heavy Three/WebGL assets.
5. Add missing asset timeouts and fallback manifests.
6. Gate WebXR behind runtime support and explicit consent.

## Priority 6: Final verification

Run:

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

Then smoke-test:

- `/spatial`
- `/spatial/demo`
- `/spatial/settings`
- `/spatial/assets`
- `/api/spatial/health`
- `/api/spatial/scenes`
- `/api/spatial/consent`

## Release decision

Ship as `public-demo-ready` when V1 checks pass and staged features are visibly gated.

Ship as `private-beta-ready` only when gated providers pass server-side and smoke-test checks.

Ship as `production-live-ready` only after Firebase, Firestore rules, deploy targets, XR/device validation, private asset pipeline, consent, export/delete, and public-copy evidence all pass.
