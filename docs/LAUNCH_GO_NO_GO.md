# URAI Launch Go/No-Go

Generated: 2026-06-25

## Decision

NO-GO: blocked.

The safe state is `demo-only` or `staging-only` for the Genesis spine until evidence gaps are closed. No staging deployment and no production deployment were performed in the final cutover pass.

## Launch Mode

Current canonical app registry mode: `demo-only`.

Current canonical app launch eligibility: `false`.

This is not `public-demo` ready and not `production` ready because the required evidence is incomplete and the live `/system` route does not show production-lock truth.

## Go Criteria

A public-demo or production cutover can be reconsidered only after these are true:

- `npm run check:system-registry` passes in a clean Node 20 environment.
- `npm run check:production-lock` passes.
- `npm run smoke:production` passes all required targets.
- `npm run smoke:genesis-spine` passes or has documented non-production warnings only.
- `npm run test:visual` captures screenshots for launch-critical routes.
- `npm run check:v1`, `npm run check:types` or `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` pass.
- Staging deploy/smoke evidence proves the registry-backed `/system` route before production.
- Production deploy command is target-locked to the intended Firebase project/site.
- Rollback target and rollback command are recorded.
- Monitoring/alert links and owners are recorded.
- `urai-privacy` gate evidence covers consent, export, delete, retention, admin audit, user-derived intelligence, communications opt-in, analytics aggregation, generated artifacts, child/minor safety if applicable, and therapy-adjacent disclaimers if applicable.

## Current No-Go Findings

| Area | Status | Evidence |
| --- | --- | --- |
| Canonical app URL | Partial | `https://urai.app` returned HTTP 200 on 2026-06-25 |
| Public routes | Partial | `/`, `/home`, `/system`, `/life-map`, `/privacy`, `/terms`, `/waitlist`, and `/demo` returned HTTP 200 |
| Canonical `/system` route | Blocking mismatch | Live `/system` returned HTTP 200 but did not contain `URAI release truth`, `Production lock`, `launch mode`, `demo-only`, or `launch-eligible`; saved HTML showed the deployed `URAI Spatial` root/home bundle |
| Local verification | Blocked by environment | `npm run check:production-lock` failed before execution because `npm` is not recognized on PATH; other npm checks are blocked for the same reason |
| Visual screenshots | Blocked by environment | Browser runtime failed with `windows sandbox failed: helper_unknown_error: apply deny-read ACLs` |
| Admin surface | Blocked | `https://urai-admin.web.app` previously returned HTTP 503 |
| Staging API proof | Partial | `https://urai-staging.web.app` returned HTTP 200, but prior `/api/healthz` and `/system-registry.json` checks returned 404 |
| Privacy gate | Not passed | Governance docs exist, but live consent/export/delete/admin audit/legal proof is not recorded as passed |
| Rollback | Missing | No current rollback target evidence recorded for production cutover |
| Monitoring | Missing | No monitoring/alert evidence recorded for production cutover |

## Result

Proceed only with documentation, static status surfaces, registry checks, staging-safe smoke, and staging deployment of the registry-backed `/system` route. Do not deploy production or wire live sensitive integrations from this state.

See `docs/FINAL_LAUNCH_REPORT.md` for the final cutover blocker report.
