# URAI Canonical App Repo Audit Receipt

DATE: 2026-07-09
SYSTEM: URAI Canonical App
REPO: LifeLoggerAI/UrAi
LOCAL_PATH: ~/UrAi
BRANCH: main
COMMIT_SHA: d4941c5
CLASSIFICATION: Canonical V1 app / public demo product spine

PURPOSE:
Main public URAI application and V1 demo/product spine.

CURRENT_LOCAL_STATE:
Sparse checkout active.
Working tree expected clean after this receipt commit.

KNOWN_OPS_DOCS_PRESENT:
- docs/ops/AUDIT_RECEIPTS.md
- docs/ops/DEPLOYMENT_RULES.md
- docs/ops/DOMAIN_REGISTRY.md
- docs/ops/NEXT_ACTIONS.md
- docs/ops/PRODUCTION_STATUS_MATRIX.md
- docs/ops/README.md
- docs/ops/REPOSITORY_REGISTRY.md
- docs/ops/URAI_MASTER_SYSTEM_MAP.md

PRODUCTION_STATUS:
Evidence-gated.
Not production-certified.

KNOWN_SECURITY_STATUS:
GitHub reported 19 vulnerabilities on default branch:
- High: 5
- Moderate: 12
- Low: 2

BLOCKERS:
- Dependabot/security review required.
- Production deploy evidence must be verified.
- Smoke test evidence must be verified.
- Rollback evidence must be verified.
- Monitoring evidence must be verified.
- Privacy/security gate evidence must be verified.

NEXT_ACTION:
Run full repo audit commands, inspect package/build/deploy configs, verify Firebase targets, then create deployment, smoke, rollback, monitoring, and security follow-up receipts.

VERIFIED_BY: Adam Clamp / URAI Labs
