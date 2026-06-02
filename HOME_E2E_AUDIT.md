# HOME E2E AUDIT

Date: 2026-05-18
Branch: `final/home-lock-execution`
Status: PARTIALLY VERIFIED
Final release lock decision: NOT LOCKED

## Executive summary

This audit executes the repository-facing portion of the URAI FINAL HOME LOCK. The active `/home` route is now wired to the Firestore-backed resolved home field instead of the older static shrine scene. Static gate scripts were added for `check:home` and `check:ascent`.

The implementation is not marked LOCKED because this environment cannot run the full command matrix, browser smoke tests, Firebase emulator proof, deployment verification, production companion endpoint proof, or voice/TTS runtime proof.

## Route-by-route audit

| Route | Status | Notes |
| --- | --- | --- |
| `/home` | PARTIALLY VERIFIED | `src/app/home/page.tsx` now mounts `UraiResolvedHomeScene`. |
| `/` | EXISTING | `src/app/page.tsx` still mounts `HomeScene`; root remains a cinematic entrypoint. |
| `/life-map` | STATIC CHECK REQUIRED | `UraiResolvedHomeScene` imports and renders `LifeMapScene` in lifemap mode. Run `npm run check:ascent`. |
| `/forecast` | NOT RUNTIME VERIFIED | Connected as an expected route in the final lock contract; must be browser-smoked. |
| `/cognitive-mirror` | NOT RUNTIME VERIFIED | Connected as an expected route in the final lock contract; must be browser-smoked. |
| `/narrator` | NOT RUNTIME VERIFIED | Companion/narrator route must be browser-smoked if retained as a separate route. |
| `/homeview` | LEGACY / NOT VERIFIED | Older cinematic shell remains present; not the canonical final `/home` route in this pass. |

## State-by-state audit

| State | Status | Evidence |
| --- | --- | --- |
| loading | PARTIALLY VERIFIED | `UraiHomeViewModel.loading` and initial loading state exist in `useUraiHomeState`. |
| live/firestore | PARTIALLY VERIFIED | Firestore snapshots are used after auth resolves. |
| demo fallback | PARTIALLY VERIFIED | `source: "demo"` exists for unauthenticated fallback. |
| unconfigured fallback | PARTIALLY VERIFIED | `source: "unconfigured"` exists for missing Firebase config. |
| error | PARTIALLY VERIFIED | Snapshot errors set a safe fallback with `error`. |
| offline | NOT VERIFIED | Explicit offline cache/runtime behavior must still be browser-tested. |
| partial data | PARTIALLY VERIFIED | Normalizers use fallback values for missing fields. |
| empty data | PARTIALLY VERIFIED | Missing nodes fall back to demo constellation nodes; dedicated empty UX remains future hardening. |

## Live data audit

Canonical hook: `src/lib/use-urai-home-state.ts`

Live data paths observed/defined:

- `users/{uid}/homeState/current`
- `users/{uid}/moodForecasts/current`
- `users/{uid}/companionState/current`
- `users/{uid}/visualState/current`
- `users/{uid}/lifeMapNodes/*`

Status: PARTIALLY VERIFIED

Reason: The hook contains live Auth and Firestore snapshot wiring, but emulator/rules/runtime proof has not been executed in this pass.

## Fallback data audit

Fallback states:

- demo fallback
- unconfigured Firebase fallback
- normalized partial-data fallback
- snapshot-error fallback

Status: PARTIALLY VERIFIED

Required follow-up before LOCKED:

- Confirm fallback mode is visually labeled or non-misleading in runtime UX.
- Confirm production config never defaults to demo when authenticated live data is available.

## Auth audit

Status: PARTIALLY VERIFIED

Observed:

- `onAuthStateChanged(auth(), ...)` is used in `useUraiHomeState`.
- Firestore reads are scoped under `users/{uid}`.

Required follow-up:

- Run emulator tests for authenticated own-user reads.
- Run emulator tests for cross-user denials.
- Run emulator tests for unauthenticated denials.

## Firestore rules audit

Status: NOT VERIFIED

Required before LOCKED:

- Run `npm run test:rules` or equivalent.
- Verify user-owned read/write scope.
- Verify trust/privacy settings scope.
- Verify telemetry write safety.
- Verify companion logs scope if used.
- Verify admin/debug protection.

## Emulator audit

Status: NOT VERIFIED

Required before LOCKED:

- Run Firebase emulator/rules tests.
- Attach command output in `HOME_LOCK_REPORT.md`.
- Do not mark LOCKED without emulator proof or equivalent rules proof.

## Companion audit

Status: PARTIALLY VERIFIED

Observed:

- Resolved scene has companion focus state.
- Resolved scene derives companion mode from live home state.
- `HOME_COMPANION_CONTRACT.md` defines the production endpoint contract.

Not verified:

- Streaming endpoint.
- Non-streaming endpoint.
- Memory retrieval endpoint.
- Voice input.
- TTS.
- Cooldown persistence.

## Voice/TTS audit

Status: NOT VERIFIED

Required before LOCKED:

