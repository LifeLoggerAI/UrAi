# Command And Live Check Log

Generated: 2026-06-30 America/Chicago
Repo: LifeLoggerAI/UrAi

## Execution limitation

This pass used the GitHub connector plus web fetches. It did not have a checked-out repository terminal, Node 20 runtime, npm, Firebase CLI, browser screenshots, or authenticated deployment shell. Therefore source files were inspected through GitHub and live URLs were checked through web fetches, but install/lint/typecheck/test/build/deploy commands were not executed in this pass.

## Commands required but not executed in this connector-only pass

| Command | Status | Required next proof |
| --- | --- | --- |
| `npm ci` or `npm install` | Not run here | Clean install log on Node 20. |
| `npm run lint` | Not run here | Passing lint log. |
| `npm run typecheck` / `npm run check:types` | Not run here | Passing TypeScript log. |
| `npm test` / `npm run test:unit` | Not run here | Passing Jest log. |
| `npm run test:rules` | Not run here | Passing Firestore rules test log. |
| `npm run test:e2e` / `npm run test:smoke` | Not run here | Passing Playwright route smoke log. |
| `npm run build` | Not run here | Successful Next build log. |
| `npm run preflight` | Not run here | Full preflight log. |
| `npm run smoke:production` | Not run here | Live URL smoke log after deployment. |
| `firebase deploy --only hosting` | Not run here | Deployment target, site, project, release SHA, and hosting URL. |
| `firebase deploy --only firestore:rules,storage` | Not run here | Rules/storage deploy evidence. |

## Web/live checks performed in this pass

| URL | Result | Launch interpretation |
| --- | --- | --- |
| `https://urai.app/` | Redirected to `/home`, public-demo content returned | Live front door exists, but not proof of full production readiness. |
| `https://urai.app/status` | Content returned | Status page says static preview/private actions off. |
| `https://urai.app/life-map` | Content returned, parsed text limited | Route appears present but needs browser/screenshot smoke. |
| `https://urai.app/privacy-controls` | Content returned | Privacy controls page present. |
| `https://urai.app/ground` | 404 | Launch blocker because source route exists and home links to it. |
| `https://urai.app/orb-chat` | Fetch cache miss | Needs live route parity check. |

## Minimum terminal proof needed for launch

```bash
node --version
npm --version
npm ci
npm run check:v1
npm run check:system-registry
npm run check:production-lock
npm run check:firestore-contract
npm run check:public-copy
npm run check:production-claims
npm run validate:completion
npm run typecheck
npm run lint
npm run test:unit
npm run test:rules
npm run build
npm run test:smoke
npm run smoke:production
```

## Minimum deployment proof needed for launch

```bash
firebase use production
firebase target:apply hosting urai-4dc1d urai-4dc1d
firebase deploy --only hosting
firebase deploy --only firestore:rules,firestore:indexes,storage
npm run smoke:production
npm run deploy:evidence
```

Capture stdout/stderr, deployment URL, Firebase project, Firebase site, release version, deployed commit SHA, rollback target, and monitoring alert links in this folder before flipping verdict to READY.
