# URAI Final Launch Checklist

Generated: 2026-06-25

This checklist is intentionally strict. A checked box requires command output, URL smoke output, deploy evidence, or linked written evidence.

## Current Status

- [ ] Production launch approved
- [ ] Public-demo launch approved
- [ ] Any repo genuinely launch-eligible
- [x] Canonical product repo identified as `LifeLoggerAI/UrAi`
- [x] `LifeLoggerAI/UrAi-Dev` locked as sandbox-only
- [x] `LifeLoggerAI/UrAiProd` locked as legacy-archive
- [x] Production-lock registry fields added
- [x] Production-lock checker added
- [x] Production smoke target config added
- [x] Existing live app HTTP smoke checked for `/`, `/home`, `/system`, `/life-map`, `/privacy`, `/terms`, `/waitlist`, and `/demo`
- [ ] Live `/system` page displays production-lock truth
- [ ] Production-lock checker executed in Node 20 environment
- [ ] Production smoke checker executed in Node 20 environment
- [ ] Visual QA screenshots captured successfully
- [ ] Local build/check/lint/test/typecheck evidence captured
- [ ] Staging deploy evidence captured for this cutover
- [ ] Production deploy log/release SHA captured
- [ ] Rollback target and rollback drill captured
- [ ] Monitoring/alert evidence captured
- [ ] Privacy release gate marked passed with evidence
- [ ] Admin access/custom claims and audit logging proven in production
- [ ] Staging proof complete for Genesis spine
- [ ] DNS/SSL custom domain evidence complete for every production domain

## Required Commands Before Cutover

```bash
npm run check:system-registry
npm run check:production-lock
npm run smoke:production
npm run smoke:genesis-spine
npm run test:visual
npm run check:v1
npm run check:types || npm run typecheck
npm run lint
npm test
npm run build
```

## Final Cutover Attempt Evidence

Date: 2026-06-25 America/Chicago

- `npm run check:production-lock` failed before execution because `npm` is not recognized on PATH.
- Other npm-based checks are blocked for the same environment reason.
- Browser screenshot capture failed because the in-app browser runtime hit `windows sandbox failed: helper_unknown_error: apply deny-read ACLs`.
- Direct HTTPS route checks returned HTTP 200 for `/`, `/home`, `/system`, `/life-map`, `/privacy`, `/terms`, `/waitlist`, and `/demo`.
- Live `/system` did not contain the expected production-lock markers and appears to serve the currently deployed `URAI Spatial` root/home bundle.
- No staging deploy was attempted.
- No production deploy was attempted.

See `docs/FINAL_LAUNCH_REPORT.md` for the full launch-blocker report.

## Manual Release Evidence Required

- Firebase project selected with explicit project/site target.
- Production deploy log includes branch, commit SHA, timestamp, operator, and Firebase project/site.
- Production URL smoke passes after deployment.
- `/system` page displays launch modes, evidence, and blockers from the registry.
- Rollback command is tested or dry-run validated and rollback target is recorded.
- Monitoring dashboard/alert links are recorded.
- Privacy gate evidence is linked and approved.
- Legal/privacy owner approval is recorded.

## Cutover Decision

Current decision: NO-GO: blocked.

Reason: production lock and public-demo evidence are incomplete, live `/system` does not display registry truth, local checks and visual QA could not run in this environment, and rollback/monitoring/privacy gate proof is missing.

Next valid action is to run the added checks in a clean Node 20 environment, deploy the registry-backed `/system` route to staging first, capture visual screenshots, then re-run final cutover preflight. Do not deploy production from this checklist state.
