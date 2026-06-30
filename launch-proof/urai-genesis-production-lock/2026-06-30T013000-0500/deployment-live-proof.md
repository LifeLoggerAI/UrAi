# Deployment And Live Proof

Generated: 2026-06-30T01:30:00-05:00
Updated: 2026-06-30 after status-copy source fix
Repo: LifeLoggerAI/UrAi
Starting SHA: 409dda09c0381510ee95923a5851eade5e6733ea
Latest source SHA observed in this pass: 58bbbadbd873bfd23c61de04bd58a59c2a6c6825

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

Live `https://urai.app/status` still returned the old copy:

- `Platform health`
- `This dashboard reflects the current heartbeat...`
- `How we track uptime`
- Firebase and narrator service monitoring language

This proves the live site is stale relative to the latest source. The repo cannot be marked production-ready until the current source commit is deployed and live route smoke confirms the new preview-health copy.

## Firebase deployment proof

Firebase project: source config points to `urai-4dc1d`.
Firebase site: source config points to `urai-4dc1d`.
Release ID: not captured.
Deployed SHA: not captured.
Rollback release: not captured.

## Current verdict

PARTIAL live proof: `/ground` parity improved and root/home/status respond, but deployment is not production-proven because `/status` is stale, deployed SHA is missing, release ID is missing, `/system` truth markers are unproven, rollback proof is missing, and monitoring proof is missing.

## Required external actions

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
