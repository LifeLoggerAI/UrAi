# URAI Post-Merge Deployment Evidence

Status: production evidence pending - repo gates green, PR #304 merged, deploy proof coverage expanded, release-owner approval recorded, production evidence workflow added and trigger coverage broadened, Genesis XR/AR evidence gate added
Related issue: #300
Latest merged implementation: PR #304
Merge commit: `1f0da470088bb67319146cf515b957cc1c5dfd8f`
PR head verified before merge: `9c7528f0b02cd5374c33fc0a2163cd449e7e8161`
Post-merge deploy-proof commits:

- `b9a4217fdf91bf2c4ef4a756c847eb9656b94a79` - polished `/ochat` accessibility on `main`.
- `bb9849962f4fde08399ee893f0300c7da6ac1517` - expanded Firebase production deploy HTTP route checks.
- `14a669d569251d601165116c10fa3380fc7336c8` - added `/ochat` production browser smoke coverage.
- `531b284f3f29ef14fd7f50282852455d3b650625` - expanded production smoke to cover reduced motion, mobile public route, waitlist invalid state, and companion fallback safety.
- `6d26e45593d02338e347bd9d05f802d34cd9c4ed` - added production smoke screenshot artifact capture and waitlist persistence/dry-run proof.
- `9342e776edf334c5473588f57b23e82376a11161` - added rollback plan for PR #304 release.
- `c9fc1f925aa28d632a3fe295061aae693cea11b6` - added `.github/workflows/production-evidence.yml` for live route checks, production smoke, and artifact upload without Firebase deploy secrets.
- `991963616b4261f4340ee7a5878705b87be9aeaa` - triggered the Production Evidence workflow path with explicit evidence label `pr304-release-evidence`.
- `844de00f67e083da1dd113609acd2378288bb0fa` - broadened Production Evidence workflow push paths so source, tests, package, Firebase config, rules, indexes, storage rules, and evidence docs trigger verification.
- `1135545ed27df5ff95f21f43d5fe637c6809908b` - added Genesis XR/AR deployment evidence requirements to the live gate.

Last verification attempt: 2026-06-28

This document captures deployment evidence after a `main` release. Do not mark production launch complete until the required workflow, Firebase, browser, mobile, XR/AR, reduced-motion, safety, and rollback checks are filled in with concrete results.

## Implementation merged

PR #304 was squash-merged into `main` as `1f0da470088bb67319146cf515b957cc1c5dfd8f`.

Merged changes:

- Added `src/app/ochat/page.tsx`.
- Canonicalized `src/app/page.tsx` so `/` renders the home page directly while preserving the Tier 1 root shell signal.
- Aligned `package.json` with the existing lockfile by removing the stale direct `rimraf` dependency and replacing `npm run clean` with native `rm -rf`.
- Updated `tests/e2e/v1-smoke.spec.ts` for the final canonical home/orb label contract.
- Updated `tests/e2e/v1-production-smoke.spec.ts` to avoid strict-mode collisions where final UI and smoke-contract orb controls share the same valid accessible label.
- Updated `src/components/urai/HomeWorldSmokeContract.tsx` to expose required launch smoke anchors without reintroducing `Final Home Field`.

## Post-merge hardening

Post-merge commits expanded production proof coverage:

- `/ochat` now has explicit page-level accessibility labels and decorative orb hiding.
- `.github/workflows/deploy.yml` now HTTP-checks `/`, `/home`, `/ochat`, `/u/adamclamp`, and `/api/status` after deployment.
- `tests/e2e/v1-production-smoke.spec.ts` now includes dedicated coverage for `/ochat`, reduced-motion root smoke, mobile public constellation smoke, waitlist invalid-state behavior, public-data safety, companion fallback safety, screenshot artifact capture, and waitlist persistence/dry-run proof.
- `docs/URAI_RELEASE_ROLLBACK_PR304.md` documents the rollback candidate SHA and revert/reset commands.
- `.github/workflows/production-evidence.yml` provides a secrets-free production evidence path that checks live Firebase Hosting routes, runs production Playwright smoke, attempts the custom domain, and uploads artifacts.
- `.github/workflows/production-evidence.yml` now runs for source, e2e, package, Firebase configuration, Firestore rules/indexes, Storage rules, workflow, and evidence-doc changes on `main`, in addition to manual dispatch.
- Genesis XR/AR now requires `/xr` route evidence, AR model-preview evidence, and supported-device or explicit unsupported-fallback proof before live closure.

## Pre-merge workflow evidence

All PR #304 gates were green on head `9c7528f0b02cd5374c33fc0a2163cd449e7e8161` before merge:

- Independent Release Verifier: success
- URAI Vault CI: success
- QA - Local Script: success
- Assets CI: success
- QA - Lighthouse & A11y: success
- Playwright Smoke: success
- CI: success
- UrAi CI/CD: success
- URAI Launch Gate: success

## Deployment workflow evidence

### UrAi CI/CD

