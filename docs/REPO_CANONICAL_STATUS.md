# URAI Repository Canonical Status

Updated: 2026-07-06

## Current authority

- Canonical public application repository: `LifeLoggerAI/urai-spatial`
- Canonical public runtime root: `urai-tier1`
- Canonical public branch: `main`
- Intended production Firebase project/site: `urai-4dc1d`
- Public domain: `https://urai.app`
- Legacy/demo application repository: `LifeLoggerAI/UrAi`
- Canonical staging repository: `LifeLoggerAI/urai-staging`
- Canonical privacy/release gate: `LifeLoggerAI/urai-privacy`
- Canonical operator control plane: `LifeLoggerAI/urai-admin`
- Canonical async execution layer: `LifeLoggerAI/urai-jobs`

## Why this changed

This file previously identified `LifeLoggerAI/UrAi` as the canonical production application. Later evidence supersedes that classification:

1. Commit `5a9b4e65b8e167354baccc648b05d98f8b5860e0` and merged PR #352 removed automatic production deployment authority from `UrAi` and explicitly classified it as a legacy repository sharing the production Firebase target.
2. Closed PR #329 records the canonical runtime decision that `LifeLoggerAI/urai-spatial` / `urai-tier1` owns `https://urai.app`.
3. The July 6, 2026 `URAI System Architecture Spec v1` in the project Drive identifies `LifeLoggerAI/urai-spatial`, `urai-tier1`, `main`, `urai-4dc1d`, and `urai.app` as the current public authority.

## Repository classifications

| Repository | Classification | Production authority | Required action |
| --- | --- | --- | --- |
| `LifeLoggerAI/urai-spatial` | canonical public runtime | candidate, evidence-gated | record exact deployed SHA, rollback SHA, CI, custom-domain smoke, monitoring, and privacy-gate proof |
| `LifeLoggerAI/UrAi` | legacy/demo and feature-extraction source | no automatic production deploy authority | retain manual deployment lock; extract only reviewed capabilities into the canonical runtime |
| `LifeLoggerAI/UrAi-Dev` | sandbox | none | never deploy as production truth |
| `LifeLoggerAI/UrAiProd` | legacy/archive | none | archive or retain only as migration evidence |
| `LifeLoggerAI/urai-staging` | staging proving ground | staging only | require release-candidate SHA and staging evidence |
| `LifeLoggerAI/urai-privacy` | privacy/governance gate | release-gate authority | prove consent, export, deletion, retention, audit, monitoring, and rollback workflows |
| `LifeLoggerAI/urai-admin` | operator control plane | internal only | prove custom-claim bootstrap, least privilege, audit trails, monitoring, and rollback |
| `LifeLoggerAI/urai-jobs` | async execution service | service-specific only | prove idempotency, retry/dead-letter behavior, budgets, privacy gate, monitoring, and rollback |
| `LifeLoggerAI/asset-factory` | generation pipeline | service-specific only | require paid-provider approval, receipts, caps, artifact integrity, and promotion gates |

## Non-negotiable deployment rule

`LifeLoggerAI/UrAi` must not deploy automatically to `urai-4dc1d`. Any manual legacy deployment requires an explicit override, exact target confirmation, a passing legacy-specific release gate, a recorded deploy SHA, a rollback SHA, and proof that the canonical `urai-spatial` release will not be overwritten.

## Current truth about `LifeLoggerAI/UrAi`

`UrAi` contains substantial Next.js, Firebase, spatial, privacy, data-contract, test, and release-evidence work. It is not an empty archive. However, its public-facing routes are largely launch-safe demo or preview implementations, several private/account capabilities remain gated, the companion route is deterministic rather than provider-backed, and current production deployment evidence is incomplete. It is therefore a legacy/demo feature source, not the authoritative production application.

## Machine-readable status warning

`system/urai-system-registry.json` still identifies `LifeLoggerAI/UrAi` as `canonical-product`. That registry is now `OBSOLETE` for canonical ownership and must not drive deployment decisions until it is reconciled across the affected repositories and validated by automated contract tests.

## Required reconciliation

1. Update the ecosystem registry in the canonical owning repository.
2. Add a cross-repository contract test that fails when more than one repository claims the same public domain or Firebase production site.
3. Keep the legacy deploy workflow manual and protected.
4. Close or supersede stale production-launch PRs and issues in `UrAi` after preserving useful evidence.
5. Create a reviewed feature-extraction matrix from `UrAi` into `urai-spatial`; do not merge the repositories wholesale.
6. Record current production and rollback SHAs before any public production claim.
