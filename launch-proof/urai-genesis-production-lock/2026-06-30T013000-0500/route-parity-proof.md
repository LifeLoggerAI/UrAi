# Route Parity Proof

Generated: 2026-06-30T01:30:00-05:00
Repo: LifeLoggerAI/UrAi
Starting SHA: 409dda09c0381510ee95923a5851eade5e6733ea
Ending SHA: captured in final response

## Source-level parity

Source contains the critical public/gated routes required for the Genesis front door. `scripts/verify-routes.mjs` already inventories 21 critical routes. This pass added `scripts/smoke-linked-routes.mjs` to verify the most important linked public/gated routes against a local or live base URL.

## Live checks performed through web fetch

| Route | Live observation | Status |
| --- | --- | --- |
| `/` | Redirected to `/home`; public demo copy visible | PARTIAL PASS |
| `/home` | Loaded Home threshold copy | PARTIAL PASS |
| `/ground` | Loaded URAI Ground World and launch-safety copy | PASS for route existence/live 200 via web |
| `/status` | Loaded static preview status copy | PARTIAL PASS |
| `/system` | Web tool cache miss / could not fetch | BLOCKED |
| `/xr` | Web tool cache miss / could not fetch | BLOCKED |
| `/privacy` | Web tool cache miss / could not fetch | BLOCKED |
| `/terms` | Web tool cache miss / could not fetch | BLOCKED |
| `/dashboard` | Web tool cache miss / could not fetch | BLOCKED |
| `/login` | Web tool cache miss / could not fetch | BLOCKED |
| `/signup` | Web tool cache miss / could not fetch | BLOCKED |
| `/waitlist` | Web safety restriction / could not fetch | BLOCKED |

## Direct finding

The prior `/ground` 404 is no longer reproduced by the web check: `/ground` returned the Ground World page with sample-data launch-safety copy. This improves live parity, but does not prove deployed SHA/release ID.

## Remaining parity blocker

`/system` live truth markers still need a real curl/browser/Firebase deploy-shell proof. READY cannot be claimed until `/system` returns HTTP 200 and includes the registry truth markers.

## Required command proof

Run after deploy:

```bash
npm run smoke:linked-routes:live
npm run smoke:production
npm run verify:release:full
```

Attach raw output, release ID, deployed SHA, and screenshots to this folder.
