# LifeLoggerAI/UrAi Repository Completion Audit

Date: 2026-07-06  
Audit branch: `audit/urai-v50-v200-2026-07-06`  
Audited repository: `LifeLoggerAI/UrAi`  
Audited branch: `main`  
Main SHA at audit start: `5a3ce86542f762d5ce8a6b5c9c023246bf844150`  
Direct parent / rollback candidate: `5a9b4e65b8e167354baccc648b05d98f8b5860e0`  

## 0. Evidence boundary

This audit used the connected GitHub installation, repository files, commit/PR/issue metadata, workflow definitions, and current URAI Drive architecture material. The authenticated GitHub identity has `admin` permission on the repository.

A local checkout could not be obtained in the current execution container because outbound GitHub DNS resolution was unavailable. Therefore current install, typecheck, lint, test, build, emulator, browser, bundle, dependency-audit, and live-deploy commands were **not run in this audit**. Historical PR descriptions and committed evidence documents are treated as historical claims, not fresh proof.

No production data was modified. No paid provider was invoked. No production deployment was triggered.

Status vocabulary used throughout:

- `VERIFIED COMPLETE`
- `IMPLEMENTED BUT UNVERIFIED`
- `PARTIALLY BUILT`
- `STUB OR PLACEHOLDER`
- `BROKEN`
- `MISSING`
- `BLOCKED`
- `OBSOLETE`
- `DUPLICATED`
- `NEEDS DECISION`

---

# 1. Executive truth report

## What this repository is

`LifeLoggerAI/UrAi` is a very large public Next.js/Firebase application and historical URAI integration repository. It contains real UI, spatial/3D experiments, Firebase rules and indexes, server routes, demo data, tests, release gates, architecture documents, and extensive launch-evidence material. It is not an empty prototype.

It is also no longer the authoritative public production runtime. Commit `5a9b4e65b8e167354baccc648b05d98f8b5860e0`, merged PR #352, closed PR #329, and the July 6 architecture specification all establish that `LifeLoggerAI/urai-spatial` / `urai-tier1` owns `urai.app`, while automatic production deploy authority was removed from `UrAi` because both repositories referenced the shared Firebase target `urai-4dc1d`.

**Classification:** `OBSOLETE` as production authority; `PARTIALLY BUILT` as a legacy/demo application; valuable as a reviewed feature-extraction and evidence source.

## What genuinely works in source

- Root and `/home` both render `NewHomeScene`.
- `/life-map` and `/focus` enter the shared `SpatialLifeMap` implementation.
- `/ground`, `/replay`, `/passport`, and `/privacy-controls` are coherent public preview routes with explicit safety boundaries.
- `/api/companion` returns deterministic normalized responses.
- `/api/waitlist` validates input, performs a process-local rate check, and can write through Firebase Admin when configured.
- Firestore and Storage rules default-deny unknown paths and include owner/admin controls.
- The repository has meaningful unit, rules, Playwright, route, copy, production-claim, and release-verification scripts.
- The lockfile currently reflects the declared root dependencies.

These are source findings. They are not current production verification.

## What is not operational or not proven

- This repository is not authorized to auto-deploy the public production app.
- No current CI status is attached to the audit-start main SHA through the available status endpoint.
- No fresh install/build/test/emulator/browser evidence was produced in this audit.
- The exact SHA currently deployed at `urai.app` is not proven by this repository.
- The direct parent SHA is only a rollback candidate, not a tested rollback.
- Account creation, authentication, private data, export, deletion, admin, monitoring, and incident-response flows are not production-verified here.
- Companion behavior is deterministic, not a production AI-provider integration.
- Major public routes are previews or sample-data experiences, not real user-data systems.
- The Functions package is not wired into the root `firebase.json` deployment configuration.
- App Check, durable abuse protection, provider budgets, and comprehensive observability are not proven.

## Production readiness verdict

**`BLOCKED` for production deployment and `OBSOLETE` as the public production authority.**

The correct V50 objective is not to redeploy this repository. It is to contain the legacy deploy path, reconcile canonical ownership, secure and verify any retained services, and extract selected capabilities into `urai-spatial` through explicit contracts.

## Five biggest strengths

1. **Substantial source surface:** real Next.js routes, Firebase contracts, spatial UI, tests, and operational documentation.
2. **Truth-oriented launch gates:** many scripts explicitly prevent unsupported production, privacy, and provider claims.
3. **Owner/admin rule posture:** unknown Firestore and Storage paths are denied by default.
4. **Public-preview safety language:** Ground, Replay, Passport, and Privacy Controls clearly distinguish preview from private runtime.
5. **Strong extraction value:** shared data contracts, spatial components, test patterns, evidence gates, and release scripts can inform the canonical runtime.

## Ten biggest deficiencies

1. Contradictory canonical-repository records across docs and `system/urai-system-registry.json`.
2. Shared Firebase production target with the canonical runtime.
3. Repository size around 1.62 GB and committed npm cache/build-like debris.
4. No current reproducible CI proof on the audit-start SHA.
5. CI uses `npm install` instead of frozen `npm ci` despite a lockfile.
6. No isolated staging project in root `.firebaserc`; default equals production.
7. Firestore public submission rules validate only that `createdAt` exists.
8. Storage owner paths have no file-size or content-type restrictions.
9. Export/deletion UI and request collections exist without verified end-to-end fulfillment and deletion cascade.
10. Multiple duplicate UI/data/runtime implementations and stale launch documents create maintenance and release ambiguity.

## Most serious risks

| Risk class | Serious risk | Severity |
| --- | --- | --- |
| Deployment | A manual legacy deploy can overwrite the canonical app on shared `urai-4dc1d` | Critical |
| Security/abuse | Direct public Firestore submissions can be spammed with weak schema constraints | High |
| Cost | Storage uploads are owner-unbounded; provider packages lack proven budgets/kill switches | High |
| Privacy | Account deletion cannot be proven to remove nested/private/provider-derived data | Critical |
| Data integrity | `ownerUid`, `userId`, and `uid` coexist as ownership keys | High |
| Reliability | Process-local waitlist rate limiting resets per instance and is not distributed | Medium-High |
| Supply chain | Committed npm cache material and very large repository increase audit and clone risk | High |
| Product truth | Static preview routes can be mistaken for integrated private product capabilities | High |
| Operations | No verified deploy SHA, rollback drill, monitoring, alerting, or incident runbook receipt | Critical |
| Governance | Machine registry still identifies the legacy repository as canonical | Critical |

---

# 2. Authority and repository state

