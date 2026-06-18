# URAI Canonical Final Release Lock Handoff — 2026-06-18

## Current repo truth

Repository: `LifeLoggerAI/UrAi`

Default branch: `main`

Canonical production source: `LifeLoggerAI/UrAi`

Do not use `UrAi-Dev` or `UrAiProd` as the production source unless a later signed promotion record explicitly changes the canonical source.

Latest confirmed visible merge: PR #342, `Passport foundation pass 1`

Confirmed merge commit: `981d7551b846e9fc48e4800241ec1c4e65435e9e`

## Final-product rule

This repo must not be called fully production locked until the current `main` head has fresh proof for all of the following on a clean Node twenty release machine:

```bash
npm ci
npm run ci
npm run preflight
npm run urai:tier5
npm run verify:release:full
npm run deploy:evidence
npm run live:check
```

For the canonical launch lock, the required aggregate gates are:

```bash
npm run preflight && npm run urai:tier5 && npm run verify:release:full && npm run deploy:evidence
```

## What the gates prove

| Gate | Required proof |
| --- | --- |
| `npm run ci` | Doctor, V1 checks, Genesis checks, Tier-Two access, demo seed, typecheck, lint, unit tests, rules tests, and build. |
| `npm run preflight` | Firebase target check, V1, Genesis, Firestore contract, public copy, completion audit, typecheck, lint, unit tests, and build. |
| `npm run urai:tier5` | Tier-One lock, Tier-Three audit, Tier-Four deploy readiness, and Tier lock report. |
| `npm run verify:release:full` | Independent release verifier with command execution enabled. |
| `npm run deploy:evidence` | Deployment evidence is present and valid before launch claims. |
| `npm run live:check` | Canonical live-check path, currently mapped to full release verification. |

## Production call

Status as of this handoff: **canonical release scripts exist and major route/passport/system work is merged, but full product lock is not claimable until the command matrix above passes on current `main` and deploy/live evidence is recorded.**
