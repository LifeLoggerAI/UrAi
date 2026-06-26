# Live Smoke Evidence

Updated: 2026-06-25

This file records public URL smoke checks captured during the Genesis spine staging proof pass. These checks do not claim production readiness.

| Repo | URL | Result | Evidence state | Notes |
| --- | --- | --- | --- | --- |
| `LifeLoggerAI/UrAi` | `https://urai-4dc1d.web.app/` | HTTP 200, body length 11338 | public root reachable | Existing deploy only; latest `/system` route is not proven live |
| `LifeLoggerAI/UrAi` | `https://urai-4dc1d.web.app/system` | HTTP 200, body length 11338, marker missing | failed route proof | Response did not contain `URAI release truth` marker |
| `LifeLoggerAI/urai-staging` | `https://urai-staging.web.app/` | HTTP 200, body length 46477, URAI marker present | staging root reachable | Static registry and health endpoint still failed |
| `LifeLoggerAI/urai-staging` | `https://urai-staging.web.app/system-registry.json` | HTTP 404 | evidence gap | New registry is not live at checked path |
| `LifeLoggerAI/urai-staging` | `https://urai-staging.web.app/api/healthz` | HTTP 404 | evidence gap | Checked health endpoint is not live |
| `LifeLoggerAI/urai-privacy` | `https://uraiprivacy.com/` | HTTP 200, privacy/consent marker present | public privacy reachable | Staging project proof is still missing |
| `LifeLoggerAI/urai-admin` | `https://urai-admin.web.app/` | HTTP 503 | blocked | Admin surface is not smoke-passing |
| `LifeLoggerAI/urai-jobs` | `https://urai-jobs.web.app/` | HTTP 200, `URAI-JOBS` marker present | public jobs reachable | Staging alias proof is still incomplete |
| `LifeLoggerAI/urai-content` | none documented | not checked | evidence gap | Standalone deploy is intentionally blocked |

Environment blockers:

- `node`, `npm`, `pnpm`, `corepack`, and `firebase` were unavailable on PATH.
- Windows checkout of `LifeLoggerAI/UrAi` failed on invalid tracked `:USERPROFILE` paths.

Next action: restore a valid runtime and filesystem, deploy the latest `/system` route only to staging, then rerun `npm run smoke:genesis-spine`.
