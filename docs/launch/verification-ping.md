# URAI Launch Validation Ping

This file exists to trigger the URAI Launch Verify GitHub Actions workflow after PR #367 was merged.

Expected workflow: `.github/workflows/urai-launch-verify.yml`

Expected checks:

- `npm run check:types`
- `npm run lint`
- `npm run test:rules`
- `npm run build`

If the workflow does not appear on the pull request, repository Actions or GitHub App workflow permissions may need to be enabled.
