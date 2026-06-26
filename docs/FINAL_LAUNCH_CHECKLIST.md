# URAI Final Launch Checklist

Generated: 2026-06-25

This checklist is intentionally strict. A checked box requires command output, URL smoke output, deploy evidence, or linked written evidence.

## Current Status

- [ ] Production launch approved
- [ ] Any repo genuinely launch-eligible
- [x] Canonical product repo identified as `LifeLoggerAI/UrAi`
- [x] `LifeLoggerAI/UrAi-Dev` locked as sandbox-only
- [x] `LifeLoggerAI/UrAiProd` locked as legacy-archive
- [x] Production-lock registry fields added
- [x] Production-lock checker added
- [x] Production smoke target config added
- [ ] Production-lock checker executed in Node 20 environment
- [ ] Production smoke checker executed in Node 20 environment
- [ ] Local build/check/lint/test/typecheck evidence captured
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
npm run check:v1
npm run check:types || npm run typecheck
npm run lint
npm test
npm run build
```

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

Current decision: NO-GO.

Next valid action is to run the added checks in a clean Node 20 environment, capture their output, and close blockers. Do not deploy production from this checklist state.
