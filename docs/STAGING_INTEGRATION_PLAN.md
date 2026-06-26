# Staging Integration Plan

Updated: 2026-06-25

`LifeLoggerAI/urai-staging` is the only approved integration proving ground for the canonical URAI app.

## Staging Objectives

1. Prove canonical `UrAi` deploy wiring without using legacy or sandbox repos
2. Prove privacy gating behavior before production rollout
3. Prove operator visibility via `urai-admin`
4. Prove async background behavior via `urai-jobs`

## Required Phase Order

1. `UrAi` target/env lock
2. `urai-staging` smoke and readiness checks
3. privacy adoption and release gate checks
4. admin control-plane validation
5. jobs runtime validation
6. only then add later subsystems in controlled staging tests

## Staging-Only Rule

No production claims may be derived from staging-only success unless the corresponding production evidence is separately captured.
