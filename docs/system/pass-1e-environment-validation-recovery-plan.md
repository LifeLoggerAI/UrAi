# Pass 1E Environment + Validation Recovery Plan

## Purpose
Define how URAI can safely restore validation without blindly installing dependencies or bypassing disk guards.

## Current Status
- Passport foundation is source-audited.
- Passport UI is source-audited.
- Pass 1D compile-readiness audit exists.
- Full compile/test validation is still blocked.

## Package Manager Status
- Lockfiles found: `package-lock.json` (inferred)
- Canonical package manager inferred: npm
- node_modules status: Does not exist or is incomplete.
- install safety: Unsafe, due to low disk space and lack of a complete `node_modules` directory.

## Disk Status
- Available disk: Below project install guard threshold.
- Notable local directories: `.next`, and potentially other build/cache directories.
- Cleanup performed: none

## Validation Blocker
- Typecheck not run: `node_modules` is not available.
- Tests not run: `node_modules` is not available.
- Reason: Dependencies are not installed, and cannot be safely installed due to low disk space.

## Safe Recovery Options
- Option A: Increase available disk space in the current workspace to meet the project's install guard requirements.
- Option B: If a pre-existing, correctly populated `node_modules` directory is available from a trusted environment, it could be restored.
- Option C: Perform a fresh `npm ci` or `npm install` only after confirming that there is sufficient disk space.
- Option D: Configure and run validation in a CI/CD environment that has sufficient resources.
- Option E: After approval from Adam, archive and remove heavy, generated folders like `.next` to free up space.

## Recommended Future Validation Sequence
1. Confirm that available disk space is above the project's install guard threshold.
2. Confirm that `npm` is the correct package manager.
3. Run `npm ci` to install dependencies from the lockfile.
4. Run `npm run typecheck` to validate TypeScript.
5. Run `npm test` to run the test suite.

## Safety Rules
- Do not bypass disk-space guards.
- Do not delete generated folders without Adam approval.
- Do not install dependencies until package manager and disk status are confirmed.
- Do not proceed to broad feature implementation until Passport compiles.

## Remaining Risks
- Source audit cannot guarantee TypeScript correctness.
- Runtime behavior is not proven.
- Visual QA is not proven.
- Test suite status is unknown.

## Recommendation
HOLD for Adam review before environment recovery or any next implementation pass.
