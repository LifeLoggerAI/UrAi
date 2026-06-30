# Deployment

## Hosting target found

Firebase Hosting config points at project and site `urai-4dc1d`.

## Deployment status

Not deployed from this connector session.

## Blocker

The GitHub connector allowed source edits and proof-file commits, but it did not expose a persistent repo checkout, dependency installation, Firebase CLI authenticated session, hosting publish command execution, or live browser verification after deploy.

Because of that, this pass leaves the repo deployment-ready but does not claim the live domain changed.

## Exact deploy commands

Run from an authenticated local or CI environment:

```bash
npm install
npm run typecheck
npm run lint
npm run test -- --passWithNoTests
npm run build
npm run launch:check
firebase deploy --only hosting --project urai-4dc1d
```

After deploy, verify:

```bash
npm run live:check
```

Manual route checks after deploy:

- `/`
- `/home`
- `/ground`
- `/life-map`
- `/xr`
- `/passport`
- `/privacy-controls`
- `/status`

## Final URL

Expected public URL after successful hosting publish: `urai.app`.
