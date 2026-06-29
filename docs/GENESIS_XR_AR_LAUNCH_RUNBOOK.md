# Genesis XR/AR Launch Runbook

Date: 2026-06-28
Owner: Adam Clamp / LifeLoggerAI
Status: implementation and gates added; live production closure is evidence-required

## Purpose

This runbook is the single operational checklist for taking the Genesis `/xr` route from implemented repo state to live verified production state.

Do **not** claim "live", "deployed", "working", "done done", "AR ready", "Quest ready", universal AR, or iOS Quick Look until the evidence requirements below are satisfied.

## Current implemented scope

- `/xr` keeps the public Home 3D scene intact.
- VR entry remains browser-gated through real WebXR capability detection.
- AR preview uses a real public glTF model asset at `/assets/ar/urai-genesis-orb.gltf`.
- AR entry is delegated to supported browser/device paths through `model-viewer` using `webxr scene-viewer`.
- iOS Quick Look is intentionally gated because no verified `.usdz` asset exists yet.
- Desktop and unsupported mobile devices remain truthful 3D preview/fallback experiences.

## Key files

- `src/app/xr/page.tsx`
- `src/components/xr/XRSessionFoundation.tsx`
- `src/components/xr/ARModelViewerPreview.tsx`
- `public/assets/ar/urai-genesis-orb.gltf`
- `scripts/check-ar-preview.mjs`
- `scripts/verify-assets.mjs`
- `scripts/check-production-claims.mjs`
- `scripts/deployment-evidence-check.mjs`
- `tests/e2e/genesis-xr-ar-production-smoke.spec.ts`
- `.github/workflows/deploy.yml`
- `.github/workflows/production-evidence.yml`
- `docs/URAI_GENESIS_AR_AUDIT.md`
- `docs/URAI_POST_MERGE_DEPLOYMENT_EVIDENCE.md`

## Local/repo validation commands

Run these before deployment:

```bash
npm install
npm run check:ar-preview
npm run verify:routes
npm run verify:assets
npm run check:public-copy
npm run check:production-claims
npm run check:types
npm run lint
npm run test:unit
npm run build
```

Preferred full gate:

```bash
npm run preflight
```

Production smoke against a deployed URL:

```bash
PLAYWRIGHT_BASE_URL=https://urai-4dc1d.web.app npm run test:smoke:production
```

## Deployment workflow path

Expected primary workflow:

```text
.github/workflows/deploy.yml
```

The workflow must:

1. install dependencies,
2. run AR preview verification,
3. run route and asset verification,
4. run public-copy and production-claim checks,
5. build,
6. deploy Firebase Hosting live,
7. check live `/`, `/home`, `/xr`, `/assets/ar/urai-genesis-orb.gltf`, `/u/adamclamp`, and `/api/status`.

Expected evidence workflow:

```text
.github/workflows/production-evidence.yml
```

The workflow must:

1. check live routes,
2. run production smoke tests,
3. capture screenshots/artifacts,
4. upload `production-evidence-results`.

## Required live evidence

Attach evidence to issue `#300` before final closure.

| Evidence | Required proof |
| --- | --- |
| Deploy run | Passing workflow URL for Firebase deploy or equivalent deploy output. |
| Evidence run | Passing Production Evidence workflow URL. |
| `/xr` route | HTTP 200 and screenshot from deployed URL. |
| AR model asset | HTTP 200 for `/assets/ar/urai-genesis-orb.gltf`; parsed as glTF 2.0. |
| Browser smoke | Passing `npm run test:smoke:production` against deployed URL. |
| Screenshot artifact | `test-results/production-evidence/desktop-xr-ar-preview.png`. |
| Desktop fallback | Desktop screenshot showing no broken AR button and truthful model preview. |
| Android/WebXR/Scene Viewer | Physical-device success proof, or explicit unsupported fallback proof. |
| iOS Quick Look | Must remain gated until verified `.usdz` asset exists. |
| Rollback | Rollback SHA and rollback command recorded. |

## Closure decision matrix

| Condition | Release decision |
| --- | --- |
| Repo checks pass, but no deployment evidence | Implementation complete; not live-verified. |
| Deployment succeeds, but no `/xr`/AR smoke artifact | Deployment incomplete for Genesis XR/AR. |
| `/xr` loads, asset loads, desktop smoke passes, no mobile proof | Web/desktop fallback verified; mobile AR still evidence-required. |
| Android AR launch succeeds or unsupported fallback is proven, all workflows green | Minimal supported-device AR preview can be called live-working with support caveats. |
| `.usdz` is absent | iOS Quick Look remains gated. |

## Safe public language after successful evidence

Allowed:

```text
Genesis includes a minimal AR preview on supported Android/WebXR/Scene Viewer paths, with desktop and unsupported devices falling back to a normal 3D model preview.
```

Not allowed until future proof exists:

```text
Universal AR is live.
AR is ready everywhere.
Quest ready.
iOS Quick Look is supported.
Full production AR is complete.
```

## Rollback notes

If deploy or smoke fails after these changes:

1. keep issue `#300` open,
2. attach the failed run URL and artifact,
3. revert the failing commit or disable the AR section behind copy-only fallback,
4. rerun deploy/evidence workflows,
5. do not claim live completion until a passing run is attached.

## Final closure statement template

Use this only after every evidence item is attached:

```text
Genesis `/xr` is live-verified for 3D preview, WebXR VR gating, and minimal supported-device AR preview. Deployment workflow passed, production evidence workflow passed, `/xr` and `/assets/ar/urai-genesis-orb.gltf` returned HTTP 200, browser smoke produced `desktop-xr-ar-preview.png`, and Android/WebXR/Scene Viewer behavior was proven or unsupported fallback was documented. iOS Quick Look remains gated until a verified USDZ asset is added.
```
