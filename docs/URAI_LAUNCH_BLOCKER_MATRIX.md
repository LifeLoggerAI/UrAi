# URAI Launch Blocker Matrix — Archived Legacy Record

Status: **SUPERSEDED / NON-EXECUTABLE / LEGACY REFERENCE**

This file previously described `LifeLoggerAI/UrAi` as a core public deployment authority. That model is obsolete.

Canonical production authority is exclusively:

`LifeLoggerAI/urai-spatial` → `urai-tier1` → `main` → `urai.app`

Machine-readable authority: `system/canonical-authority.json`.

## Current authority boundary

- `LifeLoggerAI/UrAi` is quarantined legacy/reference source.
- This repository must not deploy Hosting, Firestore, Functions, App Hosting, DNS, or any public URAI surface.
- Historical commands, Firebase targets, domains, issue references, and release paths in earlier revisions are not executable authority.
- Any useful feature must be extracted through a bounded reviewed candidate in the correct canonical repository.
- No legacy artifact or branch is a production rollback authority unless explicitly imported and certified through `urai-spatial`.

## Current public-production truth

The last certified public Spatial deployment recorded by the owner ledger is:

- repository: `LifeLoggerAI/urai-spatial`
- application: `urai-tier1`
- branch: `main`
- deployed SHA: `e2850a8b9dbd2fd11ee0197505da278322916aa0`
- protected run: `29428539402`

Later Spatial source revisions are governed by release-control issue `LifeLoggerAI/urai-spatial#614` and must not be called deployed or certified without exact protected receipts.

## Current legacy containment truth

- Source-containment candidate: `LifeLoggerAI/UrAi#365`
- External repository-settings and credential-remediation authority: `LifeLoggerAI/UrAi#364`
- UrAi-Dev and UrAiProd remain separate legacy/quarantine authorities.
- Repository CI may prove source containment only; it cannot prove provider-side revocation, repository settings, retained artifacts, historic objects, caches, clones, or backups.

## Archived capability boundaries

The following capabilities are not activated or certified by this legacy repository:

- passive sensing
- diagnosis or therapist claims
- marketplace or user-data selling
- AR, VR, or XR launch
- enterprise admin access
- Studio/export/media pipelines
- provider-backed generation
- jobs marketplace or employer products

## Prohibited operator action

Do not run historical production deploy, evidence, smoke, DNS, Firebase, or secret-backed commands from this repository. Use the current canonical repository, protected workflows, exact-head review, named environment, rollback target, monitoring, and retained receipts.

## Historical interpretation rule

Earlier revisions of this file remain historical evidence only. They must not be used to decide current release authority, deployment target, production status, or rollback ownership.
