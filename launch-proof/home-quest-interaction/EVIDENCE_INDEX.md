# Home Quest/XR Evidence Index

This index is the audit map for the `/home` Quest/WebXR foundation. It separates implemented repository proof from live runtime proof so status cannot be overstated.

## Current status

`HOME QUEST/XR PROOF-WIRED + MANIFEST-LOCKED + DEPLOYMENT-PATH-AUDITED`

This does not equal live verified Quest support. Promotion requires successful workflow/deploy/runtime evidence.

## Implementation evidence

- `src/components/urai/home/HomeWorldCanvas.tsx`
- `src/components/urai/home/HomeXRInteractionLayer.tsx`
- `src/components/urai/home/HomeXRTargets.ts`
- `src/components/xr/XRSessionFoundation.tsx`

Evidence standard:

- existing Home visuals preserved
- native WebXR controllers registered
- controller raycasting wired
- trigger and grip/back events wired
- unsupported browsers remain truthfully gated

## Automated verification evidence

- `scripts/check-home-xr-lock.mjs`
- `scripts/check-home-xr-proof-manifest.mjs`
- `scripts/check-home-xr-live-deploy-proof.mjs`
- `scripts/check-home-xr-deploy-workflow.mjs`
- `scripts/check-home-xr-evidence-index.mjs`
- `scripts/check-home-xr-completion-summary.mjs`
- `scripts/check-home-xr-proof-chain.mjs`
- `scripts/check-production-claims.mjs`
- `tests/unit/home-xr-interaction-layer.test.ts`
- `tests/e2e/home-xr-interaction.spec.ts`

Evidence standard:

- static lock passes
- manifest verifier passes
- live deploy proof gate passes
- deploy workflow verifier passes
- evidence index verifier passes
- completion summary verifier passes
- local proof-chain runner passes
- production claim checker passes
- Playwright smoke passes

## CI and workflow evidence

- `.github/workflows/ci.yml`
- `.github/workflows/audit-home-xr-deploy-workflow.yml`
- `.github/workflows/audit-home-xr-evidence-index.yml`
- `.github/workflows/audit-home-xr-proof-chain.yml`
- `.github/workflows/deploy-home-xr.yml`

Evidence standard:

- CI workflow completes successfully
- deploy workflow audit completes successfully
- evidence index audit completes successfully
- proof-chain audit completes successfully
- manual deploy workflow completes successfully before any live/deployed claim

## Deployment evidence

- `firebase.json`
- `.firebaserc`
- `scripts/smoke-home-xr-live-url.mjs`
- `launch-proof/home-quest-interaction/HOME_XR_LIVE_DEPLOY_VERIFICATION.md`
- `launch-proof/home-quest-interaction/DEPLOY_WORKFLOW_RUNBOOK.md`
- `launch-proof/home-quest-interaction/RUNTIME_EXECUTION_RECORD_TEMPLATE.md`

Evidence standard:

- Firebase Hosting config remains pointed at the documented production project/site
- deploy workflow run URL is recorded
- deployed commit SHA is recorded
- live URL smoke passes for `/`, `/home`, `/xr`, and `/life-map`
- deploy proof artifact is uploaded
- runtime execution record is completed after actual deployment/device validation

## Artifact evidence

Expected artifact names:

- `xr-playwright-output`
- `home-xr-deploy-proof`

Expected screenshot/proof paths:

- `home-xr-proof/home-desktop.png`
- `home-xr-proof/home-mobile.png`
- `home-xr-proof/home-xr-affordance-mocked.png`
- `home-xr-deploy-proof/deploy-summary.txt`

Evidence standard:

- screenshots exist in workflow artifacts
- deployment summary records commit, live URL, Firebase project, workflow URL, and status

## Manual Quest evidence

- `launch-proof/home-quest-interaction/QUEST_MANUAL_VALIDATION_CHECKLIST.md`
- `launch-proof/home-quest-interaction/HOME_XR_VERIFICATION_SIGNOFF_TEMPLATE.md`
- `launch-proof/home-quest-interaction/RUNTIME_EXECUTION_RECORD_TEMPLATE.md`

Evidence standard:

- real Quest Browser or equivalent WebXR immersive-vr capable browser is used
- `Enter VR` appears only when immersive-vr is supported
- VR session starts through browser WebXR API
- controller ray/laser appears
- hover, trigger, and grip/back behaviors pass
- no-controller fallback is validated
- runtime execution record captures final device validation decision

## Promotion rules

Allowed status progression:

1. `HOME QUEST/XR IMPLEMENTED`
2. `HOME QUEST/XR PROOF-WIRED`
3. `HOME QUEST/XR CI-GREEN`
4. `HOME QUEST/XR LIVE-SMOKE-PASSED`
5. `HOME QUEST/XR LIVE-QUEST-VERIFIED`

Blocked until full evidence exists:

- `DONE DONE`
- `Quest ready`
- `VR ready`
- `production XR`
- `full Quest support`
- `live verified working deployed`

## Current unresolved evidence gaps

These must be filled by actual runtime execution, not by repository edits:

- CI run result
- deploy workflow run result
- live deployed URL smoke result
- screenshot artifacts
- real Quest hardware validation
- completed signoff template
- completed runtime execution record

Until those are present, the correct claim is repository proof-wired and deployment-path-audited, not live verified.
