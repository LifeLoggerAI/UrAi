# Completion Plan To 100 Percent

Generated: 2026-06-30T01:30:00-05:00
Repo: LifeLoggerAI/UrAi
Starting SHA: 409dda09c0381510ee95923a5851eade5e6733ea
Ending SHA: captured in final response

## Repo-side complete in this pass

1. Added linked route smoke checker.
2. Added live linked route smoke package command.
3. Created done-done proof folder.
4. Updated completion status with honest blockers.

## External/source-plus-terminal actions required

1. Run `npm ci` in Node 20.
2. Run full checks: `check:v1`, `check:system-registry`, `check:production-lock`, `check:firestore-contract`, `check:public-copy`, `check:production-claims`, `validate:completion`, `typecheck`, `lint`, `test:unit`, `test:rules`, `build`.
3. Run local linked-route smoke after `npm run start`.
4. Deploy hosting/rules to Firebase project/site `urai-4dc1d`.
5. Capture Firebase release ID and deployed SHA.
6. Run `npm run smoke:linked-routes:live`.
7. Verify `/system` live truth markers.
8. Smoke APIs safely: waitlist dry-run or controlled persistence, companion deterministic, companion/respond fallback or provider path, admin/status unauthorized denial.
9. Configure and capture monitoring/alerts.
10. Capture rollback target and run rollback drill.
11. Complete privacy gate evidence: consent/export/delete/revocation/retention/admin audit/legal signoff as applicable.
12. Update registry and final launch report only after evidence exists.

## Acceptance criteria for READY

- Source build/test/lint/rules pass.
- Live route parity passes.
- `/system` truth page live.
- Deployed SHA equals audited SHA.
- Rollback proof exists.
- Monitoring proof exists.
- Privacy gate passes or private features remain gated.
- AI/provider claim is backed by deployed proof or remains provider-capable only.
