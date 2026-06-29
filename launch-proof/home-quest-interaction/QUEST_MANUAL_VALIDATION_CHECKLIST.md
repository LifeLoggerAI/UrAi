# Home Quest Manual Validation Checklist

Use this checklist only after the app is built or deployed. Do not mark Home Quest/XR as fully verified until this is completed on a real WebXR-capable headset/browser.

## Required environment

- Meta Quest headset or another browser/device that reports `immersive-vr` support through `navigator.xr.isSessionSupported("immersive-vr")`.
- HTTPS deployment or localhost tunnel accepted by the headset browser.
- Quest controllers awake and paired.

## Pre-checks

- [ ] Desktop `/home` loads without console errors.
- [ ] Mobile `/home` loads without console errors.
- [ ] Unsupported desktop/mobile browser hides `Enter VR` and shows truthful fallback copy.
- [ ] CI or local run generated the Home XR smoke screenshots:
  - [ ] `home-desktop.png`
  - [ ] `home-mobile.png`
  - [ ] `home-xr-affordance-mocked.png`

## Quest browser checks

- [ ] Open `/home` on Quest Browser.
- [ ] Confirm normal 3D Home scene renders before VR entry.
- [ ] Confirm `Enter VR` appears only when the browser reports immersive-vr support.
- [ ] Click `Enter VR`.
- [ ] Confirm browser permission/session prompt appears.
- [ ] Accept session.
- [ ] Confirm the VR session starts.

## Controller checks

- [ ] Wake both Quest controllers.
- [ ] Confirm visible controller ray/laser appears.
- [ ] Aim at each target and confirm hover/visual response:
  - [ ] Life Map
  - [ ] Ground
  - [ ] Sky
  - [ ] Horizon
  - [ ] Replay
  - [ ] Orb Chat
  - [ ] Mirror
  - [ ] XR Preview
- [ ] Trigger-select each safe target and confirm navigation routes correctly.
- [ ] Grip/back clears selected/hover state or closes the active selection state.
- [ ] Turn controllers off or disconnect them during an active VR session and confirm the fallback panel appears.

## Failure handling

If any item fails, do not claim Home Quest/XR is done. Record:

- device model
- browser name/version
- URL tested
- failing checklist item
- screenshot or short video if available
- console/session error if available

## Final signoff

- [ ] CI/local checks passed.
- [ ] Screenshots generated.
- [ ] Quest controller interaction verified.
- [ ] No fake headset support is shown on unsupported browsers.
- [ ] Public copy remains support-gated and truthful.

Final status may only be marked `HOME QUEST/XR VERIFIED` after every required item above is checked.