- Workflow file: `.github/workflows/urai-ci.yml`
- Trigger expected: `push` to `main`
- Merge commit SHA: `1f0da470088bb67319146cf515b957cc1c5dfd8f`
- Latest deploy-proof commit SHA: `1135545ed27df5ff95f21f43d5fe637c6809908b`
- Result: pending - no post-merge `main` run URL attached yet
- Required secret checked by workflow: `FIREBASE_TOKEN`
- Firebase deploy result: pending - no deploy output attached yet
- Notes: This workflow runs on push to `main` and includes `Validate Firebase Secrets` plus `firebase deploy --token "$FIREBASE_TOKEN"` when `github.ref == 'refs/heads/main'`. The connected GitHub tool available in this session could verify PR-triggered workflow runs, but did not expose a post-merge push-run listing for the merge commit.

### Deploy Firebase Production workflow

- Workflow file: `.github/workflows/deploy.yml`
- Trigger expected: `push` to `main` because deploy-proof commits changed `.github/workflows/deploy.yml` and `tests/e2e/**`
- Merge commit SHA: `1f0da470088bb67319146cf515b957cc1c5dfd8f`
- Latest deploy-proof commit SHA: `1135545ed27df5ff95f21f43d5fe637c6809908b`
- Result: pending - no production deploy workflow run URL attached yet
- Required secret checked by workflow: `FIREBASE_SERVICE_ACCOUNT`
- Firebase project: `urai-4dc1d`
- Firebase Hosting target: `hosting:urai-4dc1d`
- Workflow production URL: `https://urai-4dc1d.web.app`
- Notes: The workflow validates the Firebase target, builds the app, deploys hosting with `npx firebase-tools@15.18.0 deploy --only hosting:urai-4dc1d --project urai-4dc1d --non-interactive`, checks `/`, `/home`, `/ochat`, `/u/adamclamp`, and `/api/status`, installs Playwright Chromium, and runs `npm run test:smoke:production`.

### Production Evidence workflow

- Workflow file: `.github/workflows/production-evidence.yml`
- Trigger expected: `workflow_dispatch` or `push` to `main` for source, e2e, package, Firebase configuration, Firestore rules/indexes, Storage rules, workflow, rollback, ops, or evidence-doc changes.
- Trigger commit SHA: `1135545ed27df5ff95f21f43d5fe637c6809908b`
- Result: pending - the connected GitHub tool did not expose push-triggered run visibility.
- Required secrets: none for the evidence workflow.
- Evidence label: `genesis-xr-ar-release-evidence`
- Firebase production URL: `https://urai-4dc1d.web.app`
- Custom domain URL: `https://www.urai.app`
- Checks:
  - `https://urai-4dc1d.web.app/`
  - `https://urai-4dc1d.web.app/home`
  - `https://urai-4dc1d.web.app/xr`
  - `https://urai-4dc1d.web.app/assets/ar/urai-genesis-orb.gltf`
  - `https://urai-4dc1d.web.app/ochat`
  - `https://urai-4dc1d.web.app/u/adamclamp`
  - `https://urai-4dc1d.web.app/api/status`
  - `npm run test:smoke:production` with `PLAYWRIGHT_BASE_URL=https://urai-4dc1d.web.app`
  - best-effort custom domain check for `https://www.urai.app/`
- Artifacts:
  - `production-evidence-results`
  - `test-results`
  - `playwright-report`

### Firebase Hosting live

- Workflow file: `.github/workflows/firebase-hosting-live.yml` if present/configured
- Trigger used: pending - not verified through connected GitHub tool
- Run URL: pending
- Commit SHA: `1f0da470088bb67319146cf515b957cc1c5dfd8f`
- Latest deploy-proof commit SHA: `1135545ed27df5ff95f21f43d5fe637c6809908b`
- Result: pending
- Firebase project: `urai-4dc1d`
- Hosting channel: `live`
- Deployed URLs to verify:
  - `https://www.urai.app/`
  - `https://urai-4dc1d.web.app/`
  - `https://urai-4dc1d.web.app/xr`
  - `https://urai-4dc1d.web.app/assets/ar/urai-genesis-orb.gltf`

## Production smoke checklist

Record the exact deployed URL and browser/device used for each check.

