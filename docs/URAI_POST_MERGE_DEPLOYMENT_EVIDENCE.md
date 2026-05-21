# URAI Post-Merge Deployment Evidence

Status: production blocked - evidence incomplete
Related issue: #300
Latest merged implementation: PR #299
Merge commit: `d30827f1d4b05c4f8f2624ed12c961dd9bbea4dc`
Last verification attempt: 2026-05-21

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
- Deployed URL: blocked - no deployed production URL attached
- Notes: Closure requires a passing Firebase Hosting live run URL and deployed production URL. A public search for the likely Firebase Hosting domains did not return an indexed deployed URL in this verification context, so production browser smoke cannot be completed without a confirmed deployed URL or workflow artifact.

## Production smoke checklist

Record the exact deployed URL and browser used for each check.

| Check | URL | Browser/device | Result | Evidence |
| --- | --- | --- | --- | --- |
| Home loads | `/` | Desktop | blocked | No deployed production URL/run evidence attached. |
| Home loads | `/` | Mobile | blocked | No deployed production URL/run evidence attached. |
| Home reduced motion | `/` | Desktop reduced motion | blocked | No deployed production URL/run evidence attached. |
| `/home` redirects to `/` | `/home` | Desktop | blocked | No deployed production URL/run evidence attached. |
| Public constellation loads | `/u/adamclamp` | Desktop | blocked | No deployed production URL/run evidence attached. |
| Public constellation loads | `/u/adamclamp` | Mobile | blocked | No deployed production URL/run evidence attached. |
| Waitlist form validates empty email | `/u/adamclamp` | Desktop | blocked | No deployed production URL/run evidence attached. |
| Waitlist form submits configured email | `/u/adamclamp` | Desktop | blocked | No deployed production URL/run evidence attached. |
| Companion fallback responds safely | `/api/companion` or UI path | Desktop | blocked | No deployed production URL/run evidence attached. |

## Data and safety checks

- [ ] No private memory data appears on public constellation routes.
- [ ] Waitlist writes to the intended Firestore collection or dry-run mode is explicitly documented.
- [ ] Firestore rules/index deployment status is recorded.
- [ ] `/home -> /` redirect is verified in the deployed environment.
- [ ] Companion fallback avoids diagnosis, certainty claims, and private-data exposure.
- [ ] Screenshots or recordings are attached to issue #300.

## Release decision

- Release owner: blocked - not recorded
- Verification date: blocked - production evidence incomplete as of 2026-05-21
- Approved for production traffic: no
- Rollback SHA: candidate pre-PR base SHA is `6320abca8952a4b24d7504988c2ca4e7d8be791e`; final rollback SHA must be approved by the release owner before production traffic is declared complete.
- Follow-up issues: #300 remains open until deployment evidence is attached

## Known blockers

- Missing passing `UrAi CI/CD` run URL for `main` / merge commit `d30827f1d4b05c4f8f2624ed12c961dd9bbea4dc`.
- Missing passing Firebase Hosting live run URL.
- Missing confirmation that `FIREBASE_TOKEN` is configured for the workflow requiring it.
- Missing confirmation that `FIREBASE_SERVICE_ACCOUNT_URAI` is configured for the live hosting workflow.
- Missing deployed production URL.
- Missing production smoke evidence for `/`, `/home -> /`, `/u/adamclamp`, waitlist validation/submission, and companion fallback.
- Missing desktop, mobile, and reduced-motion evidence.
- Missing data/safety verification.
- Missing release owner approval.
- Missing approved rollback SHA and rollback command.

## Closure rule

Issue #300 may only be closed after every required workflow, deployment, smoke, safety, approval, and rollback evidence item is attached. Do not claim production-final from this file while status remains `production blocked - evidence incomplete`.