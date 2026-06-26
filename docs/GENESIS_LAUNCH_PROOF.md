# URAI Genesis Launch Proof

Generated at: 2026-06-26

## Scope

This proof pack covers the URAI Genesis launch/demo routes:

- `/`
- `/home`
- `/life-map`
- `/focus`
- `/replay`
- `/ground`
- `/orb`
- `/orb-chat`
- `/sky`
- `/horizon`

No new product systems were added. Real generated life movies, production generated media, passive sensing, autonomous jobs, XR worlds, marketplace flows, and provider-backed private-memory intelligence remain gated unless separately proven by deployed code, tests, provider credentials, and live smoke evidence.

## Repo Status

- Branch: `genesis-public-launch`
- Commit at start of proof pass: `5f8e738097a409b378dc49a5ef0bffd400d77876`
- Working tree: dirty
- Previous visual/interaction route changes: uncommitted
- Firebase project target verified by script: `urai-4dc1d`
- Firebase hosting site verified by script: `urai-4dc1d`
- Intended safe deploy surface: `firestore:rules`, `firestore:indexes`, `storage`, `hosting`
- Functions deploy status: excluded from the deploy command and not deployed in this pass

## Commands Run

| Command | Result |
| --- | --- |
| `git branch --show-current` | Passed: `genesis-public-launch` |
| `git log -1 --oneline` | Passed: `5f8e7380 Launch URAI Genesis visual asset pack and final QA evidence` |
| `git status --short` | Passed; dirty working tree documented |
| `npm run check:firebase` | Passed: `urai-4dc1d/urai-4dc1d` |
| `npm run check:types` | Passed |
| `npm run lint` | Passed with 5 existing non-blocking warnings |
| `npm run verify:assets` | Passed |
| `npm run verify:privacy` | Passed |
| `npm run check:genesis` | Passed |
| `npm run check:genesis:assets` | Passed |
| `npm run check:genesis:audio` | Passed |
| `npm run check:public-copy` | Passed |
| `npm run test:rules` | Passed: 105 tests |
| `npm test -- --runInBand` | Passed: 333 tests; jsdom media-method warnings only |
| `npm run build` | Passed; requested routes generated |
| `npm exec --yes firebase-tools -- deploy --project urai-4dc1d --config firebase.json --only firestore:rules,firestore:indexes,storage,hosting --dry-run` | Blocked: Firebase CLI authentication missing |

## Local Production Smoke

Local production server:

- Command: `npm start`
- URL: `http://127.0.0.1:3014`
- Smoke method: Playwright browser route checks and screenshots
- Viewports: `390x844`, `1280x900`
- Route checks: 20
- Failures: 0
- Console errors from app code: 0
- Page errors: 0

## Routes Verified

All scoped routes loaded locally without blank screens, missing imports, route-level crashes, permanent spinners, unsafe claim hits, or horizontal overflow:

- `/`
- `/home`
- `/life-map`
- `/focus`
- `/replay`
- `/ground`
- `/orb`
- `/orb-chat`
- `/sky`
- `/horizon`

## Flows Verified

- `/home` links to `/life-map`
- `/home` links to `/ground`
- `/home` links to `/orb`
- `/home` links to `/orb-chat`
- `/home` links to `/focus`
- `/home` links to `/horizon`
- Focus first `Escape` unwinds from focus into the Life Map galaxy state
- Focus second `Escape` returns to `/home`
- Replay direct load opens a sample replay overlay
- Replay `Escape` closes the replay overlay back to focus/galaxy state

## Screenshot Proof Artifacts

Screenshots and machine-readable smoke output are saved in:

- `launch-proof/genesis-smoke/`
- `launch-proof/genesis-smoke/genesis-smoke-report.json`
- `launch-proof/live-smoke/`
- `launch-proof/live-smoke/live-smoke-report.json`

Captured screenshot set:

- `desktop1280--root.png`
- `desktop1280--home.png`
- `desktop1280--life-map.png`
- `desktop1280--focus.png`
- `desktop1280--replay.png`
- `desktop1280--ground.png`
- `desktop1280--orb-chat.png`
- `desktop1280--sky.png`
- `desktop1280--horizon.png`
- `mobile390--root.png`
- `mobile390--home.png`
- `mobile390--life-map.png`
- `mobile390--orb-chat.png`