| Item | Finding | Status |
| --- | --- | --- |
| Repository | `LifeLoggerAI/UrAi` | `VERIFIED COMPLETE` |
| Visibility | Public | `VERIFIED COMPLETE` |
| Authenticated permission | Admin, with push/maintain/triage/pull | `VERIFIED COMPLETE` |
| Default branch | `main` | `VERIFIED COMPLETE` |
| Main SHA | `5a3ce86542f762d5ce8a6b5c9c023246bf844150` | `VERIFIED COMPLETE` |
| Direct parent | `5a9b4e65b8e167354baccc648b05d98f8b5860e0` | `VERIFIED COMPLETE` |
| Known-good SHA | None established by fresh audit evidence | `BLOCKED` |
| Rollback SHA | Direct parent is a candidate only | `IMPLEMENTED BUT UNVERIFIED` |
| Package manager | npm with lockfile v3 | `VERIFIED COMPLETE` |
| Root Node runtime | Node 20 | `VERIFIED COMPLETE` |
| Functions Node runtime | Node 22 | `VERIFIED COMPLETE` |
| Framework | Next.js 15.5.18 / React 19.1.1 | `VERIFIED COMPLETE` |
| Structure | Single root Next app plus separate `functions/` package and extensive docs/proof assets | `VERIFIED COMPLETE` |
| Production domain | `urai.app`, but owned by `urai-spatial` under current authority | `VERIFIED COMPLETE` as intended authority; deployed SHA `BLOCKED` |
| Firebase project/site referenced | `urai-4dc1d` | `VERIFIED COMPLETE` in source |
| Automatic legacy production deploy | Removed; manual override only | `VERIFIED COMPLETE` |
| Branch protection/environment approvals | Not visible through available evidence | `BLOCKED` |
| Current releases/tags/security alerts | Not established through available connector operations | `BLOCKED` |

Open/stale work requiring triage includes PR #346 and issues #182, #191, #196, #203, #226, #267, #286, #300, #303, #323, #333, #340, #348, #349, and #350. Several still assume `UrAi` is canonical and must be reconciled rather than blindly completed.

---

# 3. System architecture map

```text
Public browser / mobile browser / possible WebXR browser
        |
        v
Legacy Next.js 15 application: LifeLoggerAI/UrAi
  src/app/* App Router routes
  src/pages/* residual Pages Router material
  React 19 + Three/R3F + Framer Motion
        |
        +--> Static/sample preview surfaces
        |      Home, Ground, Life Map, Focus, Replay, Mirror,
        |      Passport, Privacy Controls, Status, public profile
        |
        +--> Next route handlers
        |      /api/companion        -> deterministic local engine
        |      /api/waitlist         -> validation + local limiter + Admin SDK
        |      /api/admin/*          -> protection not fully verified in this audit
        |      /api/spatial/*        -> partial spatial contracts
        |
        +--> Firebase client SDK
        |      Auth (source exists; release proof incomplete)
        |      Firestore (many owner-scoped collections)
        |      Storage (owner paths; insufficient upload constraints)
        |
        +--> Firebase Admin SDK
        |      waitlist persistence and server-side operations
        |
        +--> functions/ package
               Genkit + Vertex AI + Firebase Functions + Express
               Node 22
               deployment wiring from root config: MISSING/UNVERIFIED

Firebase configuration referenced by this repo
  Project/site: urai-4dc1d
  Hosting source: repository root
  Firestore rules: present
  Firestore indexes: present
  Storage rules: present
  Functions deployment in root firebase.json: absent
  Staging alias in root .firebaserc: absent

Canonical public production path (outside this repo)
  LifeLoggerAI/urai-spatial / urai-tier1 / main
        -> Firebase urai-4dc1d
        -> urai.app

Ecosystem dependencies
  urai-privacy -> release/privacy gate
  urai-admin   -> operator control plane
  urai-jobs    -> async execution
  asset-factory-> generated assets/provider spend
  urai-content -> content contracts
  urai-staging -> release candidate proving ground
```

---

# 4. Complete subsystem inventory

