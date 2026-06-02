# URAI Spatial File Checklist

## Repo and launch scripts

| File or area | Required state | Status |
|---|---|---|
| `package.json` | Includes V1, public-copy, Firestore, type, lint, test, build, and release gates | Present; run before launch |
| `scripts/check-public-copy.mjs` | Readable regex literals; scans Spatial routes, metadata, constants, and accessibility text | Needs patch |
| `scripts/check-firestore-contract.mjs` | Confirms declared collections have safe rules | Verify and extend for Spatial collections |
| `scripts/p0-launch-gate.mjs` | Blocks unsafe P0 launch | Verify includes Spatial gates |
| `scripts/p1-release-gate.mjs` | Blocks unsafe P1 release | Verify includes Spatial gates |

## Spatial routes and APIs

| File or area | Required state | Status |
|---|---|---|
| `src/app/spatial` | Public demo shell with safe staged copy | Inspect before launch |
| `/spatial/demo` | Demo-only route with synthetic/fallback data | Inspect before launch |
| `/spatial/settings` | Consent/settings route, no unsupported claims | Inspect before launch |
| `/spatial/assets` | Gated asset surface, no live export claim unless verified | Inspect before launch |
| `/api/spatial/health` | Truthful readiness, blockers, flags, provider status | Required |
| `/api/spatial/scenes` | Verified auth or demo-only mode; owner scoped | Required before live persistence |
| `/api/spatial/consent` | Verified auth, owner-scoped consent persistence | Required before sensitive features |

## Spatial engine files

| File or area | Required state | Status |
|---|---|---|
| `spatial-life-map` components | Use canon/contracts; avoid parallel logic | Inspect |
| `GalaxyCameraController` | Deterministic transitions; reduced motion path | Inspect |
| `cinematic-controller.ts` | Frame-rate safe interpolation and state machine | Inspect |
| `src/lib/urai-canon` | Single source of truth for V1 gates and copy boundaries | Inspect/consolidate |

## Firebase and storage

| File or area | Required state | Status |
|---|---|---|
| `firestore.rules` | Owner/admin-scoped rules for sensitive collections | Verify |
| `firebase.json` | Correct hosting, rules, functions, emulator config | Verify |
| Storage rules | Private assets and exports owner-scoped; catch-all deny | Verify |
| Firestore indexes | Required indexes for Spatial scene/consent/readiness queries | Verify |

## V1 docs

| File | Required state | Status |
|---|---|---|
| `docs/URAI_SPATIAL_LAUNCH_AUDIT.md` | Current launch audit | Added |
| `docs/URAI_SPATIAL_COMPLETION_PLAN.md` | Ordered completion plan | Added |
| `docs/URAI_SPATIAL_FILE_CHECKLIST.md` | File-by-file checklist | Added |
| `docs/URAI_SPATIAL_V1_DEFINITION_OF_DONE.md` | Final V1 acceptance criteria | Added |
| `docs/URAI_SPATIAL_READINESS_MATRIX.md` | Capability readiness matrix | Added |
| `docs/URAI_SPATIAL_PR_SUMMARY.md` | Review summary and remaining work | Added separately |

## Launch command checklist

Run and record:

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
