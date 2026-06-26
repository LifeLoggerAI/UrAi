# URAI Visual QA Final Sweep

Generated: 2026-06-25 America/Chicago
Updated: 2026-06-25T23:54:00-05:00

## Decision

Visual QA final sweep: BLOCKED.

No final visual pass can be claimed because staging deploy did not complete and screenshots were not captured in this environment.

## Intended Coverage

Required viewports:

- Desktop: 1440x900
- Tablet: 768x1024
- Mobile: 390x844

Required launch-critical routes:

- `/`
- `/system`
- `/life-map`
- `/dashboard`
- `/login`
- `/signup`
- `/waitlist`
- `/privacy`
- `/terms`

## Evidence Captured Instead

- Local direct Next build passed and emitted `.next/server/app/system.html`.
- Built `/system` contains `URAI release truth`, registry timestamp, production lock fields, Genesis Spine, and deferred/gated system sections.
- Existing staging `/system` returns 404 and cannot be visually accepted.
- Existing production `/system` returns 200 but serves the stale Spatial root/home bundle and cannot be visually accepted.

## Environment And Evidence Blockers

- Firebase staging deploy failed before deployment with `Failed to authenticate, have you run firebase login?`.
- The in-app browser/runtime previously failed screenshot capture with `windows sandbox failed: helper_unknown_error: apply deny-read ACLs`.
- No `test:visual` npm script exists in `package.json`.
- Existing staging routes `/signup`, `/login`, and `/dashboard` return 404 and need the latest commit deployed before visual QA.

## Remaining Visual Launch Blockers

- Deploy commit `f6931174fd4bf81f8a57a624fa080b542938c179` to `urai-staging`.
- Verify `/system` visually shows registry and production-lock truth.
- Verify `/life-map` is clearly demo/gated where appropriate.
- Verify `/dashboard`, `/login`, and `/signup` show gated/demo-safe pages, not fallback shells.
- Verify `/waitlist` form loading/success/error states visually.
- Verify privacy and terms remain readable on mobile.

## Final Visual QA Recommendation

NO-GO until staging screenshots or equivalent browser evidence exist and the registry-backed `/system` route is live in staging.
