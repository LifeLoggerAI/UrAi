# URAI Operations Source of Truth

This folder is the permanent operating source of truth for URAI Labs.

It exists to prevent:
- wrong repo to wrong domain deployments
- duplicate systems
- overclaimed production status
- missing deployment receipts
- missing privacy/security evidence
- confusion between production, staging, sandbox, and legacy repos

## Core Docs

- `URAI_MASTER_SYSTEM_MAP.md`
- `REPOSITORY_REGISTRY.md`
- `DOMAIN_REGISTRY.md`
- `PRODUCTION_STATUS_MATRIX.md`
- `DEPLOYMENT_RULES.md`
- `AUDIT_RECEIPTS.md`
- `NEXT_ACTIONS.md`

## Rule

No repo, domain, feature, or service may be called production unless it has:

- canonical repository confirmed
- correct branch confirmed
- deployment target confirmed
- build/test evidence
- DNS/SSL evidence
- smoke test evidence
- rollback evidence
- monitoring evidence
- privacy/security evidence where applicable
- owner approval receipt
