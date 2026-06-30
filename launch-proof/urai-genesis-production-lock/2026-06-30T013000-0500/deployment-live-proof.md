# Deployment And Live Proof

Generated: 2026-06-30T01:30:00-05:00
Updated: 2026-06-30 after production evidence workflow hardening
Repo: LifeLoggerAI/UrAi
Starting SHA: 409dda09c0381510ee95923a5851eade5e6733ea
Latest source SHA observed in this pass: 11334d84bd6985523bdbd8bd001efab4b72f1856

## Live domain checks

| Target | Result | Evidence level |
| --- | --- | --- |
| `https://urai.app/` | Redirected to `/home`; public demo content visible | Web fetch |
| `https://urai.app/home` | Home threshold content visible | Web fetch |
| `https://urai.app/ground` | Ground World content and launch safety visible | Web fetch PASS for route existence |
| `https://urai.app/status` | Responds, but live content is stale and still shows old uptime/monitoring copy | Web fetch STALE DEPLOY |
| `https://urai.app/system` | Web fetch cache miss / not proven | BLOCKED |
| `https://urai.app/xr` | Web fetch cache miss / not proven | BLOCKED |
| `https://urai.app/privacy` | Web fetch cache miss / not proven | BLOCKED |
| `https://urai.app/terms` | Web fetch cache miss / not proven | BLOCKED |
| `https://urai.app/dashboard` | Web fetch cache miss / not proven | BLOCKED |
| `https://urai.app/login` | Web fetch cache miss / not proven | BLOCKED |
| `https://urai.app/signup` | Web fetch cache miss / not proven | BLOCKED |

## Status route drift

Source `src/app/status/page.tsx` was fixed in commit `7b14614d59c0f79ccf13f0f8347a19c69d0623ec` to say preview/demo status only and to avoid claiming full production monitoring, backend uptime, provider health, or private-service availability.

Source `src/components/StatusGrid.tsx` was fixed in commit `333e6a3c8c468cce4a4947f02b50bdec90684564` to remove `Operational`, `Live service map`, and other unproven health language.

Live `https://urai.app/status` still returned the old copy:

- `Platform health`
- `This dashboard reflects the current heartbeat...`
- `Live service map`
- `Operational`
- `How we track uptime`
- Firebase and narrator service monitoring language

This proves the live site is stale relative to the latest source. The repo cannot be marked production-ready until the current source commit is deployed and live route smoke confirms the new preview-health copy.

## Deploy workflow state

`.github/workflows/deploy.yml` is configured to run on push to `main` and manual dispatch. It installs dependencies, runs release gates, builds, deploys Firebase Hosting live with `FIREBASE_SERVICE_ACCOUNT_URAI`, and verifies Firebase-hosted routes.

Commit `bbf1f6f5d9beb6a72f56c808b83adda255082fc4` hardened the deploy workflow by adding `npm run smoke:linked-routes:live` against `https://urai.app` after the Firebase Hosting deploy. This means the next successful production deploy must verify the custom-domain linked routes and markers.

Commit `11334d84bd6985523bdbd8bd001efab4b72f1856` hardened `.github/workflows/production-evidence.yml` so post-deploy evidence checks the custom domain too. It now requires `npm run smoke:linked-routes:live` and captures `https://urai.app/status`, failing unless the new preview-health and preview-service-map copy is live.

The GitHub connector did not expose a successful workflow run or combined status for connector-created publish commits, and live `/status` remained stale after the push. Therefore publish/deploy is NOT VERIFIED.

## Firebase deployment proof

Firebase project: source config points to `urai-4dc1d`.
Firebase site: source config points to `urai-4dc1d`.
Release ID: not captured.
Deployed SHA: not captured.
Rollback release: not captured.

## Current verdict

PARTIAL live proof: `/ground` parity improved and root/home/status respond, but deployment is not production-proven because `/status` is stale, deployed SHA is missing, release ID is missing, `/system` truth markers are unproven, rollback proof is missing, and monitoring proof is missing.

## Required external actions

If GitHub Actions did not auto-run or failed because the Firebase secret is missing, run one of these paths:

### GitHub Actions path

1. Open Actions > `Deploy Firebase Production`.
2. Run workflow on `main`.
3. Confirm `FIREBASE_SERVICE_ACCOUNT_URAI` is configured.
4. Confirm the new custom-domain linked route smoke step passes.
5. Confirm `Production Evidence` runs after deploy or run it manually.
6. Capture workflow run URL, Firebase release ID, deployed SHA, and evidence artifact.

### Firebase CLI path

```bash
npm run preflight
firebase use production
firebase deploy --only hosting
firebase deploy --only firestore:rules,firestore:indexes,storage
npm run smoke:linked-routes:live
npm run smoke:production
npm run verify:release:full
```

Capture release ID, deployed SHA, route smoke output, screenshots, rollback target, and monitoring evidence.
