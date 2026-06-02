# URAI Core Web Staging Evidence

## Purpose

This file captures the product-side staging evidence for `LifeLoggerAI/UrAi`. It must be completed together with the backend staging lock in `LifeLoggerAI/urai-staging`.

## Linked Trackers

- Core Web staging tracker: https://github.com/LifeLoggerAI/UrAi/issues/286
- Firebase staging backend tracker: https://github.com/LifeLoggerAI/urai-staging/issues/6

## Target

- Product repo: LifeLoggerAI/UrAi
- Backend/staging repo: LifeLoggerAI/urai-staging
- Staging URL: https://urai-staging.web.app
- Firebase project: urai-staging

## Required Product Checks

| Check | Command | Result |
|---|---|---|
| Firebase staging target | `npm run check:firebase:staging` | Pending |
| Product preflight | `npm run preflight` | Pending |
| Staging smoke | `npm run test:smoke:staging` | Pending |
| Release verifier | `npm run verify:release` | Pending |
| Staging deploy path | `npm run ship:urai:staging` | Pending |

## Required Backend Link

| Backend evidence | Status |
|---|---|
| `LifeLoggerAI/urai-staging` deploy evidence attached | Pending |
| `URAI_STAGING_LOCK.md` generated and committed | Pending |
| Backend issue #6 closed after evidence review | Pending |

## Decision Rule

Core Web staging is not locked until product checks pass and backend staging lock evidence is linked.

## Data Rule

Use synthetic data only for staging smoke. Do not use private production user content.
