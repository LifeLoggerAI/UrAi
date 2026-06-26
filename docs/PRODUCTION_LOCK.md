# URAI Production Lock

Generated: 2026-06-25

This file is the strict production truth gate for the URAI Genesis spine. It does not grant production readiness. It records what evidence exists and what remains blocked.

## Rule

A repo may be marked `production` only when all applicable evidence exists:

- production URL
- Firebase project or equivalent hosting target
- DNS verification for custom domains
- SSL/TLS verification for custom domains
- deploy evidence with release SHA or deploy log
- smoke evidence from safe public URLs
- rollback evidence with rollback target or drill result
- monitoring/alert evidence
- privacy gate evidence for user data, admin access, analytics, communications, generated assets, story/spatial memory, passive signals, or user-derived intelligence

## Current Conclusion

No repo is launch-eligible under the strict production lock as of 2026-06-25.

| Repo | Launch mode | Eligible | Production URL | Primary blocker |
| --- | --- | --- | --- | --- |
| LifeLoggerAI/UrAi | demo-only | No | https://urai.app | Missing local build/check output, deploy log, rollback, monitoring, privacy gate proof |
| LifeLoggerAI/urai-staging | staging-only | No | None | Staging only; API smoke evidence incomplete |
| LifeLoggerAI/urai-privacy | blocked | No | https://uraiprivacy.com | Consent/export/delete/admin audit/legal evidence not proven passed |
| LifeLoggerAI/urai-admin | blocked | No | https://urai-admin.web.app | Live URL returned HTTP 503; admin bootstrap/access proof missing |
| LifeLoggerAI/urai-jobs | staging-only | No | https://urai-jobs.web.app | Live root smoke exists, but rollback/monitoring/privacy/deploy-target proof missing |
| LifeLoggerAI/urai-content | demo-only | No | None | Standalone runtime deploy, DNS/SSL, provider, monitoring, rollback evidence missing |
| LifeLoggerAI/UrAi-Dev | sandbox-only | No | None | Sandbox only by canonical rule |
| LifeLoggerAI/UrAiProd | legacy-archive | No | None | Legacy/archive only by canonical rule |

## Guardrail Commands

```bash
npm run check:production-lock
npm run smoke:production
npm run check:system-registry
```

In this Codex environment, `node` and `npm` were not available on PATH, so these commands still need a Node 20 environment to execute.

## What Must Not Be Claimed

- Do not claim `UrAi` production-ready until local checks, deploy evidence, smoke evidence, rollback, monitoring, and privacy gate proof exist.
- Do not claim `urai-jobs` production-ready based only on a 200 response from `https://urai-jobs.web.app`.
- Do not claim `urai-admin` launch-ready while the Firebase URL returns HTTP 503 and admin access proof is missing.
- Do not claim `urai-content` standalone live until a production host, DNS/SSL, provider evidence, smoke, monitoring, and rollback evidence exist.
- Do not enable passive sensing, therapy-adjacent behavior, data marketplace, outbound communications, spatial memory, or user-derived intelligence without privacy gate evidence.
