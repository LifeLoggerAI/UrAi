# HOME LOCK REPORT

Date: 2026-05-18
Branch: `fix/home-lock-ci-p0-gates`
Final status: PARTIALLY LOCKED / NOT LOCKED

## Summary

This follow-up pass makes the merged URAI `/home` final-lock work harder to regress by wiring the new home lock gates into CI and P0 launch reporting.

The active `/home` route was already moved to the Firestore-backed resolved home scene in PR #247. This pass adds the next repo-level lock step: CI now runs `npm run check:home` and `npm run check:ascent`, and the P0 launch gate now tracks those checks, `/home` contract docs, and `/home` manual evidence variables.

The final release status remains not LOCKED because full runtime command output, Firebase emulator/rules proof, browser smoke tests, deployment proof, production companion endpoint proof, telemetry proof, admin/debug proof, and voice/TTS verification still need to be produced from CI/local/runtime evidence.

## Baseline findings

- Main repo: `LifeLoggerAI/UrAi`
- Default branch: `main`
- Prior merged PR: #247, `Final /home lock execution pass`
- Current follow-up branch: `fix/home-lock-ci-p0-gates`
- Framework: Next.js
- Firebase dependencies are present in `package.json`.
- Three/Fiber, Three.js, and Framer Motion dependencies are present.
- Jest, Playwright, and Firestore rules test scripts are present.
- Existing `/home` route file: `src/app/home/page.tsx`
- Existing root home entry: `src/app/page.tsx`
- Older cinematic shrine component: `src/components/urai/home/HomeScene.tsx`
- Resolved Firestore-backed home field: `src/components/urai/UraiResolvedHomeScene.tsx`
- Live home data hook: `src/lib/use-urai-home-state.ts`

## Canonical /home route path

`src/app/home/page.tsx`

## Connected route inventory

Expected home-connected routes/surfaces:

- `/home`
- `/life-map`
- `/forecast`
- `/cognitive-mirror`
- `/narrator`
- `/homeview` if retained as legacy/cinematic route
- memory star focus/bloom/replay route if implemented

## Files changed in PR #247

- `src/app/home/page.tsx`
- `package.json`
- `scripts/check-home-lock.mjs`
- `scripts/check-ascent-lock.mjs`
- `HOME_DATA_CONTRACT.md`
- `HOME_COMPANION_CONTRACT.md`
- `HOME_E2E_AUDIT.md`
- `HOME_LOCK_REPORT.md`

## Files changed in this follow-up branch

- `.github/workflows/ci.yml`
- `scripts/p0-launch-gate.mjs`
- `HOME_LOCK_REPORT.md`

## Features implemented

### `/home` canonical route wiring

`/home` imports and renders `UraiResolvedHomeScene`, which is the Firestore-backed resolved scene with:

- home/transition/lifemap state model
- live home state hook
- reduced-motion ascent behavior
- memory constellation nodes
- physical aura orb charge behavior
- ground/body interaction zones
- return-home behavior from embedded lifemap mode

### Static verification gates

Added in PR #247:

- `npm run check:home`
- `npm run check:ascent`

This follow-up adds those checks to CI and P0 reporting.

### CI gate integration

`.github/workflows/ci.yml` now runs:

- `npm run check:home`
- `npm run check:ascent`

These run after V1 wiring and before P0/P1 release gates, seed data, unit tests, rules tests, typecheck, lint, and build.

### P0 launch gate integration

`scripts/p0-launch-gate.mjs` now tracks:

- `scripts/check-home-lock.mjs`
- `scripts/check-ascent-lock.mjs`
- `src/app/home/page.tsx`
- `src/components/urai/UraiResolvedHomeScene.tsx`
- `src/lib/use-urai-home-state.ts`
- `HOME_LOCK_REPORT.md`
- `HOME_E2E_AUDIT.md`
- `HOME_DATA_CONTRACT.md`
- `HOME_COMPANION_CONTRACT.md`
- `npm run check:home`
- `npm run check:ascent`
- `CI includes npm run check:home`
- `CI includes npm run check:ascent`
- `/home` desktop/mobile/reduced-motion/emulator/companion fallback evidence env vars

Passed checks now report: `No action required; this item is already covered by the listed evidence.`

## Data wiring completed

Existing live data hook verified and documented:

