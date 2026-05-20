# URAI Staging Release Status

This repository owns the Core Web product surface and product-side staging evidence.

The Firebase staging backend and validation shell are tracked in LifeLoggerAI/urai-staging.

## Trackers

- Core Web product tracker: https://github.com/LifeLoggerAI/UrAi/issues/286
- Backend staging tracker: https://github.com/LifeLoggerAI/urai-staging/issues/6

## Current Decision

URAI staging should not be marked fully locked until both product-side evidence and backend-side evidence are attached to their trackers.

## Evidence Required

- Product staging checks completed.
- Product staging smoke completed.
- Release verifier completed.
- Backend staging deploy completed.
- Backend smoke completed.
- Final backend lock evidence linked.

## Data Rule

Use synthetic staging data only. Do not use private production user content in smoke checks.
