# URAI Post-Merge Deployment Evidence

Status: template
Related issue: #300
Latest merged implementation: PR #299
Merge commit: `d30827f1d4b05c4f8f2624ed12c961dd9bbea4dc`

Use this document to capture deployment evidence after a `main` release. Do not mark a release complete until the required workflow, Firebase, and browser checks are filled in with concrete results.

## Deployment workflow evidence

### UrAi CI/CD

- Workflow file: `.github/workflows/urai-ci.yml`
- Trigger used: `push to main` / `workflow_dispatch`
- Run URL:
- Commit SHA:
- Result: pending
- Required secret checked: `FIREBASE_TOKEN`
- Firebase deploy result:
- Notes:

### Firebase Hosting live

- Workflow file: `.github/workflows/firebase-hosting-live.yml`
- Trigger used: `push to main` / `workflow_dispatch`
- Run URL:
- Commit SHA:
- Result: pending
- Required secret checked: `FIREBASE_SERVICE_ACCOUNT_URAI`
- Firebase project: `urai-4dc1d`
- Hosting channel: `live`
- Deployed URL:
- Notes:

## Production smoke checklist

Record the exact deployed URL and browser used for each check.

| Check | URL | Browser/device | Result | Evidence |
| --- | --- | --- | --- | --- |
| Home loads | `/` | Desktop | pending | |
| Home loads | `/` | Mobile | pending | |
| Home reduced motion | `/` | Desktop reduced motion | pending | |
| `/home` redirects to `/` | `/home` | Desktop | pending | |
| Public constellation loads | `/u/adamclamp` | Desktop | pending | |
| Public constellation loads | `/u/adamclamp` | Mobile | pending | |
| Waitlist form validates empty email | `/u/adamclamp` | Desktop | pending | |
| Waitlist form submits configured email | `/u/adamclamp` | Desktop | pending | |
| Companion fallback responds safely | `/api/companion` or UI path | Desktop | pending | |

## Data and safety checks

- [ ] No private memory data appears on public constellation routes.
- [ ] Waitlist writes to the intended Firestore collection or dry-run mode is explicitly documented.
- [ ] Firestore rules/index deployment status is recorded.
- [ ] `/home -> /` redirect is verified in the deployed environment.
- [ ] Companion fallback avoids diagnosis, certainty claims, and private-data exposure.
- [ ] Screenshots or recordings are attached to issue #300.

## Release decision

- Release owner:
- Verification date:
- Approved for production traffic: yes / no
- Rollback SHA:
- Follow-up issues:

## Known blockers

List blockers here rather than implying production completion.

- 
