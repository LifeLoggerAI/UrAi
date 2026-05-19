# URAI Tier-1 / Tier-2 Freeze System Audit

Date: 2026-05-19
Repository: `LifeLoggerAI/UrAi`
Branch: `audit/tier-freeze-system-ledger`
Base branch: `main`
Base SHA used for this audit branch: `01d72b5aac0f0ef480bad24f31e852252e540c37`

## Executive summary

This audit pass implements a repo-native Tier-1 / Tier-2 freeze ledger so URAI cannot be declared locked, frozen, or production-ready without explicit evidence. It adds a command that inventories the key launch systems, separates `Completed but not verified` from `Blocked`, writes a Markdown ledger to `tmp/tier-freeze-ledger.md`, and fails in strict mode while unresolved blockers remain.

This is intentionally conservative. The current repo has extensive V1, P0/P1/P2, Tier-2 access, completion, deployment, and closeout documentation, but several docs still require live runtime evidence, staging/production deployment proof, visual proof, and closure of open launch gates before Tier-1 or Tier-2 can honestly be called frozen.

## Baseline found

- Main app repository: `LifeLoggerAI/UrAi`.
- Default branch: `main`.
- Package manager: npm.
- App framework: Next.js 15, React 19, Firebase/Firestore, Firebase Functions.
- Existing package scripts include `check:v1`, `check:tier2-access`, `validate:completion`, `preflight`, `launch:p0`, `release:p1`, `test:unit`, `test:rules`, `typecheck`, `lint`, `build`, `test:smoke`, and deploy scripts.
- Existing V1 launch status says the V1 demo spine is implemented and repo-wired, but runtime/build/deploy validation is still pending.
- Existing closeout runbook requires release candidate SHA, rollback SHA, local structural gates, strict P1 evidence, staging checks, production readiness checks, visual proof, and a final demo recording.
- Existing launch gate register says production-readiness and deploy claims are blocked until fresh post-merge CI/deployment evidence is captured, and live-data/final-animation claims require separate gates.

## What changed in this pass

### Added

- `scripts/tier-lock/tier-freeze-ledger.mjs`
  - Generates `tmp/tier-freeze-ledger.md`.
  - Inventories Tier-1 and Tier-2 freeze-critical items.
  - Labels items as `Completed but not verified` or `Blocked` based on repo evidence.
  - Identifies whether each item blocks Tier-1 freeze, Tier-2 freeze, or both.
  - Provides required verification commands before freeze.
  - Supports `--strict` mode, which exits non-zero when blockers remain.

### Updated

- `package.json`
  - Adds `check:tier-freeze`.
  - Adds `check:tier-freeze:strict`.

### Added documentation

- `docs/audits/URAI_TIER_FREEZE_SYSTEM_AUDIT.md`
  - Captures this audit baseline, changed files, ledger behavior, blockers, and next commands.

## Tier-1 completion ledger summary

| Area | Current status | Evidence | Freeze impact |
| --- | --- | --- | --- |
| Public home route | Completed but not verified if route file exists | `src/app/page.tsx` | Needs smoke/visual proof before freeze |
| Public constellation route | Completed but not verified if route file exists | `src/app/u/[handle]/page.tsx` or `src/app/u/adamclamp/page.tsx` | Needs smoke/visual proof before freeze |
| Companion API | Completed but not verified if route exists | `src/app/api/companion/route.ts` | Needs valid/invalid prompt proof |
| Waitlist API | Completed but not verified if route exists | `src/app/api/waitlist/route.ts` | Needs dry-run and Firestore persistence proof |
| Firestore rules/indexes | Completed but not verified if files exist | `firestore.rules`, `firestore.indexes.json` | Needs rules test and staging deploy proof |
| V1 launch gates | Completed but not verified if scripts exist | `package.json` scripts | Needs command evidence |
| Release/deploy runbooks | Completed but not verified if docs exist | Launch/deploy/rollback docs | Needs filled release evidence |
| Fresh post-merge CI/deploy evidence | Blocked | Launch gate register gate #33 | Blocks Tier-1 freeze |

## Tier-2 completion ledger summary

| Area | Current status | Evidence | Freeze impact |
| --- | --- | --- | --- |
| Tier-2 canon standards | Completed but not verified if files exist | `docs/canon/TIER_2_CANON_STANDARDS.md`, `src/canon/tier2.ts` | Needs command evidence |
| Tier-2 access evaluator and API | Completed but not verified if files exist | `src/lib/tier-locks/evaluateTierLock.ts`, `src/app/api/tier-lock/tier2/route.ts` | Needs denied/allowed/API proof |
| Tier-2 seed and audit tooling | Completed but not verified if scripts exist | `seed:tier2`, `seed:tier2:firestore`, `check:tier2-access` | Needs dry-run/staging evidence |
| Tier-2 public route isolation | Completed but not verified if check exists | `scripts/tier-lock/tier2-access-check.mjs` | Needs check output evidence |
| Live-data and final-animation production claims | Blocked | Launch gate register gates #31 and #32 | Blocks final Tier-2 freeze |
| Fresh post-merge CI/deploy evidence | Blocked | Launch gate register gate #33 | Blocks Tier-2 freeze |

## Required commands after pulling this branch

Run the new ledger:

```bash
npm run check:tier-freeze
```

Run strict freeze gate. This is expected to fail until blockers are closed and evidence is attached:

```bash
npm run check:tier-freeze:strict
```

Run the release proof path:

```bash
npm install
npm run check:lockfile
npm run check:v1
npm run check:tier2-access
npm run launch:p0
npm run release:p1
npm run seed:demo
npm run test:unit
npm run test:rules
npm run typecheck
npm run lint
npm run build
npm run test:smoke
```

Run Functions verification:

```bash
cd functions
npm install
npm run build
cd ..
```

## Blockers that cannot be honestly bypassed

Tier-1 and Tier-2 cannot be called locked/frozen until these are resolved:

1. Fresh post-merge CI/deployment evidence must be captured and attached.
2. Staging route smoke evidence must be captured for the launch routes.
3. Production deploy approval and deploy URL must be recorded.
4. Rollback target SHA must be recorded.
5. Firestore rules/indexes/functions deploy proof must be captured when applicable.
6. Live Firebase client data claims must remain blocked until the live-data gate is closed.
7. Final Rive/Lottie animation claims must remain blocked until wrapper, fallback, reduced-motion, and visual evidence are committed.
8. Tier-2 public exposure must remain gated until Tier-1 is sealed and Tier-2 allowed/denied states pass tests.

## Final decision

Current decision after this implementation pass:

- Tier-1 freeze: **BLOCKED PENDING VERIFICATION EVIDENCE**.
- Tier-2 freeze: **BLOCKED PENDING VERIFICATION EVIDENCE AND OPEN GATE CLOSURE**.
- Deployment: **not appropriate to claim as final production-ready from this session alone** because this environment cannot run local npm/build/browser/Firebase deploy validation and the repo itself requires external CI/deployment evidence before production-readiness claims.

This branch improves the repo by making the freeze state explicit, repeatable, and failure-driven instead of subjective.
