# URAI Production Rollback Plan

Generated: 2026-06-25

## Current State

Rollback evidence is missing. Production launch is blocked until rollback evidence is recorded.

## Required Rollback Evidence

Before any production cutover, record:

- release candidate commit SHA
- rollback commit SHA or previous deployed version identifier
- Firebase hosting version or channel to roll back to
- exact rollback command
- operator responsible for rollback
- expected rollback smoke commands
- maximum tolerated rollback time
- monitoring alert that triggers rollback
- post-rollback verification output

## Candidate Rollback Commands To Verify

These commands are documented or implied by repo scripts but were not executed in this pass:

| Repo | Candidate rollback command | Status |
| --- | --- | --- |
| LifeLoggerAI/UrAi | Not proven; likely Firebase Hosting rollback/version restore must be documented | Missing |
| LifeLoggerAI/urai-staging | `docs/STAGING_ROLLBACK_PLAN.md` exists; production rollback not applicable | Staging-only |
| LifeLoggerAI/urai-admin | `pnpm rollback:production` / `bash scripts/rollback-production.sh` | Not executed; admin blocked |
| LifeLoggerAI/urai-jobs | `npm run prod:rollback-worker` for workers; Firebase rollback still needs proof | Not executed |
| LifeLoggerAI/urai-content | `npm run smoke:rollback`; deploy script intentionally blocked | Standalone launch blocked |
| LifeLoggerAI/urai-privacy | No production rollback proof recorded in this pass | Missing |

## Rollback Acceptance Criteria

- Rollback target is immutable and belongs to the same Firebase/hosting project being launched.
- Rollback can be executed without adding secrets to the repo.
- Smoke checks pass after rollback.
- Monitoring shows recovery or incident owner acknowledges remaining degradation.
- Evidence is pasted into `docs/PRODUCTION_SMOKE_EVIDENCE.md` or the repo-specific evidence log.

## Current Decision

No production rollback path is proven. Production launch remains NO-GO.
