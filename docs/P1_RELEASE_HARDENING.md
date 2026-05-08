# URAI P1 Release Hardening

P1 is the staging-to-production release discipline layer for URAI V1.

P1 does not add new product scope. It prevents a working P0 demo from turning into an unsafe or unrepeatable production deploy.

## Goal

A production promotion is allowed only when:

- the canonical P0 launch gate is green,
- staging and production targets are explicit,
- staging smoke tests have passed,
- the release candidate commit SHA is documented,
- the rollback commit SHA is documented,
- risky modules are behind flags or explicitly out of scope,
- production approval is explicit,
- deploys are not performed from ad hoc local branches.

## Required evidence

Set these values in the release environment, CI job, or local shell before running the strict P1 gate:

```bash
URAI_STAGING_PROJECT_ID="..."
URAI_PRODUCTION_PROJECT_ID="..."
URAI_RELEASE_CANDIDATE_SHA="..."
URAI_ROLLBACK_TARGET_SHA="..."
URAI_STAGING_SMOKE_TESTED=1
URAI_PRODUCTION_DEPLOY_APPROVED=1
```

Optional context values:

```bash
URAI_STAGING_DEPLOY_URL="https://..."
URAI_PRODUCTION_DEPLOY_URL="https://..."
URAI_RELEASE_NOTES_URL="https://..."
URAI_ROLLBACK_RUNBOOK_URL="https://..."
```

## Commands

Static P1 structure check:

```bash
npm run release:p1
```

Full local command gate:

```bash
URAI_P1_RUN_COMMANDS=1 npm run release:p1
```

Strict promotion gate:

```bash
URAI_P1_STRICT=1 \
URAI_P1_RUN_COMMANDS=1 \
URAI_STAGING_PROJECT_ID="..." \
URAI_PRODUCTION_PROJECT_ID="..." \
URAI_RELEASE_CANDIDATE_SHA="..." \
URAI_ROLLBACK_TARGET_SHA="..." \
URAI_STAGING_SMOKE_TESTED=1 \
URAI_PRODUCTION_DEPLOY_APPROVED=1 \
npm run release:p1
```

## Promotion sequence

1. Merge only a green P0 gate.
2. Cut or identify a release-candidate SHA.
3. Deploy that SHA to staging.
4. Run smoke tests against staging.
5. Confirm staging and production use the same architecture class and required Firebase resources.
6. Confirm rollback target SHA.
7. Approve production promotion.
8. Deploy only the verified release-candidate SHA.
9. Record deploy URL, release notes, rollback target, and smoke-test evidence in the P1 issue.

## Staging parity checklist

- [ ] Staging Firebase project ID documented.
- [ ] Production Firebase project ID documented.
- [ ] Firestore rules/indexes path matches production.
- [ ] Functions build/deploy path matches production.
- [ ] Required environment keys are documented without committing secret values.
- [ ] Public demo routes exist in staging and production.
- [ ] Waitlist persistence path is equivalent between staging and production.
- [ ] Private data read rules are equivalent between staging and production.

## Risky module flag checklist

Risky modules must be disabled, feature-flagged, or explicitly marked out of P1 scope before production promotion.

- [ ] Admin/debug surfaces.
- [ ] Story/export pipeline.
- [ ] Marketplace/payment surfaces.
- [ ] Spatial/XR surfaces.
- [ ] Relationship insights.
- [ ] Passive/private memory ingestion.
- [ ] Any AI flow that writes persistent user-facing state.

## Rollback requirements

A production deploy must have:

- known-good rollback commit SHA,
- exact command or hosting-provider action for rollback,
- Firebase rules/index rollback note,
- owner responsible for executing rollback,
- criteria for rollback decision.

## Production deploy rule

A production deploy is valid only if the deployed commit equals `URAI_RELEASE_CANDIDATE_SHA` and the P1 strict gate passes.

Do not treat local ad hoc deploys from unverified branches as production releases.

## Output

The P1 gate writes:

```txt
tmp/p1-release-gate-report.md
```

Attach or summarize that report in GitHub issue #191 before marking P1 done.
