# URAI Public Copy + Claims Safety Audit

Generated: 2026-06-25 America/Chicago

## Decision

Public copy is safer after this pass, but the public app is not production-ready and is not final public-demo ready until the updated source is built, visually checked, deployed to staging, and verified live.

## Rules Applied

- Do not claim production readiness without production-lock evidence.
- Do not claim passive sensing, therapy/diagnosis, outbound communications, monetization, autonomous jobs, user-data marketplace, real provider integrations, or user-derived intelligence is live unless privacy and production evidence proves it.
- Public demo language is allowed when it is clearly sample/demo/evidence-gated.
- Roadmap/future language is allowed when clearly labeled.
- CTAs must point somewhere real or be explicitly gated.

## URAI Public Routes Reviewed

| Route / file | Claim posture before | Action |
| --- | --- | --- |
| `src/app/layout.tsx` | Metadata said `Private AI Companion + Symbolic Life Map`, which sounded live | Changed to `URAI Public Demo — Symbolic Life Map` and evidence-gated description |
| `src/app/page.tsx` | Previously fixed in done-done pass to remove dead CTAs and overclaims | Confirmed as public demo / launch-truth posture |
| `src/app/about/page.tsx` | Said `passive magical life OS` | Reframed as public demo for privacy-gated reflection and symbolic Life Map |
| `src/app/launch/page.tsx` | Metadata and body implied private companion/passport systems more strongly than evidence supports | Reframed as public demo, sample data, roadmap/gated systems, and no production-readiness claim |
| `src/components/launch/WaitlistCapture.tsx` | Waitlist suggested users could try a private AI companion and symbolic life map | Reframed as updates and early-access news as private features pass evidence gates |
| `src/app/waitlist/page.tsx` | Already patched in prior pass | Confirmed public-demo / gated roadmap framing |
| `src/components/WaitlistForm.tsx` | Already patched in prior pass | Confirmed direct early-access copy |
| `src/app/privacy/page.tsx` | Reflective/not diagnostic posture present | No source patch needed |
| `src/app/terms/page.tsx` | Early-access and no medical/emergency replacement language present | No source patch needed |
| `README.md` | Mixed demo language with deeper companion/home claims and missing final lock status | Reframed README around sample demo, gated systems, current launch posture, and strict validation |

## External Public Repos Sampled

| Repo | Finding | Action |
| --- | --- | --- |
| `LifeLoggerAI/urai-marketing` | README said `production-lock live deployment` and `production-ready`, stronger than strict current system evidence | Patched README to historical no-domain live evidence / strict production lock incomplete |
| `LifeLoggerAI/B2Bportal` | README said Foundation was `live-foundation` while DNS still resolves to Squarespace | Patched README to `repo-ready / domain-blocked` until live-domain verifier passes |
| `LifeLoggerAI/urai-investors` | README describes production deployment structure but includes pre-production verification steps | No patch in this pass; still should receive a dedicated investor claims/legal review before broad publication |
| `LifeLoggerAI/urai-labs-llc` | README explicitly says stale `SHIP`/`LOCKED` language was removed and launch gates remain open | No patch needed in sampled README |
| `LifeLoggerAI/urai-foundation` | README explicitly says live-domain verification fails while DNS resolves to Squarespace | No patch needed in sampled README |

## Claims Fixed

- Replaced `passive magical life OS` with evidence-gated reflection/public demo language.
- Replaced `Private AI Companion + Symbolic Life Map` metadata with public-demo symbolic Life Map metadata.
- Changed launch page copy so companion, passport, ground, legacy, exports, audio capture, location, health, Gmail, relationships, and provider integrations are not implied live.
- Changed waitlist copy so it promises launch updates and access news, not live private AI companion access.
- Updated README so full passive sensing, therapy/diagnosis, marketplace, AR/VR, B2B, studio/export systems, autonomous jobs, outbound communications, provider integrations, user-derived intelligence, and automated life-logging are explicitly not live in V1 without evidence.
- Updated marketing README to remove strict production-ready posture.
- Updated B2B README to stop labeling Foundation fully live while DNS is unresolved.

## Claims Deferred / Gated

- Passive sensing remains gated.
- Audio/location/health/Gmail/relationship integrations remain gated.
- Therapy-adjacent or clinical claims remain disallowed.
- Outbound communications remain gated.
- Monetization/data marketplace remains gated.
- Autonomous jobs and production analytics remain gated.
- Private AI companion and user-derived intelligence remain gated unless privacy and launch evidence passes.
- Admin/dashboard/login/signup remain gated or waitlist-first.

## Remaining Copy Risks

- The currently deployed live `https://urai.app/system` route still does not show the registry-backed production-lock truth; the patched source must be staged and verified.
- `src/app/life-map/page.tsx` delegates to `SpatialLifeMap`; visual and copy review of that component still requires a working browser/runtime.
- Investor-facing claims in `urai-investors` should receive dedicated legal/securities review before broad publication.
- Marketing, B2B, and Foundation public surfaces should be re-smoked from their live URLs after their README changes are deployed or reflected in site copy.
- The word `companion` can remain only when clearly sample/demo/roadmap/gated; avoid implying a live private AI agent.

## Commands Run

| Command | Result | Reason |
| --- | --- | --- |
| `rg` route/tree copy sweeps | Partial pass | Local tree/path sweep succeeded where files were available; some external repos were accessed through GitHub only |
| `npm run check:production-lock` | Failed before execution in prior and current environment | `npm` is not recognized on PATH |
| `npm run check:system-registry` | Blocked | `npm` unavailable |
| `npm run check:types` / `npm run typecheck` | Blocked | `npm` unavailable |
| `npm run lint` | Blocked | `npm` unavailable |
| `npm run build` | Blocked | `npm` unavailable |
| Visual QA | Blocked | Prior browser runtime failed with Windows sandbox ACL error |

## Required Follow-Up

1. Run the checks in a clean Node 20 environment.
2. Run visual QA for `/`, `/about`, `/launch`, `/waitlist`, `/privacy`, `/terms`, `/life-map`, `/system`, `/dashboard`, `/login`, and `/signup`.
3. Deploy to staging only.
4. Verify live `/system` shows production-lock truth.
5. Re-run claims search against built/staged HTML before any public-demo cutover.
