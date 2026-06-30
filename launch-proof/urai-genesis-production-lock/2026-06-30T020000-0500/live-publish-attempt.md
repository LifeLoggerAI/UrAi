# Live Publish Attempt / External Receipts Lock — URAI Genesis

Generated: 2026-06-30T02:00:00-05:00
Repo: LifeLoggerAI/UrAi
Branch: main
Observed indexed head before this file: 2262afb97a52f952c6fd0d9d073aaa3ad286d8f3

## What was requested

Push, publish live, confirm, verify, and document receipts for the current Genesis/front-door repo.

## What this pass could verify through GitHub

- GitHub access is available with admin/maintain/push permissions.
- Default branch is `main`.
- Prior blocker commit `889c95c244a92ecb3680403603d7bb70b6822ff7` is contained in `main`; `main` is 96 commits ahead of it.
- The latest proof folder before this pass is `launch-proof/urai-genesis-production-lock/2026-06-30T013000-0500/`.
- Source contains the registry-backed `/system` route at `src/app/system/page.tsx`.
- Source contains launch-validation scripts and deployment scripts in `package.json`, including `preflight`, `verify:release:full`, `smoke:linked-routes`, `smoke:linked-routes:live`, `deploy`, and `ship:urai:prod`.
- The previous proof folder already records source-side fixes and linked-route smoke tooling.

## Live/deploy attempt result

This environment does not expose an authenticated Firebase CLI session, Firebase project credentials, deployment secret store, or a working external DNS/network path from the local container. A direct container check failed before HTTP with DNS resolution failure:

```text
curl -I -L --max-time 20 https://urai.app/system
curl: (6) Could not resolve host: urai.app
```

Because of that, this pass could not honestly perform or confirm:

- `npm ci`
- full local validation chain
- Firebase deploy
- Firebase release ID capture
- deployed commit SHA capture
- direct live `/system` truth-marker proof
- rollback drill
- monitoring/alert proof
- privacy-gate signoff
- provider-backed AI smoke

## Production truth

Do not mark this repo broad-production READY from this pass alone. The source is closer and the repo is documented, but live publication still requires external deployment credentials and independent live receipts.

Current status remains:

`DONE BUT NEEDS EXTERNAL ENV / DEPLOY PROOF`

## Exact operator commands to finish live proof

Run these from an authenticated Node 20 + Firebase CLI terminal with access to `urai-4dc1d`:

```bash
npm ci
npm run check:v1
npm run check:system-registry
npm run check:production-lock
npm run check:firestore-contract
npm run check:public-copy
npm run check:production-claims
npm run validate:completion
npm run typecheck
npm run lint
npm run test:unit
npm run test:rules
npm run build
npm run smoke:linked-routes
npm run test:smoke
npm run deploy
npm run smoke:linked-routes:live
npm run verify:release:full
```

After deploy, capture:

```bash
firebase hosting:releases:list --site urai-4dc1d --limit 5
curl -I -L https://urai.app/system
curl -L https://urai.app/system | grep -E "URAI release truth|Registry shape|Genesis Spine|Deferred And Gated Systems"
```

Required receipts before READY:

1. Passing command logs for install/checks/typecheck/lint/tests/rules/build/smoke.
2. Firebase release ID.
3. Deployed commit SHA.
4. Live `/system` truth-marker output or screenshot.
5. Live `/ground`, `/status`, `/life-map`, `/privacy-controls`, `/dashboard`, `/login`, `/signup` route smoke output.
6. `/api/waitlist` safe persistence proof or documented dry-run mode.
7. Public user denial proof for admin/private routes.
8. Rollback target and rollback drill proof.
9. Monitoring/alert proof.
10. Privacy-gate evidence before any private-data launch claim.

## Ecosystem coordinator line

`LifeLoggerAI/UrAi` remains `DONE BUT NEEDS EXTERNAL ENV / DEPLOY PROOF`; do not mark broad production-ready until Firebase deploy/live-system/validation/rollback/monitoring/privacy receipts are attached.

FINAL VERDICT: DONE BUT NEEDS EXTERNAL ENV / DEPLOY PROOF — GitHub/source proof is pushed, but live publication cannot be honestly confirmed without external Firebase credentials, runnable Node validation, DNS/live access, deployed SHA, rollback, monitoring, and privacy-gate receipts.