| Subsystem | Exact path | Status | Evidence | Missing work | Dependencies | Severity | Target |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Root application | `src/app`, `package.json` | `IMPLEMENTED BUT UNVERIFIED` | Next 15 app and scripts present | fresh build/test; decide extraction vs archive | canonical repo decision | Critical | V50 |
| Home scene | `src/app/page.tsx`, `src/app/home/page.tsx`, `src/components/urai/home/*` | `IMPLEMENTED BUT UNVERIFIED` | both routes render `NewHomeScene` | visual/performance/a11y comparison with canonical Home | Three/R3F assets | High | V50 |
| Ground preview | `src/app/ground/page.tsx` | `STUB OR PLACEHOLDER` | hardcoded agents/zones/objects; explicit sample preview | real contracts only if selected for extraction | privacy/jobs/admin | Medium | V100 |
| Life Map/Focus | `src/app/life-map/page.tsx`, `src/app/focus/page.tsx`, `src/components/spatial-life-map/*` | `PARTIALLY BUILT` | shared spatial component | real data, camera/a11y/mobile/perf proof | data contracts, assets | High | V100 |
| Replay | `src/app/replay/page.tsx` | `STUB OR PLACEHOLDER` | hardcoded sample beats/evidence cards | provenance-backed media pipeline and consent | storage, jobs, asset-factory | High | V100 |
| Mirror | `src/app/mirror/page.tsx`, `src/components/life-map/LifeMapUniverse*` | `PARTIALLY BUILT` | overlay route exists | data truth, explanations, test coverage | private data/consent | High | V100 |
| Passport | `src/app/passport/page.tsx` | `STUB OR PLACEHOLDER` | static control architecture | authenticated owner record, consent, portability execution | auth/privacy | Critical | V100 |
| Privacy Controls | `src/app/privacy-controls/page.tsx` | `STUB OR PLACEHOLDER` | static product-shape copy | real settings, consent withdrawal, export/delete status | urai-privacy | Critical | V50/V100 |
| Companion API | `src/app/api/companion/route.ts`, `src/lib/companion-engine*` | `STUB OR PLACEHOLDER` | deterministic local replies | explicit product decision: keep deterministic or add provider orchestration | safety, budgets | Medium | V100 |
| Waitlist API | `src/app/api/waitlist/route.ts`, `src/lib/waitlist.ts` | `PARTIALLY BUILT` | validation and Admin write | durable limiter, App Check/bot control, observability, retention | Firebase Admin | High | V50 |
| Authentication/account | `src/app/login`, `src/app/signup`, `src/app/dashboard`, Firebase client code | `PARTIALLY BUILT` | routes described as gated | provider config, recovery, sessions, authorization, live E2E | Firebase Auth | Critical | V50 |
| Admin APIs/UI | `src/app/admin`, `src/app/api/admin/*` | `IMPLEMENTED BUT UNVERIFIED` | source paths present | verify every route uses auth/custom claims; audit logs; no header bypass | urai-admin | Critical | V50 |
| Firestore rules | `firestore.rules` | `PARTIALLY BUILT` | default deny, owner/admin helpers | strict schemas, submission abuse controls, consistent ownership key, deletion model | Auth/App Check | Critical | V50 |
| Firestore indexes | `firestore.indexes.json` | `PARTIALLY BUILT` | indexes present | migrate `userId` indexes/queries to canonical owner key | data migration | High | V50 |
| Storage rules | `storage.rules` | `BROKEN` for broad production uploads | owner-only but no size/type constraints | allowlist paths/types/sizes; quarantine/scanning; quotas | Storage/Functions | Critical | V50 |
| Firebase target config | `.firebaserc`, `firebase.json`, `env.local.template` | `BROKEN` for safe legacy deployment | default=production; shared target; root source | isolated staging/legacy target or no deploy; WIF; protected environment | canonical runtime | Critical | V50 |
| Functions package | `functions/*` | `PARTIALLY BUILT` | Node 22 Genkit/Vertex dependencies | root deploy wiring, source audit, emulator tests, budgets, secrets, region/timeouts | billing/providers | High | V100 |
| Data contracts | `src/lib/firestore-schema.ts`, `src/lib/shared/urai-contracts*`, `docs/contracts/*` | `DUPLICATED` | multiple contract sources | one versioned canonical schema and migration registry | cross-repo contracts | High | V50/V100 |
| Spatial auth/data | `src/lib/spatial/*`, `src/app/api/spatial/*` | `PARTIALLY BUILT` | source present | object-level authorization and canonical API ownership | urai-spatial | High | V100 |
| Tests | `tests`, `src/**/*.test.*`, Jest/Playwright configs | `IMPLEMENTED BUT UNVERIFIED` | scripts and historical claims | fresh clean-run artifacts; remove stale/skipped tests | CI runner | Critical | V50 |
| CI | `.github/workflows/ci.yml` | `PARTIALLY BUILT` | type/lint/test/build/XR smoke jobs | use npm ci; real emulator/rules; current status; required checks | GitHub settings | High | V50 |
| Legacy deploy | `.github/workflows/deploy-home-xr.yml` and related deploy workflows | `BLOCKED` by design | manual dispatch only after PR #352 | environment approval, target collision guard, WIF, rollback | Firebase | Critical | V50 |
| Evidence/registry | `launch-proof`, `release-verification`, `system/urai-system-registry.json`, `docs/*` | `OBSOLETE`/`DUPLICATED` | large proof/document set | reconcile dates/authority; machine-generated receipts only | all repos | High | V50 |
| Repository hygiene | `:USERPROFILE/pm-cache-fresh`, committed generated/cache material | `BROKEN` | cache paths indexed; repo ~1.62 GB | purge history safely, Git LFS/CDN policy, secret scan | migration window | High | V50 |
| PWA/offline | manifest/service-worker/offline material where present | `IMPLEMENTED BUT UNVERIFIED` | scattered source/docs | installability and offline conflict resolution proof | browser/device | Medium | V100 |
| Accessibility | route copy, reduced-motion tests/docs, UI components | `PARTIALLY BUILT` | accessibility intent and some gates | automated axe + keyboard + screen-reader + contrast + XR alternatives | design system | High | V50/V100 |
| Localization | scattered language plans/content | `MISSING` as proven runtime | roadmap/Drive evidence only | locale routing, message catalog, QA, legal copy | content | Medium | V100 |
| Observability | status routes/docs | `STUB OR PLACEHOLDER` | status copy exists | real logs, traces, metrics, alerts, SLOs, redaction | hosting/functions | Critical | V50 |

---

# 5. Route inventory

`verify-routes.mjs` checks 21 critical paths, while the README and source route map document additional routes. Presence does not equal production readiness.

| Route | Purpose/data source | Auth | Real status | Key gap |
| --- | --- | --- | --- | --- |
| `/` | `NewHomeScene` | public | `IMPLEMENTED BUT UNVERIFIED` | legacy, not production authority |
| `/home` | same `NewHomeScene` | public | `IMPLEMENTED BUT UNVERIFIED` | duplicate entry contract vs canonical repo |
| `/launch` | launch surface | public | `IMPLEMENTED BUT UNVERIFIED` | current copy/live parity not proven |
| `/demo` | demo surface | public | `STUB OR PLACEHOLDER` | clarify relation to root demo |
| `/early-access` | acquisition | public | `PARTIALLY BUILT` | persistence/analytics/abuse proof |
| `/waitlist` | waitlist form | public | `PARTIALLY BUILT` | durable backend and consent receipt |
| `/login` | account login | gated | `PARTIALLY BUILT` | provider/session/recovery/live proof |
| `/signup` | waitlist/account gate | public/gated | `PARTIALLY BUILT` | canonical signup decision |
| `/dashboard` | private dashboard | protected intent | `BLOCKED` | account and authorization proof |
| `/life-map` | `SpatialLifeMap` | public demo | `PARTIALLY BUILT` | sample vs real data; a11y/perf |
| `/focus` | Life Map focus mode | public demo | `PARTIALLY BUILT` | source/provenance and selection state |
| `/replay` | hardcoded replay preview | public demo | `STUB OR PLACEHOLDER` | no real replay pipeline |
| `/mirror` | LifeMap mirror overlay | public demo | `PARTIALLY BUILT` | no verified private pattern engine |
| `/orb-chat` | companion surface | public/demo | `PARTIALLY BUILT` | deterministic backend, safety/abuse |
| `/ground` | static private-workforce preview | public demo | `STUB OR PLACEHOLDER` | no real operations/data |
| `/sky` | spatial transition surface | public demo | `IMPLEMENTED BUT UNVERIFIED` | route ownership and interaction proof |
| `/horizon` | spatial transition surface | public demo | `IMPLEMENTED BUT UNVERIFIED` | route ownership and interaction proof |
| `/passport` | static identity/consent preview | public demo | `STUB OR PLACEHOLDER` | no live owner/consent/portability record |
| `/privacy-controls` | static privacy-control preview | public | `STUB OR PLACEHOLDER` | no live control mutations |
| `/privacy` | trust/legal information | public | `IMPLEMENTED BUT UNVERIFIED` | legal/current-code consistency review |
| `/terms` | terms | public | `IMPLEMENTED BUT UNVERIFIED` | legal review and effective-date process |
| `/status` | status copy | public | `STUB OR PLACEHOLDER` unless real telemetry-backed | monitoring source and uptime truth |
| `/system` | registry-backed truth route | public/noindex intent | `OBSOLETE` while registry is stale | canonical registry correction |
| `/xr` | capability-gated WebXR preview | public gated | `PARTIALLY BUILT` | live Quest/device proof and fallbacks |
| `/u/[handle]` | public constellation demo | public | `PARTIALLY BUILT` | privacy/publication model and moderation |
| `/admin` and `/admin/*` | internal operations | admin intent | `IMPLEMENTED BUT UNVERIFIED` | verify all auth/custom-claim checks |
| `/app/*` | private-ish product routes | account intent | `IMPLEMENTED BUT UNVERIFIED` | canonical ownership and auth gating |
| `/api/companion` | deterministic reply | public POST | `STUB OR PLACEHOLDER` | rate limit, abuse, product truth |
| `/api/companion/respond` | companion responder contract | public/gated unknown | `IMPLEMENTED BUT UNVERIFIED` | duplicate endpoint and security review |
| `/api/waitlist` | Admin-backed waitlist | public POST | `PARTIALLY BUILT` | distributed rate limit/App Check/receipts |
| `/api/admin/status` | admin status | admin intent | `IMPLEMENTED BUT UNVERIFIED` | header bypass and claim verification |
| `/api/spatial/scenes` | spatial data | private intent | `IMPLEMENTED BUT UNVERIFIED` | object-level auth and canonical service owner |
| `/api/frame` | frame/metadata route | public | `IMPLEMENTED BUT UNVERIFIED` | input/output abuse and cache review |

