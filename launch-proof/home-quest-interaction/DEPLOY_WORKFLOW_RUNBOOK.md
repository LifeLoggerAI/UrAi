# Home Quest/XR Deploy Workflow Runbook

Use this runbook to execute the manual Firebase Hosting deployment workflow added at:

- `.github/workflows/deploy-home-xr.yml`

This is the operational path from `HOME QUEST/XR PROOF-WIRED` to `HOME QUEST/XR LIVE-SMOKE-PASSED`.

## Required repository secret

The workflow requires this GitHub repository secret:

- `FIREBASE_TOKEN`

Create it from a trusted terminal with Firebase access:

```bash
firebase login:ci
```

Then add the generated token as the repository secret `FIREBASE_TOKEN`.

Optional production Firebase/OpenAI secrets may also be set to replace CI placeholders:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `OPENAI_API_KEY`

## Workflow inputs

When manually running the workflow, use:

- `live_url`: `https://urai-4dc1d.web.app`
- `firebase_project`: `urai-4dc1d`

## What the workflow proves

The workflow must complete all of these before deploy:

- install dependencies
- typecheck
- lint
- unit/rules tests
- production build
- route verification
- asset verification
- public copy check
- production claims check
- Home XR static lock
- Home XR proof manifest check
- Home XR live deploy proof gate
- genesis spine smoke
- Home XR Playwright smoke

Then it deploys Firebase Hosting and runs live URL smoke against the deployed target.

## Required success artifact

The workflow uploads:

- `home-xr-deploy-proof`

The artifact should include:

- Home XR Playwright screenshot proof under `/tmp/urai-playwright-results`
- `home-xr-deploy-proof/deploy-summary.txt`

The deployment summary should include:

- deployed commit SHA
- live URL
- Firebase project
- workflow run URL
- `status=deployed-and-live-smoked`

## Promotion rule

Only after the workflow succeeds may the status be promoted to:

- `HOME QUEST/XR LIVE-SMOKE-PASSED`

Do not promote to:

- `HOME QUEST/XR LIVE-QUEST-VERIFIED`

until the real Quest hardware checklist is also completed.

## Failure rule

If the workflow fails at any step, do not claim deployment success. Record:

- failed step name
- workflow run URL
- failing log excerpt
- commit SHA
- whether the failure is build/test/deploy/live-smoke related

Fix the failure in repo and rerun the workflow.
