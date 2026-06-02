# URAI Release Rollback Plan - PR #304

Date: 2026-05-22
Release scope: PR #304 route/contract lock plus post-merge deploy-proof hardening

## Current release commits

- PR #304 merge commit: `1f0da470088bb67319146cf515b957cc1c5dfd8f`
- `/ochat` accessibility polish: `b9a4217fdf91bf2c4ef4a756c847eb9656b94a79`
- Deploy HTTP route expansion: `bb9849962f4fde08399ee893f0300c7da6ac1517`
- `/ochat` production smoke: `14a669d569251d601165116c10fa3380fc7336c8`
- Deployment evidence doc update: `0367a84df5bc323766d7440e00705b0890a1aab4`
- Expanded production smoke release proof: `531b284f3f29ef14fd7f50282852455d3b650625`

## Rollback target

Approved rollback candidate before PR #304:

```text
115c0548167818967dc955fc616d0302f93a2452
```

Use this rollback target only if production deployment of the PR #304 release creates a critical issue that cannot be hotfixed safely.

## Rollback method A - GitHub revert commits

Preferred when preserving history and auditability.

```bash
git checkout main
git pull origin main

git revert --no-edit 531b284f3f29ef14fd7f50282852455d3b650625
git revert --no-edit 0367a84df5bc323766d7440e00705b0890a1aab4
git revert --no-edit 14a669d569251d601165116c10fa3380fc7336c8
git revert --no-edit bb9849962f4fde08399ee893f0300c7da6ac1517
git revert --no-edit b9a4217fdf91bf2c4ef4a756c847eb9656b94a79
git revert --no-edit 1f0da470088bb67319146cf515b957cc1c5dfd8f

git push origin main
```

Then watch the `main` deploy workflows and verify:

```bash
npm run test:smoke:production
```

## Rollback method B - emergency reset

Use only for a severe production incident and only after release-owner approval.

```bash
git checkout main
git fetch origin

git reset --hard 115c0548167818967dc955fc616d0302f93a2452
git push --force-with-lease origin main
```

After reset, verify the production deploy workflow and live routes.

## Verification after rollback

Record evidence in issue #300:

- Rollback commit or reset SHA
- Deploy workflow run URL
- Deployed URL
- `/` browser proof
- `/home` redirect proof
- `/api/status` proof
- Public route proof if still present
- Mobile/reduced-motion proof if affected

## Release-owner approval

Release owner should explicitly approve one of:

- Continue release
- Hotfix forward
- Revert commits
- Emergency reset

Until approval is recorded, rollback remains a documented candidate, not an executed release action.