All routes require responsive, loading, empty, error, keyboard, screen-reader, reduced-motion, analytics-consent, and live-smoke evidence before production certification. Static preview routes generally have visual content but not production data integration.

---

# 6. Firebase readiness report

## Repository-verified configuration

- `.firebaserc` maps both `default` and `production` to `urai-4dc1d`.
- `firebase.json` configures Hosting with repository root as source and site `urai-4dc1d`.
- `env.local.template` defaults public and Admin project IDs to `urai-4dc1d`.
- Firestore rules, indexes, and Storage rules exist.
- Root client uses Firebase 12.2.1 and Admin 13.0.0.
- Functions package uses Node 22, Firebase Functions 6, Admin 12.6, Genkit, and Vertex AI.

## GitHub-verified deployment evidence

- Automatic legacy deploy authority was removed in merged PR #352 / commit `5a9b4e6...`.
- A manual Home XR deploy workflow remains and defaults to `urai-4dc1d`.
- The workflow requires a Firebase token and runs source checks before deploy.
- No current deployed-SHA receipt, rollback drill, or protected-environment approval was established by this audit.

## Console-only checks still unverified

- Current Firebase project owner/IAM assignments.
- Hosting release history and exact current deployed SHA.
- App Hosting build/runtime configuration.
- Authorized Auth domains and enabled providers.
- App Check registrations/enforcement.
- Secret Manager values and access policies.
- Firestore/Storage rules currently deployed versus repository source.
- Firestore indexes build status.
- Function regions, concurrency, min/max instances, timeout, memory, retries, and service accounts.
- Budget alerts, quotas, billing account, API restrictions, and provider quotas.
- Backup/PITR/export schedules and restore drill.
- Logging sinks, retention, alerts, dashboards, and redaction.
- Preview channels and environment protection.

## Unsafe or missing Firebase configuration

1. `default` equals production; there is no root staging alias.
2. The legacy and canonical repos share the same production project/site.
3. Root `firebase.json` does not declare Firestore, indexes, Storage, emulators, or Functions.
4. Public submission rules accept any document with `createdAt`, without strict field allowlists or App Check.
5. Storage owner paths permit arbitrary file type and size.
6. Ownership fields are inconsistent across rules and indexes.
7. User account deletion does not demonstrate recursive cleanup or provider-derived deletion.
8. The deploy workflow uses token authentication instead of short-lived workload identity.
9. No verified rollback action is present.
10. Development templates default to production identifiers.

## Exact remaining Firebase work

- Prevent this repo from targeting `urai-4dc1d` except through an emergency, protected, audited override—or assign a separate legacy/staging project.
- Add a collision guard that checks canonical repo, intended SHA, site, and domain before deploy.
- Move deploy authentication to GitHub OIDC/Workload Identity Federation.
- Add explicit Firebase services and emulator configuration to the owning repository.
- Add strict schema functions to public submission rules; prefer server-only writes.
- Enforce App Check and durable rate limiting on public mutations.
- Add Storage content-type, path, size, quota, and malware/quarantine controls.
- Choose one ownership key, migrate data and indexes, and remove legacy aliases.
- Implement and test recursive export/deletion orchestration.
- Record deployed SHA, rollback SHA, rules/index versions, smoke receipts, and monitoring links in a machine-readable release receipt.

---

# 7. Data architecture audit

The repository models many domains: users, profiles, consents, memories, stars, blooms, timeline events, forecasts, reflections, relationships, social graph, focus sessions, replay evidence, telemetry, safety events, export/deletion requests, spatial scenes/anchors, jobs, transactions, and provider-derived enrichments.

## Core problems

- `ownerUid`, `userId`, and `uid` all represent ownership.
- Top-level and `/users/{uid}/...` collection models coexist.
- Rules list many conceptual collections that may have no active writer/reader.
- Indexes still use `userId` for many private collection groups.
- Request collections exist for export/deletion but fulfillment state machines are not proven.
- Retention, legal hold, tombstone, derivative deletion, and orphan cleanup are not encoded consistently.
- No single versioned schema registry is proven to govern every repository.

## Canonical recommendation

Use a versioned envelope for all private records:

```ts
type PrivateRecord<T> = {
  schemaVersion: number;
  ownerUid: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  source: { kind: string; sourceId?: string; consentReceiptId?: string };
  privacy: { classification: string; retentionPolicyId: string; exportable: boolean; deletable: boolean };
  provenance: { generatedBy?: string; model?: string; parentIds?: string[] };
  data: T;
};
```

Canonical private data should live under owner-scoped paths or use mandatory `ownerUid`, never a mixture. Runtime validation should use one shared schema package. Every asynchronous event should include `eventId`, `eventType`, `schemaVersion`, `ownerUid`, `occurredAt`, `idempotencyKey`, `traceId`, and a privacy classification.

## Migration sequence

