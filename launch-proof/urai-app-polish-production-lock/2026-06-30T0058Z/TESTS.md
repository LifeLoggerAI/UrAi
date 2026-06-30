# Tests

## Executed in this connector session

Repository write verification only:

- Fetched `package.json` to confirm scripts and framework.
- Fetched `firebase.json` and `.firebaserc` to confirm Firebase Hosting project/site config.
- Fetched route/component files to confirm app-router wiring.
- Fetched updated `src/components/urai/home/NewHomeScene.tsx` after write to confirm the new component content landed on `main`.
- Fetched updated `src/app/page.tsx` after write to confirm the public root now renders `NewHomeScene`.

## Not executed here

The following commands were not run inside this connector-only session because no repository checkout, npm install, Node runtime, browser runner, or Firebase CLI session was available through the GitHub connector:

```bash
npm install
npm run typecheck
npm run lint
npm run test
npm run build
npm run verify:routes
npm run launch:check
firebase deploy --only hosting
```

## Required local/CI verification before public deploy

Run:

```bash
npm install
npm run typecheck
npm run lint
npm run test -- --passWithNoTests
npm run build
npm run verify:routes
npm run launch:check
```

Then launch a local preview and manually verify desktop, tablet, and mobile widths for `/`, `/home`, `/ground`, `/life-map`, `/xr`, `/passport`, `/privacy-controls`, and `/status`.
