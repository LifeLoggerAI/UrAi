# URAI Production Smoke Evidence

Generated: 2026-06-25
Updated: 2026-06-25T23:54:00-05:00

Smoke evidence is URL reachability evidence only. It does not prove production readiness without deploy, rollback, monitoring, Firebase target, and privacy gate evidence.

## Latest Production Decision

Production smoke is still BLOCKED for launch approval.

No production deploy was attempted in the latest blocker pass because staging deploy did not complete and staging `/system` was not proven.

## Latest Local Evidence

| Check | Result |
| --- | --- |
| Node/npm | Portable Node `v20.19.4`, npm `10.8.2` |
| `npm ci` | Passed |
| `npm run check:system-registry` | Passed |
| `npm run check:production-lock` | Passed internal consistency; `eligibleForLaunch=false` remains correct |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed after `src/app/launch/page.tsx` apostrophe escape fix; warnings remain |
| `npm test` | Passed, 50 suites and 319 tests |
| `npm run build` | Failed before Next build because POSIX `rm`/`mkdir -p` are unavailable on Windows |
| Direct Next build | Passed with `node ./node_modules/next/dist/bin/next build` |
| Built `/system` | Contains registry truth markers locally |

## Latest Live Route Smoke

Date: 2026-06-25T23:54:00-05:00

| URL | HTTP status | Result | Launch claim |
| --- | --- | --- | --- |
| `https://urai.app/` | 200 | Existing live root responds | Reachability only |
| `https://urai.app/system` | 200 | Responds, but serves stale Spatial root/home bundle instead of registry truth | Launch blocker |
| `https://urai.app/privacy` | 200 | Existing live route responds | Reachability only |
| `https://urai.app/terms` | 200 | Existing live route responds | Reachability only |
| `https://urai.app/waitlist` | 200 | Existing live route responds with same root bundle length as `/` | Reachability only; content needs post-deploy proof |

## Staging Gate Before Production

| URL | HTTP status | Result |
| --- | --- | --- |
| `https://urai-staging.web.app/` | 200 | Existing staging root responds |
| `https://urai-staging.web.app/system` | 404 | Blocking: registry-backed `/system` is not live in staging |
| `https://urai-staging.web.app/life-map` | 200 | Existing route responds |
| `https://urai-staging.web.app/privacy` | 200 | Existing route responds |
| `https://urai-staging.web.app/terms` | 200 | Existing route responds |
| `https://urai-staging.web.app/waitlist` | 200 | Existing route responds |
| `https://urai-staging.web.app/signup` | 404 | Blocking for requested public-demo route set |
| `https://urai-staging.web.app/login` | 404 | Blocking for requested public-demo route set |
| `https://urai-staging.web.app/dashboard` | 404 | Blocking for requested public-demo route set |

## Deploy Blocker

Attempted staging deploy command:

```bash
npm exec firebase-tools -- deploy --project urai-staging --only hosting --config firebase.staging.json
```

Result:

```text
Error: Failed to authenticate, have you run firebase login?
```

No secrets were added. No production deploy was attempted.

## Required Before Production Smoke Counts

- Authenticate Firebase CLI with an operator account authorized for `urai-staging`.
- Deploy commit `f6931174fd4bf81f8a57a624fa080b542938c179` to staging first.
- Verify staging `/system` shows registry and production-lock truth.
- Capture desktop/tablet/mobile visual evidence or equivalent browser DOM evidence.
- Only after staging passes, deploy public-demo target and re-run production smoke.
- Do not call the system production-ready until production lock, rollback, monitoring, DNS/SSL, privacy gate, and smoke evidence all pass.