## Deploy Status

Deployment was reported complete outside this pass. This pass did not deploy and did not run any Functions deployment.

Safe deploy command recorded for the Genesis public surface:

```bash
npm exec --yes firebase-tools -- deploy --project urai-4dc1d --config firebase.json --only firestore:rules,firestore:indexes,storage,hosting
```

Deployed URLs checked:

- `https://www.urai.app`
- `https://urai-4dc1d.web.app`

## Live Smoke Status

Live smoke was performed on 2026-06-26 against both deployed URLs.

Summary:

- Route checks: 40
- Screenshot files: 26
- Direct route HTTP status: all scoped routes returned HTTP 200
- Console errors: 0 captured by console listener
- Page errors: 12 captured, all on `/focus` and `/replay`
- Request failures: 1 captured on `https://urai-4dc1d.web.app`
- Unsupported production-claim hits: 0

Routes checked on both live URLs:

- `/`
- `/home`
- `/life-map`
- `/focus`
- `/replay`
- `/ground`
- `/orb`
- `/orb-chat`
- `/sky`
- `/horizon`

Live smoke did not pass as a launch-confirmation gate.

Observed blockers:

- `/home` on both live URLs did not expose the expected Genesis links to `/life-map`, `/ground`, `/orb`, `/orb-chat`, `/focus`, and `/horizon`.
- `/focus` emitted React minified error `#418` on both live URLs.
- `/replay` emitted React minified error `#418` on both live URLs.
- Focus Escape/unwind did not match the locally proven behavior on either live URL.
- Replay direct load did not show the expected sample replay overlay on either live URL.
- Replay Escape/unwind did not match the locally proven behavior on either live URL.
- Mobile/desktop tap-target warnings were captured on route navigation and Life Map/Focus/Replay controls.
- One request failure was captured on `https://urai-4dc1d.web.app` for `_next/static/chunks/app/life-map/layout-c76c60db87e1b379.js`.

Interpretation:

- Firebase Hosting fallback/direct route reachability is working at the HTTP level.
- The deployed live surface does not match the locally proven Genesis interaction-flow candidate.
- Existing public URLs must not be treated as proof that the local Genesis route-flow candidate is live until the exact candidate is deployed and live smoke passes.

## Claim Safety

Checked public copy with `npm run check:public-copy` and a targeted unsupported-claim search. No launch-blocking unsupported claims were found in the checked surfaces. The following remain gated:

- Real generated life movies
- Production generated user media
- Provider-backed image/video/audio generation
- Passive sensing
- Autonomous jobs/agents
- Complete XR/AR/VR worlds
- Marketplace/data monetization
- Broad outbound communications

## Remaining Blockers

- Live smoke failed on both deployed URLs.
- The deployed `/home` surface does not expose the expected Genesis flow links.
- Live `/focus` and `/replay` emit React minified error `#418`.
- Live Focus/Replay unwind behavior does not match the local proof.
- Live smoke indicates the deployed surface does not match the locally verified Genesis candidate.
- The working tree remains dirty, including uncommitted route/proof changes and pre-existing `public/assets/sky/**` Git LFS pointer-sized asset changes.

## Final Live Blocker Fix + Redeploy Attempt

Run at: `2026-06-26T07:23:15.7755091-05:00`

Scope:

- Re-verified the current local Genesis candidate on branch `genesis-public-launch`.
- Confirmed `HEAD` remains `5f8e738097a409b378dc49a5ef0bffd400d77876`.
- Confirmed the local smoke-passing Genesis route and flow changes are still uncommitted in this worktree.
- Confirmed the likely root cause of live/local mismatch: the deployed live bundle does not include the uncommitted Genesis route shell, `/home` route links, `/orb-chat` route alias, and Focus/Replay unwind updates that passed local smoke.
- Rebuilt the app from the current worktree and re-ran local production smoke.
- Attempted the safe Firebase deploy command; deploy did not start because Firebase CLI authentication is missing.

