# Launch Blocker Proof Plan - 2026-07-06

## Purpose

This plan records what must happen before URAI public launch claims can move from source-complete or demo-ready language into production-certified language.

## Current posture

URAI has public repositories, source docs, architecture docs, release evidence logs, privacy boundaries, and search-footprint docs.

Production certification remains blocked until exact deployment and verification receipts exist.

## Primary blockers

1. Exact-head CI evidence must complete on the current candidate branch.
2. The candidate branch must be reconciled with current main.
3. The exact passing SHA must be recorded.
4. A manual protected deployment must use a full target SHA and distinct rollback SHA.
5. Firebase project and hosting target must be verified.
6. Domain and route parity must be verified.
7. Public Status must display receipt-backed state.
8. Desktop and mobile screenshots must be captured.
9. Privacy gates must pass.
10. Provider-backed assets, physical XR/device support, and production persistence must remain false unless receipts exist.

## Required receipt set

- exact tested SHA;
- exact passing SHA;
- exact deployed SHA;
- rollback SHA;
- build output;
- test output;
- deployment output;
- route proof;
- domain proof;
- Status receipt;
- screenshot proof;
- privacy gate proof;
- rollback proof;
- known limitations.

## Public language before proof closes

Use:

> URAI is in an evidence-gated public demo and launch-hardening phase.

Do not use:

> production certified
> fully launched
> provider-backed
> device certified
> legally complete
> clinically validated

## Next action

Restore GitHub Actions scheduling/capacity, rerun only latest exact-head checks, merge only passing exact head, and deploy only through the protected workflow with target and rollback SHA evidence.
