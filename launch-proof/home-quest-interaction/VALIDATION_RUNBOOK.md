# Home Quest/XR Validation Runbook

This runbook turns the `/home` Quest/WebXR work into repeatable proof. Do not mark `/home` Quest/XR as verified unless the relevant command, artifact, and device checks below are complete.

## Local command gate

Run from repo root:

```bash
npm install
npm run check:types
npm run lint
npm test
npm run build
npm run verify:routes
npm run verify:assets
npm run check:public-copy
npm run check:production-claims
node scripts/check-home-xr-lock.mjs
npm run smoke:genesis-spine
npx playwright install --with-deps chromium
npx playwright test tests/e2e/home-xr-interaction.spec.ts --project=chromium --project=mobile-chrome
```

Expected result: every command exits `0`.

## CI gate

The CI workflow must complete both jobs successfully:

- `V1 app unit/build gate`
- `Home and Life Map XR Playwright smoke`

The app gate must include:

- typecheck
- lint
- unit/rules tests
- build
- route verification
- asset verification
- public copy check
- production claims check
- Home XR static lock
- genesis spine smoke

The smoke gate must include:

- Chromium install
- production build
- Home XR Playwright smoke
- Life Map XR Playwright smoke
- artifact upload

## Artifact gate

The Playwright artifact should include `/tmp/urai-playwright-results`.

Required Home XR screenshots:

- `home-xr-proof/home-desktop.png`
- `home-xr-proof/home-mobile.png`
- `home-xr-proof/home-xr-affordance-mocked.png`

A missing screenshot means the proof is incomplete, even if the app looks correct manually.

## Quest hardware gate

Use `QUEST_MANUAL_VALIDATION_CHECKLIST.md` for the device pass. The key pass/fail checks are:

- unsupported browsers do not show a fake headset button
- supported Quest Browser shows `Enter VR`
- session prompt appears and can be accepted
- VR session starts through the browser WebXR API
- controller ray/laser is visible
- hover state changes on each target
- trigger selects each route target
- grip/back clears or closes selection state
- no-controller fallback appears when controllers are unavailable during a VR session

## Allowed final labels

Use these exact labels in launch notes:

- `HOME QUEST/XR IMPLEMENTED` — code exists, but checks are not run.
- `HOME QUEST/XR PROOF-WIRED` — static lock, smoke tests, screenshots, and CI wiring exist.
- `HOME QUEST/XR CI-GREEN` — CI/local checks and Playwright artifacts pass.
- `HOME QUEST/XR VERIFIED` — CI/local proof plus real Quest hardware checklist are complete.

Do not use `DONE DONE`, `Quest ready`, `VR ready`, or `production XR` unless the status is at least `HOME QUEST/XR VERIFIED` and the claim is surrounded by the proof link/checklist.

## Failure recording

For every failure, record:

- command or checklist step
- commit SHA
- device/browser
- exact error text
- screenshot/video if available
- whether the failure blocks desktop/mobile fallback
- whether the failure blocks Quest/WebXR support only

## Current known limitation

This repository has WebXR progressive enhancement. It must remain truthful on unsupported browsers and devices. Hiding unsupported headset entry is correct behavior, not a failure.
