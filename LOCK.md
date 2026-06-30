# URAI Release Lock

## commit

Current locked branch: `main`.

Current local release baseline is tracked against the latest clean `origin/main` state at the time this lock file was written. Record the exact commit SHA from `git rev-parse HEAD` before any production promotion.

## Firebase

Firebase Hosting public surface has been deployed for the URAI public web/spatial experience.

This lock does not claim that all Firebase Functions are production-complete. Backend functions for ingestion, enrichment, intelligence generation, export/deletion, entitlement syncing, metrics rollups, and system checks remain gated until independently verified.

## Node

Node/Next build path is verified through the project package scripts and local build checks.

## test

Local automated tests pass for the public surface and current safety/rules coverage.

Verified command categories include:
- unit tests
- rules tests
- e2e tests
- smoke tests

## build

The Next.js production build passes for the public URAI surface.

## deploy

Firebase Hosting deploy has succeeded for the public surface.

Deployment evidence checks are present and wired through the release flow.

## staging

Staging/full-system promotion is not unlocked by this file.

Backend Firebase Functions and Firestore domain proof remain required before full staging approval.

## production

Public web surface: deployed.

Full backend production: gated.

URAI must not claim full backend production readiness until:
- required Firebase Functions are implemented, protected, tested, and referenceable
- required Firestore domains have type/schema/path/rules/test coverage
- consent gates are implemented and enforced
- export/deletion/admin/entitlement/intelligence workflows are verified
- independent release verification returns production-ready without failed or unverified blockers
