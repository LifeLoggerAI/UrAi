# URAI Tier 1-4 Freeze Ledger

Last updated: 2026-05-19
Branch: `main`
Repository: `LifeLoggerAI/UrAi`

## Freeze posture

Tier 1 and Tier 2 are production locked by the current deploy gate. Tier 3 and Tier 4 are implemented as canonical gated layers in the shared Life Map route shell and are promoted to default-on feature flags. Final lock remains dependent on the production deploy workflow passing after this ledger and smoke expansion land.

## Branch and PR safety

Current emergency production stabilization has been performed directly on `main` because the repository production deploy gate is configured from `main`, previous deploy fixes were needed immediately, and the user requested autonomous repo completion. Future non-emergency Tier 5/governance work should use a named branch and PR before merge.

## Tier status ledger

| Tier | Status | Evidence | Lock condition |
| --- | --- | --- | --- |
| Tier 1 | LOCKED pending final post-change deploy rerun | Canonical routes `/home`, `/life-map`, `/life-map/star/:starId`, `/focus`, `/focus/session/:sessionId`, `/replay`, `/replay/:replayId`; route machine attributes; production smoke route coverage. | Deploy production workflow and production smoke must pass after current changes. |
| Tier 2 | LOCKED pending final post-change deploy rerun | `TierTwoInteractionPanel` renders star preview, filters/privacy, focus state, replay state, and critical flow links. | Production smoke must continue to pass with Tier 2 active. |
| Tier 3 | IMPLEMENTED / NOT FINAL-FROZEN until final smoke passes | `tier-three-four.ts` defines constellation model, grouping, visible-star filtering, progression paths, pinned/hidden/deleted exclusion, dense-map fixture, and LOD budget. `LifeMapUniverse` renders `[data-tier-three-layer='active']`. | Final production smoke must pass with `[data-tier-three='true']` and `[data-tier-three-layer='active']`. |
| Tier 4 | IMPLEMENTED / NOT FINAL-FROZEN until final smoke passes | `tier-three-four.ts` defines replay journeys, source-backed policy, artifact unlock model, redaction requirement, and performance budgets. `LifeMapUniverse` renders `[data-tier-four-layer='active']`. | Final production smoke must pass with `[data-tier-four='true']` and `[data-tier-four-layer='active']`. |

## Environment and secrets matrix

| Variable | Required | Local expectation | Staging expectation | Production expectation | Owner | Used by | Missing behavior | Blocks deployment |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `FIREBASE_SERVICE_ACCOUNT` | Required for deploy | Not needed unless deploying | Staging deploy service account JSON | Production service account JSON for `urai-4dc1d` | Release owner | GitHub Actions deploy | Deploy credential validation fails | Yes |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Required for live Firebase client | `.env.local` public config | staging Firebase app config | production Firebase app config | App owner | Firebase client/status API | status API degraded | Yes for full production readiness |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Required | local/staging auth domain | staging auth domain | production auth domain | App owner | Firebase client/status API | status API degraded | Yes |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Required | local/staging project | staging project | `urai-4dc1d` | App owner | Firebase client/status API | status API degraded | Yes |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Required | local/staging bucket | staging bucket | production bucket | App owner | Firebase client/status API | status API degraded | Yes |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Required | local/staging sender | staging sender | production sender | App owner | Firebase client/status API | status API degraded | Yes |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Required | local/staging app id | staging app id | production app id | App owner | Firebase client/status API | status API degraded | Yes |
| `FIREBASE_FUNCTIONS_REGION` | Optional but expected | unset allowed | configured if functions enabled | configured if functions enabled | Release owner | status API/functions | status API degraded | No unless functions are required for flow |
| `NEXT_PUBLIC_FUNCTIONS_ORIGIN` | Optional but expected | unset allowed | staging function origin | production function origin | Release owner | status API/functions | deterministic fallback | No unless callable functions are required |
| `NEXT_PUBLIC_NARRATOR_API_BASE` | Optional | unset fallback | staging narrator endpoint | production narrator endpoint | AI owner | narrator/status surfaces | deterministic fallback copy | No |
| `NEXT_PUBLIC_URAI_FLAG_LIFE_MAP_TIER_1` | Optional override | default true | true | true | Release owner | route shell | disables dependent tiers if false | Yes if false |
| `NEXT_PUBLIC_URAI_FLAG_LIFE_MAP_TIER_2` | Optional override | default true | true | true | Release owner | Tier 2 panel | hides Tier 2 extras | Yes for Tier 2 lock if false |
| `NEXT_PUBLIC_URAI_FLAG_LIFE_MAP_TIER_3` | Optional override | default true | true | true | Release owner | Tier 3 constellation layer | disables Tier 3/4/5 | Yes for Tier 3/4 lock if false |
| `NEXT_PUBLIC_URAI_FLAG_LIFE_MAP_TIER_4` | Optional override | default true | true | true | Release owner | Tier 4 journey/artifact layer | disables Tier 4/5 | Yes for Tier 4 lock if false |
| `NEXT_PUBLIC_URAI_FLAG_LIFE_MAP_TIER_5` | Optional override | default false | false | false | Release owner | future Tier 5 | mature governance hidden | No for Tier 1-4 |

## Database and migration readiness

