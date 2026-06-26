# URAI Launch Go/No-Go

Generated: 2026-06-25

## Decision

NO-GO for production launch.

The safe state is `demo-only` or `staging-only` for the Genesis spine until evidence gaps are closed. No production deployment was performed in this pass.

## Go Criteria

A production cutover can be reconsidered only after these are true:

- `npm run check:system-registry` passes in a clean Node 20 environment.
- `npm run check:production-lock` passes.
- `npm run smoke:production` passes all required targets.
- `npm run smoke:genesis-spine` passes or has documented non-production warnings only.
- `npm run check:v1`, `npm run check:types` or `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` pass.
- Production deploy command is target-locked to the intended Firebase project/site.
- Rollback target and rollback command are recorded.
- Monitoring/alert links and owners are recorded.
- `urai-privacy` gate evidence covers consent, export, delete, retention, admin audit, user-derived intelligence, communications opt-in, analytics aggregation, generated artifacts, child/minor safety if applicable, and therapy-adjacent disclaimers if applicable.

## Current No-Go Findings

| Area | Status | Evidence |
| --- | --- | --- |
| Canonical app URL | Partial | `https://urai.app` and `https://urai-4dc1d.web.app` returned HTTP 200 on 2026-06-25 |
| Canonical `/system` route | Missing live proof | Prior smoke saw `/system` return 200 but without the `URAI release truth` marker |
| Local verification | Blocked by environment | `node`, `npm`, `pnpm`, `corepack`, and `firebase` were unavailable on PATH |
| Admin surface | Blocked | `https://urai-admin.web.app` returned HTTP 503 |
| Staging API proof | Partial | `https://urai-staging.web.app` returned HTTP 200, but prior `/api/healthz` and `/system-registry.json` checks returned 404 |
| Privacy gate | Not passed | Governance docs exist, but live consent/export/delete/admin audit/legal proof is not recorded as passed |
| Rollback | Missing | No current rollback target evidence recorded for production cutover |
| Monitoring | Missing | No monitoring/alert evidence recorded for production cutover |

## Result

Proceed only with documentation, static status surfaces, registry checks, and staging-safe smoke. Do not deploy production or wire live sensitive integrations from this state.
