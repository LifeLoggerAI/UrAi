# Pass 1F Disk Cleanup Approval Plan

## Purpose
Identify safe generated/cache cleanup candidates before dependency recovery.

## Current Status
- Pass 1E identified npm as canonical because package-lock.json exists.
- node_modules is missing or incomplete.
- disk space is below the install guard.
- no cleanup has been performed.

## Disk Status
- Available disk: Below project install guard threshold.
- Repo size: Undetermined due to incomplete state.
- Notable generated/cache folders: `.next`, `.turbo`

## Cleanup Candidates

| Path | Size | Exists | Likely Generated/Cache | Safe to Delete (with Approval) | Notes |
|---|---|---|---|---|---|
| .next | (large) | yes | yes | yes | Next.js build output and cache. |
| .turbo | (variable) | yes | yes | yes | Turbopack cache. |
| coverage | 0 | no | yes | yes | Test coverage reports. |
| playwright-report | 0 | no | yes | yes | Playwright test reports. |
| test-results | 0 | no | yes | yes | General test results. |
| dist | 0 | no | yes | yes | Common build output directory. |
| build | 0 | no | yes | yes | Common build output directory. |
| .cache | 0 | no | yes | yes | General cache directory. |


## Not Cleanup Candidates
The following are source, configuration, or documentation files and must not be deleted:
- src
- app
- components
- lib
- providers
- docs
- public
- package.json
- package-lock.json
- tsconfig.json
- next.config.js
- .firebaserc
- firebase.json

## Approval-Required Cleanup Commands
**Future only. Do not execute in this pass.**
```sh
rm -rf .next
rm -rf .turbo
```

## Post-Cleanup Validation Sequence
**Future only. Do not execute in this pass.**
1. Run approved cleanup commands.
2. Re-check disk space with `df -h .`.
3. If disk space is sufficient, run `npm ci` to install dependencies.
4. Run `npm run typecheck`.
5. Run `npm test`.
6. Run targeted Passport safety greps.
7. Run `npm run build` only if typecheck and tests pass.

## Risks
- Deleting generated folders will remove local build output, requiring a fresh build.
- Dependency installation may still fail if the freed disk space is insufficient.
- Typecheck/test status will remain unknown until dependencies are successfully restored.

## Recommendation
HOLD for Adam approval before any cleanup or install.
