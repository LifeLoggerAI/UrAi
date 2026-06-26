# URAI Visual QA Final Sweep

Generated: 2026-06-25 America/Chicago

## Decision

Visual QA final sweep: BLOCKED.

No final visual pass can be claimed because screenshots could not be captured in this environment.

## Intended Coverage

Required viewports:

- Desktop: 1440x900
- Tablet: 768x1024
- Mobile: 390x844

Required launch-critical routes:

- `/`
- `/home`
- `/system`
- `/life-map`
- `/dashboard`
- `/login`
- `/signup`
- `/waitlist`
- `/privacy`
- `/terms`
- `/demo`

## Environment Blocker

The in-app browser/runtime failed during screenshot capture with:

```text
windows sandbox failed: helper_unknown_error: apply deny-read ACLs
```

A minimal browser retry failed with the same sandbox error. Therefore no screenshot evidence is claimed for this pass.

## HTTP-Level Route Evidence

The following routes returned HTTP 200 during the final sweep:

| Route | HTTP status | Visual readiness |
| --- | --- | --- |
| `/` | 200 | Not visually verified in this pass |
| `/home` | 200 | Not visually verified in this pass |
| `/system` | 200 | Blocking content mismatch; does not show production-lock truth live |
| `/life-map` | 200 | Not visually verified in this pass |
| `/dashboard` | 200 | Repo-side gated route added after live smoke; needs deploy and screenshot proof |
| `/login` | 200 | Repo-side gated route added after live smoke; needs deploy and screenshot proof |
| `/signup` | 200 | Repo-side gated route added after live smoke; needs deploy and screenshot proof |
| `/waitlist` | 200 | Repo-side copy fixed; needs deploy and screenshot proof |
| `/privacy` | 200 | Not visually verified in this pass |
| `/terms` | 200 | Not visually verified in this pass |
| `/demo` | 200 | Not visually verified in this pass |

## Repo-Side Visual / UX Fixes Made

| Route / file | Fix |
| --- | --- |
| `/` / `src/app/page.tsx` | Replaced prototype/dead-button surface with launch-safe public demo hero, clear CTAs, privacy/system links, and gated-system warning |
| `/waitlist` / `src/app/waitlist/page.tsx` | Reframed waitlist as public demo and evidence-gated roadmap updates |
| `src/components/WaitlistForm.tsx` | Removed vague `signal` status language and private-feature overclaim copy |
| `/dashboard` / `src/app/dashboard/page.tsx` | Added explicit gated dashboard page |
| `/login` / `src/app/login/page.tsx` | Added explicit gated login page |
| `/signup` / `src/app/signup/page.tsx` | Added explicit waitlist-first signup page |

## Remaining Visual Launch Blockers

- Capture desktop/tablet/mobile screenshots after the repo-side fixes are deployed to staging.
- Verify `/system` visually shows registry and production-lock truth.
- Verify `/life-map` does not look like an unfinished prototype on mobile.
- Verify `/dashboard`, `/login`, and `/signup` show the new gated pages, not a fallback shell.
- Verify `/waitlist` form loading/success/error states visually.
- Verify no top-nav/homepage CTA points to `/ground` or any missing/deferred live route.
- Verify privacy and terms remain readable on mobile.

## Final Visual QA Recommendation

NO-GO until screenshots exist and the registry-backed `/system` route is live in staging.
