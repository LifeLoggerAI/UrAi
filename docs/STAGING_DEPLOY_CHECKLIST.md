# Staging Deploy Checklist

Repo: LifeLoggerAI/UrAi
Branch/commit tested: main @ bde5449820ac132cbbad1cd1e5ef5b8bca3af790 plus subsequent staging evidence commits
Date/time tested: 2026-06-25T22:37:56-05:00

| Item | Evidence | Status |
| --- | --- | --- |
| Can build locally | `npm run build` documented | blocked: `npm` unavailable |
| Can run checks locally | `npm run check:system-registry`, `npm run check:v1`, `npm run check:types`, `npm run lint`, `npm test` documented | blocked: `npm` unavailable |
| Staging Firebase project documented | Package has `ship:urai:staging`; prior registry docs name `urai-staging` | partial: local checkout unsafe and Firebase CLI unavailable |
| Deploy command documented | `npm run ship:urai:staging` | pass as documented, not executed |
| Required env vars documented without secrets | README lists Firebase public and Admin variables; no secrets added in this pass | pass |
| Safe smoke route/page documented | `/`, `/system`, `system/genesis-spine-smoke-targets.json` | partial: `/system` marker not live at checked URL |
| Safe to deploy to staging | Not from this environment | blocked |

Command run:

```txt
node -v
npm -v
pnpm -v
corepack --version
where.exe firebase
```

Actual result: Node, npm, pnpm, corepack, and Firebase CLI were unavailable on PATH.

Next action: repair local checkout on a filesystem that supports the repo's tracked paths, restore Node 20/npm, run checks, then deploy only to staging.