Additional commands run:

| Command | Result |
| --- | --- |
| `git branch --show-current` | Passed: `genesis-public-launch` |
| `git status --short` | Passed; dirty worktree documented |
| `git log -1 --oneline` | Passed: `5f8e7380 Launch URAI Genesis visual asset pack and final QA evidence` |
| `git diff --stat` | Passed; uncommitted route/proof/asset changes documented |
| `npm run check:firebase` | Passed: `urai-4dc1d/urai-4dc1d` |
| `npm run check:types` | Passed |
| `npm run lint` | Passed with 5 existing non-blocking warnings |
| `npm run verify:assets` | Passed |
| `npm run verify:privacy` | Passed |
| `npm run check:genesis` | Passed |
| `npm run check:genesis:assets` | Passed |
| `npm run check:genesis:audio` | Passed |
| `npm run check:public-copy` | Passed |
| `npm run test:rules` | Passed: 105 tests |
| `npm test -- --runInBand` | Passed: 333 tests; jsdom media-method warnings only |
| `npm run build` | Passed; requested Genesis routes generated |
| `npm exec --yes firebase-tools -- use` | Blocked: Firebase CLI authentication missing |
| `npm exec --yes firebase-tools -- deploy --project urai-4dc1d --config firebase.json --only firestore:rules,firestore:indexes,storage,hosting` | Blocked before deploy: Firebase CLI authentication missing |

Final local production smoke:

- Server command: `npm start`
- Local URL: `http://127.0.0.1:3014`
- Smoke method: Playwright browser route checks, flow checks, and screenshots
- Viewports: `390x844`, `1280x900`
- Route checks: 20
- Flow checks: 8
- Screenshot files: 20
- Failures: 0
- Console errors from app code: 0
- Page errors: 0
- Failed asset/chunk requests: 0

Routes re-verified locally:

- `/`
- `/home`
- `/life-map`
- `/focus`
- `/replay`
- `/ground`
- `/orb`
- `/orb-chat`
- `/sky`
- `/horizon`

Flows re-verified locally:

- `/home` exposes links to `/life-map`, `/ground`, `/orb`, `/orb-chat`, `/focus`, and `/horizon`.
- `/focus` first `Escape` returns to a Life Map galaxy/focus-safe state.
- `/focus` second `Escape` returns to `/home`.
- `/replay` direct load shows the `REPLAY THREAD / SAMPLE MEMORY PREVIEW` overlay.
- `/replay` `Escape` closes the replay overlay into a focus/galaxy-safe state.

Final local proof artifacts:

- `launch-proof/final-local-smoke/final-local-smoke-report.json`
- `launch-proof/final-local-smoke/mobile390--root.png`
- `launch-proof/final-local-smoke/mobile390--home.png`
- `launch-proof/final-local-smoke/mobile390--life-map.png`
- `launch-proof/final-local-smoke/mobile390--focus.png`
- `launch-proof/final-local-smoke/mobile390--replay.png`
- `launch-proof/final-local-smoke/mobile390--ground.png`
- `launch-proof/final-local-smoke/mobile390--orb.png`
- `launch-proof/final-local-smoke/mobile390--orb-chat.png`
- `launch-proof/final-local-smoke/mobile390--sky.png`
- `launch-proof/final-local-smoke/mobile390--horizon.png`
- `launch-proof/final-local-smoke/desktop1280--root.png`
- `launch-proof/final-local-smoke/desktop1280--home.png`
- `launch-proof/final-local-smoke/desktop1280--life-map.png`
- `launch-proof/final-local-smoke/desktop1280--focus.png`
- `launch-proof/final-local-smoke/desktop1280--replay.png`
- `launch-proof/final-local-smoke/desktop1280--ground.png`
- `launch-proof/final-local-smoke/desktop1280--orb.png`
- `launch-proof/final-local-smoke/desktop1280--orb-chat.png`
- `launch-proof/final-local-smoke/desktop1280--sky.png`
- `launch-proof/final-local-smoke/desktop1280--horizon.png`

Firebase deploy surface:

