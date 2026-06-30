# Release Checklist

Generated: 2026-06-30T01:30:00-05:00
Repo: LifeLoggerAI/UrAi
Starting SHA: 409dda09c0381510ee95923a5851eade5e6733ea
Ending SHA: captured in final response

## Source checks

- [ ] `npm ci`
- [ ] `npm run check:v1`
- [ ] `npm run check:system-registry`
- [ ] `npm run check:production-lock`
- [ ] `npm run check:firestore-contract`
- [ ] `npm run check:public-copy`
- [ ] `npm run check:production-claims`
- [ ] `npm run validate:completion`
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run test:unit`
- [ ] `npm run test:rules`
- [ ] `npm run build`
- [ ] `npm run smoke:linked-routes`

## Deploy checks

- [ ] Firebase project selected: `urai-4dc1d`
- [ ] Firebase site selected: `urai-4dc1d`
- [ ] Hosting deploy completed
- [ ] Firestore rules/indexes deployed
- [ ] Storage rules deployed if used
- [ ] Firebase release ID captured
- [ ] Deployed commit SHA captured

## Live checks

- [ ] `/`
- [ ] `/home`
- [ ] `/system`
- [ ] `/status`
- [ ] `/life-map`
- [ ] `/ground`
- [ ] `/xr`
- [ ] `/privacy-controls`
- [ ] `/privacy`
- [ ] `/terms`
- [ ] `/dashboard`
- [ ] `/login`
- [ ] `/signup`
- [ ] `/api/waitlist` safe test
- [ ] `/api/companion` deterministic test
- [ ] `/api/companion/respond` fallback/provider-safe test
- [ ] `/api/admin/status` unauthorized denial test

## Launch gates

- [ ] Privacy gate passed or private features remain gated
- [ ] Provider AI proof captured or AI copy remains provider-capable only
- [ ] Rollback target captured
- [ ] Rollback drill run
- [ ] Monitoring configured
- [ ] Alerts configured
- [ ] Incident contact documented
- [ ] Final launch report updated

## Current checklist status

Not ready. All unchecked items require external terminal/deploy/provider/monitoring/privacy proof.
