# URAI V1 Rollback Runbook

This runbook defines what to do when a staging or production release must be rolled back or disabled.

Parent issue: #185

## Principles

- Prefer fast recovery over debugging live production.
- Roll back to the last known good release candidate when core routes are broken.
- Disable risky feature flags before rolling back when the failure is isolated to an optional feature.
- Do not test fixes directly in production.
- Record the incident, owner, time, and recovery action.

## Trigger conditions

Rollback or disablement is required when any of these happen after deploy:

- [ ] `/` does not load.
- [ ] `/u/adamclamp` does not load.
- [ ] `/api/companion` returns persistent 5xx errors.
- [ ] `/api/waitlist` cannot accept valid submissions in the intended environment.
- [ ] Firestore rules expose private passive, memory, or relationship data.
- [ ] Admin/debug route is publicly accessible when it should be guarded.
- [ ] A deploy breaks mobile layout enough to block demo use.
- [ ] Error volume indicates broad runtime failure.
- [ ] A privacy/security concern is discovered.

## First response checklist

- [ ] Stop further deploys.
- [ ] Identify current deployed commit.
- [ ] Identify last known good commit.
- [ ] Capture the failing route/API and error.
- [ ] Check whether the failure is feature-flagged.
- [ ] Check whether rollback is safer than hotfix.
- [ ] Assign one release owner.
- [ ] Record timestamps and action taken.

## Disablement before rollback

Use this first if the issue is isolated to a non-core or feature-flagged surface:

- [ ] Disable experimental spatial/avatar modules.
- [ ] Disable Ancient Signals overlay if it causes runtime failure.
- [ ] Disable trust/telemetry/cooldown experiment if it causes runtime failure.
- [ ] Disable admin/debug public access if it is exposed.
- [ ] Disable optional jobs/asset generation flows if they are causing failures.

If the home route, public constellation route, companion API, or waitlist API is broken, proceed to rollback.

## Firebase Hosting rollback

Use the Firebase Console or Firebase CLI to roll back Hosting to the last known good release.

Preferred console path:

1. Open Firebase Console.
2. Select the correct project.
3. Open Hosting.
4. Select the affected site/channel.
5. Choose the last known good release.
6. Roll back.
7. Run post-rollback smoke checks.

CLI path, if release/channel IDs are known:

```bash
firebase hosting:channel:list
firebase hosting:releases:list
# Use Firebase Console/CLI rollback command appropriate for the configured hosting target.
```

Record:

- Project:
- Site/channel:
- Bad release:
- Restored release:
- Operator:
- Time:

## Firestore rules/indexes rollback

If rules or indexes caused the issue:

- [ ] Revert the rules/index change in git or restore the last known good release artifact.
- [ ] Deploy only rules/indexes if app code is otherwise healthy.

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

After deploy:

- [ ] Confirm public demo reads still work.
- [ ] Confirm private passive data is not publicly readable.
- [ ] Confirm private memory data is not publicly readable.
- [ ] Confirm private relationship data is not publicly readable.
- [ ] Confirm waitlist write behavior is still intended.

## Functions rollback or disablement

If Functions caused the issue:

- [ ] Identify failing function(s).
- [ ] Check logs.
- [ ] Revert to last known good Functions commit or disable the failing function if safe.
- [ ] Deploy Functions only if app/hosting is otherwise healthy.

```bash
firebase deploy --only functions
```

After deploy:

- [ ] Confirm companion API if affected.
- [ ] Confirm scheduled rollups if affected.
- [ ] Confirm callable functions if affected.
- [ ] Confirm no retry storm or runaway cost issue remains.

## Git rollback path

For app-code rollback:

```bash
git checkout main
git pull
git revert <bad-merge-commit-sha>
npm install
npm run check:v1
npm run test:unit
npm run test:rules
npm run check:types
npm run lint
npm run build
npm run test:smoke
```

Then open and merge a rollback PR. If emergency policy allows direct deploy from a reverted commit, record who approved it and why.

## Post-rollback smoke checks

Required after any rollback:

- [ ] `/` loads.
- [ ] `/u/adamclamp` loads.
- [ ] `/api/companion` accepts a valid POST.
- [ ] `/api/waitlist` accepts a valid POST in the intended mode.
- [ ] Mobile home route works.
- [ ] Mobile public constellation route works.
- [ ] No private passive/memory/relationship data is public.
- [ ] Error logs return to normal.

## Incident record template

- Date/time:
- Environment: staging / production
- Release candidate commit:
- Deployed release ID or URL:
- Trigger condition:
- User impact:
- Decision: disable / rollback / hotfix
- Action taken:
- Restored commit/release:
- Owner:
- Verification result:
- Follow-up issue(s):

## Follow-up requirements

After recovery:

- [ ] Open an issue for root-cause analysis.
- [ ] Add or update a test that would have caught the failure.
- [ ] Update the staging promotion checklist if a gate was missing.
- [ ] Update feature flags or deploy protections if rollback was avoidable.
- [ ] Close the incident only after root cause and prevention are documented.
