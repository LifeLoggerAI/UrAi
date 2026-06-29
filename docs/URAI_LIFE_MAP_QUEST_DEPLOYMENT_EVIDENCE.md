# URAI Life Map Quest Deployment Evidence

Status: route reachable, repo proof-wired, live Quest verification pending
Route: `/life-map`
Feature scope: progressive WebXR enhancement for Life Map only

## Claim boundary

Do not claim Life Map Quest, VR, XR, or DONE DONE production readiness until this document contains concrete CI, deployment, browser, Playwright, and physical Quest evidence.

Allowed current status labels:

- `LIFE MAP QUEST ROUTE-REACHABLE`
- `LIFE MAP QUEST INTERACTION PROOF-WIRED`
- `LIFE MAP QUEST LIVE-SMOKE-PASSED`
- `LIFE MAP QUEST LIVE-QUEST-VERIFIED`

Blocked until verified:

- `DONE DONE`
- `Quest ready`
- `VR ready`
- `production XR`
- `full Quest support`

## Repo proof gates

Required scripts:

- `npm run smoke:life-map-quest`
- `npm run smoke:life-map-quest-proof`
- `npm run smoke:life-map-quest-live-proof`
- `npm run smoke:life-map-quest-live` with a deployed URL environment variable

Required CI steps:

- Check Life Map Quest static lock
- Check Life Map Quest proof manifest
- Check Life Map Quest live deploy proof gate
- Run Life Map XR smoke checks
- Optional deployed Life Map Quest URL smoke

## Deployment evidence required

Fill these only after deployment is verified:

- Production URL:
- Firebase URL:
- Deployed commit SHA:
- Deployment workflow run URL:
- CI workflow run URL:
- Production evidence workflow run URL:
- Playwright artifact URL:
- Browser console evidence URL:
- Quest Browser evidence URL:

## Route smoke checklist

- [ ] `/` returns HTTP 200 or redirects to `/home` successfully.
- [ ] `/home` returns HTTP 200.
- [ ] `/xr` returns HTTP 200.
- [ ] `/life-map` returns HTTP 200.
- [ ] `/life-map` hydrates in a real browser.
- [ ] `/life-map` mounts the Life Map canvas.
- [ ] `/life-map` keeps non-XR desktop navigation usable.
- [ ] `/life-map` does not display a fake VR entry on unsupported desktop/mobile browsers.
- [ ] Public copy avoids unverified Quest/VR/XR readiness claims.

## Playwright evidence required

- [ ] Desktop `/life-map` screenshot artifact exists.
- [ ] Mobile `/life-map` screenshot artifact exists.
- [ ] Browser console has no blocking runtime errors.
- [ ] Playwright run URL is attached.
- [ ] Artifact archive is attached or linked.

## Quest hardware evidence required

- [ ] Meta Quest Browser reaches deployed `/life-map`.
- [ ] VR entry appears only after real `immersive-vr` support is reported.
- [ ] VR session starts from deployed `/life-map`.
- [ ] Left controller ray is visible.
- [ ] Right controller ray is visible.
- [ ] Controller ray hover selects or highlights the focused star.
- [ ] Trigger selects the focused Life Map star.
- [ ] Selected star detail panel appears in VR.
- [ ] Grip/back closes or clears the selected panel.
- [ ] VR menu trigger navigation works.
- [ ] Desktop/mobile controls still work after exiting VR.

## Current external route observation

A text-level public fetch confirmed the production root and `/life-map` routes are reachable. The `/life-map` response was an app shell/loading response, which proves reachability but not hydration, canvas mount, WebXR behavior, controller behavior, or headset operation.

## Closure rule

Do not mark this feature live-working, production XR, Quest ready, or DONE DONE until every deployment, browser, Playwright, and Quest hardware evidence item above is attached or linked.
