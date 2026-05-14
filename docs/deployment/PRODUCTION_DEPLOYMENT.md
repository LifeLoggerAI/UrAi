# URAI Production Deployment

Production URL: `https://www.urai.app`
Firebase Hosting site: `urai-4dc1d`
Primary repository: `LifeLoggerAI/UrAi`

## Required access

- GitHub write access to `LifeLoggerAI/UrAi`.
- Firebase CLI authenticated against the production Firebase project.
- Permission to deploy Hosting, Functions, Firestore rules, Firestore indexes, and Storage rules.
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

Run Functions verification:

```bash
cd functions
npm install
npm run build
cd ..
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

Deploy Firebase surfaces in this order:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
firebase deploy --only functions
firebase deploy --only hosting:urai-4dc1d
```

If the Firebase CLI target alias is configured differently, use the existing project alias rather than creating a new site.

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
- Firebase Function health check endpoint for `healthCheck`.

## Launch criteria

Production is ready only when:

- All validation commands pass.
- Hosting serves the current build.
- Firestore and Storage rules are deployed.
- Functions compile and deploy.
- DNS resolves `www.urai.app` to Firebase Hosting.
- No secrets are committed.
- Demo mode works without privileged credentials.
- Admin-only and server-only data paths are not publicly readable.
