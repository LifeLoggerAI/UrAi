# Home XR Completion Summary

This summary gathers the Home Quest/XR repository proof path in one place.

## Current repository status

The `/home` XR path is implemented and proof-wired in the repository. The deployment path is also defined and audited. The remaining promotion to live verification depends on runtime evidence from GitHub Actions/Firebase Hosting and real headset validation.

## Implementation files

- `src/components/urai/home/HomeWorldCanvas.tsx`
- `src/components/urai/home/HomeXRInteractionLayer.tsx`
- `src/components/urai/home/HomeXRTargets.ts`
- `src/components/xr/XRSessionFoundation.tsx`

## Verification files

- `scripts/check-home-xr-lock.mjs`
- `scripts/check-home-xr-proof-manifest.mjs`
- `scripts/check-home-xr-live-deploy-proof.mjs`
- `scripts/check-home-xr-deploy-workflow.mjs`
- `scripts/check-home-xr-evidence-index.mjs`
- `scripts/smoke-home-xr-live-url.mjs`
- `tests/unit/home-xr-interaction-layer.test.ts`
- `tests/e2e/home-xr-interaction.spec.ts`

## Workflows

- `.github/workflows/ci.yml`
- `.github/workflows/audit-home-xr-deploy-workflow.yml`
- `.github/workflows/audit-home-xr-evidence-index.yml`
- `.github/workflows/audit-home-xr-proof-chain.yml`
- `.github/workflows/deploy-home-xr.yml`

## Proof documents

- `launch-proof/home-quest-interaction/EVIDENCE_INDEX.md`
- `launch-proof/home-quest-interaction/DEPLOY_WORKFLOW_RUNBOOK.md`
- `launch-proof/home-quest-interaction/HOME_XR_LIVE_DEPLOY_VERIFICATION.md`
- `launch-proof/home-quest-interaction/HOME_XR_VERIFICATION_SIGNOFF_TEMPLATE.md`
- `launch-proof/home-quest-interaction/OPERATOR_NEXT_STEP.md`
- `launch-proof/home-quest-interaction/QUEST_MANUAL_VALIDATION_CHECKLIST.md`
- `launch-proof/home-quest-interaction/VALIDATION_RUNBOOK.md`
- `launch-proof/home-quest-interaction/home-xr-proof-manifest.json`

## Promotion path

1. Run the normal CI workflow.
2. Run the Home XR proof-chain audit workflow.
3. Run the manual Firebase Hosting deploy workflow.
4. Confirm the deploy proof artifact exists.
5. Run or review the live URL smoke result.
6. Complete real Quest/browser validation.
7. Complete the signoff template.

## Claim boundary

Use repository completion language until runtime proof exists. Use live verification language only after deploy, live smoke, artifacts, and device validation are complete.