- `onAuthStateChanged(auth(), ...)`
- Firestore snapshots through `onSnapshot`
- user-scoped paths under `users/{uid}`
- normalized home view model
- demo/unconfigured fallback source states
- normalized life-map nodes

Live data paths documented in `HOME_DATA_CONTRACT.md`:

- `users/{uid}/homeState/current`
- `users/{uid}/moodForecasts/current`
- `users/{uid}/companionState/current`
- `users/{uid}/visualState/current`
- `users/{uid}/lifeMapNodes/*`

## Firebase/Auth/Firestore status

Status: PARTIALLY VERIFIED

Completed:

- Firebase client dependency exists.
- Auth state binding exists in the live hook.
- Firestore reads are user-scoped in the hook.
- Expected rules and emulator proof requirements are documented.
- P0 now tracks `/home` emulator proof as an explicit manual evidence variable.

Not completed in this environment:

- Firebase emulator execution.
- Rules test output capture.
- Production Firebase runtime proof.
- Deployment proof.

## Firestore rules status

Status: NOT VERIFIED

Required before LOCKED:

- Run `npm run test:rules` or repository equivalent.
- Prove authenticated own-user reads pass.
- Prove cross-user reads fail.
- Prove unauthenticated reads fail.
- Prove telemetry/trust/companion/admin scopes.
- Set `URAI_HOME_FIREBASE_EMULATOR_VERIFIED=1` only after real proof exists.

## Emulator proof status

Status: NOT VERIFIED

Reason: The connector environment allowed GitHub file changes but did not provide a live clone/runtime command environment for executing Firebase emulators.

## Companion/orb status

Status: PARTIALLY VERIFIED

Completed:

- `/home` routes to the resolved scene with physical aura orb behavior.
- Resolved scene has companion focus surface.
- Home view model includes companion mode and narrator whisper.
- Companion contract exists.
- P0 now tracks `/home` companion fallback evidence.

Not completed:

- Production companion endpoint not verified.
- Streaming response not verified.
- Memory retrieval endpoint not verified.
- Cooldown persistence not verified.

## Voice/TTS status

Status: NOT VERIFIED

Voice input and TTS hooks were documented but not proven in this pass.

## Explainability status

Status: PARTIALLY VERIFIED

- Contract requires explainability for emotional weather, narrator insight, memory star, passive cue, companion suggestion, and aura state.
- Runtime UI proof is still required.

## Asset system status

Status: PARTIALLY VERIFIED

Observed:

- Existing Three/Fiber home world canvas exists.
- Resolved scene includes CSS/procedural visual field.
- Fallback expectations are documented.

Still required:

- Final authored Rive/Lottie/GLB asset registry proof.
- Browser smoke for WebGL/fallback failures.
- Mobile performance proof.

## Visual/motion status

Status: PARTIALLY VERIFIED

Observed in resolved scene:

- physical orb CSS
- memory stars
- constellation path
- ground hotspots
- body/silhouette field
- lifemap transition mode
- reduced-motion shortcut
- return-home behavior

Still required:

- Runtime browser visual smoke.
- Reduced-motion browser smoke.
- Mobile viewport smoke.
- Set `URAI_HOME_DESKTOP_VERIFIED=1`, `URAI_HOME_MOBILE_VERIFIED=1`, and `URAI_HOME_REDUCED_MOTION_VERIFIED=1` only after real proof exists.

## Route continuity status

Status: PARTIALLY VERIFIED

Completed:

- `/home` routes to resolved scene.
- Resolved scene can enter embedded lifemap mode and return home.
- `npm run check:ascent` exists and is now in CI.

Still required:

- Browser-smoke `/life-map`, `/forecast`, `/cognitive-mirror`, `/narrator`, `/homeview` if retained.
- Verify memory star focus/bloom/replay routes if implemented.

## Privacy/trust status

Status: PARTIALLY VERIFIED

Completed:

- Contracts document privacy, no raw private logs, no diagnostic copy, no hidden recording.
- Existing home copy is symbolic and non-diagnostic.

Still required:

- Full route copy scan.
- `npm run check:public-copy`.
- Trust/privacy persistence proof.
- Admin/debug guard proof.

## Telemetry status

Status: NOT VERIFIED

Required:

- Identify telemetry utility.
- Add or verify sanitized `/home` event payloads.
- Prove telemetry failure is non-breaking.
- Prove privacy preference behavior if configurable.

