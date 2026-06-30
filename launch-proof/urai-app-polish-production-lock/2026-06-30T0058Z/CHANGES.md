# Changes

## Files changed

### `src/components/urai/home/NewHomeScene.tsx`

Rebuilt the home experience into a launch-safe spatial threshold:

- Added a clearer three-zone layout: left route cards, center hero/portal, right truth panels.
- Added central primary CTA: `Step inside Ground`.
- Added truthful secondary actions: `Open Life Map preview`, `Check XR support`.
- Added route state badges for `Live`, `Preview`, and `Gated` semantics.
- Added a fixed bottom spatial dock with accessible route links.
- Increased small text readability with stronger weight, improved contrast, and more consistent spacing.
- Preserved cinematic URAI Spatial mood: orb, ground plane, sky route, stars, portal, dark panels, and warm/cyan contrast.
- Kept the existing `HomeWorldCanvas` inside `HomeXREntryCard` to preserve the 3D/WebGL proof/fallback section.
- Added launch-safety copy that private account access, live sensing, generated private media, health inference, autonomous actions, and headset entry remain gated unless proof passes.

### `src/app/page.tsx`

- Replaced the separate root public demo page with the shared `NewHomeScene` component.
- Result: `/` and `/home` now present the same URAI Spatial landing surface after deployment.

## Not changed

- No fake headset button was added.
- No fake XR/AR support was claimed.
- No autonomous helper behavior was added.
- No private data capture was added.
- No existing route was removed.
