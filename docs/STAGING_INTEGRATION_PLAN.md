# Staging Integration Plan

Updated: 2026-06-25

`LifeLoggerAI/urai-staging` is the only approved integration proving ground for the canonical URAI app.

## Staging Objectives

1. Prove canonical `UrAi` deploy wiring without using legacy or sandbox repos
2. Prove privacy gating behavior before production rollout
3. Prove operator visibility via `urai-admin`
4. Prove async background behavior via `urai-jobs`
5. Prove `urai-content` as a safe source/template dependency before any standalone launch

## Required Phase Order

1. `UrAi` target/env lock
2. `UrAi` `/system` route build and staging smoke proof
3. `urai-staging` smoke and readiness checks
4. privacy adoption and release gate checks
5. admin control-plane validation
6. jobs runtime validation without real job execution
7. content/template validation as source package
8. only then add later subsystems in controlled staging tests

## Current Staging Evidence

| Repo | State | Evidence |
| --- | --- | --- |
| `LifeLoggerAI/UrAi` | blocked | Public root returns 200, but `/system` marker is not live at checked URL; local build/checks blocked by tooling |
| `LifeLoggerAI/urai-staging` | staging_deployed | Root URL returns 200; static registry and health endpoint returned 404 |
| `LifeLoggerAI/urai-privacy` | not_checked | Public privacy URL returns 200; no staging Firebase binding found |
| `LifeLoggerAI/urai-admin` | blocked | Public admin URL returned 503; no staging alias found |
| `LifeLoggerAI/urai-jobs` | staging_deployed | Public jobs URL returns 200; staging alias proof incomplete |
| `LifeLoggerAI/urai-content` | blocked | Deploy is intentionally blocked; no staging URL found |

## Staging-Only Rule

No production claims may be derived from staging-only success unless the corresponding production evidence is separately captured.

## Safety Rule

Spatial, asset factory, analytics, communications, storytime, passive sensing, outbound messaging, therapy-adjacent claims, monetization, and provider integrations remain deferred until privacy, consent, export/delete, admin audit, provider, and smoke evidence gates are complete.
