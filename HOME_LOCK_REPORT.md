# HOME LOCK REPORT

Date: 2026-05-18
Branch: `final/home-lock-execution`
Final status: PARTIALLY LOCKED / NOT LOCKED

## Summary

This execution pass performed the repository-facing portion of the URAI FINAL HOME LOCK. The active `/home` route now mounts the Firestore-backed resolved home scene, and static final-lock scripts and required contract/audit documents were added.

The final release status is not LOCKED because runtime commands, Firebase emulator/rules proof, browser smoke tests, deployment proof, production companion endpoint proof, and voice/TTS verification were not executable through this connector-only environment.

## Baseline findings

- Main repo: `LifeLoggerAI/UrAi`
- Default branch: `main`
- Working branch: `final/home-lock-execution`
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

## Files changed

- `src/app/home/page.tsx`
- `package.json`
- `scripts/check-home-lock.mjs`
- `scripts/check-ascent-lock.mjs`
- `HOME_DATA_CONTRACT.md`
- `HOME_COMPANION_CONTRACT.md`
- `HOME_E2E_AUDIT.md`
- `HOME_LOCK_REPORT.md`

## Features implemented

### `/home` canonical route wiring

`/home` now imports and renders `UraiResolvedHomeScene`, which is the Firestore-backed resolved scene with:

- home/transition/lifemap state model
- live home state hook
- reduced-motion ascent behavior
- memory constellation nodes
- physical aura orb charge behavior
- ground/body interaction zones
- return-home behavior from embedded lifemap mode

### Static verification gates

Added:

- `npm run check:home`
- `npm run check:ascent`

These scripts statically verify key final-lock requirements are present in the repository.

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

- Confirmed Firebase client dependency exists.
- Confirmed auth state binding exists in the live hook.
- Confirmed Firestore reads are user-scoped in the hook.
- Documented expected rules and emulator proof requirements.

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

## Emulator proof status

Status: NOT VERIFIED

Reason: The connector environment allowed GitHub file changes but did not provide a live clone/runtime command environment for executing Firebase emulators.

## Companion/orb status

Status: PARTIALLY VERIFIED

Completed:

- `/home` now routes to the resolved scene with physical aura orb behavior.
- Resolved scene has companion focus surface.
- Home view model includes companion mode and narrator whisper.
- Companion contract produced.

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

## Route continuity status

Status: PARTIALLY VERIFIED

Completed:

- `/home` routes to resolved scene.
- Resolved scene can enter embedded lifemap mode and return home.

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

Added static gate scripts:

- `scripts/check-home-lock.mjs`
- `scripts/check-ascent-lock.mjs`

No Jest/Playwright tests were added in this pass because runtime verification could not be executed here.

## Commands run

Commands were not run in this connector-only environment. The following commands must be run from a local/CI checkout before marking `/home` LOCKED:

```bash
npm install
npm run typecheck
npm run lint
npm run test
npm run build
npm run check:home
npm run check:ascent
npm run test:rules
npm run test:smoke
npm run launch:p0
```

If using pnpm in your environment, run the pnpm equivalents.

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

1. Pull branch `final/home-lock-execution`.
2. Run `npm install`.
3. Run `npm run check:home`.
4. Run `npm run check:ascent`.
5. Run `npm run typecheck`.
6. Run `npm run lint`.
7. Run `npm run test`.
8. Run `npm run build`.
9. Run `npm run test:rules`.
10. Run smoke tests for `/home`, `/life-map`, `/forecast`, `/cognitive-mirror`, `/narrator`, `/homeview` if retained.
11. Attach outputs to this report.
12. Only then update release/status docs to LOCKED if all criteria pass.
