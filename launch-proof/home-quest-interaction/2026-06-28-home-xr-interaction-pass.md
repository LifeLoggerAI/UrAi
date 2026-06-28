# Home Quest Interaction Pass — 2026-06-28

## Scope

Implemented a native Three.js/WebXR interaction layer for `/home` without replacing the existing Home visuals or WebXR capability gate.

## Files changed

- `src/components/urai/home/HomeWorldCanvas.tsx`
- `src/components/urai/home/HomeXRInteractionLayer.tsx`
- `src/components/urai/home/HomeXRTargets.ts`
- `tests/unit/home-xr-interaction-layer.test.ts`
- `tests/e2e/home-xr-interaction.spec.ts`
- `scripts/check-production-claims.mjs`
- `package.json`
- `.github/workflows/ci.yml`

## Architecture

`HomeWorldCanvas` keeps the existing `CinematicWorld` and adds `HomeXRInteractionLayer` inside the same React Three Fiber canvas.

`HomeXRInteractionLayer` uses the existing native WebXR foundation from `XRSessionFoundation` / Three.js renderer XR support. It does not depend on a DOM-only fake VR interaction path.

The layer adds:

- native `renderer.xr.getController(0)` and `renderer.xr.getController(1)` support
- controller connected / disconnected listeners
- visible controller rays / laser pointers
- frame-loop raycasting against in-world meshes
- hover state
- selected state
- trigger/select activation
- squeeze/grip close behavior where browser/controller events expose it
- in-world instruction panel
- in-world controller fallback panel when a VR session is active but no controllers are connected

## Interactive targets

- Life Map -> `/life-map`
- Ground -> `/ground`
- Sky -> `/life-map`
- Horizon -> `/location-map`
- Replay -> `/replay`
- Orb Chat -> `/ochat`
- Mirror -> `/mirror`
- XR Preview -> `/xr`

## Desktop / mobile preservation

The same in-world target meshes retain React Three Fiber pointer handlers, so mouse and touch clicks continue to work outside a headset. The existing DOM route navigation, WebGL fallback, and WebXR support gate were not removed.

## Added checks

- Unit smoke check for required in-world Home XR target registry.
- Playwright smoke coverage for desktop `/home` load, mobile `/home` load, canvas presence, no console/page errors, truthful unsupported-device fallback copy, and no visible fake VR button when immersive-vr is unsupported.
- `check:production-claims` script to fail unqualified XR/VR/AR/Quest production claims.
- CI now runs typecheck, lint, unit/rules tests, build, route verification, asset verification, public copy check, production claims check, genesis spine smoke, and Home XR Playwright smoke.

## Verification status

Not run in this environment:

- `npm run check:types`
- `npm run lint`
- `npm run build`
- `npm run verify:routes`
- `npm run verify:assets`
- `npm run check:public-copy`
- `npm run check:production-claims`
- `npm run smoke:genesis-spine`
- `npx playwright test tests/e2e/home-xr-interaction.spec.ts --project=chromium --project=mobile-chrome`

Reason: the execution container could not resolve `github.com`, so the repo could not be cloned locally for command execution or Playwright screenshots.

## CI status

A GitHub Actions workflow was expanded to run the requested command set plus Home XR Playwright smoke. No workflow run was visible through the available connector for this latest push at the time of this note.

## Screenshots

Not captured in this environment for the same reason above. Required follow-up proof:

- desktop `/home`
- mobile `/home`
- `/home` with XR affordance visible on supported or mocked WebXR environment

## Honest status

HOME QUEST INTERACTION READY WITH WARNINGS

Warnings:

- implementation is committed, but not locally typechecked or built in this environment
- CI has been wired, but no run result was visible through the available connector yet
- not verified on physical Quest hardware in this environment
- screenshots were not captured in this environment
