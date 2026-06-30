# Claim Audit

Generated: 2026-06-30T01:30:00-05:00
Repo: LifeLoggerAI/UrAi
Starting SHA: 409dda09c0381510ee95923a5851eade5e6733ea
Ending SHA: captured in final response

## Claim posture

Public Genesis copy may describe demo, direction, architecture, and gated experiences. It must not imply private user memory, passive sensing, headset entry, generated media, autonomous jobs, real analytics, admin controls, outbound communications, or production AI unless evidence exists.

## Current safe claims

- Public demo/front-door: supported by source and live root/home/ground/status checks.
- Sample-safe Life Map/Ground: supported by source/live copy.
- Private data and autonomous actions gated: supported by public copy and gated routes.
- XR/WebXR foundation: supported by source capability checks; headset entry not generally claimed live.
- Companion foundation: supported by deterministic endpoint and provider-capable respond endpoint.
- Waitlist: supported by source API, but deployed persistence not proven.

## Claims that must remain gated

- Private memory/live life-logging.
- Passive sensing.
- Diagnosis/therapy/medical claims.
- Autonomous actions/jobs.
- Generated private media.
- Provider-backed AI live generation.
- Admin/operator controls.
- Analytics/communications/storytime/content production integrations.
- Compliance claims such as HIPAA, SOC, GDPR, CCPA readiness.

## Required ongoing proof

Run `npm run check:public-copy` and `npm run check:production-claims` in a Node 20 checkout. If either fails, fix public copy before deployment.