1. Inventory active readers/writers by collection and route.
2. Freeze creation of new `userId`-owned documents.
3. Add dual-read telemetry, not indefinite dual-write.
4. Backfill `ownerUid` with verifiable counts and quarantine invalid records.
5. Create new indexes and deploy them before query cutover.
6. Switch readers and writers behind a release flag.
7. Verify export/delete and orphan detection.
8. Remove legacy indexes/rules only after a rollback window.

---

# 8. APIs, integrations, providers, and cost controls

| Integration | Location | Status | Required variables/auth | Risk/control gap |
| --- | --- | --- | --- | --- |
| Firebase web SDK | root app | `IMPLEMENTED BUT UNVERIFIED` | `NEXT_PUBLIC_FIREBASE_*` | defaults point at production project |
| Firebase Admin | root server routes | `PARTIALLY BUILT` | project/client email/private key or ADC | service-account lifecycle and least privilege unverified |
| Waitlist | `/api/waitlist` | `PARTIALLY BUILT` | Admin credentials unless dry-run | process-local limiter; no App Check/durable anti-abuse |
| Companion | `/api/companion` | `STUB OR PLACEHOLDER` | none for deterministic engine | endpoint can be spammed; must not be sold as provider AI |
| OpenAI | env/scripts/source references | `IMPLEMENTED BUT UNVERIFIED` | `OPENAI_API_KEY` | no proven runtime path, budget, or receipt gate |
| Genkit/Vertex AI | `functions/` | `PARTIALLY BUILT` | Google/Firebase IAM | paid calls possible if deployed; no proven caps/kill switch |
| Asset Factory | cross-repo | `BLOCKED` pending provider receipts | provider secrets | explicit approval and artifact receipt required |
| Analytics/telemetry | source collections/status docs | `PARTIALLY BUILT` | Firebase/other providers unknown | consent, redaction, retention, and monitoring unproven |
| Email/SMS/payments/maps | scattered plans or no verified active adapter | `MISSING` or `ROADMAP` | undecided | do not claim integrated |

Required provider controls before V100:

- provider allowlist and environment-specific routing;
- per-user, per-project, and global quotas;
- hard daily/monthly spend caps;
- concurrency and queue limits;
- idempotency keys and deduplication;
- timeout/retry/dead-letter policy;
- emergency kill switch independent of deploy;
- consent and privacy classification before calls;
- model/version/prompt/provenance receipts;
- usage/cost dashboard and anomaly alerts;
- explicit paid-generation approval gates.

---

# 9. Security, privacy, legal, and abuse resistance

## Immediate issues

| Finding | Status | Severity | Required action |
| --- | --- | --- | --- |
| Shared legacy/canonical production target | `BROKEN` | Critical | isolate target and add deploy collision guard |
| Public Firestore create checks only `createdAt` | `BROKEN` | High | server-only writes or strict keys/types/length/App Check |
| Owner Storage upload has no type/size bounds | `BROKEN` | Critical | allowlists, quotas, quarantine, scanning |
| Waitlist limiter is in-memory and header-based | `PARTIALLY BUILT` | High | durable distributed rate limit and bot control |
| Ownership-key drift | `BROKEN` | High | migrate to `ownerUid` |
| Export/delete requests without proven fulfillment | `PARTIALLY BUILT` | Critical | authenticated state machine, receipts, recursive deletion |
| Admin route protection not fully audited | `BLOCKED` | Critical | route-by-route auth/custom-claim tests; remove header gates in prod |
| App Check enforcement | `MISSING` | High | enable and test for public mutations/storage |
| Log redaction/retention | `BLOCKED` | High | structured redaction and retention policy |
| Dependency/security alerts | `BLOCKED` | High | CodeQL/Dependabot/secret scan/SBOM and triage |

No legal or regulatory compliance claim is established. The product handles or plans to handle memory, relationship, location, voice, health-adjacent, and behavioral data; these require heightened consent, minimization, access control, retention, explainability, and deletion design. Children/minors, crisis handling, biometric-adjacent inference, clinical claims, and international transfer rules require explicit policy decisions and counsel review before expansion.

---

# 10. Build, testing, CI/CD, release, performance, and cost

## Build/test truth

The repository defines install, doctor, typecheck, lint, Jest, rules, Playwright, build, route, privacy, claims, tier, and release-verifier commands. Current execution evidence is `BLOCKED` because the repository could not be checked out in the audit container and no current commit statuses were returned through the available status endpoint.

Past PR descriptions are useful historical context but do not certify current `main`.

## CI defects

- Workflows use `npm install`; production gates should use `npm ci`.
- CI supplies placeholder Firebase/Admin/OpenAI values and disables required Admin integration.
- Emulator and actual rules integration are not clearly part of the primary CI job.
- Live smoke is optional.
- Artifact upload may ignore missing browser output.
- No proven required-check/branch-protection policy.
- No staging promotion job tied to an immutable release candidate.
- No automated rollback drill.
- No SBOM, dependency audit, CodeQL, secret scan, or license gate in the observed main workflow.

## Performance/capacity findings

- Repository size and committed cache material are the first scaling failure: clones already fail in constrained runners.
- Three/R3F and multiple spatial implementations can inflate bundles and GPU memory.
- Hardcoded preview routes are cheap but do not validate real data behavior.
- Unbounded listeners/collections cannot be ruled out without a full source and runtime trace.
- Storage growth is unbounded per owner under current rules.
- Functions/Genkit cold starts and paid model calls are not capacity-tested.

## Capacity assumptions

| Scale | Assumption | First likely failure |
| --- | --- | --- |
| Low | hundreds of demo visitors/day | route drift, missing monitoring, waitlist limiter resets |
| Medium | tens of thousands/month | Storage/Firestore abuse, spatial bundle/mobile GPU, quota visibility |
| High | hundreds of thousands/month | query/index design, listener cost, provider spend, operational support |
| Breakout | millions/month/multi-region | single-project coupling, no event backbone, no regional failover, deletion/export throughput |

---

# 11. Documentation and operational readiness

The repository has unusually extensive documentation, but quantity is not reliability. Multiple documents and the machine registry contradict the later canonical-runtime decision. Proof folders sometimes preserve attempts rather than passing receipts.

Required operational documents still needing a single authoritative version:

- canonical repo/domain/project registry;
- environment and secret registry;
- staging-to-production promotion runbook;
- exact rollback procedure and drill receipt;
- incident response and escalation;
- privacy request/export/deletion runbook;
- backup/restore and disaster recovery;
- provider outage and cost emergency runbook;
- data model and migration registry;
- service ownership/RACI;
- release certification schema;
- archive/extraction policy for this repository.

