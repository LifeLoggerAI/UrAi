# WebXR Foundation Status — 2026-06-28

## Scope

Repository: `LifeLoggerAI/UrAi`

This evidence note covers the Genesis Home/XR WebXR foundation pass. It does not claim universal VR, AR, Quest, or headset production readiness.

## Implemented foundation

- `/xr` exists as a real route with a Home 3D preview and WebXR capability panel.
- `/home` keeps the normal Genesis Home experience and exposes a support-gated WebXR affordance.
- `/` links to the XR gate without claiming full XR support.
- WebXR entry is progressive enhancement only.
- `Enter VR` is hidden unless the browser reports `immersive-vr` support and a real Three.js WebGL renderer exists.
- Unsupported browsers keep truthful fallback copy.
- No DOM-only fake VR interaction was added.

## Current code gates

- `src/components/xr/XRSessionFoundation.tsx`
  - checks WebGL support
  - checks secure context
  - checks `navigator.xr`
  - checks `immersive-vr`
  - checks `immersive-ar`
  - enables `gl.xr.enabled`
  - requests a real `immersive-vr` session only from the browser WebXR API
- `src/app/xr/page.tsx`
  - renders the capability panel
  - renders the 3D preview
  - renders `Enter VR` only through the support-gated component
- `src/components/urai/home/NewHomeScene.tsx`
  - preserves the current Home threshold UI
  - adds a safe XR route link and support-gated Home XR card
- `tests/e2e/home-xr-interaction.spec.ts`
  - verifies `/home` desktop canvas and fallback copy
  - verifies mobile-safe `/home` layout
  - verifies no fake `Enter VR` when unsupported
  - verifies mocked support can expose the real affordance

## Deployment configuration

Firebase deployment is configured through `.github/workflows/deploy-home-xr.yml`.

The workflow is intentionally manual-only and requires:

- `live_url`
- `firebase_project`
- `FIREBASE_TOKEN` repository secret

The workflow runs pre-deploy checks, Playwright smoke, Firebase Hosting deploy, live URL smoke, and artifact upload.

## Verification commands

Run in the Genesis repo root:

```bash
npm install
npm run check:types
npm run lint
npm run build
npm run verify:routes
npm run verify:assets
npm run check:public-copy
npm run check:production-claims
npm run smoke:genesis-spine
node scripts/check-home-xr-lock.mjs
node scripts/check-home-xr-proof-manifest.mjs
node scripts/check-home-xr-live-deploy-proof.mjs
node scripts/check-home-xr-deploy-workflow.mjs
npx playwright install --with-deps chromium
npx playwright test tests/e2e/home-xr-interaction.spec.ts --project=chromium --project=mobile-chrome
```

## Live status

Current status: **WEBXR FOUNDATION READY WITH WARNINGS**

Reason for warning: repository code and deployment workflow are present, but this note does not include a completed live deployment artifact, live route HTTP proof, deployed screenshots, or physical Quest hardware validation.

Do not use these labels yet:

- `HOME QUEST/XR LIVE-SMOKE-PASSED`
- `HOME QUEST/XR LIVE-QUEST-VERIFIED`
- `Quest ready`
- `full VR ready`
- `full XR live`

Allowed current label:

- `HOME QUEST/XR DEPLOY-CONFIGURED`

## Required proof before live claim

Update `launch-proof/home-quest-interaction/HOME_XR_LIVE_DEPLOY_VERIFICATION.md` only after collecting:

- live URL
- deployed commit SHA
- deployment run URL or command output
- HTTP 200 proof for `/`, `/home`, `/xr`, and `/life-map`
- desktop screenshot proof
- mobile screenshot proof
- unsupported-browser fallback proof
- real Quest Browser support check
- real WebXR session start proof on supported hardware
