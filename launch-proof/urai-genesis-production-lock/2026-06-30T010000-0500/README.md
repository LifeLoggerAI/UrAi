# URAI Genesis / Main Front Door Production Proof Pass

Audit timestamp: 2026-06-30T01:00:00-05:00
Repo: LifeLoggerAI/UrAi
Branch: main
Latest audited commit before this proof folder: 21e57b4453b340cb728205ec7db022bfdeb0fb9e
Prior blocker commit checked: 889c95c244a92ecb3680403603d7bb70b6822ff7

## Verdict

PARTIAL / NOT READY for broad production.

Genesis is a real Next.js/Firebase public/demo front door. It has source routes for `/`, `/home`, `/system`, `/status`, `/ground`, `/life-map`, `/xr`, gated account surfaces, waitlist API, deterministic companion API, Firebase config, Firestore rules, and release/production-lock scripts.

It cannot be called production-ready yet because the currently audited source commit is not proven deployed, current CI/build/test receipts are absent, live route parity for `/ground` and `/system` could not be fully re-proven in this pass, rollback/monitoring/privacy-gate evidence remains absent, and the registry still marks Genesis launch eligibility as false.

## Scores

| Area | Score | Notes |
| --- | ---: | --- |
| Source readiness | 70 / 100 | Real app, many routes, safety copy, production-lock scripts. |
| Launch readiness | 42 / 100 | Deployed SHA/release ID, monitoring, rollback, and fresh full live smoke missing. |
| Route parity readiness | 55 / 100 | Source contains `/ground` and `/system`; live root exposes Ground link, but direct route parity remains unproven. |
| Integration readiness | 38 / 100 | Downstream systems are mostly registry-gated/blocked/roadmap. |
| Security/privacy readiness | 58 / 100 | Good public/demo posture and gating docs; privacy-gate proof incomplete. |
| Deployment readiness | 35 / 100 | Firebase target known, but deployed commit SHA and release proof missing. |

## Repo state receipts

- Repo is reachable with admin/maintain/push permissions.
- Visibility is public.
- Default branch is `main`.
- Compare from prior blocker commit `889c95c244a92ecb3680403603d7bb70b6822ff7` to `main` showed `main` ahead by one commit at the time of comparison, with only the ecosystem proof README added.
- Latest `main` later advanced to `21e57b4453b340cb728205ec7db022bfdeb0fb9e` from the safe env-template fix in this pass.
- GitHub combined status for the prior proof commit and the env-template fix commit returned no status checks, so CI proof is missing for both.

## Safe fix completed

`env.local.template` was updated to align example Firebase project IDs with the production Firebase project/site `urai-4dc1d`. This fixes the prior mismatch where the template used `FIREBASE_PROJECT_ID=urai-42390883` while `.firebaserc` and `firebase.json` targeted `urai-4dc1d`.

Commit: `21e57b4453b340cb728205ec7db022bfdeb0fb9e`

## Live checks performed

The web checker opened `https://urai.app/`. It redirected to `/home` and returned a public demo page with launch-safe copy, Ground/Life Map/XR links, paused Firebase feedback/bug intake messaging, and explicit safety language saying private data, autonomous actions, and headset entry remain gated.

Direct browser extraction for child routes was limited by the available web tool. Local container network checks failed DNS resolution, so no local curl-based route parity proof was possible from this environment.

## Source route findings

- `/ground` exists at `src/app/ground/page.tsx` and is a public sample-data world preview with launch-safety copy. If live `/ground` still returns 404, the most likely cause is stale deploy/live-source drift rather than missing source.
- `/system` exists at `src/app/system/page.tsx`, is registry-backed, noindexed, and says it shows launch mode, production eligibility, DNS/SSL proof, smoke evidence, rollback evidence, monitoring evidence, privacy gate evidence, and blockers.
- `system/urai-system-registry.json` still marks `LifeLoggerAI/UrAi` as `canClaimProduction: false`, `eligibleForLaunch: false`, and `launchMode: demo-only`.
- `/api/waitlist` validates input, rate-limits by hook, supports dry-run mode, and writes to Firestore only when Firebase Admin is configured and dry-run is disabled.
- `/api/companion` is deterministic/local mocked behavior via `buildCompanionReply`; it is not provider-backed AI.

## P0 blockers

1. Prove deploy freshness: deployed Firebase release must point to the current audited commit SHA.
2. Prove `/ground` direct live route returns expected public Ground page, not 404.
3. Prove `/system` direct live route returns registry truth markers and not a stale bundle.
4. Run full validation chain and attach logs: install, check:v1, check:system-registry, check:production-lock, check:firestore-contract, check:public-copy, check:production-claims, validate:completion, typecheck, lint, unit tests, rules tests, build, smoke/e2e.
5. Prove waitlist persistence safely in emulator/staging or controlled production test without exposing records.
6. Prove privacy gate: export/delete/consent/revocation/retention/legal-hold evidence or keep private data surfaces gated.
7. Prove rollback and monitoring.

## Completion gate

Do not mark READY until source, build, route parity, live deployment, privacy/security, rollback, and monitoring evidence are all current and attached.

FINAL VERDICT: PARTIAL — the Genesis source is real and safer after the Firebase env-template fix, but launch readiness remains blocked by missing current validation, deployed-SHA proof, `/ground` and `/system` live parity proof, privacy-gate evidence, rollback, and monitoring.