---

# 12. Cross-repository conclusion

`LifeLoggerAI/UrAi` should be treated as a **legacy application, demo surface, and feature/evidence extraction source**. It should not be merged wholesale into `urai-spatial`, and it should not independently deploy over the canonical public site.

| Dependency | Expected contract | Current state | Release risk |
| --- | --- | --- | --- |
| `urai-spatial` | canonical public UI/runtime | latest authority says canonical | duplicate domain/site ownership |
| `urai-privacy` | consent/export/delete/release gate | source exists; live gate unproven | private launch blocked |
| `urai-admin` | internal control plane | separate repo; live proof incomplete | unsafe operator actions |
| `urai-jobs` | async processing | candidate service; strict evidence incomplete | retries/idempotency/privacy |
| `asset-factory` | generated assets and provider receipts | separate pipeline | spend and artifact provenance |
| `urai-content` | versioned public/content contracts | source package role | contract/version drift |
| `urai-staging` | release-candidate proving ground | staging-only | no immutable promotion proof |

---

# 13. Exhaustive actionable backlog

The following backlog is exhaustive for the evidence inspected in this pass. Additional code-level defects may be discovered when a clean checkout and complete tests are available.

| ID | Title / affected paths | Current status | Required implementation and acceptance criteria | Dependencies | Risk | Effort | Milestone | Autonomous now? | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| URAI-001 | Freeze legacy production target: `.firebaserc`, deploy workflows | `PARTIALLY BUILT` | no automatic deploy; protected override names exact project/site/SHA; collision guard verifies canonical authority | GitHub/Firebase settings | Critical | M | V50 | Partly | workflow tests + rejected wrong-target run |
| URAI-002 | Reconcile canonical docs: `docs/REPO_CANONICAL_STATUS.md`, registry | `OBSOLETE` | all docs and machine registry agree `urai-spatial` owns public runtime | cross-repo owners | Critical | M | V50 | Docs partly | contract test across repos |
| URAI-003 | Record current deployed and rollback SHA | `MISSING` | release receipt names domain, project, site, deploy SHA, rollback SHA, timestamp | Firebase console | Critical | S | V50 | No | live receipt + rollback readback |
| URAI-004 | Close/supersede stale PR #346 | `NEEDS DECISION` | preserve useful cleanup commits; no merge to production; explicit supersession comment | owner | High | S | V50 | Yes after review | PR state/comment |
| URAI-005 | Triage stale/duplicate launch issues | `DUPLICATED` | every open issue mapped to legacy extraction, canonical repo, or closed/not-planned | issue owners | Medium | M | V50 | Yes | issue index |
| URAI-006 | Purge committed npm cache/history: `:USERPROFILE/pm-cache-fresh` | `BROKEN` | remove current tree; history rewrite plan; repo clone works in constrained CI; secret scan clean | maintenance window | High | L | V50 | No, history rewrite | clone size and scan report |
| URAI-007 | Frozen dependency installs: CI workflows | `PARTIALLY BUILT` | all CI uses `npm ci`; lock check passes; no implicit lock mutation | lockfile | High | S | V50 | Yes | clean CI run |
| URAI-008 | Fresh release gate on main | `BLOCKED` | install, doctor, type, lint, unit, rules, integration, build, browser all pass with artifacts | suitable runner | Critical | M | V50 | No current checkout | signed CI artifacts |
| URAI-009 | Branch protection and environments | `BLOCKED` | required checks, review, no force push, protected production environment and approval | GitHub admin | Critical | S | V50 | Console only | settings export/screenshots |
| URAI-010 | Move deploy auth to OIDC/WIF | `MISSING` | no long-lived Firebase token; least-privilege service account | GCP IAM | High | M | V50 | No | successful protected deploy |
| URAI-011 | Add separate staging/legacy Firebase target | `MISSING` | local/default cannot write production; explicit environment target | Firebase project | Critical | M | V50 | No | wrong-target negative test |
| URAI-012 | Strict public submission rules: `firestore.rules` | `BROKEN` | keys/types/lengths/timestamps enforced or all writes server-only | rules tests | High | M | V50 | Code possible | emulator abuse tests |
| URAI-013 | App Check and bot protection | `MISSING` | enforced on mutation/storage endpoints; documented fallback | Firebase console/client | High | M | V50 | No | invalid token rejection |
| URAI-014 | Durable waitlist throttling: `src/lib/waitlist.ts` | `PARTIALLY BUILT` | distributed limiter, trusted client IP handling, idempotency, spam telemetry | server/runtime | High | M | V50 | Code possible | concurrent load/abuse tests |
| URAI-015 | Storage upload policy: `storage.rules` | `BROKEN` | path/type/size limits, quota, quarantine, malware scan, derivative rules | Functions/Storage | Critical | L | V50 | Partly | emulator + malicious upload tests |
| URAI-016 | Ownership-key migration | `BROKEN` | `ownerUid` canonical; queries/indexes/data migrated; no ambiguous ownership | data export/migration | High | XL | V50/V100 | No prod data changes | count checks + dual-read telemetry |
| URAI-017 | Account auth/recovery/session certification | `PARTIALLY BUILT` | signup/login/logout/recovery/session expiration/E2E and authorized domains | Firebase Auth | Critical | L | V50 | Partly | emulator and staging E2E |
| URAI-018 | Admin authorization audit: `src/app/admin`, `src/app/api/admin` | `BLOCKED` | every route deny-by-default; custom claims; immutable audit; no prod header bypass | urai-admin/Auth | Critical | L | V50 | Partly | object-level auth tests |
| URAI-019 | Export workflow | `PARTIALLY BUILT` | authenticated request -> queued job -> complete portable archive -> expiry/audit | privacy/jobs/storage | Critical | XL | V100 | No | staging export receipt |
| URAI-020 | Deletion workflow | `PARTIALLY BUILT` | authenticated request -> grace period -> recursive deletion -> derivatives/providers -> tombstone receipt | privacy/jobs/providers | Critical | XL | V100 | No | seeded-user deletion proof |
| URAI-021 | Consent ledger and withdrawal | `PARTIALLY BUILT` | versioned receipt per source/purpose; withdrawal stops future processing | privacy | Critical | L | V100 | No | rules + E2E + audit receipt |
| URAI-022 | Canonical schema package | `DUPLICATED` | one versioned package for records/events/APIs across repos | ecosystem | High | XL | V100 | Partly | consumer contract CI |
| URAI-023 | Companion product decision | `NEEDS DECISION` | label deterministic mode or implement safe provider router; rate limit and tests | product/safety | Medium | M/L | V100 | Partly | behavior/safety suite |
| URAI-024 | Provider budget and receipt system | `MISSING` | caps, quotas, kill switch, model receipt, cost alert, approval gate | providers/jobs | Critical | L | V100 | No paid calls | simulated quota tests |
| URAI-025 | Functions deployment ownership: `functions`, `firebase.json` | `BROKEN`/`UNWIRED` | decide owner; configure or remove; emulator, region, runtime, service account, retry/cost settings | canonical repo | High | L | V100 | Partly | emulator/deploy receipt |
| URAI-026 | Route extraction matrix | `MISSING` | every route/component classified retain/extract/archive/delete; destination owner named | urai-spatial | High | M | V50 | Yes | reviewed matrix |
| URAI-027 | Remove duplicate runtimes/components | `DUPLICATED` | one Home/Life Map/Replay/Passport implementation per canonical surface | extraction matrix | High | XL | V100 | No wholesale change | dead-code/build tests |
| URAI-028 | Spatial performance/a11y | `PARTIALLY BUILT` | lazy load, GPU budget, reduced motion, keyboard/nonvisual alternatives, mobile proof | assets/device lab | High | L | V100 | Partly | Lighthouse/device/axe |
| URAI-029 | Replay provenance pipeline | `STUB OR PLACEHOLDER` | source IDs, consent, media job, evidence rail, deletion lineage | jobs/storage/assets | High | XL | V100 | No | end-to-end replay receipt |
| URAI-030 | Passport real control plane | `STUB OR PLACEHOLDER` | account identity, consent, source provenance, export/delete status | auth/privacy | Critical | XL | V100 | No | authenticated E2E |
| URAI-031 | Status/observability truth | `STUB OR PLACEHOLDER` | telemetry-backed status; SLOs; alerts; synthetic smoke; no false uptime claims | monitoring | Critical | L | V50 | No | alert drill and dashboard |
| URAI-032 | Structured logging/redaction | `MISSING` | trace IDs, owner pseudonyms, secret/PII redaction, retention | all services | High | L | V50/V100 | Partly | log fixtures and review |
| URAI-033 | Security automation | `MISSING` | Dependabot, CodeQL, secret scan, SBOM, license and dependency audit | GitHub | High | M | V50 | Yes | passing workflows |
| URAI-034 | Backup/restore/DR | `BLOCKED` | PITR/export policy, encrypted backups, restore drill, RPO/RTO | Firebase/GCP | Critical | L | V100 | No | restore receipt |
| URAI-035 | Accessibility certification | `PARTIALLY BUILT` | axe, keyboard, screen reader, contrast, zoom, reduced motion, captions/haptics alternatives | design/device | High | L | V100 | Partly | audit artifact |
| URAI-036 | Localization runtime | `MISSING` | locale catalog/routing, 19-language QA, fallback, legal/content review | content | Medium | XL | V100 | Partly | locale E2E |
| URAI-037 | PWA/offline data conflict model | `PARTIALLY BUILT` | installability, encrypted cache, sync/conflict/delete behavior | auth/data | High | L | V100 | Partly | offline E2E |
| URAI-038 | Analytics consent and event schema | `PARTIALLY BUILT` | event allowlist, consent, minimization, deletion, versioning | privacy/analytics | High | L | V100 | Partly | schema tests and data audit |
| URAI-039 | Queue/idempotency/dead-letter proof | `MISSING` in this repo | durable event contract and replay-safe workers | urai-jobs | Critical | XL | V100/V150 | No | chaos/retry tests |
| URAI-040 | WebXR/Quest live certification | `BLOCKED` | exact device/browser matrix, session lifecycle, fallback, performance, privacy | urai-spatial/device | High | L | V150 | No | device video/log receipt |
| URAI-041 | Native/installable/on-device layer | `MISSING` | explicit architecture and privacy boundary; no speculative launch claim | product/device | High | XL | V150 | No | prototype + threat model |
| URAI-042 | Cross-repo release manifest | `MISSING` | immutable versions/contracts/deploy SHAs for every service | ecosystem | Critical | L | V150 | Partly | promotion gate |
| URAI-043 | Platform API and extension sandbox | `MISSING` | scoped auth, versioned API, quotas, review/signing, revocation | governance | Critical | XL | V200 | No | third-party conformance suite |
| URAI-044 | Multi-region resilience | `MISSING` | regional data policy, failover, replicated events, tested recovery | GCP architecture | Critical | XL | V200 | No | failover drill |
| URAI-045 | Long-term portability/governance | `MISSING` | durable open export formats, model/provider independence, governance process | legal/platform | High | XL | V200 | No | portability conformance |

