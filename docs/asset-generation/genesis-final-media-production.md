# Genesis Final Media Production Pack

Last updated: 2026-06-27

## Summary

The URAI Genesis onboarding film now has a complete launch-safe media production pack: final SVG poster frames, loopable SVG background options, per-scene video prompts, transition prompts, voiceover scripts, captions, sound-design notes, and a machine-readable final manifest.

Actual final MP4/WebM video segments and WAV/MP3 voice/music renders were not generated in this environment. They remain gated as `needs_external_render` until produced by an external render/TTS/music pipeline, rights-cleared, wired, tested, deployed, and live-smoke proven.

## Asset Status

| Scene | Poster | Loop background | Status | Safe claim |
| --- | --- | --- | --- | --- |
| scattered-life | scattered-life-poster.svg | scattered-life-loop.svg | needs_external_render | symbolic-public-preview-only |
| urai-appears | urai-appears-poster.svg | urai-appears-loop.svg | needs_external_render | urai-is-introduced-as-a-consent-bound-interface- |
| you-live | you-live-poster.svg | you-live-loop.svg | needs_external_render | use-helps-and-can-language-do-not-imply-automati |
| life-map-sky | life-map-sky-poster.svg | life-map-sky-loop.svg | needs_external_render | life-map-is-a-genesis-sample-memory-field-until- |
| orb-speaks | orb-speaks-poster.svg | orb-speaks-loop.svg | needs_external_render | orb-copy-must-remain-companion-preview-not-thera |
| focus-image | focus-image-poster.svg | focus-image-loop.svg | needs_external_render | the-focused-moment-is-the-onboarding-seed-memory |
| replay-begins | replay-begins-poster.svg | replay-begins-loop.svg | needs_external_render | replay-is-sample-preview-fallback-not-a-real-gen |
| ground-council | ground-council-poster.svg | ground-council-loop.svg | needs_external_render | council-remains-a-preview-autonomous-agents-do-n |
| private-nudges | private-nudges-poster.svg | private-nudges-loop.svg | needs_external_render | nudges-are-future-permissioned-examples-not-live |
| life-films | life-films-poster.svg | life-films-loop.svg | needs_external_render | life-films-are-gated-until-provider-backed-gener |
| memory-music-videos | memory-music-videos-poster.svg | memory-music-videos-loop.svg | needs_external_render | music-videos-are-concept-preview-until-real-lice |
| symbolic-people | symbolic-people-poster.svg | symbolic-people-loop.svg | needs_external_render | no-real-person-cloning-no-replacement-for-real-p |
| ar-vr-xr | ar-vr-xr-poster.svg | ar-vr-xr-loop.svg | needs_external_render | spatial-worlds-are-preview-surfaces-not-complete |
| passport-ownership | passport-ownership-poster.svg | passport-ownership-loop.svg | needs_external_render | do-not-claim-marketplace-payouts-are-live-licens |
| global-emotional-map | global-emotional-map-poster.svg | global-emotional-map-loop.svg | needs_external_render | global-signal-is-roadmap-permissioned-no-live-da |
| accessibility-legacy | accessibility-legacy-poster.svg | accessibility-legacy-loop.svg | needs_external_render | accessibility-and-legacy-are-aspirational-produc |
| final-home-return | final-home-return-poster.svg | final-home-return-loop.svg | needs_external_render | genesis-preview |

## Files

- TypeScript manifest: `src/data/genesisOnboardingFinalAssets.ts`
- Public manifest: `public/genesis/onboarding/final-manifest.json`
- Poster frames: `public/genesis/onboarding/posters/`
- Loop backgrounds: `public/genesis/onboarding/final/`
- Video prompts: `public/genesis/onboarding/video-prompts/`
- Audio specs: `public/genesis/onboarding/audio/`
- Captions: `public/genesis/onboarding/captions/`

## Safe Launch Claim

URAI Genesis includes a cinematic onboarding preview built from launch-safe poster frames, symbolic motion backgrounds, captions, and production-ready render specs.

## Claims Still Gated

- Final generated private life movies.
- Final rendered onboarding video segments.
- Final voiceover or score.
- Provider-backed video, image, or audio generation.
- AR/VR/XR worlds as production-live surfaces.
- Passive sensing, autonomous agents, marketplace payouts, therapy, diagnosis, or enterprise readiness.

## External Render Requirements

1. Render each 8-12 second segment using the prompt file for that scene.
2. Render each 3-5 second transition prompt where needed.
3. Export web-safe `.mp4` and `.webm` files under `public/genesis/onboarding/final/`.
4. Export final voiceover/music files under `public/genesis/onboarding/audio/`.
5. Update `src/data/genesisOnboardingFinalAssets.ts` and `public/genesis/onboarding/final-manifest.json` from `needs_external_render` to `generated` or `final` only after proof exists.
6. Run `npm run check:onboarding`, `npm run check:genesis`, `npm run check:types`, `npm test -- --runInBand`, and `npm run build`.
