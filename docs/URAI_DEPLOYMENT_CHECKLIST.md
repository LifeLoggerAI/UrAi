# URAI Genesis Deployment Checklist

Deploy URAI Genesis only when each gate below is satisfied.

## Identity and stack

- Confirm repository is `LifeLoggerAI/UrAi`.
- Confirm branch and commit intended for deployment.
- Confirm Firebase target before deployment with `npm run check:firebase` or the environment-specific Firebase target check.
- Confirm the application stack from `package.json`: Next.js, React, Firebase, Three.js, React Three Fiber, Jest, Playwright, and TypeScript.

## Secret safety

- Do not commit `.env.local`, service account JSON, private keys, tokens, or Firebase Admin credentials.
- Review diffs for secrets before deployment.
- Keep server-only Firebase Admin logic out of client bundles.

## Required checks

Run the repository's own scripts before any deploy:

```bash
npm install
npm run doctor
npm run check:v1
npm run check:genesis
npm run check:firestore-contract
npm run check:public-copy
npm run validate:completion
npm run typecheck
npm run lint
npm run test:unit
npm run test:rules
npm run build
```

For launch confidence, run:

```bash
npm run launch:check
npm run preflight
```

Browser smoke coverage should be run when Playwright dependencies are available:

```bash
npx playwright install --with-deps chromium
npm run test:smoke
npm run test:e2e
```

## Production UI review

- No placeholder, demo, debug, or dev labels appear in production UI.
- The home/world remains cinematic, minimal, spatial, and polished.
- Permission controls exist for sensitive systems.
- URAI Passport is accessible.
- The orb and Council wording is consistent.
- "OS Crew" does not appear in visible UI.
- URAI remains ad-free.

## Safety review

- Sensitive insights are worded as signals or patterns.
- No medical, diagnostic, deception, relationship, or crisis claims are presented as fact.
- Social intelligence requires explicit permission.
- Facial/environment and audio/transcription features require explicit permission.
- Export and deletion controls are present or safely documented as scaffolded.

## Deploy commands

Use only commands already present in `package.json` and only after checks pass:

```bash
npm run deploy:hosting
npm run deploy
npm run ship:urai:staging
npm run ship:urai:prod
```

Do not guess deploy commands. Prefer staging first when Firebase target identity is uncertain.

## Deployment evidence

After deployment, record:

- repo name
- git remote
- branch
- commit SHA
- Firebase project/site
- checks run and results
- deploy command used
- live URL
- known safe scaffolds
- blockers, if any
