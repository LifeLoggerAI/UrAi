# UrAi Repository Authority

Updated: 2026-10-09

Status: **QUARANTINED LEGACY / REFERENCE REPOSITORY**

The canonical product repository is `LifeLoggerAI/urai-spatial`, with application root `urai-tier1`, branch `main`, and domain `urai.app`. This repository (`LifeLoggerAI/UrAi`), `LifeLoggerAI/UrAi-Dev`, and `LifeLoggerAI/UrAiProd` retain historical source and evidence; they have no staging or production deployment authority.

Read [the machine-readable repository authority](../system/canonical-authority.json), [the quarantine controls](LEGACY_QUARANTINE_AUTHORITY.md), and [the production deployment boundary](LEGACY_PRODUCTION_DEPLOY_DISABLED.md). The machine record's dated `certifiedProductionSha` is retained historical evidence and does not identify the current deployed revision or approve a current release.

The June 25 record below is **historical and superseded**. Its description of this repository as canonical and its service readiness labels, including Jobs' former “production-live” label, are not current authority. Preserve the record for provenance; resolve each service's present source, deployed revision, runtime evidence, and release requirements through its owning repository and the current Labs governance register.

Current cross-system provenance is maintained by `LifeLoggerAI/urai-labs-llc:governance/cross-system-canon-provenance.json`; release decisions use `governance/system-candidate-20261003.json` at a freshly resolved exact Labs governance commit. This document grants no deployment, credential, provider, review, or release authority.

## Historical June 25 record — superseded

# URAI Repo Canonical Status

Updated: 2026-06-25

## Canonical Truth

- Canonical product repo: `LifeLoggerAI/UrAi`
- Canonical staging repo: `LifeLoggerAI/urai-staging`
- Canonical privacy/release gate: `LifeLoggerAI/urai-privacy`
- Canonical operator control plane: `LifeLoggerAI/urai-admin`
- Canonical async execution layer: `LifeLoggerAI/urai-jobs`

## Explicit Non-Canonical Repos

- `LifeLoggerAI/UrAi-Dev`: sandbox/dev only
- `LifeLoggerAI/UrAiProd`: legacy/archive only

## Repo Status Summary

| Repo | Status | Why |
| --- | --- | --- |
| `LifeLoggerAI/UrAi` | canonical but not yet fully production-claimable | live front door exists, but Genesis proof set is incomplete |
| `LifeLoggerAI/UrAi-Dev` | sandbox only | README explicitly says it is not production truth |
| `LifeLoggerAI/UrAiProd` | legacy/archive | README explicitly says it must not be deployed as production |
| `LifeLoggerAI/urai-staging` | staging | staging shell and smoke endpoints exist, but evidence file still says blocked |
| `LifeLoggerAI/urai-privacy` | blocked governance gate | repo is strong, live proof still incomplete |
| `LifeLoggerAI/urai-admin` | blocked internal runtime | repo is strong, live operator proof incomplete |
| `LifeLoggerAI/urai-jobs` | production-live service with evidence | repo includes production validation and live URL evidence |
| `LifeLoggerAI/urai-content` | canonical service, not standalone-live | safe to consume as content source, not safe to overclaim as launched standalone site |
| `LifeLoggerAI/urai-spatial` | partial | good scaffolding, not launch-proven |
| `LifeLoggerAI/urai-analytics` | blocked | preview/staging only until durable live evidence exists |
| `LifeLoggerAI/asset-factory` | partial | verified Firebase base exists, custom domain still blocked |
| `LifeLoggerAI/urai-storytime` | blocked | README explicitly says not live-published verified |
| `LifeLoggerAI/urai-communications` | blocked pilot | provider/compliance proof missing |
| `LifeLoggerAI/urai-marketing` | scoped live public surface | live on Firebase URL for current scope |
| `LifeLoggerAI/urai-investors` | partial public surface | live app front door exists, but full proof is incomplete |
| `LifeLoggerAI/B2Bportal` | partial public surface | production evidence gate still open |
| `LifeLoggerAI/urai-labs-llc` | blocked public surface | stale launch language explicitly called out in repo |
| `LifeLoggerAI/urai-foundation` | blocked governance surface | repo ready, DNS cutover still blocked |
| `LifeLoggerAI/urai-studio` | blocked public surface | evidence ledger still incomplete |
