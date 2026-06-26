# URAI Rollback Drill

Generated: 2026-06-26

This drill documents how URAI should roll back during the first 24-72 hours after public launch. Do not run a rollback or deploy from this document unless explicitly approved by the launch owner.

## Rollback Readiness Status

Current readiness: **not complete**.

Known gaps:

- No completed rollback drill evidence is recorded in `docs/ROLLBACK_EVIDENCE.md`.
- No last-known-good release ID is recorded in repo docs.
- No deploy log/release SHA for the current public bundle is recorded in repo docs.
- No external monitoring or alert policy evidence is recorded.
- Local Node/npm checks were unavailable in this Codex workspace.

Until these gaps are closed, URAI must remain public-demo/demo-only in launch language.

## Rollback Targets

| Surface | Project / Host | Rollback Target |
| --- | --- | --- |
| Canonical public/demo app | Firebase project `urai-4dc1d`, Hosting site `urai-4dc1d` | Previous healthy Firebase Hosting release or redeploy of last-known-good Git SHA. |
| Staging proving ground | Firebase project `urai-staging` | Previous staging release; never treat as production truth. |
| Privacy gate | `uraiprivacy.com` | Follow that repo/host's release history; do not assume Firebase until evidence proves it. |

## Primary Rollback Path: Firebase Console

Use this when the current public Hosting release is bad and a previous healthy release exists.

1. Open Firebase Console.
2. Select project `urai-4dc1d`.
3. Go to Hosting.
4. Select site `urai-4dc1d`.
5. Open Release history.
6. Identify the last known good release by timestamp, release ID, deployer, and verified smoke evidence.
7. Use the console rollback action for that previous release.
8. Wait for Hosting propagation.
9. Run post-rollback smoke checks.
10. Record the rollback release ID, timestamp, operator, reason, and smoke results in `docs/ROLLBACK_EVIDENCE.md` or the release evidence issue.

This path avoids introducing secrets into the repo and does not require committing emergency code.

## Fallback Rollback Path: Redeploy Last-Known-Good SHA

Use this only if the console rollback path is unavailable or the team intentionally rolls back through source control.

Prerequisites:

- Last-known-good Git SHA is recorded.
- Node 20/npm environment is available.
- Firebase CLI is authenticated outside the repo.
- No secrets are committed or printed.

Commands:

```bash
git fetch origin
git checkout <LAST_KNOWN_GOOD_SHA>
npm ci
npm run check:system-registry
npm run check:production-lock
npm run build
firebase deploy --project urai-4dc1d --only hosting
```

After deploy, return the worktree to the intended branch before continuing normal development.

## Post-Rollback Smoke Checks

Run all applicable checks after rollback:

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

Manual checks:

- [ ] Homepage loads and contains current URAI demo copy.
- [ ] `/system` does not expose private data or unsupported production claims.
- [ ] `/privacy` and `/terms` load.
- [ ] Waitlist/signup CTA routes somewhere real and safe.
- [ ] Browser console has no blocking runtime errors.
- [ ] Firebase Functions logs show no sustained incident errors.
- [ ] DNS/SSL for `urai.app` and `www.urai.app` are healthy.
- [ ] Private/admin routes are not exposed to unauthenticated users.

## Dry-Run Drill Checklist

Complete this before calling the launch production-ready:

- [ ] Identify the current Firebase Hosting release ID.
- [ ] Identify the previous known-good release ID.
- [ ] Confirm who can perform Firebase Console rollback.
- [ ] Confirm rollback operator has access without sharing secrets.
- [ ] Confirm `npm run smoke:production` can run in a Node 20 environment.
- [ ] Confirm `npm run check:system-registry` can run.
- [ ] Confirm `npm run check:production-lock` can run.
- [ ] Confirm `npm run build` can run.
- [ ] Confirm post-rollback smoke evidence destination.
- [ ] Run a staging rollback or simulated staging redeploy first when possible.

## Evidence Template

```text
Rollback drill date:
Operator:
Environment: staging | production | dry-run only
Reason:
Current release ID:
Rollback target release ID or Git SHA:
Rollback path: Firebase Console | redeploy known-good SHA
Commands run:
Smoke results:
Firebase log review:
DNS/SSL status:
Private/admin exposure check:
Outcome:
Follow-up actions:
```

## Do Not Do During Rollback

- Do not deploy new feature code while rolling back.
- Do not add secrets or provider tokens to the repo.
- Do not enable passive sensing, communications, analytics, therapy-adjacent behavior, generated user artifacts, or derived intelligence as part of rollback.
- Do not mark production-ready only because rollback succeeded; production lock evidence must still be complete.
