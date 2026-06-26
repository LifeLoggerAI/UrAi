# URAI Final Launch Checklist

Generated: 2026-06-25
Updated: 2026-06-25T23:54:00-05:00

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
- [x] Node 20/npm verification completed with portable runtime
- [x] Local registry and production-lock checks executed
- [x] Local typecheck/lint/test evidence captured
- [x] Local direct Next build passed and emitted `/system`
- [x] Existing live app HTTP smoke checked for `/`, `/system`, `/privacy`, `/terms`, and `/waitlist`
- [ ] Live `/system` page displays production-lock truth
- [ ] Staging deploy evidence captured for this cutover
- [ ] Staging `/system` page displays production-lock truth
- [ ] Visual QA screenshots captured successfully
- [ ] Production deploy log/release SHA captured
- [ ] Rollback target and rollback drill captured
- [ ] Monitoring/alert evidence captured
- [ ] Privacy release gate marked passed with evidence
- [ ] Admin access/custom claims and audit logging proven in production
- [ ] Staging proof complete for Genesis spine
- [ ] DNS/SSL custom domain evidence complete for every production domain

## Commands Run In Latest Blocker Pass

```bash
C:\tmp\node-v20.19.4-win-x64\node.exe -v
C:\tmp\node-v20.19.4-win-x64\npm.cmd -v
npm ci
npm run check:system-registry
npm run check:production-lock
node scripts/check-firebase-target.mjs --config firebase.staging.json
npm run typecheck
npm run lint
npm test
npm run build
node ./node_modules/next/dist/bin/next build
npm exec firebase-tools -- deploy --project urai-staging --only hosting --config firebase.staging.json
```

## Latest Evidence Summary

- Portable Node 20 is working: `v20.19.4`; portable npm is `10.8.2`.
- `npm ci` passed after Node 20 was placed on PATH for package postinstall scripts.
- `npm run check:system-registry` passed.
- `npm run check:production-lock` passed internal consistency and correctly kept `eligibleForLaunch=false`; privacy-gated systems still lack gate evidence.
- `npm run typecheck` passed.
- `npm run lint` passed after fixing one JSX apostrophe escape in `src/app/launch/page.tsx`; 5 warnings remain.
- `npm test` passed: 50 suites and 319 tests.
- `npm run build` failed before build because this Windows shell lacks POSIX `rm`/`mkdir -p`.
- Direct Next build passed with `node ./node_modules/next/dist/bin/next build` and emitted `/system`.
- Built `/system` contains registry truth markers including `URAI release truth`, registry timestamp, production lock data, Genesis Spine, and deferred/gated systems.
- Firebase staging deploy failed before deploy because Firebase CLI is not authenticated: `Failed to authenticate, have you run firebase login?`.
- Existing staging `/system` returns 404 and does not show registry truth.
- Existing production `/system` returns 200 but still serves the stale Spatial root/home bundle, not registry truth.

## Cutover Decision

Current decision: NO-GO: blocked.

Reason: source/build readiness improved, but staging deploy is blocked by Firebase authentication and staging `/system` is not proven live. Production/public-demo deploy remains prohibited until staging `/system` truth passes.

Next valid action: authenticate Firebase CLI for project/site `urai-staging`, deploy commit `f6931174fd4bf81f8a57a624fa080b542938c179` to staging, smoke `/`, `/system`, `/life-map`, `/privacy`, `/terms`, `/waitlist`, `/signup`, `/login`, and `/dashboard`, then capture visual evidence. Do not deploy production from this checklist state.
