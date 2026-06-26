# URAI Video Asset Production Manifest

Generated: 2026-06-26

Purpose: define exact launch-safe video deliverables for URAI Genesis without pretending generated private user media is live. Until these files exist, are wired, and pass route QA, all video surfaces stay gated, preview, sample, or fallback only.

## Export Targets

| Asset | Required files | Duration | Dimensions | Routes | Poster fallback | Required visible label |
|---|---|---:|---|---|---|---|
| URAI Genesis hero loop | `public/assets/video/urai-genesis-hero-loop.mp4`, optional `public/assets/video/urai-genesis-hero-loop.webm` | 8-15s | 1920x1080, safe crop to 1600x1000 | `/`, `/home`, `/launch` if wired later | `public/assets/genesis/hero/urai-genesis-hero-1600x1000.png` | `Genesis product preview` |
| Onboarding intro | `public/assets/video/urai-onboarding-intro.mp4`, optional `.webm` | 20-45s | 1920x1080 | `/onboarding` | `public/assets/genesis/cards/passport-preview-card.png` | `Onboarding walkthrough preview` |
| Life Map preview loop | `public/assets/video/urai-life-map-preview-loop.mp4`, optional `.webm` | 8-15s | 1920x1080 | `/life-map`, `/app/life-map` | `public/assets/genesis/life-map/life-map-background-1600x1000.png` | `Life Map preview - sample visual layer` |
| Memory Film sample preview | `public/assets/video/urai-memory-film-sample-preview.mp4`, optional `.webm` | 15-30s | 1920x1080 | `/replay`, `/replay/sample-replay`, `/memory/memory-001`, `/memory/sample` only if clearly labeled | `public/assets/genesis/memory-film/memory-film-preview-sample.png` | `Sample memory film preview - not real user output` |
| Companion/Council preview loop | `public/assets/video/urai-companion-council-preview-loop.mp4`, optional `.webm` | 8-15s | 1920x1080 | `/narrator`, `/app/council` | `public/assets/genesis/companion/companion-preview-card.png` | `Companion preview - provider generation gated` |
| Passport/privacy trust preview | `public/assets/video/urai-passport-privacy-preview-loop.mp4`, optional `.webm` | 8-15s | 1920x1080 | `/passport`, `/privacy`, `/settings/privacy`, `/app/settings/privacy` | `public/assets/genesis/passport/passport-privacy-card.png` | `Privacy trust preview` |
| Spatial/XR preview loop | `public/assets/video/urai-spatial-xr-preview-loop.mp4`, optional `.webm` | 8-15s | 1920x1080 | `/spatial`, `/spatial/demo`, `/spatial/assets` | `public/assets/genesis/spatial/spatial-xr-preview-sample.png` | `Spatial preview - not live XR world` |
| Generic media fallback clip | `public/assets/video/urai-media-fallback-preview.mp4`, optional `.webm` | 6-10s | 1920x1080 | Only as a clearly labeled fallback where a video slot exists | `public/assets/genesis/fallbacks/media-thumbnail-sample.png` | `Fallback preview - no user media connected` |

## Playback Requirements

- Use `.mp4` as the baseline web-safe delivery format; include `.webm` only when exported and verified.
- Do not autoplay audible media. Any autoplay loop must be muted, inline, decorative, and pausable or nonessential.
- Use `preload="metadata"` or lazy loading for non-hero media.
- Always provide a poster image and safe static fallback.
- Every route must remain usable when a video fails or is missing.
- Do not attach sample clips to `memory.videoUrl` unless the UI label says sample/demo/preview and not real user output.
- Do not use video URLs from user storage unless the Firestore record is owner-scoped and the storage path/rules are verified.

## Real Memory Film Gate

A video can be called a real memory film only after all of these are proven:

- Authenticated user selected or uploaded source memories.
- User approved the script/story before rendering.
- Server-side job validated Firebase auth.
- Provider keys stayed server-only.
- Output was created from real user input or a proven provider-backed proof job.
- Output was stored under owner-scoped storage, such as `users/{uid}/generated-media/{outputId}/...`.
- Firestore output record includes an `ownerUid` or equivalent owner-only field.
- Playback route loads the owner-scoped output.
- Delete/export controls exist or are explicitly gated.
- Tests, rules, build, and local/live smoke evidence pass.

## Acceptance Checks Before Wiring

- `npm run verify:assets`
- `npm run check:genesis:assets`
- `npm run check:genesis:audio`
- `npm run check:types`
- `npm run lint`
- `npm test -- --runInBand`
- `npm run test:rules`
- `npm run build`
- Browser route QA on mobile and desktop for every route using a video asset.

## Current Status

No branded launch video files from this manifest are present yet. Existing ambient MP4 assets under `public/assets/sky/**` and `public/assets/ground/**` are not substitutes for onboarding, walkthrough, memory-film, narrator, or spatial product videos, and selected browser metadata checks did not prove them route-ready.
