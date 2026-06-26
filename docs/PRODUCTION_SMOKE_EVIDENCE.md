# URAI Production Smoke Evidence

Generated: 2026-06-25

Smoke evidence is URL reachability evidence only. It does not prove production readiness without deploy, rollback, monitoring, Firebase target, and privacy gate evidence.

## Safe Smoke Targets

Configured in `system/production-smoke-targets.json` and executed by:

```bash
npm run smoke:production
```

This command was added in this pass, but could not be executed here because `node` and `npm` were not available on PATH.

## Manual URL Evidence Captured

| URL | Result | Meaning | Launch claim |
| --- | --- | --- | --- |
| https://urai.app/ | HTTP 200 | Canonical custom domain responds | Demo reachability only |
| https://www.urai.app/ | HTTP 200 | Canonical www domain responds | Demo reachability only |
| https://urai-4dc1d.web.app/ | HTTP 200 | Canonical Firebase host responds | Demo reachability only |
| https://urai-staging.web.app/ | HTTP 200 | Staging root responds | Staging-only |
| https://uraiprivacy.com/ | HTTP 200 | Privacy custom domain responds; DNS resolved to Squarespace | Not privacy gate pass |
| https://www.uraiprivacy.com/ | HTTP 200 | Privacy www domain responds; DNS resolved to Squarespace | Not privacy gate pass |
| https://urai-jobs.web.app/ | HTTP 200 | Jobs Firebase host responds | Not production-ready without strict evidence |
| https://urai-admin.web.app/ | HTTP 503 | Admin Firebase host is unavailable | Launch blocker |
| https://uraiassetfactory.com/ | HTTP 200 | Asset Factory apex responds | Deferred only |
| https://www.uraiassetfactory.com/ | HTTPS failed; HTTP 404 | Asset Factory www is not ready | Domain blocker |
| https://uraifoundation.org/ | HTTP 200 | Foundation external surface responds | External/governance surface only |
| https://www.uraifoundation.org/ | HTTP 200 | Foundation www responds | External/governance surface only |

## Required Before Production Smoke Counts

- Run `npm run smoke:production` from a clean Node 20 environment.
- Save command output, timestamp, branch, commit SHA, and operator.
- Attach failed optional target warnings without treating them as launch pass.
- Re-run after production deployment and after rollback drill.
