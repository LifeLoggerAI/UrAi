# URAI Post-Launch Watch

Generated: 2026-06-26

This runbook covers the first 24-72 hours after a public URAI launch. It does not approve deployment and does not claim production readiness. It defines what to watch, where to check it, and when to trigger incident response or rollback.

## Current Evidence Baseline

- Canonical repo: `LifeLoggerAI/UrAi`
- Canonical public/demo app: `https://urai.app`
- Firebase project: `urai-4dc1d`
- Firebase Hosting site: `urai-4dc1d`
- Staging project: `urai-staging`
- Existing strict production lock: `docs/PRODUCTION_LOCK.md`
- Existing live smoke evidence: `docs/LIVE_SMOKE_EVIDENCE.md`
- Existing rollback evidence: `docs/ROLLBACK_EVIDENCE.md`

Current status remains demo-only until build/check output, deploy evidence, smoke evidence, rollback evidence, monitoring evidence, and privacy-gate evidence are recorded.

## Watch Cadence

Use this cadence for the first launch day:

| Window | Cadence | Owner Action |
| --- | --- | --- |
| T+0 to T+2h | Every 15 minutes | Run smoke checks, inspect Firebase/Cloud logs, check CTAs and legal routes. |
| T+2h to T+8h | Every 30 minutes | Re-run smoke, check error/log trends, inspect lead/waitlist flow if enabled. |
| T+8h to T+24h | Every 60 minutes | Confirm availability, DNS/SSL, redirects, console errors, and admin exposure. |
| T+24h to T+72h | Every 4 hours, then daily | Continue availability and error trend checks until stable. |

## Routes To Watch

| Route | Required Check | Rollback Trigger |
| --- | --- | --- |
| `/` | HTTP 200, URAI marker, no stale prototype title, primary CTAs visible. | 5xx, blank page, stale/non-URAI bundle, unsafe production claim, or broken primary CTA. |
| `/system` | HTTP 200 and `URAI release truth` marker after the new deploy. Must remain noindex. | 5xx, private data exposure, production claim without evidence, or marker missing after deploy. |
| `/waitlist` | HTTP 200 and CTA/form renders. If submit is enabled, test a safe non-private test lead. | Broken public CTA, form exceptions, writes to wrong project, or exposed private/admin data. |
| `/privacy` | HTTP 200, URAI privacy metadata, clear consent/export/delete boundaries. | Missing route, outdated unsafe privacy language, or privacy gate claims that are not proven. |
| `/terms` | HTTP 200, early-access scope, no medical/emergency/production overclaim. | Missing route, legal placeholder hidden, or unsafe clinical/production wording. |
| `/login` and `/signup` | Public route availability only; do not test real private accounts in smoke. | Auth route exposes admin/private data or signs users into wrong environment. |
| `/admin`, `/dashboard`, `/app`, private routes | Must not expose private/admin data to unauthenticated users. | Any unauthenticated private/admin exposure. |

## Lightweight Smoke Commands

Safe public smoke from a workstation:

```bash
curl -I https://urai.app/
curl -I https://urai.app/system
curl -I https://urai.app/waitlist
curl -I https://urai.app/privacy
curl -I https://urai.app/terms
npm run smoke:production
npm run check:system-registry
npm run check:production-lock
```

If Node/npm is unavailable, record the environment blocker and run the `curl` checks plus Firebase Console checks manually.

## Firebase And Log Checks

Firebase Hosting release and rollback path:

- Firebase Console -> project `urai-4dc1d` -> Hosting -> site `urai-4dc1d` -> Release history.
- Confirm the latest release timestamp, deployer, version, and active domains.
- Confirm custom domains `urai.app` and `www.urai.app` show healthy DNS/SSL.

Firebase Functions logs path, if functions are deployed:

- Firebase Console -> project `urai-4dc1d` -> Functions -> Logs.
- Google Cloud Console -> project `urai-4dc1d` -> Logging -> Logs Explorer.
- Filter for severity `ERROR`, `CRITICAL`, `ALERT`, and HTTP 5xx.

Firebase Hosting does not replace application monitoring. Until an alerting provider is wired, the launch watch must use manual smoke checks, browser console checks, Firebase release history, Cloud Logging for Functions, and explicit evidence capture.

## 24-Hour Checklist

- [ ] Confirm `https://urai.app/` returns HTTP 200.
- [ ] Confirm `https://urai.app/system` returns HTTP 200 and, after deploy, contains the `URAI release truth` marker.
- [ ] Confirm `/system` remains noindex and is not being used as marketing copy.
- [ ] Confirm `/waitlist` and primary homepage CTAs route to real pages.
- [ ] Confirm `/privacy` and `/terms` return HTTP 200 and contain launch-safe language.
- [ ] Confirm no browser console runtime errors on `/`, `/waitlist`, `/privacy`, `/terms`, and `/system`.
- [ ] Confirm Firebase Hosting custom domains show healthy DNS/SSL.
- [ ] Confirm no unexpected redirects from `urai.app`, `www.urai.app`, or Firebase web.app host.
- [ ] Confirm unauthenticated users cannot access admin/private data routes.
- [ ] Confirm Firebase Functions logs have no sustained 5xx/error spikes if functions are active.
- [ ] Confirm no outbound communications, passive sensing, analytics, therapy, marketplace, or user-derived intelligence behavior is live without privacy gate evidence.
- [ ] Capture timestamped evidence in `docs/LIVE_SMOKE_EVIDENCE.md` or a release evidence issue before any production-ready claim.

## Monitoring Gaps

- No dedicated external uptime monitor is recorded.
- No alert routing policy is recorded.
- No Sentry or equivalent client/runtime error reporting config was found in the inspected evidence.
- No Firebase Functions log-based alert policy is recorded.
- No rollback drill evidence exists yet.
- Local checks could not be run in this Codex environment when Node/npm were unavailable.

## Launch Watch Recommendation

Do not promote beyond public-demo language until a Node 20 environment runs the release checks, a fresh deploy log is captured, smoke evidence proves the currently deployed bundle, and rollback plus monitoring evidence are recorded.
