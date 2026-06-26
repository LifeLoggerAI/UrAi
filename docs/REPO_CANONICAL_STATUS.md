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
