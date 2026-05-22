# URAI Post-Merge Deployment Evidence

Status: production evidence pending - repo gates green and PR #304 merged
Related issue: #300
Latest merged implementation: PR #304
Merge commit: `1f0da470088bb67319146cf515b957cc1c5dfd8f`
PR head verified before merge: `9c7528f0b02cd5374c33fc0a2163cd449e7e8161`
Last verification attempt: 2026-05-22

This document captures deployment evidence after a `main` release. Do not mark production launch complete until the required workflow, Firebase, browser, mobile, reduced-motion, safety, and rollback checks are filled in with concrete results.

## Implementation merged

PR #304 was squash-merged into `main` as `1f0da470088bb67319146cf515b957cc1c5dfd8f`.

Merged changes:

- Added `src/app/ochat/page.tsx`.
- Canonicalized `src/app/page.tsx` so `/` renders the home page directly while preserving the Tier 1 root shell signal.
- Aligned `package.json` with the existing lockfile by removing the stale direct `rimraf` dependency and replacing `npm run clean` with native `rm -rf`.
- Updated `tests/e2e/v1-smoke.spec.ts` for the final canonical home/orb label contract.
- Updated `tests/e2e/v1-production-smoke.spec.ts` to avoid strict-mode collisions where final UI and smoke-contract orb controls share the same valid accessible label.
- Updated `src/components/urai/HomeWorldSmokeContract.tsx` to expose required launch smoke anchors without reintroducing `Final Home Field`.

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
- Result: pending - no post-merge `main` run URL attached yet
- Required secret checked by workflow: `FIREBASE_TOKEN`
- Firebase deploy result: pending - no deploy output attached yet
- Notes: This workflow runs on push to `main` and includes `Validate Firebase Secrets` plus `firebase deploy --token "$FIREBASE_TOKEN"` when `github.ref == 'refs/heads/main'`. The connected GitHub tool available in this session could verify PR-triggered workflow runs, but did not expose a post-merge push-run listing for the merge commit.

### Deploy Firebase Production workflow

- Workflow file: `.github/workflows/deploy.yml`
- Trigger expected: `push` to `main` because PR #304 changed `src/**`, `package.json`, and `tests/e2e/**`
- Merge commit SHA: `1f0da470088bb67319146cf515b957cc1c5dfd8f`
- Result: pending - no production deploy workflow run URL attached yet
- Required secret checked by workflow: `FIREBASE_SERVICE_ACCOUNT`
- Firebase project: `urai-4dc1d`
- Firebase Hosting target: `hosting:urai-4dc1d`
- Workflow production URL: `https://urai-4dc1d.web.app`
- Notes: The workflow validates the Firebase target, builds the app, deploys hosting with `npx firebase-tools@15.18.0 deploy --only hosting:urai-4dc1d --project urai-4dc1d --non-interactive`, checks `/`, `/home`, and `/api/status`, installs Playwright Chromium, and runs `npm run test:smoke:production`.

### Firebase Hosting live

- Workflow file: `.github/workflows/firebase-hosting-live.yml` if present/configured
- Trigger used: pending - not verified through connected GitHub tool
- Run URL: pending
- Commit SHA: `1f0da470088bb67319146cf515b957cc1c5dfd8f`
- Result: pending
- Firebase project: `urai-4dc1d`
- Hosting channel: `live`
- Deployed URLs to verify:
  - `https://www.urai.app/`
  - `https://urai-4dc1d.web.app/`

## Production smoke checklist

Record the exact deployed URL and browser/device used for each check.

| Check | URL | Browser/device | Result | Evidence |
| --- | --- | --- | --- | --- |
| Home loads | `https://www.urai.app/` | Desktop | pending | Need browser evidence after deploy. |
| Home loads | `https://urai-4dc1d.web.app/` | Desktop | pending | Need Firebase Hosting evidence after deploy. |
| Home loads | `/` | Mobile | pending | Need mobile browser evidence. |
| Home reduced motion | `/` | Desktop reduced motion | pending | Need reduced-motion browser evidence. |
| `/home` redirects to `/` | `/home` | Desktop | pending | Deploy workflow checks this path; attach run URL/output. |
| Public constellation loads | `/u/adamclamp` | Desktop | pending | Need production browser proof. |
| Public constellation loads | `/u/adamclamp` | Mobile | pending | Need mobile browser proof. |
| Waitlist form validates empty email | `/u/adamclamp` | Desktop | pending | Need production browser proof. |
| Waitlist form submits configured email | `/u/adamclamp` | Desktop | pending | Need production browser proof or explicit dry-run proof. |
| Companion fallback responds safely | `/api/companion` or UI path | Desktop | pending | Need production API/UI proof. |
| `/ochat` loads | `/ochat` | Desktop | pending | Need production browser proof after PR #304 deploy. |

## Data and safety checks

- [ ] No private memory data appears on public constellation routes.
- [ ] Waitlist writes to the intended Firestore collection or dry-run mode is explicitly documented.
- [ ] Firestore rules/index deployment status is recorded.
- [ ] `/home -> /` redirect is verified in the deployed environment.
- [ ] `/ochat` loads and returns safely to `/home` and `/life-map`.
- [ ] Companion fallback avoids diagnosis, certainty claims, and private-data exposure.
- [ ] Screenshots or recordings are attached to issue #300.

## Release decision

- Release owner: pending
- Verification date: pending - production evidence incomplete as of 2026-05-22
- Approved for production traffic: pending
- Rollback SHA: pre-PR #304 base SHA is `115c0548167818967dc955fc616d0302f93a2452`; final rollback SHA must be approved by the release owner before production traffic is declared complete.
- Follow-up issues: #300 remains open until deployment evidence is attached.

## Known blockers

- Missing passing `UrAi CI/CD` push-run URL for merge commit `1f0da470088bb67319146cf515b957cc1c5dfd8f`.
- Missing passing Deploy Firebase Production workflow run URL for merge commit `1f0da470088bb67319146cf515b957cc1c5dfd8f`.
- Missing confirmation that `FIREBASE_TOKEN` is configured for `.github/workflows/urai-ci.yml`.
- Missing confirmation that `FIREBASE_SERVICE_ACCOUNT` is configured for `.github/workflows/deploy.yml`.
- Missing closure-grade deployed production URL evidence tied to a workflow run.
- Missing production smoke evidence for `/`, `/home -> /`, `/ochat`, `/u/adamclamp`, waitlist validation/submission, and companion fallback.
- Missing desktop screenshot, mobile evidence, and reduced-motion evidence.
- Missing data/safety verification.
- Missing release owner approval.
- Missing approved rollback command.

## Closure rule

Issue #300 may only be closed after every required workflow, deployment, smoke, safety, approval, and rollback evidence item is attached. Do not claim production-final from this file while status remains `production evidence pending`.
