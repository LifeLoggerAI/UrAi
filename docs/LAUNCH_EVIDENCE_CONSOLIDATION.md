# URAI Genesis Launch Evidence Consolidation

Generated: 2026-06-26

This file consolidates the launch evidence that is currently present in the verified local runtime at `C:\tmp\UrAi-latest-runtime\UrAi-main`. Anything not backed by code, tests, deploy logs, screenshots, or live smoke evidence remains gated.

## Evidence Kept

- Genesis asset evidence: `docs/GENESIS_ASSET_PACK_EVIDENCE.md`.
- AAA visual screenshot evidence: `docs/AAA_VISUAL_QA_EVIDENCE.md`.
- Local screenshot/report artifacts: `C:\tmp\urai-aaa-visual-qa-final`.
- Production evidence requirements: `docs/PRODUCTION_EVIDENCE_REQUIREMENTS.md`.
- Production lock and overclaiming guardrails: `docs/PRODUCTION_LOCK.md` and `docs/DO_NOT_OVERCLAIM.md`.
- Privacy and consent gate evidence: `docs/PRIVACY_RELEASE_GATE_EVIDENCE.md` and `docs/PRIVACY_CONSENT_V1.md`.

## Firebase Deploy Surface

For the Genesis launch candidate, the safe Firebase deploy surface is:

- Firebase Hosting.
- Firestore rules and indexes.
- Firebase Storage rules.

Use the narrow deploy scripts for this surface:

```bash
npm run deploy:hosting
npm run deploy:rules
```

Do not run a broad Firebase deploy for launch closure. Cloud Functions remain gated until package/import blockers, function contract tests, identity validation, and live smoke evidence are proven. The current launch candidate should not claim deployed Functions unless separate deploy logs and smoke evidence exist.

## Claims That Remain Gated

These systems must remain labeled as gated, preview, roadmap, sample, fallback, or demo unless new evidence is added:

- Passive sensing or automated life logging.
- Therapy, diagnosis, or medical/mental-health claims.
- Data marketplace, monetization, or sale of user-derived intelligence.
- Autonomous jobs or background execution beyond verified local behavior.
- Broad outbound communications, calls, SMS, or email automation.
- Provider integrations that require private credentials.
- Production generated life movies, memory films, narration, trailers, or user media.
- AR, VR, XR, or 3D worlds beyond verified preview/fallback surfaces.
- Cross-repo system health that is not backed by live endpoint smoke evidence.

## Commit Readiness Caveat

The verified launch runtime is not itself a Git working tree. The accessible `LifeLoggerAI/UrAi` Git checkouts in this workspace are currently unusable for a clean commit because they contain only `.git` at the filesystem root and report tracked source files as deleted. Commit readiness requires a valid `LifeLoggerAI/UrAi` working tree before these launch evidence files can be committed.