- Browser test voice permission states.
- Unsupported browser fallback.
- TTS speaking/stop/mute state if supported.
- Quiet mode behavior.

## Visual/motion audit

Status: PARTIALLY VERIFIED

Observed in `UraiResolvedHomeScene`:

- aura orb physical CSS and data-state behavior
- sky layer
- constellation memory stars
- ground hotspots
- body/silhouette field
- reduced-motion path
- lifemap transition mode
- return-home behavior

Required before LOCKED:

- Browser visual smoke.
- Mobile viewport smoke.
- Reduced-motion browser smoke.
- WebGL/fallback asset smoke.

## Sky ascent audit

Status: PARTIALLY VERIFIED

Observed:

- `Mode = "home" | "transitioning" | "lifemap"`
- `openLifeMap`
- `returnHome`
- reduced-motion shortcut to `lifemap`
- transition CSS for `.is-transitioning`

Required:

- Run `npm run check:ascent`.
- Run browser smoke for ascent and return-home.

## Life-map continuity audit

Status: PARTIALLY VERIFIED

Observed:

- Resolved scene renders `<LifeMapScene />` in lifemap mode.
- Return button returns to home mode.

Required:

- Confirm `/life-map` route itself loads.
- Confirm memory star focus/bloom/replay behavior where implemented.

## Memory star audit

Status: PARTIALLY VERIFIED

Observed:

- `Constellation` renders memory stars from normalized `home.nodes`.
- Nodes open a focus surface.
- Nodes share the resolved scene's visual language.

Required:

- Browser smoke star open/close.
- Verify empty node state with real empty Firestore data.

## Emotional weather audit

Status: PARTIALLY VERIFIED

Observed:

- `moodWeather`, `forecastSummary`, and `forecastMessage` are normalized in `useUraiHomeState`.
- Visuals derive from `visualState`, threshold, recovery, and rhythm.

Required:

- Browser smoke emotional weather display.
- Copy review for all connected forecast/narrator surfaces.

## Mobile audit

Status: NOT VERIFIED

Required:

- iOS Safari smoke.
- Android Chrome smoke.
- Small viewport smoke.
- Touch-target check.
- Safe-area check.

## Reduced-motion audit

Status: PARTIALLY VERIFIED

Observed:

- `prefers-reduced-motion` listener exists.
- Reduced motion skips transition timer and enters lifemap directly.

Required:

- Browser smoke with reduced motion enabled.

## Accessibility audit

Status: PARTIALLY VERIFIED

Observed:

- main zones are buttons with aria labels.
- return-home has aria label.
- scene pulse uses `aria-live`.

Required:

- Keyboard-only browser smoke.
- Focus-visible visual check.
- Color contrast review.

## Telemetry audit

Status: NOT VERIFIED

Required:

- Confirm telemetry utility exists.
- Add or verify sanitized home events.
- Confirm telemetry failure is non-breaking.
- Confirm privacy setting behavior if configurable.

## Privacy/safety copy audit

Status: PARTIALLY VERIFIED

Observed:

- Existing resolved scene and hook copy is symbolic and avoids direct diagnostic claims.
- `HOME_COMPANION_CONTRACT.md` defines diagnostic-language restrictions.

Required:

- Full connected-route copy scan.
- `npm run check:public-copy`.

## Admin/debug protection audit

Status: NOT VERIFIED

Required:

- Inspect admin/debug routes.
- Confirm admin auth guard.
- Run rules/route tests where available.

## Console/logging audit

Status: NOT VERIFIED

Required:

- Run browser smoke and inspect console.
- Ensure no raw private data is logged.

## Evidence checklist

| Evidence item | Status |
| --- | --- |
| `/home` route wired to resolved scene | COMPLETE |
| `check:home` script added | COMPLETE |
| `check:ascent` script added | COMPLETE |
| `HOME_DATA_CONTRACT.md` produced | COMPLETE |
| `HOME_COMPANION_CONTRACT.md` produced | COMPLETE |
| `HOME_LOCK_REPORT.md` produced | COMPLETE |
| `HOME_E2E_AUDIT.md` produced | COMPLETE |
| Typecheck run | NOT RUN IN THIS ENVIRONMENT |
| Lint run | NOT RUN IN THIS ENVIRONMENT |
| Unit tests run | NOT RUN IN THIS ENVIRONMENT |
| Build run | NOT RUN IN THIS ENVIRONMENT |
| Firestore rules/emulator proof | NOT RUN IN THIS ENVIRONMENT |
| Browser smoke | NOT RUN IN THIS ENVIRONMENT |
| Deployment proof | NOT RUN IN THIS ENVIRONMENT |

## Final pass/fail table

| Area | Result |
| --- | --- |
| Repo inspection | PASS |
| `/home` route wiring | PASS |
| Static gate scripts | PASS |
| Data contract | PASS |
| Companion contract | PASS |
| Runtime verification | FAIL - not executed here |
| Emulator/rules verification | FAIL - not executed here |
| Deploy evidence | FAIL - not executed here |
| Final LOCKED status | FAIL - do not mark LOCKED yet |
