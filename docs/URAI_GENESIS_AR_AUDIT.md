# URAI Genesis AR Audit and Proof Status

Date: 2026-06-28
Commit scope: public Genesis `/xr` AR hardening pass

## Final status

**AR PREVIEW READY ON SUPPORTED DEVICES, WITH LIVE DEPLOYMENT STILL EVIDENCE-REQUIRED.**

This repo now contains a minimal public AR preview path that does not fake AR with a normal Three.js canvas. The AR entry is delegated to supported browser/device paths through `model-viewer` using a real glTF asset.

This document does **not** claim production deployment, physical mobile device validation, or CI success until those are proven by deployment logs, device screenshots, and passing command output.

## Capability matrix

| Capability | Status | Evidence |
| --- | --- | --- |
| Desktop 3D preview | Implemented | Existing `/xr` Home 3D canvas remains intact. |
| VR entry | Browser-gated | `XRSessionButton` only appears when `immersive-vr` is supported and the real WebGL renderer is ready. |
| AR model preview | Implemented | `/xr` imports `ARModelViewerPreview`; component loads `model-viewer` and points to `/assets/ar/urai-genesis-orb.gltf`. |
| Android AR | Supported-device gated | `model-viewer` uses `ar-modes="webxr scene-viewer"`. Requires compatible Android Chrome / Google Play Services for AR. |
| iOS Quick Look | Gated | No verified `.usdz` asset exists yet; iOS Quick Look is intentionally not claimed. |
| Universal AR | Not claimed | Unsupported browsers/devices remain normal 3D preview/fallback only. |
| Live deployment | Evidence-required | No deployment proof attached to this commit set yet. |
| Physical-device proof | Evidence-required | Needs Android/iOS device screenshots or video and route URL proof. |

## Runtime findings

`package.json` dependencies include:

- `three`
- `@react-three/fiber`
- `@react-three/drei`

`package.json` does not include:

- `@react-three/xr`
- `@google/model-viewer`

The AR preview avoids a lockfile/package churn by loading the `model-viewer` web component through a module script on the `/xr` page section. This keeps the change small and avoids replacing existing Home/Life Map/XR behavior.

## Asset findings

Added critical public AR model asset:

- `public/assets/ar/urai-genesis-orb.gltf`

The asset is intentionally lightweight and self-contained with embedded buffer data. It is suitable as a proof marker for public AR entry without adding heavy textures or binary model payloads.

Not present yet:

- verified `.usdz` model for iOS Quick Look
- production branded GLB/USDZ export pipeline
- texture/material asset bundle for a final branded AR object

## Route claim matrix

| Route/surface | Claim status |
| --- | --- |
| `/xr` | Says VR only appears when browser proves support. Says AR is gated to supported mobile/browser paths. Shows model-based AR preview section. |
| `/spatial` | Keeps AR gated/roadmap language until Asset Factory/device QA are green. |
| `/`, `/home`, `/life-map` | No AR production claim added. Existing 3D/Life Map surfaces preserved. |

## Files changed in this AR pass

- `src/app/xr/page.tsx`
- `src/components/xr/ARModelViewerPreview.tsx`
- `src/components/spatial/SpatialShell.tsx`
- `public/assets/ar/urai-genesis-orb.gltf`
- `scripts/verify-assets.mjs`
- `docs/URAI_GENESIS_AR_AUDIT.md`

## Validation commands required before live claim

Run and capture output:

```bash
npm run check:types
npm run lint
npm run build
npm run verify:routes
npm run verify:assets
npm run check:public-copy
npm run check:production-claims
npm run smoke:genesis-spine
```

## Deployment proof required before live claim

To call this live, attach evidence for:

1. deployment command and successful hosting output,
2. deployed `/xr` URL serving the current commit,
3. desktop fallback screenshot,
4. Android supported-device AR screenshot/video or explicit unsupported fallback screenshot,
5. iOS fallback screenshot or USDZ-backed Quick Look proof after a real USDZ asset is added.

## Honest release note

Genesis now has a **minimal supported-device AR preview path** on `/xr`. It is not universal AR. It is not an iOS Quick Look claim. It is not a deployment claim. Unsupported devices remain safely in 3D preview/fallback mode.