## Accessibility/mobile status

Status: PARTIALLY VERIFIED

Observed:

- Key home scene elements are buttons with aria labels.
- Scene pulse uses `aria-live`.
- Reduced-motion logic exists.

Still required:

- Keyboard-only browser smoke.
- Focus-visible check.
- Color contrast review.
- iOS Safari / Android Chrome smoke.

## Tests added/updated

Added static gate scripts in PR #247:

- `scripts/check-home-lock.mjs`
- `scripts/check-ascent-lock.mjs`

Added gate integration in this follow-up branch:

- CI runs `npm run check:home`.
- CI runs `npm run check:ascent`.
- P0 report tracks both scripts and both commands.

No Jest/Playwright tests were added in this pass because runtime verification could not be executed here.

## Commands run

Commands were not run in this connector-only environment. The following commands must be run from a local/CI checkout before marking `/home` LOCKED:

```bash
npm install
npm run check:home
npm run check:ascent
npm run typecheck
npm run lint
npm run test
npm run build
npm run test:rules
npm run test:smoke
npm run launch:p0
```

Full P0 evidence gate:

```bash
URAI_P0_RUN_COMMANDS=1 \
URAI_P0_DESKTOP_VERIFIED=1 \
URAI_P0_MOBILE_VERIFIED=1 \
URAI_P0_WAITLIST_PERSISTENCE_VERIFIED=1 \
URAI_P0_FIREBASE_RULES_INDEXES_DEPLOYED=1 \
URAI_P0_PRIVATE_DATA_SAFETY_VERIFIED=1 \
URAI_HOME_DESKTOP_VERIFIED=1 \
URAI_HOME_MOBILE_VERIFIED=1 \
URAI_HOME_REDUCED_MOTION_VERIFIED=1 \
URAI_HOME_FIREBASE_EMULATOR_VERIFIED=1 \
URAI_HOME_COMPANION_FALLBACK_VERIFIED=1 \
URAI_P0_DEMO_RECORDING_URL="https://example.com/demo.mp4" \
npm run launch:p0
```

## Command results

Not available from this connector-only execution pass.

## Smoke test results

Not available from this connector-only execution pass.

## Known limitations

- Full runtime proof was not run.
- Emulator/rules proof was not run.
- Deploy proof was not produced.
- Voice/TTS was not verified.
- Companion streaming/memory endpoint was not verified.
- Telemetry implementation was not verified.
- Admin/debug protection was not verified.
- Mobile browser behavior was not verified.

## Failures/blockers

Critical blockers preventing LOCKED:

1. Build/typecheck/lint/test results are not attached.
2. Firebase emulator/rules proof is not attached.
3. Browser smoke proof is not attached.
4. Deploy proof is not attached.
5. Companion endpoint proof is not attached.
6. Voice/TTS proof is not attached or explicitly finalized as unsupported fallback.
7. Telemetry/privacy/admin checks are not attached.

## Evidence summary

Complete:

- Route wiring commit exists.
- Static gate scripts exist.
- CI includes `check:home` and `check:ascent` in this follow-up branch.
- P0 tracks `check:home` and `check:ascent` in this follow-up branch.
- Data contract exists.
- Companion contract exists.
- E2E audit exists.
- Lock report exists.

Incomplete:

- Runtime command output.
- Firebase emulator output.
- Browser smoke output.
- Deployment output.

## Release lock decision

Final status: PARTIALLY LOCKED / NOT LOCKED

Do not mark `/home` LOCKED yet.

## Whether /home can be marked LOCKED

No. `/home` cannot be marked LOCKED until all required runtime, emulator, smoke, deployment, privacy, telemetry, companion, voice/TTS, and documentation evidence passes.

## Exact next actions

1. Merge this follow-up branch after CI passes.
2. Run `npm install`.
3. Run `npm run check:home`.
4. Run `npm run check:ascent`.
5. Run `npm run typecheck`.
6. Run `npm run lint`.
7. Run `npm run test`.
8. Run `npm run build`.
9. Run `npm run test:rules`.
10. Run smoke tests for `/home`, `/life-map`, `/forecast`, `/cognitive-mirror`, `/narrator`, `/homeview` if retained.
11. Run the full P0 evidence gate with the new `/home` evidence env vars.
12. Attach outputs to this report.
13. Only then update release/status docs to LOCKED if all criteria pass.
