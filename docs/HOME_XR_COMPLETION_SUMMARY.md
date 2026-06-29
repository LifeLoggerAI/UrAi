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
- `scripts/check-home-xr-completion-summary.mjs`
- `scripts/check-home-xr-proof-chain.mjs`
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
- `launch-proof/home-quest-interaction/PROOF_CHAIN_COMMAND.md`
- `launch-proof/home-quest-interaction/QUEST_MANUAL_VALIDATION_CHECKLIST.md`
- `launch-proof/home-quest-interaction/VALIDATION_RUNBOOK.md`
- `launch-proof/home-quest-interaction/home-xr-proof-manifest.json`

## One-command repository proof chain

Run this command for the local repository proof chain:

```bash
node scripts/check-home-xr-proof-chain.mjs
```

This validates the repository proof path only. It does not replace runtime deployment, live smoke, artifact review, or headset validation.

## Promotion path

1. Run the one-command repository proof chain.
2. Run the normal CI workflow.
3. Run the Home XR proof-chain audit workflow.
4. Run the manual Firebase Hosting deploy workflow.
5. Confirm the deploy proof artifact exists.
6. Run or review the live URL smoke result.
7. Complete real Quest/browser validation.
8. Complete the signoff template.

## Claim boundary

Use repository completion language until runtime proof exists. Use live verification language only after deploy, live smoke, artifacts, and device validation are complete.
