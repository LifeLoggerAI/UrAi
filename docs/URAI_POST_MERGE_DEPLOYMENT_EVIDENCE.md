# URAI Post-Merge Deployment Evidence

Status: production blocked - evidence incomplete
Related issue: #300
Latest merged implementation: PR #299
Merge commit: `d30827f1d4b05c4f8f2624ed12c961dd9bbea4dc`
Last verification attempt: 2026-05-22

This document captures deployment evidence after a `main` release. Do not mark this release complete until the required workflow, Firebase, and browser checks are filled in with concrete results.

## Deployment workflow evidence

### UrAi CI/CD

- Workflow file: `.github/workflows/urai-ci.yml`
- Trigger used: not verified through connected GitHub tool
- Run URL: blocked - no run URL attached
- Commit SHA: `d30827f1d4b05c4f8f2624ed12c961dd9bbea4dc`
- Result: blocked - no post-merge `main` workflow evidence attached
- Required secret checked: `FIREBASE_TOKEN` - not verifiable from this context
- Firebase deploy result: blocked - no deploy evidence attached
- Notes: A connected GitHub workflow lookup for merge commit `d30827f1d4b05c4f8f2624ed12c961dd9bbea4dc` returned no workflow-run evidence. This does not prove the workflow never ran; it means no closure-grade run evidence is currently attached or visible through the connected tool.

### Firebase Hosting live

- Workflow file: `.github/workflows/firebase-hosting-live.yml`
- Trigger used: not verified through connected GitHub tool
- Run URL: blocked - no run URL attached
- Commit SHA: `d30827f1d4b05c4f8f2624ed12c961dd9bbea4dc`
- Result: blocked - no Firebase Hosting live evidence attached
- Required secret checked: `FIREBASE_SERVICE_ACCOUNT_URAI` - not verifiable from this context
- Firebase project: `urai-4dc1d`
- Hosting channel: `live`
- Deployed URL: partial evidence found for `https://www.urai.app/`; closure still blocked without deploy workflow run URL and full smoke evidence.
- Notes: Internal deployment docs identify `https://www.urai.app` as the production URL and Firebase Hosting site `urai-4dc1d`. Web fetches on 2026-05-21 and 2026-05-22 returned a live URAI Spatial home shell at `https://www.urai.app/` with visible text including `URAI Spatial`, `Home`, `Tier 1 / Canonical Shell`, and `Home → LifeMap → Focus → Replay`. Subroute verification remained blocked in this context: the web tool could not safely open `/home`, `/api/status`, `/u/adamclamp`, or the Firebase default hosting URL.

### Deploy Firebase Production workflow

- Workflow file: `.github/workflows/deploy.yml`
- Trigger used: not verified through connected GitHub tool
- Run URL: blocked - no run URL attached
- Commit SHA: `d30827f1d4b05c4f8f2624ed12c961dd9bbea4dc`
- Result: blocked - no post-merge production deploy workflow evidence attached
- Required secret checked: `FIREBASE_SERVICE_ACCOUNT` - not verifiable from this context
- Firebase project: `urai-4dc1d`
- Firebase Hosting target: `hosting:urai-4dc1d`
- Workflow production URL: `https://urai-4dc1d.web.app`
- Notes: `.github/workflows/deploy.yml` is an additional production deploy workflow. It validates the Firebase target, builds the app, deploys hosting with `npx firebase-tools@15.18.0 deploy --only hosting:urai-4dc1d --project urai-4dc1d --non-interactive`, checks `https://urai-4dc1d.web.app/`, `/home`, and `/api/status`, installs Playwright Chromium, and runs `npm run test:smoke:production`. A web fetch for `https://urai-4dc1d.web.app/` failed in this verification context, so it is not closure-grade production evidence.

## Production smoke checklist

Record the exact deployed URL and browser used for each check.

| Check | URL | Browser/device | Result | Evidence |
| --- | --- | --- | --- | --- |
| Home loads | `https://www.urai.app/` | Web fetch | partial pass | 2026-05-22 web fetch returned URAI Spatial home shell text: `URAI Spatial`, `Home`, `Tier 1 / Canonical Shell`, `Home → LifeMap → Focus → Replay`. Closure still blocked without workflow run evidence and browser screenshot. |
| Home loads | `/` | Mobile | blocked | No mobile browser evidence attached. |
| Home reduced motion | `/` | Desktop reduced motion | blocked | No reduced-motion browser evidence attached. |
| `/home` redirects to `/` | `/home` | Desktop | blocked | Web tool could not safely open this subroute in the current context; no production redirect proof attached. |
| Public constellation loads | `/u/adamclamp` | Desktop | blocked | Web tool could not fetch this subroute in the current context; no production browser proof attached. |
| Public constellation loads | `/u/adamclamp` | Mobile | blocked | No mobile browser evidence attached. |
| Waitlist form validates empty email | `/u/adamclamp` | Desktop | blocked | No production browser proof attached. |
| Waitlist form submits configured email | `/u/adamclamp` | Desktop | blocked | No production browser proof attached. |
| Companion fallback responds safely | `/api/companion` or UI path | Desktop | blocked | No production API/UI proof attached. |

## Data and safety checks

- [ ] No private memory data appears on public constellation routes.
- [ ] Waitlist writes to the intended Firestore collection or dry-run mode is explicitly documented.
- [ ] Firestore rules/index deployment status is recorded.
- [ ] `/home -> /` redirect is verified in the deployed environment.
- [ ] Companion fallback avoids diagnosis, certainty claims, and private-data exposure.
- [ ] Screenshots or recordings are attached to issue #300.

## Release decision

- Release owner: blocked - not recorded
- Verification date: blocked - production evidence incomplete as of 2026-05-22
- Approved for production traffic: no
- Rollback SHA: candidate pre-PR base SHA is `6320abca8952a4b24d7504988c2ca4e7d8be791e`; final rollback SHA must be approved by the release owner before production traffic is declared complete.
- Follow-up issues: #300 remains open until deployment evidence is attached

## Known blockers

- Missing passing `UrAi CI/CD` run URL for `main` / merge commit `d30827f1d4b05c4f8f2624ed12c961dd9bbea4dc`.
- Missing passing Firebase Hosting live run URL.
- Missing passing Deploy Firebase Production workflow run URL.
- Missing confirmation that `FIREBASE_TOKEN` is configured for the workflow requiring it.
- Missing confirmation that `FIREBASE_SERVICE_ACCOUNT_URAI` is configured for the live hosting workflow.
- Missing confirmation that `FIREBASE_SERVICE_ACCOUNT` is configured for `.github/workflows/deploy.yml`.
- Missing closure-grade deployed production URL evidence tied to a workflow run.
- Missing production smoke evidence for `/home -> /`, `/u/adamclamp`, waitlist validation/submission, and companion fallback.
- Missing desktop screenshot, mobile evidence, and reduced-motion evidence.
- Missing data/safety verification.
- Missing release owner approval.
- Missing approved rollback SHA and rollback command.

## Closure rule

Issue #300 may only be closed after every required workflow, deployment, smoke, safety, approval, and rollback evidence item is attached. Do not claim production-final from this file while status remains `production blocked - evidence incomplete`.