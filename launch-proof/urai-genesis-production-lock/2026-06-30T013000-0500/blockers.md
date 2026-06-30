# Blockers

Generated: 2026-06-30T01:30:00-05:00
Repo: LifeLoggerAI/UrAi
Starting SHA: 409dda09c0381510ee95923a5851eade5e6733ea
Ending SHA: captured in final response

## P0 launch blockers

1. Full Node 20 command chain not run: install, checks, typecheck, lint, tests, rules tests, build, smoke.
2. Firebase deployed SHA and release ID not captured.
3. Live `/system` registry truth markers not proven.
4. Privacy gate not passed.
5. Monitoring and rollback proof missing.
6. Provider-backed AI not deployed/smoked.
7. Firestore/Storage rules not deployed/test-proven in this pass.

## P1 important fixes

1. Run new `npm run smoke:linked-routes` locally after build.
2. Run `npm run smoke:linked-routes:live` after deploy.
3. Add production-mode test proving `/api/admin/status` ignores spoofed headers unless explicit demo env gate is enabled.
4. Prove `/api/waitlist` persistence and duplicate behavior in deployed env.
5. Capture screenshots for root/home/system/status/life-map/ground/xr/privacy/terms/dashboard/login/signup.

## P2 polish

1. Add exact Firebase release metadata capture script.
2. Add generated route inventory from `src/app`.
3. Add noindex metadata audit for internal/admin/system pages.
4. Add public status history if monitoring is implemented.

## P3 later enhancements

1. Link downstream repo proof folders once each repo passes its own production lock.
2. Add richer mobile/XR fallback QA matrix.
3. Add non-sensitive public uptime export.
