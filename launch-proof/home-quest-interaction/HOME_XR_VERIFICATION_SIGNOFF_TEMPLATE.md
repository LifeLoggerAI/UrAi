# Home Quest/XR Verification Signoff Template

Do not complete this file from intention or visual inspection alone. Fill it only after the CI/local/artifact/device proof has actually been captured.

## Summary

- Route: `/home`
- Commit SHA tested:
- Tested by:
- Date/time:
- Final status requested:
  - [ ] HOME QUEST/XR CI-GREEN
  - [ ] HOME QUEST/XR VERIFIED

## CI proof

- CI run URL:
- CI workflow name: `CI`
- Required successful jobs:
  - [ ] V1 app unit/build gate
  - [ ] Home and Life Map XR Playwright smoke

Required app gate checks:

- [ ] Typecheck passed
- [ ] Lint passed
- [ ] Unit/rules tests passed
- [ ] Production build passed
- [ ] Route verification passed
- [ ] Asset verification passed
- [ ] Public copy check passed
- [ ] Production claims check passed
- [ ] Home XR static lock passed
- [ ] Home XR proof manifest check passed
- [ ] Genesis spine smoke passed

## Artifact proof

- Artifact name: `xr-playwright-output`
- Artifact URL:
- Required files:
  - [ ] `home-xr-proof/home-desktop.png`
  - [ ] `home-xr-proof/home-mobile.png`
  - [ ] `home-xr-proof/home-xr-affordance-mocked.png`

## Quest hardware proof

- Device model:
- Browser name/version:
- URL tested:
- HTTPS or accepted localhost/tunnel confirmed:
  - [ ] yes

Required checks:

- [ ] `/home` loads in Quest Browser
- [ ] Normal 3D Home scene renders before VR entry
- [ ] `Enter VR` appears only when immersive-vr is supported
- [ ] Browser VR permission/session prompt appears
- [ ] VR session starts through the browser WebXR API
- [ ] Quest controller ray/laser appears
- [ ] Hover feedback works on Life Map
- [ ] Hover feedback works on Ground
- [ ] Hover feedback works on Sky
- [ ] Hover feedback works on Horizon
- [ ] Hover feedback works on Replay
- [ ] Hover feedback works on Orb Chat
- [ ] Hover feedback works on Mirror
- [ ] Hover feedback works on XR Preview
- [ ] Trigger selection routes correctly for safe targets
- [ ] Grip/back clears or closes selection state
- [ ] Controller unavailable fallback appears during active VR session when controllers are disconnected/unavailable

## Claim boundary check

- [ ] Unsupported browsers do not show a fake headset button
- [ ] Unsupported browsers show truthful fallback copy
- [ ] Public copy does not claim unverified full Quest/VR/XR support
- [ ] Any `DONE DONE`, `Quest ready`, `VR ready`, or `production XR` wording links to this completed signoff and proof artifacts

## Failures or exceptions

List every failure, exception, workaround, or browser/device limitation here. If this section contains an unresolved blocker, do not mark `HOME QUEST/XR VERIFIED`.

- None recorded / or details:

## Final authorization

Only check one:

- [ ] Approved as `HOME QUEST/XR CI-GREEN`
- [ ] Approved as `HOME QUEST/XR VERIFIED`
- [ ] Not approved; blockers remain

Signer:
Date:
