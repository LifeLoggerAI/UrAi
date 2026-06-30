# URAI 100% Completion Plan

This is the execution plan for moving the URAI ecosystem from demo/static/partial surfaces to a connected production-grade system without overclaiming.

## Operating rule

URAI is not DONE DONE because a page exists, a route renders, or a repo has a production-looking name. A system is DONE DONE only when it has:

1. implemented runtime behavior,
2. real integration with the canonical product spine,
3. automated checks,
4. deploy evidence,
5. live smoke evidence,
6. rollback evidence,
7. monitoring/alert evidence,
8. privacy/export/delete evidence where user data is involved,
9. honest public copy.

## Canonical spine

The canonical product spine is `LifeLoggerAI/UrAi`. All launchable product claims flow through this repo. External repos can remain source packages, services, demos, governance surfaces, or public surfaces, but they do not become production truth until their evidence gates pass.

Machine-readable control files:

- `system/urai-system-registry.json` — current repo status and production lock state.
- `system/urai-integration-spine.json` — integration order, dependencies, and launch gates.
- `scripts/check-system-registry.mjs` — validates registry consistency.
- `scripts/check-system-of-systems-readiness.mjs` — validates the ecosystem-wide launch gate.

Run:

```bash
npm run check:system-registry
npm run check:system-of-systems
```

For non-release reporting only:

```bash
URAI_ALLOW_BLOCKED_SYSTEMS=1 npm run check:system-of-systems
```

## P0: public app, privacy, staging

### P0-CANONICAL-BUILD — `LifeLoggerAI/UrAi`

Goal: make `urai.app` the only public product truth.

Acceptance criteria:

- `npm ci` succeeds on Node 20.
- `npm run preflight` succeeds.
- `npm run launch:check` succeeds.
- production deployment SHA is recorded.
- public routes do not claim unsupported VR, AR, automation, health, therapy, or production data behavior.
- unfinished modules are visibly gated or hidden.

Build tasks:

1. keep `/`, `/home`, `/life-map`, `/passport`, `/privacy-controls`, `/status`, `/support`, and `/xr` green;
2. wire auth only when privacy/export/delete gates are ready;
3. keep WebXR progressive enhancement only;
4. add release artifact folder per deploy;
5. publish exact commit SHA and smoke output.

### P0-PRIVACY-FLOWS — `LifeLoggerAI/urai-privacy`

Goal: no private-data feature launches without consent, export, delete, audit, and legal versioning.

Acceptance criteria:

- consent categories are versioned and auditable;
- export flow produces a user-owned archive;
- delete flow purges Firestore and Storage paths for the requesting user;
- admin access is audited;
- legal signoff date and policy version are recorded.

Build tasks:

1. define consent categories: account, memory, location, calendar, content, analytics, communications;
2. define export schema and archive manifest;
3. define delete contract for Firestore, Storage, jobs, analytics, communications;
4. connect policy versions to `UrAi` footer/passport/privacy UI;
5. block analytics/communications/storytime until this gate passes.

### P0-STAGING-PARITY — `LifeLoggerAI/urai-staging`

Goal: staging becomes the isolated proof path before production.

Acceptance criteria:

- staging deploy uses isolated Firebase/project targets;
- staging smoke covers root, health, auth, privacy, admin, jobs routes;
- release candidate SHA is recorded;
- rollback SHA is recorded.

Build tasks:

1. verify Firebase aliases are target-locked;
2. add `/api/healthz` or equivalent route proof if missing;
3. record release-candidate SHA;
4. record rollback SHA;
5. keep staging data separate from production.

## P1: operator/runtime/content

### P1-ADMIN-BOOTSTRAP — `LifeLoggerAI/urai-admin`

Goal: a real operator control plane, not a placeholder admin route.

Acceptance criteria:

- superadmin bootstrap is documented and proven;
- admin URL returns 200 for authorized users and rejects unauthorized users;
- operator actions write audit records;
- monitoring and rollback evidence are recorded.

