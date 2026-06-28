# Production Evidence: Asset Factory

system: asset-factory
productionClaimAllowed: false
liveDeployEvidence: missing
liveSmokeEvidence: missing
privacyReviewEvidence: missing
rollbackEvidence: missing
owner: URAI release
lastReviewed: 2026-06-27
status: disabled

This file records whether URAI can claim Asset Factory-backed production media generation.

Current approved language is adapter present, provider bridge contract hardened, dispatch disabled by default, callbacks secret/signature verified, completion requires private/signed artifact metadata, local/stub provider only, gated/private beta, and not provider-backed until proven.

## Local Evidence Present

- URAI has a server-only adapter in `src/lib/asset-factory/index.ts`.
- Dispatch payloads include job id, owner scope, consent/evidence refs, requested artifact types, required artifact types, callback metadata, and `rawPrivateDataIncluded: false`.
- Dispatch fails closed when `ASSET_FACTORY_ENABLED`, `ASSET_FACTORY_BASE_URL`, or `ASSET_FACTORY_API_KEY` are missing.
- Callback updates require `ASSET_FACTORY_CALLBACK_SECRET` through shared secret or HMAC signature verification.
- Callback completion is rejected without required private/signed artifacts.
- Cross-owner, public/raw URL, wrong content type, and raw private/secret metadata artifacts are rejected by contract tests.

## Missing Before Live Claim

- `ASSET_FACTORY_ENABLED=true` in production.
- Server-only `ASSET_FACTORY_BASE_URL` and `ASSET_FACTORY_API_KEY`.
- `ASSET_FACTORY_CALLBACK_SECRET` and callback route smoke proof.
- `ASSET_FACTORY_CALLBACK_URL` pointing at the deployed callback route when provider callbacks are enabled.
- Provider-backed video/audio/image/model generation evidence.
- Owner-scoped storage proof with private/signed URLs or protected GCS paths.
- Live callback proof writing artifacts into URAI.
- Privacy/legal review evidence.
- Deploy evidence and rollback evidence.

Live requires server-only credentials, private/signed output proof, callback proof, provider smoke evidence, privacy review, deploy evidence, and rollback proof. Until then, provider-backed production media generation remains gated/disabled.