No destructive schema migration is introduced by the current Tier 3/4 implementation. Tier 3 and Tier 4 use deterministic fixtures and canonical adapters only. Migration is not required before deploy. Before connecting real persistence for star preferences, replay journeys, artifact unlocks, or user-specific constellations, create a reversible migration covering legacy records, deleted/vaulted exclusions, and seed compatibility.

Rollback path: revert the commits adding `src/lib/urai-canon/tier-three-four.ts`, the Life Map shell wiring, default flag promotion, and smoke expansions. Alternatively set `NEXT_PUBLIC_URAI_FLAG_LIFE_MAP_TIER_3=false` or `NEXT_PUBLIC_URAI_FLAG_LIFE_MAP_TIER_4=false` to activate safe fallbacks without code rollback.

## Auth and privacy readiness

The current canonical Tier 3/4 implementation does not query user-specific private data. Visible-star filtering excludes hidden and deleted records before layout. Vaulted stars render as locked/protected metadata only. Replay journeys are source-backed and export review-gated; artifacts require redaction before unlock/share.

Before connecting real user data, verify unauthenticated, authenticated, expired session, missing profile, permission denied, cross-user direct URL isolation, vaulted replay isolation, and deleted derivative cleanup.

## Feature flag matrix

Tier 1 through Tier 4 flags have explicit env keys, safe fallbacks, dependency integrity checks, and production smoke checks. Disabled behavior must render a safe shell, not a 404.

## Production content audit

Current Tier 1-4 route copy avoids lorem ipsum, fake medical claims, therapy claims, and unsupported AI truth claims. AI/narrator language stays deterministic and fallback-safe. Locked/vaulted/deleted states are represented as protected metadata, not user content.

## Accessibility check

Current shell includes semantic headings, nav labels, direct-loadable routes, large tap targets, reduced-motion flag support, and non-motion route state text. Remaining hardening before final product-wide lock: full keyboard traversal pass, focus ring screenshot pass, and screen-reader pass across every modal/overlay once cinematic controllers are deeper than static shell.

## Performance budgets

| Surface | Budget |
| --- | --- |
| Initial route load | <= 2500 ms |
| Dense-map render | <= 120 ms |
| Constellation layer render | <= 160 ms |
| Replay journey transition | <= 220 ms |
| Artifact unlock animation | <= 300 ms |
| Mobile memory | <= 256 MB |
| Asset preload | <= 900 KB |

Tier 4 keeps advanced cinematics disabled by default and uses static premium depth, not heavy camera paths.

## Observability and security

Production status is exposed through `/api/status`. Deploy verification checks `/`, `/home`, and `/api/status`. Logging must remain content-safe and never include private replay, focus, or memory content. Analytics must remain metadata-only.

## Export/share/delete readiness

Export/share is not exposed as a completed public action in this implementation. Tier 4 artifacts are review-gated and redaction-required. Real export/share/delete remains blocked until revoke/delete and derivative cleanup are backed by persistence.

## Release and rollback readiness

Build command: `npm run build`
Deploy command: `gh workflow run deploy.yml --ref main`
Smoke command: production workflow `Verify production browser smoke`
Rollback command: revert the final Tier 3/4 commits or set Tier 3/Tier 4 env flags to false.
Stop-the-release criteria: build failure, production route 404 after retry window, smoke failure, deploy credential failure, privacy regression, or hidden/deleted content becoming visible.

## Visual QA lock

Production smoke verifies route presence and core surfaces. Manual screenshot QA still required for full visual lock: `/home`, `/life-map`, `/life-map/star/starter-star`, `/focus`, `/focus/session/starter-session`, `/replay`, `/replay/starter-replay`, locked state, empty state, error state, reduced-motion state, mobile viewport, and desktop viewport.

## Final crosswalk

| Source/spec | Requirement group | Implemented files | Tests/checks | Tier | Status | Blocker |
| --- | --- | --- | --- | --- | --- | --- |
| Uploaded Tier 1-5 freeze instructions | Route shell/state/flags/deploy evidence | `LifeMapUniverse`, feature flags, deploy workflow | production smoke | Tier 1-4 | implemented | final post-change deploy rerun |
| Orb/sky/horizon/visual standard | Moonlit sacred-tech visual shell | `LifeMapUniverse`, home shell | smoke + manual visual QA | Tier 1-4 | implemented as shell | screenshot QA pending |
| Life Map/star specs | star routes, selected state, locked/vaulted/hidden/deleted handling | `LifeMapUniverse`, `TierTwoInteractionPanel`, `tier-three-four.ts` | production smoke expanded | Tier 1-3 | implemented | real persistence migration deferred |
| Focus specs | setup/session direct-load and state | `LifeMapUniverse`, state machines | production smoke | Tier 1-2 | implemented | deeper session persistence deferred |
| Replay specs | library/detail/state/replay journey/artifacts | `LifeMapUniverse`, `tier-three-four.ts` | production smoke expanded | Tier 1-4 | implemented | export/delete backend deferred |
| Deployment specs | build/deploy/smoke/rollback | `.github/workflows/deploy.yml`, this ledger | production deploy workflow | Tier 1-4 | implemented | final rerun required |
| Phase 13.5 gap closure | env, migration, auth, privacy, flags, perf, observability, rollback | this ledger | doc review + deploy gate | Tier 1-4 | documented | final rerun required |
