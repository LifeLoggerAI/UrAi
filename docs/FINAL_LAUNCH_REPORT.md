# URAI Final Launch Report

Generated: 2026-06-25 America/Chicago

## Final Decision

NO-GO: blocked

No staging deploy was attempted. No production deploy was attempted.

The live canonical app responds over HTTPS, but the final launch cutover is blocked because production lock does not allow launch, local package-script preflight cannot run in this environment, `/system` does not show the newly added production-lock truth on the live site, rollback and monitoring evidence are missing, and privacy gate evidence is not passed.

## Launch Mode

| Repo | Registry launch mode | Eligible for launch | Production claim |
| --- | --- | --- | --- |
| LifeLoggerAI/UrAi | demo-only | false | false |
| LifeLoggerAI/urai-staging | staging-only | false | false |
| LifeLoggerAI/urai-privacy | blocked | false | false |
| LifeLoggerAI/urai-admin | blocked | false | false |
| LifeLoggerAI/urai-jobs | staging-only | false | false |
| LifeLoggerAI/urai-content | demo-only | false | false |
| LifeLoggerAI/UrAi-Dev | sandbox-only | false | false |
| LifeLoggerAI/UrAiProd | legacy-archive | false | false |

## What Launched

Nothing was deployed in this pass.

Existing live URLs were smoke checked only. This report does not claim a new launch.

## URLs And Routes Smoke Tested

Source: `curl.exe -L -s -o NUL -w ...` from the Codex workspace.

| URL | HTTP status | Result |
| --- | --- | --- |
| https://urai.app/ | 200 | Existing live root responds |
| https://urai.app/home | 200 | Existing live route responds |
| https://urai.app/system | 200 | Responds, but content falls back to root/home bundle, not production-lock `/system` truth |
| https://urai.app/life-map | 200 | Existing live route responds |
| https://urai.app/privacy | 200 | Existing live route responds |
| https://urai.app/terms | 200 | Existing live route responds |
| https://urai.app/waitlist | 200 | Existing live route responds |
| https://urai.app/demo | 200 | Existing live route responds |

## `/system` Verification

`https://urai.app/system` returned HTTP 200, but saved HTML inspection did not find these expected markers:

- `URAI release truth`
- `Production lock`
- `launch mode`
- `demo-only`
- `launch-eligible`

The HTML title and body indicated the currently deployed `URAI Spatial` root/home experience. This means the latest `/system` route added in the repo is not live on the deployed app.

This is launch-blocking because public users cannot verify production/staging/deferred truth from the live system route.

## Screenshots

Screenshots were not captured in this final cutover pass.

Reason: the in-app browser/runtime failed under the managed Windows sandbox with `windows sandbox failed: helper_unknown_error: apply deny-read ACLs`. A retry with a minimal browser navigation produced the same failure. No screenshot evidence is claimed.

## Commands Run

| Command | Result | Reason |
| --- | --- | --- |
| `npm run check:production-lock` | Failed before execution | `npm` is not recognized on PATH |
| `npm run check:system-registry` | Not executable here | `npm` is not recognized on PATH |
| `npm run smoke:production` | Not executable here | `npm` is not recognized on PATH |
| `npm run smoke:genesis-spine` | Not executable here | `npm` is not recognized on PATH |
| `npm run test:visual` | Not executable here | `npm` is not recognized on PATH; browser screenshot runtime also failed |
| `npm run check:v1` | Not executable here | `npm` is not recognized on PATH |
| `npm run check:types` / `npm run typecheck` | Not executable here | `npm` is not recognized on PATH |
| `npm run lint` | Not executable here | `npm` is not recognized on PATH |
| `npm test` | Not executable here | `npm` is not recognized on PATH |
| `npm run build` | Not executable here | `npm` is not recognized on PATH |
| `curl.exe -I https://urai.app/` | Passed | HTTP 200, HTTPS works |
| Route `curl.exe` checks for `/`, `/home`, `/system`, `/life-map`, `/privacy`, `/terms`, `/waitlist`, `/demo` | Passed at HTTP level | All returned HTTP 200 |
| `/system` marker inspection | Failed | Live route does not contain production-lock markers |

## DNS/SSL Status

Known from the production-lock audit and rechecked root header:

- `https://urai.app/` resolves and returns HTTP 200 with HTTPS/HSTS headers.
- `www.urai.app` previously resolved to `urai-4dc1d.web.app` and returned HTTP 200.
- `urai-admin.web.app` previously returned HTTP 503.
- `uraiadmin.com` / `www.uraiadmin.com` previously resolved to Squarespace, not the Firebase admin surface.
- `www.uraiassetfactory.com` previously had HTTPS failure / HTTP 404.
- Non-canonical domains remain deferred or blocked and were not launched here.

## Firebase Target Used

No Firebase target was used. No Firebase deploy command was run.

Registry evidence still records the canonical app Firebase project as `urai-4dc1d`, but production deploy was blocked before target selection because production lock and preflight evidence are incomplete.

## Commit SHA Deployed

No commit was deployed in this pass.

Latest repo-side production-lock/reporting evidence was written through GitHub, but there is no live deploy SHA for this cutover.

## Systems Launched

None.

## Systems Deferred

- `LifeLoggerAI/urai-staging`: staging-only proving ground
- `LifeLoggerAI/urai-jobs`: staging-only under strict production lock
- `LifeLoggerAI/urai-content`: source/package/demo-only until standalone launch evidence exists
- `LifeLoggerAI/urai-spatial`: roadmap-only
- `LifeLoggerAI/asset-factory`: roadmap-only/deferred
- `LifeLoggerAI/urai-analytics`: blocked
- `LifeLoggerAI/urai-storytime`: blocked
- `LifeLoggerAI/urai-communications`: blocked
- `LifeLoggerAI/B2Bportal`: blocked

## Systems Blocked

- `LifeLoggerAI/urai-privacy`: privacy release gate not passed; consent/export/delete/admin audit/legal evidence missing
- `LifeLoggerAI/urai-admin`: live URL previously returned 503; admin bootstrap/custom-claim evidence missing
- Production launch for `LifeLoggerAI/UrAi`: blocked by missing local checks, missing deploy evidence, missing rollback evidence, missing monitoring evidence, missing privacy gate evidence, and live `/system` mismatch

## Rollback Status

Rollback plan exists as documentation, but rollback proof is missing.

No deployed commit SHA or previous known good production rollback target was verified in this pass. Therefore rollback is not launch-ready.

## Final Reason

Final decision is `NO-GO: blocked` because evidence does not permit deployment:

- Registry launch mode for `LifeLoggerAI/UrAi` is `demo-only`, not `public-demo` or `production`.
- `eligibleForLaunch` is `false`.
- Package-script preflight could not run because `npm` is unavailable.
- Browser screenshot evidence could not be captured due sandbox failure.
- `/system` is not live with production-lock truth.
- Rollback, monitoring, deploy SHA, and privacy gate evidence are missing.

Do not deploy production from this state.