- Project target in `.firebaserc`: `urai-4dc1d`
- Hosting site in `firebase.json`: `urai-4dc1d`
- Safe deploy surface remains `firestore:rules`, `firestore:indexes`, `storage`, and `hosting`.
- `functions` remains present in `firebase.json` but is excluded from the safe deploy command.
- No Functions deploy was attempted or performed in this pass.

Deploy authority blocker:

- `firebase-tools login:list` reports no authorized Firebase accounts.
- `firebase use` fails with `Failed to authenticate, have you run firebase login?`
- The safe deploy command fails before deployment with the same authentication error.
- Because no deploy occurred in this pass, live smoke was not re-run as a post-deploy pass and the public URLs must remain gated until an authenticated deploy of this exact candidate succeeds.

## Prior Local/Deploy Verdict

Local Genesis launch/demo proof passed again from the current worktree. Live Genesis launch confirmation remains blocked because Firebase deploy authority is missing in this environment, so the exact local Genesis candidate could not be deployed to `https://www.urai.app` and `https://urai-4dc1d.web.app`. Production public launch remains blocked until an authorized deploy of this exact candidate succeeds and live smoke passes without page errors or flow mismatches.

## Firebase Production Live Smoke Confirmation

Run at: `2026-06-26T13:26:10.566Z`

Live URLs checked:

- `https://www.urai.app`
- `https://urai-4dc1d.web.app`

Safe deploy command recorded for this public surface:

```bash
npm exec --yes firebase-tools -- deploy --project urai-4dc1d --config firebase.json --only firestore:rules,firestore:indexes,storage,hosting
```

This pass did not deploy and did not deploy Firebase Functions.

Live smoke summary:

- Route checks: 44
- Flow checks: 32
- Direct route HTTP status: all checked route loads returned HTTP 200
- Console errors from page console listener: 0
- Page errors: observed on `/focus` and `/replay`
- Request failures: 0 in the confirmation report
- Unsupported production-claim hits: 0
- Screenshot/report artifacts: `launch-proof/live-smoke-confirmation/`
- Machine-readable report: `launch-proof/live-smoke-confirmation/live-smoke-confirmation-report.json`

Routes checked on both live URLs at mobile and desktop widths:

- `/`
- `/home`
- `/life-map`
- `/focus`
- `/replay`
- `/ground`
- `/orb`
- `/orb-chat`
- `/sky`
- `/horizon`
- `/cognitive-mirror`

Flow results:

- `/home` to `/life-map`: failed; expected link selector was not present on the live `/home` surface.
- `/home` to `/ground`: failed; expected link selector was not present on the live `/home` surface.
- `/home` to `/orb`: failed; expected link selector was not present on the live `/home` surface.
- `/home` to `/orb-chat`: failed; expected link selector was not present on the live `/home` surface.
- `/life-map` to `/focus`: failed; visible/clickable focus navigation did not complete within the smoke timeout.
- `/focus` to `/replay`: failed; expected replay navigation selector was not found.
- Focus Escape/unwind: failed; the live `/focus` page emitted a page error instead of proving the local unwind behavior.
- Replay Escape/unwind: failed; the live `/replay` page emitted a page error instead of proving the local unwind behavior.

Interpretation:

- Firebase Hosting direct-route fallback is working at the HTTP level.
- The live public URLs are not yet a passing proof of the current Genesis route-flow candidate.
- The live `/home` surface does not expose the expected Genesis navigation contract.
- The live `/focus` and `/replay` routes still need redeploy/fix verification before public launch can be called green.
- Claim safety is acceptable in the checked live copy because no unsupported claim hits were found, but demo/sample/preview visibility remains gated on the failing live route-flow proof.
- Firebase Functions status remains gated to deploy records; no Functions deployment was performed by this pass, and the recorded safe deploy command excludes Functions.

## Final Verdict

FAIL: the deployed URLs are reachable, but live Genesis flow/runtime verification did not pass. Public launch remains blocked until `/home`, `/focus`, `/replay`, and the expected Genesis navigation/unwind flows pass live smoke on both Firebase URLs.
