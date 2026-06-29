# Life Map Quest Live Deploy Verification

This file is for proving that Life Map Quest interaction is not only pushed, but also live on a deployed target. Do not mark this complete from repository configuration alone.

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
- [ ] `/life-map` renders exactly one visible Life Map canvas
- [ ] `/life-map` shows Life Map galaxy copy and non-XR DOM navigation outside VR
- [ ] unsupported desktop/mobile browser does not show a fake VR entry
- [ ] browser console has no blocking runtime errors
- [ ] public copy does not claim unverified full Quest/VR/XR support

## Live screenshot proof

Capture and attach/store screenshots for:

- [ ] deployed desktop `/life-map`
- [ ] deployed mobile `/life-map`
- [ ] deployed unsupported-browser no-fake-VR-entry behavior
- [ ] deployed `/xr` capability panel

## Quest live proof

Use the deployed URL, not localhost, unless explicitly testing a localhost/tunnel path.

- [ ] Quest Browser can reach deployed `/life-map`
- [ ] `Enter VR` appears only when Quest Browser reports immersive-vr support
- [ ] VR session starts from deployed `/life-map`
- [ ] left controller ray/laser appears
- [ ] right controller ray/laser appears
- [ ] star hover highlight works from controller ray
- [ ] trigger selects focused star
- [ ] selected star details appear in the in-world VR panel
- [ ] grip/back closes or clears selected panel
- [ ] VR menu buttons respond to trigger selection
- [ ] desktop and mobile controls still work after exiting VR

## Final live status labels

Use only these labels:

- `LIFE MAP QUEST DEPLOY-CONFIGURED` — Firebase/project config exists, but live URL not verified.
- `LIFE MAP QUEST LIVE-SMOKE-PASSED` — deployed URLs and browser smoke checks pass.
- `LIFE MAP QUEST LIVE-QUEST-VERIFIED` — live deployed URL passes real Quest hardware validation.

Do not claim `live verified working deployed`, `Quest ready`, `VR ready`, `production XR`, or `DONE DONE` until this file has URL evidence, smoke proof, screenshots, and Quest validation attached or linked.
