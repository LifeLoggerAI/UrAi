# UrAi Tier 1-5 Freeze Execution System

Status: active execution control document
Owner: Product / Engineering / QA / Security / Release Operations
Source basis: user-provided UrAi completion plan, current canonical repo README, and discovered repository state.

## Non-negotiable truth rule

No UrAi tier, feature, release, document, or artifact may be marked complete unless it has all of the following evidence:

1. Source evidence
2. Implementation evidence
3. Test evidence
4. QA evidence
5. Documentation evidence
6. Owner signoff
7. Freeze status

If any evidence is missing, the status must be `Blocked`, `Unclear`, `Not Started`, `Partially Done`, or `Mostly Done`; it must not be `Done`.

## Canonical production source

The canonical live URAI repo is `LifeLoggerAI/UrAi`.

Legacy/archive production-style content in `LifeLoggerAI/UrAiProd` must not be treated as production implementation unless it is ported into this repo and verified through this repo's CI/deploy path.

## Current confirmed product posture

The current repo README describes URAI V1 as a conservative public demo spine for a future passive emotional operating system. It explicitly states that full passive sensing, therapy/diagnosis, marketplace, AR/VR, B2B, and studio/export systems are not live in V1 unless explicitly implemented, consent-gated, tested, and documented.

Therefore, Tier 1-5 completion cannot be claimed by implication. Each tier needs explicit requirement, implementation, test, QA, documentation, and release evidence.

## Final done state

UrAi is done only when every Tier 1-5 requirement is traceable from source to implementation to verification to documentation to signoff to freeze.

### Product done

- Tier 1-5 definitions are signed.
- Every tier has target customer, included features, excluded features, dependencies, acceptance criteria, and evidence.
- No tier promise exists only in notes, prompts, generated artifacts, or archived repos.

### Engineering done

- Frontend, backend, database, storage, auth, authorization, tier gating, payments, AI/model behavior, admin tooling, analytics, monitoring, and release scripts are implemented in canonical code paths.
- All implementation has PR/commit evidence.
- All implementation is reproducible from a clean checkout.

### QA done

- Unit, integration, E2E, smoke, regression, staging, production-readiness, security, accessibility, and performance checks are complete.
- No blocker or critical bugs remain open.

### Documentation done

- Product, tier, architecture, frontend, backend/API, database, auth/permissions, payments, AI/model, analytics, admin/operator, QA, deployment, rollback, incident response, disaster recovery, known issues, changelog, signoff, and freeze docs exist and are versioned.

### Security/privacy done

- Auth, authorization, custom claims, RBAC, tier gating, privacy consent, PII handling, deletion/export, retention, webhook verification, abuse controls, audit logs, storage access, and admin access are tested and signed off.

### Release operations done

- CI green.
- Staging verified.
- Production deploy path verified.
- Rollback tested.
- Monitoring and alerts are live.
- Final release artifacts are tagged and archived.

## Proposed normalized tier definitions

These definitions are execution placeholders until Product approves official definitions.

| Tier | Proposed name | Target customer | Scope | Freeze status |
| --- | --- | --- | --- | --- |
| Tier 1 | Free/Core UrAi | New individual users | Auth, profile, dashboard, base demo spine, limited Avatar/Mirror or symbolic mirror, basic privacy controls | Unconfirmed |
| Tier 2 | Pro Individual | Paying individual users | Pro entitlement, premium mirror/avatar access, exports, higher limits, billing portal | Unconfirmed |
| Tier 3 | Advanced AI / Companion | Power users/creators | AI companion/persona, memory/context, prompt safety, AI limits, evaluations | Unconfirmed |
| Tier 4 | SDK / Business / Enterprise | Business/licensee | APIs/SDKs, API keys, usage limits, metering, audit, SLA/support docs | Unconfirmed |
| Tier 5 | Franchise / Platform / Platinum | Strategic partners | Branded companions, revenue share, partner admin, compliance/security reviews | Unconfirmed |

## Release blocker list

The following are blockers until closed with evidence:

1. Official Tier 1-5 definitions are missing.
2. Tier gating matrix is not approved.
3. Payment/Pro entitlement implementation is not proven.
4. AI/companion behavior is not fully evaluated.
5. Security/privacy signoff is missing.
6. QA signoff is missing.
7. Production deploy evidence is missing.
8. Rollback evidence is missing.
9. Documentation freeze package is incomplete.
10. Requirement traceability matrix is incomplete.

## Status vocabulary

Use only these statuses:

- Done: all evidence and signoffs attached.
- Mostly Done: implemented but one or more non-blocking evidence/signoff items missing.
- Partially Done: meaningful implementation exists, but major work remains.
- Not Started: no confirmed implementation.
- Unclear: cannot determine from available evidence.
- Blocked: cannot complete until dependency or decision is resolved.

## Master freeze gates

| Gate | Required evidence | Required owner |
| --- | --- | --- |
| Tier definitions | Signed Tier 1-5 spec | Product |
| Requirement traceability | Complete RTM | Product + QA |
| Frontend | Routes/components/state evidence | Frontend Lead |
| Backend/API | API/function tests | Backend Lead |
| Database/storage | Schema/rules/index/migration tests | Backend + Security |
| Auth/RBAC | Role and denied-access tests | Security |
| Tier gating | Client and server bypass tests | Product + Security |
| Payments | Stripe checkout/webhook/billing tests | Backend + Finance/Product |
| AI/model | Prompt, safety, quality, fallback, cost tests | AI Lead |
| Admin tools | Admin RBAC and audit tests | Ops + Security |
| Analytics/logging | Event/dashboards/log evidence | Data/Ops |
| QA | Smoke/regression/E2E/security/accessibility/perf evidence | QA Lead |
| Docs | Full docs pack | Docs Owner |
| Release | CI/staging/prod/rollback/monitoring evidence | Release Lead |

## Required verification commands

Run and attach evidence for all applicable commands:

```bash
npm run check:v1
npm run check:firestore-contract
npm run seed:demo
npm run test:unit
npm run check:types
npm run lint
npm run build
npm run preflight
npm run test:smoke
npm run test:e2e
```

If a command is unavailable or fails, create a bug/blocker and attach the failure log.

## Scope freeze policy

After scope freeze, only these changes are allowed:

- Blocker fixes
- Security fixes
- Data-loss fixes
- Production deploy fixes
- Approved release-critical documentation corrections

The following are prohibited after freeze:

- New features
- Unapproved UI redesigns
- Untracked prompt changes
- Backend/API changes without regression testing
- Database changes without migration/rollback verification
- Payment or tier changes without approval
- Environment/config changes without release approval

## Final freeze certificate

```text
FINAL FREEZE CERTIFICATE - URAI

Release/version:
Freeze date/time:
Release branch/tag:
Production environment:
Artifact archive:
Rollback plan verified:
Monitoring verified:
Open blockers: 0 required
Approved exceptions:

Final approvers:
- Product:
- Engineering:
- QA:
- Security/privacy:
- Design:
- Release operations:

Certification:
No item is marked complete unless it has source evidence, implementation evidence, test evidence, QA evidence, documentation evidence, owner signoff, and freeze status.

Final status:
[ ] Frozen
[ ] Not frozen
```
