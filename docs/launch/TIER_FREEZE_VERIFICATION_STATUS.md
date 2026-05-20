# Tier Freeze Verification Status

This file records the current gate status without claiming launch readiness.

## Current verified fixes

- Firestore Tier 2 policy contract anchors are restored.
- Canonical Firestore rules tests passed in CI after the rules reconciliation work.
- Unit tests passed in CI after the focus/replay runtime contract work.
- The `/home` route imports the resolved scene through its default export.
- The Firestore contract checker accepts the canonical owner helper names used by the current rules.

## Current remaining evidence required before lock

Tier 1 and Tier 2 are not considered locked until the Launch Gate completes on current `main` after the contract-checker fix and produces fresh evidence for:

- preflight
- tier lock
- smoke tests
- build
- route verification

## Policy

Do not mark Tier 1 locked, Tier 2 locked, launch-ready, final, or frozen unless those current-main verification steps pass and the evidence is available.