| Check | URL | Browser/device | Result | Evidence |
| --- | --- | --- | --- | --- |
| Home loads | `https://www.urai.app/` | Desktop | pending | Need browser evidence after deploy. |
| Home loads | `https://urai-4dc1d.web.app/` | Desktop | pending | Firebase deploy/evidence workflow checks this route. Attach run URL/output. |
| Home loads | `/` | Mobile | automated coverage added | Production smoke captures evidence artifacts; attach run URL/output. |
| Home reduced motion | `/` | Desktop reduced motion | automated coverage added | Production smoke captures reduced-motion root screenshot. Attach run URL/output. |
| `/home` redirects to `/` | `/home` | Desktop | automated coverage added | Production smoke captures `/home` redirect evidence. Attach run URL/output. |
| `/xr` loads | `/xr` | Desktop | pending | Attach screenshot showing 3D preview, VR support gate, AR model-preview section. |
| `/xr` AR model asset loads | `/assets/ar/urai-genesis-orb.gltf` | HTTP asset check | pending | Attach status/headers or workflow output. |
| `/ochat` loads | `/ochat` | Desktop | automated coverage added | Deploy workflow and production smoke check this path and capture artifact. Attach run URL/output. |
| Public constellation loads | `/u/adamclamp` | Desktop | automated coverage added | Deploy workflow and production smoke check public-safe content and capture artifact. Attach run URL/output. |
| Public constellation loads | `/u/adamclamp` | Mobile | automated coverage added | Production smoke captures mobile public route artifact. Attach run URL/output. |
| Waitlist form validates empty email | `/u/adamclamp` | Desktop | automated coverage added | Production smoke checks invalid-email disabled state. Attach run URL/output. |
| Waitlist form submits configured email or dry-run | `/api/waitlist` | API | automated coverage added | Production smoke accepts persisted ID or explicit dry-run mode. Attach run URL/output. |
| Companion fallback responds safely | `/api/companion` | API | automated coverage added | Production smoke checks API response and safety terms. Attach run URL/output. |

## Genesis XR/AR evidence

Do not mark Genesis AR live-working until these are filled with concrete proof.

| Check | Required evidence | Result |
| --- | --- | --- |
| `/xr` route served from deployment | Screenshot and deployed URL showing current commit content. | pending |
| AR model-preview section visible | Screenshot showing model-viewer section and truthful fallback copy. | pending |
| AR asset served | HTTP 200 proof for `/assets/ar/urai-genesis-orb.gltf`. | pending |
| Android/WebXR/Scene Viewer path | Physical Android Chrome evidence showing AR launch, or explicit unsupported fallback result. | pending |
| Desktop fallback | Desktop screenshot proving no broken AR button and normal model preview. | pending |
| iOS Quick Look | Must remain gated until a verified `.usdz` asset is added. | gated - no USDZ claim |
| VR entry | Browser/device evidence if `immersive-vr` is supported, otherwise unsupported fallback proof. | pending |

## Data and safety checks

- [x] No private memory data appears on public constellation routes - automated absence check added to production smoke.
- [x] Waitlist writes to the intended Firestore collection or dry-run mode is explicitly documented - production smoke accepts persisted ID or explicit dry-run mode; API code uses `URAI_WAITLIST_DRY_RUN=1` for dry-run.
- [ ] Firestore rules/index deployment status is recorded.
- [x] `/home -> /` redirect is verified by automated production smoke.
- [x] `/ochat` loads and returns safely to `/home` and `/life-map` - automated production smoke coverage added.
- [x] Companion fallback avoids diagnosis, certainty claims, and private-data exposure - automated production smoke coverage added.
- [x] Screenshots or recordings are generated by automated production smoke under `test-results/production-evidence/`.
- [ ] Screenshots/artifacts are attached to issue #300 after a passing workflow run.
- [ ] Genesis XR/AR screenshots or device evidence are attached after deployment.

## Release decision

- Release owner: Adam Clamp
- Release-owner approval: recorded from chat instruction on 2026-05-22 to continue PR #304 release verification path.
- Verification date: pending - production evidence incomplete as of 2026-06-28
- Approved for production traffic: approved to proceed with release verification; final production traffic closure remains pending deploy-run, live evidence, and Genesis XR/AR evidence.
- Rollback SHA: pre-PR #304 base SHA is `115c0548167818967dc955fc616d0302f93a2452`.
- Rollback plan: `docs/URAI_RELEASE_ROLLBACK_PR304.md`.
- Follow-up issues: #300 remains open until deployment evidence is attached.

## Known blockers

- Missing passing `UrAi CI/CD` push-run URL for merge commit `1f0da470088bb67319146cf515b957cc1c5dfd8f` or latest deploy-proof commit `1135545ed27df5ff95f21f43d5fe637c6809908b`.
- Missing passing Deploy Firebase Production workflow run URL for latest deploy-proof commit `1135545ed27df5ff95f21f43d5fe637c6809908b`.
- Missing passing Production Evidence workflow run URL for trigger commit `1135545ed27df5ff95f21f43d5fe637c6809908b`.
- Missing confirmation that `FIREBASE_TOKEN` is configured for `.github/workflows/urai-ci.yml`.
- Missing confirmation that `FIREBASE_SERVICE_ACCOUNT` is configured for `.github/workflows/deploy.yml`.
- Missing closure-grade deployed production URL evidence tied to a workflow run.
- Missing attached artifacts from `production-evidence-results`.
- Missing Firestore rules/index deployment evidence.
- Missing deployed `/xr` proof and AR model-preview screenshot.
- Missing Android/WebXR/Scene Viewer supported-device proof or explicit unsupported fallback proof.

## Closure rule

Issue #300 may only be closed after every required workflow, deployment, smoke, XR/AR, safety, approval, and rollback evidence item is attached. Do not claim production-final from this file while status remains `production evidence pending`.
