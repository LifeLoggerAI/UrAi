# UrAi P0 Local Gate Evidence

Date: 2026-05-30
Repo: LifeLoggerAI/UrAi
Branch used by runner: main
Runner path: /tmp/UrAi-build
Status: p0_structurally_ready_evidence_required

## Purpose

This document records the local P0 release-gate evidence captured after the route, build-cache, ascent-lock, and verifier patches.

## Summary

The local P0 command run completed and produced the expected structural result. The app is no longer blocked by the previous `.firebase`, `.next/cache`, build, or ascent-lock failures.

Current release state:

- Code/build gate: passing
- P0 structural gate: passing
- Deployment/live/manual evidence: still required

## Commands With Passing Evidence

The following checks passed in the uploaded local run:

- `npm run check:ascent`
- `npm run build`
- `npm run preflight`
- `npm run check:lockfile`
- `npm run check:v1`
- `npm run seed:demo`
- `npm run test:unit`
- `npm run test:rules`
- `npm run check:types`
- `npm run lint`

## Test Evidence

Unit tests:

- 21 test suites passed
- 90 tests passed

Rules tests:

- 5 test suites passed
- 91 tests passed

Build evidence:

- Next.js production build completed
- 70 static pages generated
- route table emitted successfully

Known non-blocking build warning:

- Firebase/protobuf dynamic dependency warning through `chronoMirrorRepository.ts` and `cognitive-mirror/page.tsx`

## P0 Gate Result

The P0 launch gate command completed with passing command evidence and generated a report.

Expected current verdict:

`P0 STRUCTURALLY READY - EVIDENCE STILL REQUIRED`

This is not a production-complete verdict. It means the code and command surface are structurally ready, while manual/live deployment proof remains open.

## Deploy Evidence Result

`npm run deploy:evidence` passed the structural template check.

Remaining deployment/manual checks reported by the script:

1. Confirm UrAi CI/CD passes on main.
2. Confirm Firebase Hosting live deploy passes on main.
3. Record deployed URL.
4. Smoke deployed `/`, `/u/adamclamp`, waitlist, companion fallback, and `/home -> /` redirect.
5. Attach desktop/mobile evidence to issue #300.
6. Record rollback SHA before declaring production complete.

## Firestore Warning Still Present

`check:firestore-contract` passed, but still warns that production private indexes reference `userId` instead of `ownerUid` for:

- `timelineEvents`
- `memoryBlooms`
- `moodForecasts`
- `weeklyReflections`
- `narratorInsights`
- `passiveSignals`
- `relationshipSignals`

This warning is not blocking the current P0 structural gate, but it remains a production-hardening item.

## Remaining Manual Evidence

The P0 evidence gate still requires:

- desktop demo manually verified
- mobile demo manually verified
- waitlist Firestore persistence verified
- Firestore rules and indexes deployed
- private data read safety verified
- `/home` desktop smoke verified
- `/home` mobile smoke verified
- `/home` reduced-motion smoke verified
- `/home` Firebase emulator proof captured
- `/home` companion fallback verified
- 30-60 second demo recording captured
- deployed production URL recorded
- rollback SHA recorded

## Current Decision

Do not mark production complete yet.

Mark as:

`P0 STRUCTURALLY READY - EVIDENCE STILL REQUIRED`

Next launch step:

Run the full evidence gate with real proof values after manual/live checks are captured.
