# URAI Wave 1 Shared Foundation Adoption - UrAi App

Status: in_build
Domain: urai.app
Repository: LifeLoggerAI/UrAi
System: UrAi App
Access class: Public

## Purpose

This document locks how the shared URAI network foundation should be applied to the canonical UrAi app repository without confusing the app with the broader Studio, Content, or Labs funnel.

The app remains product-only: Genesis, life-map galaxy, orb companion, Passport, Mirror, memory stars, emotional weather, early access, and app privacy.

## Non-Negotiable Separation Rule

`urai.app` is only for the UrAi app.

Do not place Studio, Content, investor, client, or general ecosystem conversion copy above the fold. Ecosystem references are allowed only as subtle footer links or trust context.

## Shared Foundation Files to Adopt

Copy or port from `LifeLoggerAI/urai-labs-llc`:

- `src/styles/urai-network-system.css`
- `src/lib/urai-attribution.js`
- `src/lib/urai-metadata.js`
- `src/lib/urai-form.js`
- `src/lib/urai-trust.js`
- `src/lib/urai-components.js`
- `scripts/urai-qa-checks.js`
- `scripts/README_URAI_QA_CHECKS.md`

Portal files are not required for public app routes unless an authenticated admin/settings area is added:

- `src/lib/urai-portal-components.js`
- `src/styles/urai-portal-system.css`

## Required Public Routes

- `/`
- `/genesis`
- `/life-map`
- `/passport`
- `/mirror`
- `/early-access`
- `/privacy`
- `/terms`

Optional but useful:

- `/start` as app onboarding only
- `/download` when app distribution is ready

## Homepage Requirements

Hero language should stay app-specific:

> Your life, mapped as a living galaxy.

Primary CTA:

> Join Early Access

Secondary CTA:

> Explore Genesis

Required sections:

- life-map galaxy preview
- orb companion preview
- memory stars
- emotional weather
- Mirror of Becoming preview
- Passport permissions preview
- early access form
- privacy/trust link
- subtle `Built by URAI Labs` footer

## Forms

The early access form should submit as:

- `formType: waitlist`
- destination collection: `waitlist`
- source domain: `urai.app`
- interest type: `urai_app_early_access`

Required captured fields:

- name
- email
- interest category
- consent flag
- attribution payload

## Analytics Events

Required events:

- `urai_app_hero_cta_click`
- `urai_app_genesis_click`
- `urai_app_life_map_click`
- `urai_app_passport_click`
- `urai_app_waitlist_submit`
- `urai_app_privacy_click`

## Privacy Requirements

Every public route must include a visible path to:

- `https://uraiprivacy.com`
- `/privacy`

Passport copy must not overclaim active data controls unless the controls are implemented.

## QA Requirements

Before launch-lock:

- run route/build tests available in the repo
- run the URAI QA check against built/static output where applicable
- verify public pages are indexable
- verify private/admin/test routes are no-indexed if present
- verify no placeholder/debug/demo labels appear in user-facing production routes
- verify mobile layout for the life-map/orb sections
- verify reduced-motion behavior on animated scenes

## Definition of Done

This repository can move from `planning_locked` to `ready_for_review` only when:

- app-only route boundaries are preserved
- shared foundation visual rules are applied
- early access form writes through the shared form path or existing equivalent
- privacy links are visible
- metadata is complete
- CTA and form events are tracked
- QA checks pass
- production/staging URLs and latest commit are recorded in `URAI_LAUNCH_LOCK_REGISTER.md`
