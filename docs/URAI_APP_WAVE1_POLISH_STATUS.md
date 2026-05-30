# UrAi App Wave 1 Polish Status

Status: in_build
Domain: urai.app
Repo: LifeLoggerAI/UrAi
System: UrAi App

## Purpose

This document tracks the Wave 1 polish pass for `urai.app` as the app-only product surface in the URAI network.

## Non-Negotiable Boundary

`urai.app` is only the UrAi app.

It should focus on:

- Genesis
- life-map galaxy
- orb companion
- memory stars
- emotional weather
- Mirror of Becoming
- Passport
- early access
- app privacy

It should not become:

- URAI Studio
- URAI Content
- URAI Labs corporate HQ
- investor room
- general media funnel
- client services funnel

## Existing Release Infrastructure Found

The app repo already includes launch-grade scripts in `package.json`, including:

- `ci`
- `preflight`
- `launch:check`
- `release:p1`
- `deploy:evidence`
- `live:check`
- `verify:release`
- `verify:release:full`
- `urai:tier1` through `urai:tier5`
- production and staging deploy scripts

Wave 1 polish should use these existing gates instead of replacing them.

## Wave 1 Constants Added

File:

- `src/urai-foundation/wave1-foundation.ts`

Commit:

- `028404dbfb3429a361219f4be7fb581559d59cec`

This locks:

- app-only boundary
- public route expectations
- hero copy
- required app sections
- waitlist form shape
- analytics events
- privacy links
- app launch checklist

## Required App Routes

Confirm or implement:

- `/`
- `/genesis`
- `/life-map`
- `/passport`
- `/mirror`
- `/early-access`
- `/privacy`
- `/terms`

Optional:

- `/start` only if app onboarding/early access, not studio/general funnel
- `/download` when app distribution is ready

## Content Polish Requirements

Every public app route should preserve the app-only story:

> Your life, mapped as a living galaxy.

Required content areas:

- orb companion preview
- life-map galaxy preview
- memory stars
- emotional weather
- Mirror of Becoming
- Passport permissions
- early access form
- visible privacy route
- subtle `Built by URAI Labs` footer

## Form Requirements

Early access should capture:

- name
- email
- interest category
- consent flag
- source domain
- source path
- UTM/source attribution

Preferred form type:

- `waitlist`

Preferred destination:

- `waitlist`

## QA / Evidence Required

Before `urai.app` can be marked ready for Wave 1 review:

- run `npm run preflight`
- run `npm run launch:check`
- run `npm run deploy:evidence` after deployment
- run `npm run live:check` against the deployed site
- verify production URL
- verify staging URL if used
- verify DNS and SSL
- verify early access submission path
- verify app-only boundary across public routes
- verify no debug/demo labels appear in production UI
- verify mobile life-map/orb/galaxy polish
- verify reduced-motion behavior

## Current Blockers

- app route/content inspection still pending
- early access form wiring not yet verified in this Wave 1 pass
- live deployment evidence pending
- DNS/SSL evidence pending
- production/staging verification pending

## Next Step

Inspect current app routes and align any stale public copy with the Wave 1 constants without breaking the canonical app spine.