---

# 14. V50 roadmap — hardened and trustworthy current product

V50 is complete only when:

1. `UrAi` is formally classified legacy/demo and cannot collide with production.
2. The canonical repo/domain/project registry is consistent and machine-tested.
3. Current main or an extraction baseline has reproducible `npm ci`, typecheck, lint, unit, rules, integration, build, and browser artifacts.
4. Security-critical Firestore and Storage rules are hardened and emulator-tested.
5. Auth/admin/waitlist routes are certified or explicitly disabled.
6. `ownerUid` migration is planned and no new legacy ownership writes occur.
7. Current production SHA and rollback SHA for the real canonical app are recorded.
8. Monitoring, alerts, incident response, and release receipts exist.
9. Every public route is labeled real, preview, gated, or disabled.
10. Repository bloat and cache artifacts are removed from the active tree.
11. A feature-extraction matrix identifies what moves to `urai-spatial`.
12. No critical skipped test, unexplained mock, or unreviewed production claim remains.

---

# 15. V100 roadmap — completed integrated product

V100 adds:

- authenticated accounts, recovery, sessions, and private user state;
- real Passport consent, provenance, export, correction, retention, and deletion;
- one versioned data/event/API contract across repositories;
- production-safe provider orchestration with budgets, receipts, fallbacks, and kill switches;
- durable jobs, idempotency, retries, dead-letter queues, and user-visible status;
- real Life Map, Focus, Replay, Mirror, Ground, and relationship data flows;
- accessible mobile/PWA experience and validated offline behavior;
- localization infrastructure and reviewed language releases;
- consent-aware analytics and operational dashboards;
- admin tools with least privilege, immutable audit, and safe impersonation policy;
- comprehensive unit/integration/rules/E2E/accessibility/visual/performance/security coverage;
- documented backup, restore, incident, provider-outage, cost-emergency, and privacy-request operations.

