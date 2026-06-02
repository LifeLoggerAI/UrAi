# URAI Command Evidence — 2026-05-21

## Scope

Repository: `LifeLoggerAI/UrAi`

This report records the connector-verified state after the May 21 launch-hardening pass. The GitHub connector was available for direct repository edits. A local runtime clone was attempted, but the execution container could not resolve `github.com`, so command execution remains pending in a credentialed local/Firebase Studio/CI environment.

## Completed in this pass

- Added `scripts/p0-command-matrix.mjs`.
- Added `npm run launch:p0:commands`.
- Preserved `npm run launch:p0` as the structural/evidence gate.
- Preserved explicit unverified status for runtime proof instead of claiming success without command output.

## Command matrix now available

Dry run:

```bash
npm run launch:p0:commands
```

Full command execution:

```bash
URAI_P0_RUN_COMMANDS=1 npm run launch:p0:commands
```

The matrix executes:

```bash
npm run check:firebase
npm run check:lockfile
npm run check:v1
npm run validate:completion
npm run check:types
npm run lint
npm run test:unit
npm run test:rules
npm run test:smoke
npm run test:e2e
npm run build
npm run preflight
```

## Evidence gate still available

Structural/evidence report:

```bash
npm run launch:p0
```

Strict evidence gate:

```bash
URAI_P0_STRICT=1 npm run launch:p0
```

Full evidence gate example:

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

## Verified by repository inspection

- The app is a Next.js app with Firebase, Firestore rules/index scaffolding, Playwright smoke tests, Jest tests, and V1 launch scripts.
- `/home` mounts `UraiResolvedHomeScene` and `UraiHomeAccessibilityLayer`.
- `/api/companion` validates a non-empty message and returns deterministic companion output through `companion-engine`.
- `/api/waitlist` validates email, rate-limits requests, supports dry-run without Admin credentials, and writes to Firestore through Admin SDK when configured.
- `tests/e2e/v1-smoke.spec.ts` includes smoke coverage for `/`, `/home`, `/u/adamclamp`, waitlist API/form behavior, companion API, and reduced-motion `/home` path.

## Runtime commands not executed in this pass

Not executed here due to the connector/runtime limitation. Run from a clean checkout:

```bash
npm install
URAI_P0_RUN_COMMANDS=1 npm run launch:p0:commands
npm run launch:p0
```

Then update `HOME_LOCK_REPORT.md`, `HOME_E2E_AUDIT.md`, and this file with the actual output summaries.

## Launch lock decision

Status: `PARTIAL — STRUCTURALLY HARDENED, RUNTIME EVIDENCE REQUIRED`

Do not call URAI V1 100/100 launch-ready until:

- the command matrix passes,
- Playwright smoke/E2E evidence is attached,
- Firestore rules tests pass,
- staging deploy proof exists,
- mobile/desktop/reduced-motion evidence exists,
- waitlist persistence is verified with Firebase Admin credentials,
- private data safety is verified.
