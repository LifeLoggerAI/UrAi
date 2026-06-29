# Genesis XR AR Evidence Checklist

Status: evidence required before live closure.

## Implemented surfaces

- `/xr`
- `/assets/ar/urai-genesis-orb.gltf`

## Required repository checks

- `scripts/check-ar-preview.mjs`
- `scripts/check-genesis-xr-ar-live-url.mjs`
- `scripts/launch-genesis-xr-ar-gate.mjs`
- `tests/e2e/genesis-xr-ar-production-smoke.spec.ts`

## Required documentation

- `docs/URAI_GENESIS_AR_AUDIT.md`
- `docs/GENESIS_XR_AR_LAUNCH_RUNBOOK.md`
- `docs/URAI_POST_MERGE_DEPLOYMENT_EVIDENCE.md`

## Required evidence before closure

- Passing production deploy workflow run URL is attached to issue 300.
- Passing production evidence workflow run URL is attached to issue 300.
- Production evidence artifact is attached or linked.
- Deployed `/xr` route returns HTTP 200.
- Deployed AR model asset returns HTTP 200.
- AR model asset parses as glTF 2.0 and contains a mesh.
- Production smoke includes the Genesis XR AR test.
- Screenshot evidence includes `desktop-xr-ar-preview.png`.
- Desktop fallback evidence is attached.
- Supported mobile AR evidence or unsupported mobile fallback evidence is attached.
- iOS proof stays gated until a verified USDZ asset is added.

## Closure rule

Do not mark Genesis XR AR production complete until every required evidence item above is attached or linked from issue 300.
