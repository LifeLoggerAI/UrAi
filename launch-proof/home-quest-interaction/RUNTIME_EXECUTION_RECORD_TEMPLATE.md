# Home XR Runtime Execution Record Template

Use this file as the copy/paste template after running the deployment and device validation path.

## Run metadata

- Date/time:
- Operator:
- Tested commit SHA:
- Branch:

## Repository proof chain

- Command: `node scripts/check-home-xr-proof-chain.mjs`
- Result:
- Notes:

## CI proof

- CI workflow name:
- CI run URL:
- Result:
- Failed step, if any:

## Deployment proof

- Deploy workflow name:
- Deploy workflow run URL:
- Firebase project:
- Live URL:
- Result:
- Artifact name:
- Artifact notes:

## Live smoke proof

- Command or workflow step:
- `/` result:
- `/home` result:
- `/xr` result:
- `/life-map` result:
- Notes:

## Screenshot proof

- Desktop screenshot:
- Mobile screenshot:
- Mocked XR affordance screenshot:
- Artifact URL or location:

## Device validation proof

- Device/browser:
- Session support observed:
- Controller ray observed:
- Trigger select observed:
- Grip/back behavior observed:
- No-controller fallback observed:
- Notes:

## Final status decision

Choose one:

- Repository proof only
- CI green
- Live smoke passed
- Device verified
- Blocked

## Blockers

- Blocker 1:
- Blocker 2:
- Blocker 3:

## Signoff

- Operator signature:
- Date/time:
