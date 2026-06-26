# Staging Rollback Plan

Repo: LifeLoggerAI/UrAi
Branch/commit tested: main @ bde5449820ac132cbbad1cd1e5ef5b8bca3af790 plus subsequent staging evidence commits
Date/time tested: 2026-06-25T22:37:56-05:00

Rollback trigger:

- `/` fails after staging deploy.
- `/system` does not render the canonical registry-backed status surface.
- `npm run check:system-registry` or `npm run smoke:genesis-spine` fails after deploy.
- Any passive sensing, outbound communications, therapy-adjacent, marketplace, or provider behavior appears live without privacy gates.

Rollback command:

```bash
firebase hosting:clone <urai-staging-site>:live <urai-staging-site>:live --project urai-staging
```

If hosting clone is unavailable, redeploy the last known good commit after checks pass:

```bash
git checkout <last-known-good-sha>
npm run check:system-registry
npm run check:v1
npm run build
npm run ship:urai:staging
```

Expected result: staging returns to the last known safe Genesis demo behavior.

Actual result in this pass: rollback was not executed. No staging deploy was performed.

Blockers:

- Windows checkout fails on invalid tracked `:USERPROFILE` paths.
- Node/npm and Firebase CLI unavailable.
- Latest `/system` route is not proven staging-visible.

Next action: record last known good staging deploy SHA after the first successful `/system` smoke.
