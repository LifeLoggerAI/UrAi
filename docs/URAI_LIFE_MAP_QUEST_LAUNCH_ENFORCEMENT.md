# URAI Life Map Quest Launch Enforcement

Status: launch/deploy proof gate documented
Route: `/life-map`

## Required launch gate commands

The normal launch gate must run these checks before production deployment can be considered release-ready:

- `node scripts/deployment-evidence-check.mjs`
- `npm run smoke:life-map-quest`
- `npm run smoke:life-map-quest-proof`
- `npm run smoke:life-map-quest-live-proof`

## Required deploy path

The normal deploy command must continue to run `npm run launch:check` before Firebase deployment.

Production closure must not be claimed from a deployment-only command, hosting target, public route response, or app shell alone. Closure requires the launch gate, deployed route checks, production evidence workflow artifacts, browser hydration proof, and physical Quest Browser evidence.

## Required release evidence

Attach or link:

- launch gate output,
- deployment workflow output,
- production evidence workflow output,
- Life Map Quest production evidence artifact,
- deployed `/life-map` browser screenshot,
- desktop and mobile Playwright screenshots,
- browser console proof,
- physical Meta Quest Browser controller proof.

## Blocked claims

Do not claim `Quest ready`, `VR ready`, `production XR`, `full Quest support`, or `DONE DONE` until the required release evidence is attached.
