# Genesis XR AR Proof Index

Date: 2026-06-28
Repository: `LifeLoggerAI/UrAi`
Branch: `main`
Status: repo implementation and verification gates added; live deployment proof still required.

## Access confirmed

The GitHub connector confirmed admin and push access to `LifeLoggerAI/UrAi` on the default branch `main` during this completion pass.

## Implemented runtime surface

- Route: `/xr`
- Page: `src/app/xr/page.tsx`
- WebXR foundation: `src/components/xr/XRSessionFoundation.tsx`
- AR model preview: `src/components/xr/ARModelViewerPreview.tsx`
- Public AR model asset: `public/assets/ar/urai-genesis-orb.gltf`

## Verification scripts

- `scripts/check-ar-preview.mjs`
- `scripts/check-genesis-ar-asset.mjs`
- `scripts/check-genesis-xr-ar-live-url.mjs`
- `scripts/check-genesis-xr-ar-evidence-checklist.mjs`
- `scripts/launch-genesis-xr-ar-gate.mjs`
- `scripts/launch-genesis-xr-ar-full-gate.mjs`
- `scripts/launch-genesis-xr-ar-complete-gate.mjs`

## Existing shared gates touched or verified

- `scripts/verify-routes.mjs` includes `/xr`.
- `scripts/verify-assets.mjs` includes `public/assets/ar/urai-genesis-orb.gltf` as a critical asset.
- `scripts/deployment-evidence-check.mjs` requires Genesis XR AR evidence.
- `scripts/check-production-claims.mjs` keeps XR AR claims proof-qualified.

## Automated smoke and deploy coverage

- `tests/e2e/genesis-xr-ar-production-smoke.spec.ts`
- `npm run test:smoke:production` includes Genesis XR AR smoke coverage.
- `.github/workflows/deploy.yml` runs AR preview gates before deploy and checks live `/xr` plus the AR asset after deploy.
- `.github/workflows/production-evidence.yml` checks `/xr`, the AR asset, and production smoke evidence.

## Documentation and evidence files

- `docs/URAI_GENESIS_AR_AUDIT.md`
- `docs/GENESIS_XR_AR_LAUNCH_RUNBOOK.md`
- `docs/GENESIS_XR_AR_EVIDENCE_CHECKLIST.md`
- `docs/URAI_POST_MERGE_DEPLOYMENT_EVIDENCE.md`

## Issue tracker

- Issue `#300`: production evidence tracker.
- Required labels added: `xr`, `ar`, `production-evidence`.
- Closure remains blocked until live deploy, workflow, screenshot, and device or fallback evidence are attached.

## Commands for local or CI operators

```bash
node scripts/check-genesis-ar-asset.mjs
node scripts/check-genesis-xr-ar-evidence-checklist.mjs
node scripts/launch-genesis-xr-ar-complete-gate.mjs
npm run check:ar-preview
npm run test:smoke:production
```

For deployed production URL verification:

```bash
URAI_LIVE_BASE_URL=https://urai-4dc1d.web.app node scripts/check-genesis-xr-ar-live-url.mjs
```

## Completion boundary

Repo-side completion is substantially hardened. Final production closure still requires evidence outside static repo edits:

- passing deploy workflow run URL,
- passing production evidence workflow run URL,
- uploaded production evidence artifacts,
- deployed `/xr` HTTP proof,
- deployed AR asset HTTP proof,
- `desktop-xr-ar-preview.png`,
- physical Android/WebXR/Scene Viewer proof or explicit unsupported fallback proof,
- iOS Quick Look remaining gated until a verified USDZ asset exists.

Do not claim Genesis XR AR is fully live-production complete until those proof items are attached to issue `#300`.
