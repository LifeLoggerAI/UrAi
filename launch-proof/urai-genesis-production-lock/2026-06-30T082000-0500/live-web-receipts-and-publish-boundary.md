# Live Web Receipts And Publish Boundary — URAI Genesis

Generated: 2026-06-30T08:20:00-05:00
Repo: LifeLoggerAI/UrAi
Branch: main

## Purpose

This receipt records the live web checks and publish boundary for the Genesis/front-door repo after the request to push, publish, make live, confirm, verify, and document receipts.

## GitHub/source status

- GitHub writes are available and proof files were pushed to `main`.
- Latest observed `main` commit before this receipt was `82a9097979c98ac2ea5128c5fb245b85869bf2e1`.
- GitHub combined status for `82a9097979c98ac2ea5128c5fb245b85869bf2e1` returned no status checks.
- A Firebase deploy workflow exists at `.github/workflows/deploy-home-xr.yml`, but it is manually dispatched and requires repository deployment credentials before publishing.
- This connected environment does not expose a Firebase CLI session, Firebase release metadata, deployment credentials, or a workflow-dispatch action. Therefore this pass cannot honestly claim a new Firebase deploy, deployed SHA, or release ID.

## Live web receipts verified through browser/web fetch

| Route | Live result | Launch meaning |
| --- | --- | --- |
| `https://urai.app/` | Redirects to `https://urai.app/home`; public demo content renders. | Live public front door exists. |
| `https://urai.app/ground` | Renders `URAI Ground World`, `Your private world helps your real life`, helpers, world zones, inspectable objects, and launch-safety copy. | Prior `/ground` 404 is no longer the current observed live state. |
| `https://urai.app/life-map` | Renders Life Map galaxy preview and says Replay/Passport stay owner-gated. | Public demo Life Map route is live. |
| `https://urai.app/status` | Renders `URAI status & reliability`, `Static-safe launch heartbeat`, public preview mode, and private actions off. | Public status route is live and mostly truth-gated, though final monitoring receipts are still needed. |
| `https://urai.app/xr` | Attempt through the root XR link failed with web-fetch cache miss. Root page says VR entry is hidden when immersive-vr support is unavailable. | XR remains demo/browser-gated, not full production proof. |
| `https://urai.app/system` | Direct open remained blocked by the web tool URL-safety constraint; no linked route from root was available. | `/system` source is wired but direct live proof remains missing. |

## Publish boundary

I cannot deploy Firebase from this connector-only environment. I can push GitHub commits and verify accessible public routes, but a real deploy requires one of these external execution paths:

1. Firebase CLI access in an authenticated terminal.
2. Manual dispatch of the repository deploy workflow with deploy credentials configured.
3. A connected CI/CD system that automatically deploys from `main` and exposes release metadata.

None of those deploy execution paths were available to this assistant session.

## Current production truth

`LifeLoggerAI/UrAi` is live as a public demo/front-door surface for `/home`, `/ground`, `/life-map`, and `/status`. It is not broad production-ready because the final deploy proof stack is still missing:

- current CI/check/build/test logs,
- Firebase release ID,
- deployed commit SHA,
- direct `/system` truth-marker receipt,
- rollback proof,
- monitoring proof,
- privacy-gate proof,
- waitlist persistence proof,
- admin/private denial proof.

## Exact final commands for the terminal with Firebase access

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
npm run test:smoke
npm run deploy
npm run verify:release:full
```

After deploy:

```bash
firebase hosting:releases:list --site urai-4dc1d --limit 5
curl -I -L https://urai.app/system
curl -L https://urai.app/system | grep -E "URAI release truth|Registry shape|Genesis Spine|Deferred And Gated Systems"
```

## Ecosystem coordinator line

`LifeLoggerAI/UrAi` is `LIVE DEMO / DONE BUT NEEDS EXTERNAL DEPLOY PROOF`; do not mark broad production-ready until the Firebase release/deployed SHA, `/system`, validation, rollback, monitoring, privacy-gate, waitlist persistence, and admin/private denial receipts are attached.

FINAL VERDICT: LIVE DEMO / DONE BUT NEEDS EXTERNAL DEPLOY PROOF — public demo routes are live and documented, but this session cannot execute Firebase deployment or prove the final production release stack.
