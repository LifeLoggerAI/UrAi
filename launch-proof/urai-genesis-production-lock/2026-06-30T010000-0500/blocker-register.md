# Blocker Register — URAI Genesis

Audit timestamp: 2026-06-30T01:00:00-05:00
Repo: LifeLoggerAI/UrAi

## P0 blockers

| Severity | Issue | User-visible risk | File/path | Fix required | Proof required | Acceptance criteria |
| --- | --- | --- | --- | --- | --- | --- |
| P0 | Deployed SHA/release ID not proven | Cannot prove current source is live | Firebase Hosting/App Hosting release evidence | Run controlled deploy or fetch Firebase release metadata | Release ID, deploy timestamp, commit SHA | Live release maps to audited commit |
| P0 | `/ground` direct live parity unproven | Ground CTA may lead to 404 or stale bundle | `src/app/ground/page.tsx`, Firebase hosting | Deploy current build or fix hosting route drift | HTTP 200, screenshot, smoke log | `/ground` renders Ground World page with launch-safety copy |
| P0 | `/system` direct live truth markers unproven | Public truth route may be stale or missing | `src/app/system/page.tsx`, `system/urai-system-registry.json` | Deploy current build or fix hosting route drift | HTTP 200, screenshot, text markers | `/system` shows registry truth, launch posture, blocked/deferred systems |
| P0 | Full validation chain not run in this environment | Build/type/test regressions may exist | repo root scripts | Run in authenticated checkout/CI | Raw command logs | install/checks/type/lint/test/build/smoke pass |
| P0 | Privacy gate incomplete | Public/private data surfaces may overclaim | `system/urai-system-registry.json`, privacy docs | Implement/prove export/delete/consent/revocation/retention | Privacy-gate receipts | Private data features stay gated until proof passes |
| P0 | Rollback and monitoring evidence missing | Unsafe launch/no ops safety | deploy docs/monitoring proof | Configure/test rollback and alerting | rollback drill log, alert screenshots/logs | Launch has monitored rollback path |

## P1 blockers

| Severity | Issue | User-visible risk | Fix required | Acceptance criteria |
| --- | --- | --- | --- | --- |
| P1 | Waitlist persistence not safely proven | CTA may only dry-run or fail in prod | Emulator/staging or controlled write/read proof | Safe test shows validation, write, duplicate handling, and no record exposure |
| P1 | Status copy references service health without proof | Users may infer live monitoring | Add/live-proof status feed or keep copy clearly limited | Status page copy matches actual monitoring receipts |
| P1 | Admin/app private routes exist in source | Private surfaces could leak if ungated | Confirm auth/noindex/route gates | Public user cannot access private/admin data |
| P1 | Downstream integrations mostly registry-gated | Users may infer storytime/spatial/jobs/etc are live | Keep links/copy gated and evidence-based | No unverified downstream feature is claimed live |

## P2 blockers

- Add automated live route parity smoke test for `/`, `/home`, `/ground`, `/system`, `/status`, `/life-map`, `/xr`, `/privacy`, `/terms`, `/privacy-controls`.
- Add screenshot artifact capture to CI/release proof.
- Add exact Firebase release metadata capture script.

## P3 improvements

- Add explicit route inventory generated from `src/app`.
- Add noindex metadata audit for internal/admin/status routes.
- Add public copy truth linter for downstream feature claims.
