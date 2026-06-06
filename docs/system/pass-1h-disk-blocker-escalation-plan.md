# Pass 1H Disk Blocker Escalation + External Validation Plan

## Purpose
Document the remaining disk blocker after approved cache cleanup and define a safe validation path outside this constrained workspace.

## Current Status
- Pass 1G removed approved generated/cache folders.
- Available disk after cleanup: 0
- Dependency recovery remains unsafe: unsafe while disk is full.
- Typecheck/test status: Unknown, blocked by disk and dependency issues.

## Remaining Generated/Cache Folders
- .next (unexpectedly still present)

## Not Cleanup Candidates
- src
- app
- components
- lib
- providers
- docs
- public
- package.json
- package-lock.json
- config files
- Firebase config
- source-controlled app logic

## Disk Blocker
Even after the approved cleanup of `.next` and `.turbo` in Pass 1G, the available disk space remains at 0. The `.next` directory was not successfully removed, likely due to the disk being full. This presents a hard blocker for any operations that require disk space, including dependency installation.

## Safe Options
- Option A: Move the repository to a larger workspace.
- Option B: Increase the Firebase IDE workspace storage/quota.
- Option C: Push the current branch/changes and run validation in a CI environment.
- Option D: Clone the repository fresh into a larger local or cloud environment and run `npm ci` there.
- Option E: Export a patch/diff for the Passport work and validate it in a clean environment.
- Option F: Continue with documentation and planning passes only, until the disk issue is resolved.

## Recommended External Validation Sequence
1. Preserve current changes.
2. Ensure the Git branch is cleanly committed or a patch is exported.
3. Move to a workspace with sufficient disk space.
4. Confirm `npm` is the canonical package manager via `package-lock.json`.
5. Run `npm ci`.
6. Run `npm run typecheck`.
7. Run `npm test`.
8. Run Passport safety greps.
9. Run `npm run build` only after typecheck/tests are acceptable.
10. Return validation logs to the evidence ledger.

## Evidence Needed Later
- dependency install result
- typecheck result
- test result
- build result
- Passport safety grep result
- /passport screenshot
- /genesis screenshot

## Safety Rules
- Do not bypass disk-space guards.
- Do not delete source-controlled app logic.
- Do not install dependencies while available disk is 0.
- Do not run validation in this workspace until disk is fixed.

## Recommendation
HOLD for Adam review before dependency recovery or feature implementation.
