# URAI V1 Public Demo Smoke Evidence

Date: 2026-05-22
Owner: Adam Clamp
Repo: LifeLoggerAI/UrAi
Related issue: #300

## Current verdict

Status: PRODUCTION BLOCKED

Repo-side implementation and production-evidence workflow scaffolding exist. Closure still requires a completed Production Evidence workflow comment on Issue #300 with run URL and artifact URL.

## Canonical public surface

URAI V1 launches as the memory-world public demo surface.

- `/` is the V1 public root.
- `/home` is the deeper memory-world surface.
- `/u/adamclamp` is the public demo constellation.
- `/api/companion` is the companion smoke endpoint.
- `/api/waitlist` is the waitlist smoke endpoint.
- `/spatial` is a gated Spatial preview surface.
- `/api/spatial/health` is the Spatial readiness endpoint.

## Required route evidence

- [ ] `/` deployed route loads.
- [ ] `/home` deployed route follows the launch contract.
- [ ] `/u/adamclamp` loads public-safe demo content.
- [ ] `/api/companion` returns a safe response.
- [ ] `/api/waitlist` handles invalid and valid submissions correctly.
- [ ] `/spatial` loads as a preview surface.
- [ ] `/api/spatial/health` returns readiness JSON.

## Required command evidence

- [ ] `npm install`
- [ ] `npm run check:v1`
- [ ] `npm run check:firestore-contract`
- [ ] `npm run seed:demo`
- [ ] `npm run test:unit`
- [ ] `npm run check:types`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm run preflight`
- [ ] `npm run test:smoke`
- [ ] `npm run test:e2e`
- [ ] `npm run test:smoke:production`

## Required deployment evidence

- [ ] Firebase project confirmed.
- [ ] Firebase Hosting URL confirmed.
- [ ] Custom domain checked.
- [ ] Public Firebase env values configured.
- [ ] Admin Firebase env values configured without exposing secret material.
- [ ] Firestore rules deployed.
- [ ] Firestore indexes deployed.
- [ ] Waitlist persistence verified in Firestore or dry-run mode recorded.

## Required artifacts

- [ ] Desktop root screenshot.
- [ ] Mobile root screenshot.
- [ ] Reduced-motion root screenshot.
- [ ] Desktop public demo screenshot.
- [ ] Mobile public demo screenshot.
- [ ] Companion response evidence.
- [ ] Waitlist success evidence.
- [ ] Waitlist error evidence.
- [ ] Production Evidence workflow artifact attached to Issue #300.

## Public-copy lock

- [ ] No unsupported public claims.
- [ ] No Spatial production claim before Spatial evidence is complete.
- [ ] No B2B production claim before B2B evidence is complete.
- [ ] No production-live claim until Issue #300 is closed with evidence.

## Privacy and operations

- [ ] Privacy route or link is visible.
- [ ] Waitlist removal path is documented.
- [ ] Support/contact route or email is visible.
- [ ] Error logging is available.
- [ ] Uptime/status route is checked.
- [ ] Rollback SHA and rollback plan are recorded.

## Evidence references

- Issue #300
- `docs/URAI_POST_MERGE_DEPLOYMENT_EVIDENCE.md`
- `docs/URAI_RELEASE_ROLLBACK_PR304.md`
- `docs/URAI_CANONICAL_PUBLIC_SURFACE.md`

## Closure rule

Do not mark production complete from this file alone. Update this file only after workflow run URL, artifact URL, route smoke output, screenshots, Firebase rules/index evidence, and waitlist persistence evidence are attached.
