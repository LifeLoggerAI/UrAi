# URAI Production Deployment

Production URL: `https://www.urai.app`
Firebase Hosting site: `urai-4dc1d`
Primary repository: `LifeLoggerAI/UrAi`

## Required access

- GitHub write access to `LifeLoggerAI/UrAi`.
- Firebase CLI authenticated against the production Firebase project.
- Permission to deploy Hosting, Firestore rules, Firestore indexes, and Storage rules.
- Functions remain gated for Genesis and must not be deployed until their package/import blockers are fixed and independently verified.
- DNS access for `urai.app` / `www.urai.app` if domain verification or records need updates.

## Pre-deploy verification

Run from the repo root:

```bash
npm install
npm run validate:completion
npm run check:v1
npm run typecheck
npm run lint
npm run test:unit
npm run test:rules
npm run build
```

Run browser smoke coverage when Chromium is available:

```bash
npx playwright install --with-deps chromium
npm run test:smoke
```

## Firebase preview deploy

Use a preview channel before production:

```bash
firebase hosting:channel:deploy urai-completion-preview --site urai-4dc1d
```

Verify the preview URL with the post-deploy checklist.

## Production deploy

Deploy only the Genesis-approved Firebase surfaces:

```bash
npm exec --yes firebase-tools -- deploy --project urai-4dc1d --config firebase.json --only firestore:rules,firestore:indexes,storage,hosting
```

Do not deploy Functions as part of the Genesis launch. If the Firebase CLI target alias is configured differently, use the existing project alias rather than creating a new site.

## Post-deploy checks

Run:

```bash
npm run verify:release
```

Then manually verify:

- `https://www.urai.app/`
- `https://www.urai.app/u/adamclamp`
- `https://www.urai.app/status`
- `https://www.urai.app/privacy`
- `https://www.urai.app/terms`
- Functions are intentionally gated and are not part of Genesis live smoke evidence.

## Launch criteria

Production is ready only when:

- All validation commands pass.
- Hosting serves the current build.
- Firestore and Storage rules are deployed.
- Functions remain gated until package/import blockers are fixed, tests pass, and a separate deploy/smoke record exists.
- DNS resolves `www.urai.app` to Firebase Hosting.
- No secrets are committed.
- Demo mode works without privileged credentials.
- Admin-only and server-only data paths are not publicly readable.
