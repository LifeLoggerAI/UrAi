# Staging Smoke Evidence

Repo: LifeLoggerAI/UrAi
Branch/commit tested: main @ f6931174fd4bf81f8a57a624fa080b542938c179
Date/time tested: 2026-06-25T23:54:00-05:00

## Decision

Staging proof: BLOCKED.

The source/build for `/system` is correct locally, but no new staging deploy was completed because Firebase CLI authentication is unavailable in this environment.

## Local Verification

| Check | Command or URL | Expected result | Actual result | Pass/fail | Notes |
| --- | --- | --- | --- | --- | --- |
| Node runtime | `C:\tmp\node-v20.19.4-win-x64\node.exe -v` | Node 20 | `v20.19.4` | pass | Portable Node used because PATH Node was missing |
| npm runtime | `C:\tmp\node-v20.19.4-win-x64\npm.cmd -v` | npm available | `10.8.2` | pass | Portable npm used |
| Install | `npm ci` with Node 20 on PATH | Dependencies install | Installed 842 packages | pass | npm audit reports 32 vulnerabilities; not changed in this pass |
| Registry gate | `npm run check:system-registry` | Pass | Pass | pass | No production claim implied |
| Production lock | `npm run check:production-lock` | Internal consistency pass | Pass with privacy-gate warnings | pass | `eligibleForLaunch=false` remains correct |
| Staging Firebase target | PowerShell env + `node scripts/check-firebase-target.mjs --config firebase.staging.json` | `urai-staging/urai-staging` | Pass | pass | `npm run check:firebase:staging` is Unix-env syntax and fails on Windows |
| Typecheck | `npm run typecheck` | Pass | Pass | pass |  |
| Lint | `npm run lint` | Pass | Pass with 5 warnings | pass | One JSX apostrophe lint error fixed in `src/app/launch/page.tsx` |
| Tests | `npm test` | Pass | 50 suites, 319 tests passed | pass | jsdom logs expected media API not-implemented console errors, but tests pass |
| npm build script | `npm run build` | Next build | Fails before Next build | fail | Windows shell lacks POSIX `rm`/`mkdir -p`; script portability blocker |
| Direct Next build | `node ./node_modules/next/dist/bin/next build` | Build passes | Build passed; `/system` emitted | pass | Equivalent app build verification |
| Built `/system` marker | `Select-String .next/server/app/system.html` | Registry truth markers | Found `URAI release truth`, registry timestamp, production lock, Genesis Spine, deferred/gated systems | pass | Local build only |

## Staging Deploy Attempt

| Item | Value |
| --- | --- |
| Firebase project | `urai-staging` |
| Hosting site | `urai-staging` |
| Config | `firebase.staging.json` |
| Command attempted | `npm exec firebase-tools -- deploy --project urai-staging --only hosting --config firebase.staging.json` |
| Result | Failed before deploy |
| Error | `Failed to authenticate, have you run firebase login?` |

No secrets were added. No production deploy was attempted.

## Existing Staging Route Smoke

These checks are for the already-live staging surface, not a new deployment from commit `f6931174fd4bf81f8a57a624fa080b542938c179`.

| URL | Status | Result |
| --- | --- | --- |
| `https://urai-staging.web.app/` | 200 | Existing staging root responds |
| `https://urai-staging.web.app/system` | 404 | Blocking: does not show registry/production-lock truth |
| `https://urai-staging.web.app/life-map` | 200 | Existing route responds |
| `https://urai-staging.web.app/privacy` | 200 | Existing route responds |
| `https://urai-staging.web.app/terms` | 200 | Existing route responds |
| `https://urai-staging.web.app/waitlist` | 200 | Existing route responds |
| `https://urai-staging.web.app/signup` | 404 | Blocking for requested launch-critical route |
| `https://urai-staging.web.app/login` | 404 | Blocking for requested launch-critical route |
| `https://urai-staging.web.app/dashboard` | 404 | Blocking for requested launch-critical route |

## Remaining Staging Blocker

Authenticate Firebase CLI with an operator account that can deploy to project/site `urai-staging`, then deploy commit `f6931174fd4bf81f8a57a624fa080b542938c179` to staging and re-run route smoke. Do not deploy production until staging `/system` displays registry truth.