Repository-backed plans: spatial worlds, memory/replay, Passport/privacy, companion, relationships, WebXR, PWA, jobs, content, admin, analytics. New recommendations: durable distributed rate limiting, standardized event backbone, formal SLOs, SBOM, WIF, and conformance testing.

---

# 16. V150 roadmap — multi-surface ecosystem

V150 requires proven cross-repository integration rather than parallel demos:

- immutable ecosystem release manifest;
- canonical web and installable/native client strategy;
- Quest/WebXR device certification and non-XR alternatives;
- voice/audio/transcription with consent, retention, and deletion lineage;
- richer memory, relationship, legacy, and accessibility systems;
- on-device/private inference where technically justified;
- offline-first encrypted data and deterministic conflict resolution;
- migration compatibility across schema/model/client versions;
- international data-location and language operations;
- partner/enterprise APIs with tenant isolation and scoped permissions;
- mature developer, test-environment, synthetic-data, and operational tooling.

No V150 item may bypass V100 privacy, identity, provenance, cost, or deletion foundations.

---

# 17. V200 roadmap — mature platform

V200 is a governed platform with:

- versioned public and partner APIs;
- signed extension architecture and sandbox;
- durable event contracts and compatibility guarantees;
- multi-region resilience, tested failover, and disaster recovery;
- transparent governance, audit, appeal, and model-change processes;
- privacy-preserving intelligence and on-device/federated options;
- model/provider independence and portable prompts/artifacts;
- high-scale SRE, SLO/error-budget, capacity, and cost operations;
- long-term open data export and deletion guarantees;
- complete traces, metrics, logs, lineage, and user-visible provenance;
- automated release certification and rollback;
- ecosystem interoperability without surrendering user ownership;
- sustainable unit economics with per-feature cost attribution.

---

# 18. Prioritized execution order

## First 10 actions

1. Merge the canonical-status correction after review.
2. Keep all `UrAi` production deployment manual and blocked by default.
3. Record the actual `urai-spatial` production SHA and rollback SHA.
4. Reconcile or disable the stale machine registry.
5. Run a clean clone and full release gate on a large runner.
6. Remove current-tree npm cache/generated debris and prepare history cleanup.
7. Change CI installs to `npm ci` and make checks required.
8. Harden Firestore public submission and Storage upload rules.
9. Build the route/component extraction matrix into `urai-spatial`.
10. Triage stale PR #346 and duplicate legacy launch issues.

## First 25 actions

Actions 1-10, then:

11. Separate staging/legacy Firebase targets from production.  
12. Move deploy auth to WIF.  
13. Add deploy collision and exact-SHA guards.  
14. Audit all admin/API route authorization.  
15. Replace waitlist local limiter with durable abuse controls.  
16. Establish one ownership key and migration plan.  
17. Add App Check.  
18. Certify Auth lifecycle or keep accounts disabled.  
19. Build export/deletion state machines in privacy/jobs repos.  
20. Add observability, alerts, SLOs, and redaction.  
21. Add security automation/SBOM/dependency triage.  
22. Decide Functions ownership and remove or wire it.  
23. Create versioned schema/event contracts.  
24. Extract selected routes/components with tests, not wholesale history.  
25. Produce a signed V50 release receipt and rollback drill.

## Critical path

```text
Canonical authority
 -> deployment isolation
 -> clean reproducible build/CI
 -> security rules + auth/admin
 -> canonical data ownership
 -> privacy export/delete
 -> observability/rollback
 -> feature extraction
 -> V50 certification
 -> provider/jobs integration
 -> V100 product completion
 -> multi-surface V150
 -> platform V200
```

## Parallel workstreams

- **Release/infra:** target isolation, WIF, branch protection, CI, receipts.
- **Security/privacy:** rules, App Check, auth/admin, consent/export/delete.
- **Data/contracts:** owner migration, schema/event package, indexes.
- **Product extraction:** Home/Life Map/Focus/Replay/Mirror/Passport comparison and ports.
- **Operations:** monitoring, redaction, backup/restore, incident/cost runbooks.
- **Repository hygiene:** cache purge, dependency/security automation, stale issue/PR cleanup.

## Do not begin yet

- broad paid provider generation;
- autonomous outbound actions;
- public private-account launch;
- enterprise/partner APIs;
- native clients or multi-region architecture;
- wholesale merge of `UrAi` into `urai-spatial`;
- production deployment from this legacy repository.

---

# 19. Release definitions of done

## V50 gate

- canonical repo/domain/project ownership passes a machine contract;
- no shared-target ambiguity;
- clean frozen install and all core checks pass;
- critical rules/auth/admin tests pass;
- exact deploy and rollback SHAs recorded;
- live canonical route smoke passes desktop/mobile;
- monitoring/alert and rollback drill pass;
- preview/mock/gated labels are accurate;
- security/privacy review signed;
- no unexplained critical skipped tests.

## V100 gate

- real account/private-data flows pass end to end;
- export and deletion complete with receipts;
- provider calls are budgeted, consented, idempotent, and observable;
- durable jobs and failures are tested;
- accessibility, localization, mobile/PWA, offline, analytics, admin, and privacy suites pass;
- backup/restore and incident drills pass;
- every major route uses production data or is explicitly disabled.

## V150 gate

- cross-repo release manifest is immutable and compatible;
- XR/native/installable surfaces pass device matrices and privacy review;
- voice/on-device/offline systems have deletion and migration lineage;
- partner/enterprise isolation passes security testing;
- international operations and migrations are rehearsed;
- ecosystem rollback is tested.

## V200 gate

- platform APIs/extensions pass conformance and abuse testing;
- multi-region failover and disaster recovery pass stated RPO/RTO;
- model/provider swaps are tested without data loss;
- long-term portable export passes independent validation;
- governance and audit processes operate with evidence;
- automated release certification blocks any missing implementation, test, deployment, live verification, rollback, security, privacy, or mock-disclosure gate.

---

# 20. Changes made by this audit

- Created branch `audit/urai-v50-v200-2026-07-06`.
- Corrected `docs/REPO_CANONICAL_STATUS.md` to reflect current `urai-spatial` authority and legacy `UrAi` deployment containment.
- Added this evidence-backed audit and V50-V200 roadmap.
- Did not modify runtime code, production data, secrets, billing, providers, or production deployment.

## Test result for this branch

Documentation-only changes. Automated commands were not run because no local checkout could be obtained in the execution container. The pull request must run the repository CI before merge. This is a disclosed blocker, not a passing result.

## Rollback

Revert the documentation commits on this branch/PR. No runtime or production rollback is required because this audit does not deploy or alter runtime code.
