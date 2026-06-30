# Deployment And Live Proof

Generated: 2026-06-30T01:30:00-05:00
Repo: LifeLoggerAI/UrAi
Starting SHA: 409dda09c0381510ee95923a5851eade5e6733ea
Ending SHA: captured in final response

## Live domain checks

| Target | Result | Evidence level |
| --- | --- | --- |
| `https://urai.app/` | Redirected to `/home`; public demo content visible | Web fetch |
| `https://urai.app/home` | Home threshold content visible | Web fetch |
| `https://urai.app/ground` | Ground World content and launch safety visible | Web fetch |
| `https://urai.app/status` | Static preview service status visible | Web fetch |
| `https://urai.app/system` | Web fetch cache miss / not proven | BLOCKED |
| `https://urai.app/xr` | Web fetch cache miss / not proven | BLOCKED |
| `https://urai.app/privacy` | Web fetch cache miss / not proven | BLOCKED |
| `https://urai.app/terms` | Web fetch cache miss / not proven | BLOCKED |
| `https://urai.app/dashboard` | Web fetch cache miss / not proven | BLOCKED |
| `https://urai.app/login` | Web fetch cache miss / not proven | BLOCKED |
| `https://urai.app/signup` | Web fetch cache miss / not proven | BLOCKED |

## Firebase deployment proof

Firebase project: source config points to `urai-4dc1d`.
Firebase site: source config points to `urai-4dc1d`.
Release ID: not captured.
Deployed SHA: not captured.
Rollback release: not captured.

## Current verdict

PARTIAL live proof: `/ground` parity improved and root/home/status respond, but deployment is not production-proven because deployed SHA, release ID, `/system` truth markers, rollback, and monitoring proof are missing.

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
