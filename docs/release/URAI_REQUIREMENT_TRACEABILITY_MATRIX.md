# UrAi Requirement Traceability Matrix

Status: seed matrix - not complete
Owner: Product / QA

## Completion rule

No row may be marked `Done` unless every evidence column is filled and owner signoff is complete.

| Req ID | Tier | Requirement | Source evidence | Implementation evidence | Test evidence | QA evidence | Documentation evidence | Owner | Status | Signoff | Freeze status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| URAI-TIER-001 | All | Official Tier 1-5 definitions must be approved and versioned | Missing | N/A | Review/signoff required | Missing | Missing | Product | Blocked | No | Not frozen |
| URAI-TIER-002 | All | Tier gating matrix must define allowed/denied behavior per tier | Missing | Missing | Missing | Missing | Missing | Product + Security | Blocked | No | Not frozen |
| URAI-V1-001 | Tier 1 | Public demo spine must remain explicitly scoped and conservative | README.md | Current repo README | npm run check:v1 | Missing | README.md | Product | Partially Done | No | Not frozen |
| URAI-AUTH-001 | Tier 1 | Signup/login/logout/password reset/profile lifecycle must be verified | Missing | Missing | Missing | Missing | Missing | Eng + QA | Unclear | No | Not frozen |
| URAI-DB-001 | Tier 1 | Firestore rules/index scaffolding must match V1 launch collections | README.md | firestore.rules/indexes required | npm run check:firestore-contract | Missing | Missing | Backend + Security | Unclear | No | Not frozen |
| URAI-AV-001 | Tier 1/2 | Avatar/Mirror or symbolic mirror behavior must be explicitly implemented in canonical repo | Uploaded execution plan / prior spec references | Missing | Missing | Missing | Missing | Frontend + AI | Blocked | No | Not frozen |
| URAI-PAY-001 | Tier 2 | Stripe checkout must create paid subscription sessions only for authenticated users | Payment snippets referenced in execution plan | Missing | Missing | Missing | Missing | Backend | Blocked | No | Not frozen |
| URAI-PAY-002 | Tier 2 | Stripe webhook must verify signatures and sync Firestore entitlement state | Payment snippets referenced in execution plan | Missing | Missing | Missing | Missing | Backend + Security | Blocked | No | Not frozen |
| URAI-PAY-003 | Tier 2 | Billing portal must support cancel/downgrade/failed payment lifecycle | Payment snippets referenced in execution plan | Missing | Missing | Missing | Missing | Backend + Product | Blocked | No | Not frozen |
| URAI-AI-001 | Tier 3 | Companion/model behavior must have prompt/version management | Execution plan | Missing | Missing | Missing | Missing | AI Lead | Blocked | No | Not frozen |
| URAI-AI-002 | Tier 3 | AI safety, hallucination, fallback, rate limit, and cost controls must be tested | Execution plan | Missing | Missing | Missing | Missing | AI Lead + Security | Blocked | No | Not frozen |
| URAI-SDK-001 | Tier 4 | SDK/API/business tier scope must be confirmed before implementation is considered complete | Execution plan | Missing | Missing | Missing | Missing | Product + Eng | Blocked | No | Not frozen |
| URAI-FRANCHISE-001 | Tier 5 | Franchise/platform tier scope, revenue, admin, and compliance controls must be confirmed | Execution plan | Missing | Missing | Missing | Missing | Product + Legal + Ops | Blocked | No | Not frozen |
| URAI-ADMIN-001 | Shared | Admin tools must enforce RBAC and write audit logs | Execution plan | Missing | Missing | Missing | Missing | Ops + Security | Blocked | No | Not frozen |
| URAI-SEC-001 | Shared | Auth, authorization, storage, privacy, deletion/export, and abuse controls must pass security review | Execution plan | Missing | Missing | Missing | Missing | Security | Blocked | No | Not frozen |
| URAI-QA-001 | Shared | Unit, integration, E2E, smoke, regression, accessibility, performance, and staging verification must pass | README validation commands / execution plan | Missing | Missing | Missing | Missing | QA | Blocked | No | Not frozen |
| URAI-OPS-001 | Shared | CI/CD, staging, production deploy, rollback, monitoring, alerting, and incident workflows must be verified | Execution plan | Missing | Missing | Missing | Missing | Release Ops | Blocked | No | Not frozen |
| URAI-DOCS-001 | Shared | Full documentation pack must exist and be frozen | Execution plan | Missing | Missing | Missing | This doc + freeze system seed | Docs Owner | Partially Done | No | Not frozen |

## Required evidence attachment format

For every row, attach:

```text
Requirement ID:
Source link:
Implementation PR/commit/file:
Automated test command/result:
Manual QA evidence:
Documentation link:
Owner signoff:
Freeze status:
```
