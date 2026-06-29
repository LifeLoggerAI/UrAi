# Home Quest/XR Live Deploy Verification

This file is for proving that the Home Quest/XR foundation is not only pushed, but also live on a deployed target. Do not mark this complete from repository configuration alone.

## Known hosting configuration

Repository configuration currently points at Firebase Hosting:

- Firebase project: `urai-4dc1d`
- Firebase hosting site: `urai-4dc1d`
- Config files:
  - `.firebaserc`
  - `firebase.json`

Configuration is not deployment proof. A real deployment must be verified by URL and runtime checks.

## Required live URLs

Fill these in only after deployment exists and responds:

- Primary production URL:
- Firebase hosting URL:
- Alternate/custom domain URL:
- Commit SHA deployed:
- Deployment command or CI deploy run URL:

## Live smoke checks

Run these against the deployed URL, not local development:

- [ ] `/` responds with HTTP 200
- [ ] `/home` responds with HTTP 200
- [ ] `/xr` responds with HTTP 200
- [ ] `/life-map` responds with HTTP 200
- [ ] `/home` renders the 3D canvas
- [ ] `/home` shows truthful WebXR fallback copy on unsupported desktop/mobile browser
- [ ] unsupported desktop/mobile browser does not show `Enter VR`
- [ ] browser console has no blocking runtime errors
- [ ] public copy does not claim unverified full Quest/VR/XR support

## Live screenshot proof

Capture and attach/store screenshots for:

- [ ] deployed desktop `/home`
- [ ] deployed mobile `/home`
- [ ] deployed unsupported-browser WebXR fallback
- [ ] deployed `/xr` capability panel

## Quest live proof

Use the deployed URL, not localhost, unless explicitly testing a localhost/tunnel path.

- [ ] Quest Browser can reach deployed `/home`
- [ ] `Enter VR` appears only when Quest Browser reports immersive-vr support
- [ ] VR session starts from deployed page
- [ ] controller ray/laser appears
- [ ] target hover works
- [ ] trigger selection works
- [ ] grip/back clear behavior works
- [ ] controller-unavailable fallback works

## Final live status labels

Use only these labels:

- `HOME QUEST/XR DEPLOY-CONFIGURED` — Firebase/project config exists, but live URL not verified.
- `HOME QUEST/XR LIVE-SMOKE-PASSED` — deployed URLs and browser smoke checks pass.
- `HOME QUEST/XR LIVE-QUEST-VERIFIED` — live deployed URL passes real Quest hardware validation.

Do not claim `live verified working deployed` until this file has URL evidence, smoke proof, screenshots, and Quest validation attached or linked.
