# URAI Incident Response

Generated: 2026-06-26

This checklist is for public-demo launch incidents. It prioritizes user safety, privacy containment, clear evidence, and fast rollback over new feature fixes.

## Incident Severity

| Severity | Definition | Immediate Action |
| --- | --- | --- |
| SEV-1 | Private/admin data exposure, wrong Firebase project writes, auth bypass, unsafe passive sensing/communications, or legal/privacy breach. | Freeze deploys, disable affected path if possible, start rollback, notify owner/legal/privacy reviewer. |
| SEV-2 | Homepage, waitlist, privacy, terms, or system route unavailable or serving stale/wrong bundle. | Start incident, run smoke, prepare rollback if not resolved within 15 minutes. |
| SEV-3 | Console/runtime errors that affect CTAs, broken redirects, degraded Firebase Functions, incorrect metadata/social preview. | Triage, patch or rollback if user-facing flow remains broken after 30 minutes. |
| SEV-4 | Cosmetic or copy issue with no safety, privacy, availability, or conversion impact. | Track as follow-up; do not hotfix unless bundled with a safe patch. |

## Rollback-Triggering Failures

Rollback is required or strongly recommended when any of these occur after launch:

- Public homepage returns sustained 5xx, blank page, or wrong bundle for more than 10 minutes.
- `/privacy` or `/terms` is unavailable during launch watch.
- `/waitlist` or the primary CTA routes users to a dead page or wrong environment.
- `/system` claims production readiness without current deploy, smoke, rollback, monitoring, and privacy evidence.
- Any unauthenticated route exposes private, admin, waitlist, Firebase, or user-derived data.
- Any live route starts passive sensing, outbound communication, therapy-adjacent behavior, marketplace behavior, or derived intelligence without privacy gate evidence.
- Firebase Functions show sustained errors affecting public flows.
- DNS/SSL for `urai.app` or `www.urai.app` becomes unhealthy.
- A deploy cannot be tied back to an approved commit/release SHA.

## First 15 Minutes

- [ ] Declare incident owner and timestamp.
- [ ] Capture affected route(s), HTTP status, browser console errors, screenshots if available, and user impact.
- [ ] Freeze unrelated deploys and provider changes.
- [ ] Run safe smoke commands:

```bash
curl -I https://urai.app/
curl -I https://urai.app/system
curl -I https://urai.app/waitlist
curl -I https://urai.app/privacy
curl -I https://urai.app/terms
npm run smoke:production
```

- [ ] Check Firebase Hosting release history for latest deploy timestamp and active version.
- [ ] Check Firebase Functions / Cloud Logging for errors if functions are involved.
- [ ] Decide: fix-forward only if the cause is obvious, low-risk, and can be verified immediately; otherwise rollback.

## Privacy And Safety Containment

If the incident involves private data, admin access, auth, communications, analytics, passive signals, generated assets, or user-derived intelligence:

- [ ] Treat as SEV-1 until proven otherwise.
- [ ] Stop or disable the affected feature path.
- [ ] Do not export or copy private user data into public docs, chat, screenshots, or issue text.
- [ ] Preserve minimal evidence: route, timestamp, request id/log id, error class, and affected system.
- [ ] Notify the privacy/release gate owner before resuming launch activity.
- [ ] Require export/delete/retention/admin-audit impact assessment before closing the incident.

## Firebase Checks

Hosting:

- Firebase Console -> project `urai-4dc1d` -> Hosting -> site `urai-4dc1d` -> Release history.
- Confirm active release, previous release, custom domain health, and SSL status.

Functions / backend:

- Firebase Console -> project `urai-4dc1d` -> Functions -> Logs.
- Google Cloud Console -> project `urai-4dc1d` -> Logging -> Logs Explorer.
- Look for 5xx, permission denied, missing env/config, failed writes, quota errors, and auth/custom-claim errors.

## Communication Template

Use concise internal updates:

```text
Incident: URAI launch watch SEV-[level]
Started: [timestamp + timezone]
Affected route/system: [route or system]
User impact: [known impact]
Current action: [triage | rollback | monitoring]
Evidence: [HTTP status/log id/screenshot path]
Next update: [time]
```

Do not state production readiness in incident updates unless the production lock evidence is complete.

## Recovery Checklist

- [ ] Affected public routes return expected HTTP status.
- [ ] Required markers are present in the body, not just HTTP 200.
- [ ] Browser console has no blocking runtime errors on affected route(s).
- [ ] Firebase Functions logs stop showing the incident error pattern.
- [ ] Privacy/admin exposure is confirmed absent.
- [ ] DNS/SSL is healthy if the incident involved domains.
- [ ] Rollback or fix commit SHA is recorded.
- [ ] Smoke evidence is updated.
- [ ] Follow-up issue/task is created for root cause and prevention.

## Closure Criteria

An incident can close only when the affected route is stable for at least one watch interval after recovery, the evidence is recorded, and any privacy/security impact has an explicit owner decision.
