# Production Evidence: Life Movie

system: life-movie
productionClaimAllowed: false
liveDeployEvidence: missing
liveSmokeEvidence: missing
privacyReviewEvidence: missing
rollbackEvidence: missing
owner: URAI release
lastReviewed: 2026-06-27
status: gated

This evidence gate intentionally blocks public claims that full generated life movies are live for every user.

Allowed public language: Genesis preview, demo, sample, fallback, private beta, gated, waitlist, coming soon, and not live.

To unlock a public production claim, attach dated deploy evidence, live smoke evidence, privacy/legal approval, rollback proof, and owner-scoped generation proof from real user-approved input.

## Private Beta Unlock Path Evidence - 2026-06-27

Local code/tests now cover the private-beta unlock path up to provider handoff and callback validation:

- Owner-scoped draft/project/scene/evidence model exists.
- Owner approval is required before render.
- `life_movie.generate` remains feature-gated/private-beta.
- Asset Factory dispatch fails closed when config is missing.
- Asset Factory payload mapping excludes raw private memory text and sends owner/evidence/consent refs.
- Callback completion requires private/signed `video`, `audio`, `subtitles`, and `manifest` artifact metadata.
- Incomplete callbacks fail the job/project instead of marking completion.
- Replay refuses to play generated media unless the full artifact bundle exists.

This is not public-live proof. `productionClaimAllowed` remains `false` until deploy logs, provider artifacts, live smoke, privacy review, export/delete/revocation proof, and rollback evidence are attached.