Build tasks:

1. fix live 503 before any admin claim;
2. prove custom claims or role guard;
3. add read-only system status dashboard first;
4. add job audit view second;
5. add user-data operations only after privacy gate.

### P1-JOBS-RUNTIME — `LifeLoggerAI/urai-jobs`

Goal: real async execution with idempotency, retry, failure visibility, and audit.

Acceptance criteria:

- a real job can be submitted, processed, retried, and completed;
- idempotency key prevents duplicate execution;
- failed job path is visible in admin;
- monitoring alert fires on forced failure.

Build tasks:

1. lock job schema;
2. add submit/process/complete/fail lifecycle;
3. add idempotency key;
4. add retry and dead-letter behavior;
5. connect admin read view;
6. record deploy, smoke, rollback, and alert proof.

### P1-CONTENT-SAFE-SOURCE — `LifeLoggerAI/urai-content`

Goal: content is safe to consume as source/templates before it becomes a live private content runtime.

Acceptance criteria:

- demo content is separated from private/user content;
- provider configuration is recorded without secrets;
- exports/downloads are privacy gated;
- content contracts are consumed by canonical app or jobs layer.

Build tasks:

1. freeze public demo content contract;
2. isolate private content schema behind privacy gate;
3. define content job payload consumed by `urai-jobs`;
4. document provider/runtime requirements.

## P2: spatial, analytics, communications

### P2-SPATIAL-PORT — `LifeLoggerAI/urai-spatial`

Goal: port only proven spatial work into canonical app.

Acceptance criteria:

- spatial branch/source is ported into `LifeLoggerAI/UrAi` or documented as deferred;
- desktop/mobile fallbacks are intact;
- WebXR entry is shown only after real immersive-vr support detection;
- headset proof is recorded before any VR claim.

Build tasks:

1. inventory spatial routes/components/assets;
2. port stable components into canonical app;
3. keep unsupported VR hidden;
4. add visual fallback for weak WebGL devices;
5. record Quest/headset evidence before any live VR marketing.

### P2-ANALYTICS-PRIVACY — `LifeLoggerAI/urai-analytics`

Goal: analytics without privacy debt.

Acceptance criteria:

- event taxonomy is approved;
- PII and sensitive signals are excluded or explicitly consented;
- durable storage and dashboard proof are recorded;
- delete/export implications are documented and tested.

Build tasks:

1. define event taxonomy;
2. default to aggregate/non-sensitive events;
3. wire only after privacy categories are complete;
4. record dashboard and deletion behavior evidence.

### P2-COMMS-OPT-IN — `LifeLoggerAI/urai-communications`

Goal: outbound messages only after opt-in and audit.

Acceptance criteria:

- provider staging proof is recorded;
- user opt-in and opt-out are enforced;
- templates are versioned;
- admin send path is audited.

Build tasks:

1. select provider and staging sandbox;
2. define template registry;
3. store consent and unsubscribe state;
4. add admin-audited send path;
5. test delete/export impact.

## P3: storytime, marketing, external surfaces

### Storytime

`LifeLoggerAI/urai-storytime` remains blocked until privacy, child-safety, provider, deploy, and session persistence proof exist. Do not market it as live.

### Marketing

`LifeLoggerAI/urai-marketing` should reflect the current product truth: public preview / static demo unless and until the P0/P1 gates pass. It can collect waitlist/contact interest only with privacy notice.

### Labs, foundation, investors, B2B, studio

These are external/support surfaces. They can be polished, but they must not be used as proof that the product runtime is done.

## Definition of 100%

URAI reaches 100% when every launch gate in `system/urai-integration-spine.json` is marked `passed` with evidence, and:

```bash
npm run preflight
npm run check:system-registry
npm run check:system-of-systems
npm run launch:check
npm run verify:release:full
```

all complete successfully against the release candidate, followed by recorded production deploy, live smoke, monitoring, and rollback proof.
