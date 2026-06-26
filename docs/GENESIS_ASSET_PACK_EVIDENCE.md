# URAI Genesis Asset Pack Evidence

Generated: 2026-06-26
Scope: Genesis launch-safe visual/audio asset pack only. This document does not claim production media generation, real user generated life movies, passive sensing, AR/VR/XR worlds, autonomous jobs, or provider-backed media pipelines are live.

## Assets Added Or Wired

- Added launch-safe Genesis visual layers under `public/assets/genesis/**` for hero, sky, overlays, body, orb, ground, portals, transitions, vignette, cards, previews, empty states, and stable compatibility URLs.
- Added Life Map, Memory Film, fallback media, companion, passport, privacy/consent, and spatial/XR preview sample visuals. These are sample/preview/fallback assets only.
- Added compatibility URLs for public launch references:
  - `/assets/genesis/hero/urai-genesis-hero-1600x1000.png`
  - `/assets/genesis/life-map/life-map-background-1600x1000.png`
  - `/assets/genesis/life-map/life-map-card-memory-sample.png`
  - `/assets/genesis/memory-film/memory-film-preview-sample.png`
  - `/assets/genesis/fallbacks/media-thumbnail-sample.png`
  - `/assets/genesis/spatial/spatial-xr-preview-sample.png`
  - `/assets/genesis/companion/companion-preview-card.png`
  - `/assets/genesis/passport/passport-privacy-card.png`
  - `/assets/genesis/privacy/consent-shield-card.png`
  - `/assets/genesis/empty-states/empty-memory-vault.png`
- Added launch-safe optional WAV placeholders under `public/assets/audio/**` and `public/sounds/**`. They are optional, no-op-safe, and must not autoplay intrusively.
- Added URAI state layers under `public/assets/urai/**`, including skies, fog, aura, silhouette, ground, orb, glyphs, and memory bloom fallback art.
- Updated `/assets/manifest.json` and `/assets/asset-manifest.js`; current manifest asset count is 276.

## Broken References Fixed

- Replaced invalid `.mp3` code/check references with existing `.wav` placeholder paths.
- Replaced avatar material absolute Windows texture references with local public asset texture names in `public/assets/avatar/*.mtl`.
- Added stable compatibility aliases for Genesis public launch asset URLs that previously 404ed during direct route QA.

## Media And Demo Claim Safety

- `/memory/memory-001` now visibly identifies the page as a sample preview and states it is not real private user memory data.
- `/app/council` now identifies Council/narrator/companion behavior as a gated demo surface until consent, account, and production evidence gates are satisfied.
- `/app/story` now identifies scripts, narrator voiceover, captions, and export handoff as a gated preview until provider, consent, job, and smoke evidence exists.
- `/app/exports` now identifies export media as sample/gated and does not claim generated life movie export is live.

## Routes Visually Checked

Checked desktop and mobile production-server render for:
`/`, `/home`, `/life-map`, `/dashboard`, `/login`, `/signup`, `/onboarding`, `/passport`, `/privacy`, `/settings/privacy`, `/replay`, `/replay/sample-replay`, `/focus`, `/focus/session/sample-session`, `/memory/memory-001`, `/record`, `/narrator`, `/app/home`, `/app/dashboard`, `/app/life-map`, `/app/life-map/replay`, `/app/life-map/focus`, `/app/council`, `/app/story`, `/app/exports`, `/app/settings`, `/app/settings/privacy`, `/spatial`, `/spatial/demo`, `/spatial/assets`, `/waitlist`, `/system`, `/status`, `/launch`, `/support`.

Final QA evidence: `C:/tmp/urai-genesis-asset-pack-final-qa/report.json` with 70 route/viewport checks, 24 direct asset checks, 0 failures, and 0 console errors. Representative screenshots are in `C:/tmp/urai-genesis-asset-pack-final-qa`.

## Checks Run

- `npm run verify:assets` - pass
- `npm run check:genesis:assets` - pass
- `npm run check:genesis:audio` - pass
- `npm run check:types` - pass
- `npm run lint` - pass with 5 existing warnings, 0 errors
- `npm run test:rules` - pass, 108 tests
- `npm test -- --runInBand` - pass, 341 tests; jsdom reports expected `HTMLMediaElement.play/pause` not implemented warnings
- `npm run build` - pass, 82 static pages generated
- Temporary Playwright route/asset QA - pass

## Safe Launch Claims

- URAI has a Genesis launch-safe visual/audio asset pack suitable for public demo presentation.
- Sample/preview visual cards and thumbnails can be shown as demo, preview, sample, fallback, or empty-state assets.
- Optional ambient/UI audio placeholders are present and non-blocking when audio is unavailable.
- Spatial/XR, narrator, memory film, replay, export, companion, and Council media surfaces are safe only as preview/gated/fallback surfaces in this pass.
- Real branded launch videos are not proven present or wired. Current video inventory is limited to ambient sky/ground MP4 container assets that are not route-wired and were not proven browser-playable during selected metadata checks; route-specific onboarding, walkthrough, memory-film, narrator, privacy, and spatial videos remain gated until exported and verified. See `docs/URAI_REAL_VIDEO_ASSET_AUDIT.md` and `docs/VIDEO_ASSET_PRODUCTION_MANIFEST.md`.

## Claims Still Gated

- Real user-generated life movies or private memory films.
- Provider-backed production media generation.
- Branded launch video loops, onboarding videos, product walkthroughs, memory-film preview clips, and spatial/XR preview videos until the files named in `docs/VIDEO_ASSET_PRODUCTION_MANIFEST.md` exist, are wired, and pass browser route QA.
- AR/VR/XR worlds as live production systems.
- Passive sensing or inferred private intelligence from user data.
- Autonomous jobs, outbound communications, or monetized user-derived media flows.
- Final sonic/voice system completion beyond optional placeholder readiness.

## Remaining Asset Blockers

None found for the Genesis launch-safe asset pack. Remaining polish is non-blocking: lint still warns about a few `<img>` usages and one anonymous style mock export.
