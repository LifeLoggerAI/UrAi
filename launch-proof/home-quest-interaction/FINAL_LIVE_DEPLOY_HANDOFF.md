# Final Home XR Live Deploy Handoff

Issue tracker: #348 — Launch verification: Home WebXR deploy and live Quest proof

Current status: `WEBXR FOUNDATION READY WITH WARNINGS`

Allowed current launch label: `HOME QUEST/XR DEPLOY-CONFIGURED`

Do not claim `live deployed working`, `Quest ready`, `full VR ready`, or `full XR live` until the evidence below is attached to issue #348 and/or linked from `HOME_XR_LIVE_DEPLOY_VERIFICATION.md`.

## Repository-side completion checklist

- [x] Native WebXR foundation implemented without fake headset support
- [x] `/xr` route present
- [x] `/home` wired with support-gated WebXR affordance
- [x] `/` links to XR gate without full-XR claims
- [x] Unit tests for unsupported and supported WebXR affordance
- [x] Playwright Home XR smoke coverage
- [x] Release evidence note committed
- [x] Live deploy proof doc exists and blocks premature claims
- [x] Manual Firebase deploy workflow exists
- [x] Non-deploying WebXR audit workflow exists
- [x] Launch verification issue created

## One-shot local verification commands

Run from a clean `LifeLoggerAI/UrAi` checkout:

```bash
npm install
node scripts/check-webxr-foundation-release-readiness.mjs
npm run check:types
npm run lint
npm test -- --runInBand src/components/xr/__tests__/XRSessionFoundation.test.tsx
npm run build
npm run verify:routes
npm run verify:assets
npm run check:public-copy
npm run check:production-claims
node scripts/check-home-xr-lock.mjs
node scripts/check-home-xr-proof-manifest.mjs
node scripts/check-home-xr-live-deploy-proof.mjs
node scripts/check-home-xr-deploy-workflow.mjs
npm run smoke:genesis-spine
npx playwright install --with-deps chromium
npx playwright test tests/e2e/home-xr-interaction.spec.ts --project=chromium --project=mobile-chrome
```

## GitHub Actions audit

Run workflow:

```text
WebXR Foundation Audit
```

Required result:

- all jobs green
- logs show repository readiness verifier passed
- logs show typecheck/lint/build passed
- logs show route/assets/copy/claims gates passed
- logs show Home XR proof gates passed
- logs show Playwright Home XR smoke passed

Record in issue #348:

- audit workflow run URL
- commit SHA audited
- any artifact URLs

## GitHub Actions deploy

Run workflow:

```text
Deploy Home XR Firebase Hosting
```

Inputs:

```text
live_url: https://urai-4dc1d.web.app
firebase_project: urai-4dc1d
```

Required secret:

```text
FIREBASE_TOKEN
```

Required result:

- verification gates pass before deploy
- Firebase Hosting deploy completes
- deployed Home XR live smoke passes
- proof artifact named `home-xr-deploy-proof` uploads

Record in issue #348 and `HOME_XR_LIVE_DEPLOY_VERIFICATION.md`:

- deployment workflow run URL
- artifact ID / artifact URL
- deployed commit SHA
- live URL
- deploy summary text

## Live HTTP/browser proof

Required deployed routes:

- [ ] `/` HTTP 200
- [ ] `/home` HTTP 200
- [ ] `/xr` HTTP 200
- [ ] `/life-map` HTTP 200

Required screenshots/artifacts:

- [ ] deployed desktop `/home`
- [ ] deployed mobile `/home`
- [ ] deployed unsupported-browser WebXR fallback
- [ ] deployed `/xr` capability panel

Only after these are attached may status move to:

```text
HOME QUEST/XR LIVE-SMOKE-PASSED
```

## Quest proof

Required physical Quest checks:

- [ ] Quest Browser can reach deployed `/home`
- [ ] `Enter VR` appears only when Quest Browser reports `immersive-vr` support
- [ ] real WebXR session starts from the deployed URL
- [ ] controller ray/laser appears
- [ ] target hover works
- [ ] trigger selection works
- [ ] grip/back clear behavior works
- [ ] controller-unavailable fallback works

Only after these are attached may status move to:

```text
HOME QUEST/XR LIVE-QUEST-VERIFIED
```

## Final claim lock

Before announcing live production readiness, verify:

```bash
node scripts/check-webxr-foundation-release-readiness.mjs
node scripts/check-home-xr-live-deploy-proof.mjs
npm run check:public-copy
npm run check:production-claims
```

If any required evidence is missing, keep the status at `WEBXR FOUNDATION READY WITH WARNINGS`.
