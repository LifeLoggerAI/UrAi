# URAI Real Video Asset Audit

Generated: 2026-06-26

Scope: launch-critical video truth only. This audit does not claim generated private memory films, provider-backed video generation, spatial/XR worlds, passive sensing, autonomous jobs, or final voice/sonic systems are live.

## Repository Video Inventory

The repository contains 35 files with video extensions under public assets:

- 28 files look like MP4 container assets by file size and `ftyp` MP4 header checks, but selected browser metadata checks did not prove playback in Playwright Chromium.
- 7 files are not usable videos in this checkout: tiny path-placeholder files or zero-byte files.
- No `.webm`, `.mov`, or `.m4v` launch assets were found.

MP4 container assets found:

- `public/assets/ground/bloom/ground-bloom-11.mp4`
- `public/assets/ground/bloom/ground-bloom-11a.mp4`
- `public/assets/ground/bloom/ground-bloom-12.mp4`
- `public/assets/ground/bloom/ground-bloom-12a.mp4`
- `public/assets/ground/cosmic/ground-cosmic-09.mp4`
- `public/assets/ground/cosmic/ground-cosmic-09a.mp4`
- `public/assets/ground/cosmic/ground-cosmic-10.mp4`
- `public/assets/ground/cosmic/ground-cosmic-10a.mp4`
- `public/assets/ground/energy/ground-energy-15.mp4`
- `public/assets/ground/energy/ground-energy-15a.mp4`
- `public/assets/ground/energy/ground-energy-16.mp4`
- `public/assets/ground/energy/ground-energy-16a.mp4`
- `public/assets/ground/fracture/ground-fracture-05.mp4`
- `public/assets/ground/fracture/ground-fracture-05a.mp4`
- `public/assets/ground/fracture/ground-fracture-06.mp4`
- `public/assets/ground/fracture/ground-fracture-06a.mp4`
- `public/assets/sky/bloom/sky-bloom-11.mp4`
- `public/assets/sky/bloom/sky-bloom-11a.mp4`
- `public/assets/sky/bloom/sky-bloom-12.mp4`
- `public/assets/sky/bloom/sky-bloom-12a.mp4`
- `public/assets/sky/cosmic/sky-cosmic-09.mp4`
- `public/assets/sky/cosmic/sky-cosmic-09a.mp4`
- `public/assets/sky/cosmic/sky-cosmic-10.mp4`
- `public/assets/sky/cosmic/sky-cosmic-10a.mp4`
- `public/assets/sky/energy/sky-energy-15.mp4`
- `public/assets/sky/energy/sky-energy-15a.mp4`
- `public/assets/sky/energy/sky-energy-16.mp4`
- `public/assets/sky/energy/sky-energy-16a.mp4`

Not usable as video in this checkout:

- `public/assets/avatar/avatar-demo.mp4`
- `public/assets/ground/ground-demo.mp4`
- `public/assets/sky/fracture/sky-fracture-05.mp4`
- `public/assets/sky/fracture/sky-fracture-05a.mp4`
- `public/assets/sky/fracture/sky-fracture-06.mp4`
- `public/assets/sky/fracture/sky-fracture-06a.mp4`
- `public/assets/sky/sky-demo.mp4`

These unusable files are not referenced by current app routes. They must not be wired into launch pages unless replaced by real exported media.

Browser route QA also requested selected direct media files from the production server:

- `/assets/ground/bloom/ground-bloom-11.mp4` returned HTTP 200 and `video/mp4`, but Chromium metadata load failed with media error code 4.
- `/assets/sky/bloom/sky-bloom-11.mp4` returned HTTP 200 and `video/mp4`, but Chromium metadata load failed with media error code 4.
- `/assets/avatar/avatar-demo.mp4` returned HTTP 200 but is a 37-byte placeholder and failed metadata load.
- `/assets/sky/fracture/sky-fracture-05.mp4` returned HTTP 200 but is zero bytes and failed metadata load.

Because browser playback was not proven, the ambient sky/ground MP4 files must be treated as source/ambient assets only, not as route-ready launch video evidence.

## Surface Classification

| Surface | Current video status | Evidence |
|---|---|---|
| `/` | STATIC IMAGE/THUMBNAIL ONLY | Public demo page uses copy, cards, links, and OG imagery; no `<video>` or video URL reference. |
| `/home` | STATIC IMAGE/THUMBNAIL ONLY | Home shell uses cinematic visuals and safe generated-media gate copy; no real video asset is attached. |
| `/life-map` | PLACEHOLDER/FALLBACK ONLY | Life Map/replay surfaces render interactive scene/fallback visuals; no actual branded Life Map video loop is wired. |
| `/onboarding` | STATIC IMAGE/THUMBNAIL ONLY | Onboarding has consent/passport/home cards and no onboarding video player. |
| `/replay` | GATED FEATURE | `src/components/urai/CinematicMemoryPlayer.tsx` supports a video frame only when `memory.videoUrl` exists. Current sample stars do not attach video. |
| `/replay/sample-replay` | GATED FEATURE | Direct replay route falls back to Life Map replay shell; no sample clip is wired. |
| `/memory/memory-001` | PLACEHOLDER/FALLBACK ONLY | Dynamic memory route is a launch-safe shell and states full private memory content remains owner-only. |
| `/memory/sample` | PLACEHOLDER/FALLBACK ONLY | Same dynamic memory shell; no private or generated video output is presented. |
| `/app/story` | GATED FEATURE | Route explicitly says scripts, narrator voiceover, captions, and export jobs remain gated. |
| `/app/exports` | GATED FEATURE | Route explicitly says video export jobs are not live user exports yet. |
| `/narrator` | PLACEHOLDER/FALLBACK ONLY | Narrator copy is fallback-safe and does not claim provider-backed voice/video output. |
| `/spatial/demo` | PLACEHOLDER/FALLBACK ONLY | Spatial shell is CSS/3D-readiness staging; XR runtime and Asset Factory materialization remain blocked unless flags/proof exist. |
| `/waitlist` and `/launch` | STATIC IMAGE/THUMBNAIL ONLY | Public launch/waitlist pages use static copy and images only. |

## Wiring Findings

- The only real HTML video player in the app is `src/components/urai/CinematicMemoryPlayer.tsx`.
- `src/lib/urai/mock-memory-stars.ts` defines `videoUrl`, `audioUrl`, and `posterUrl` fields, but the bundled sample stars do not set them.
- `src/components/urai/scenes/ReplayScene.tsx` labels replay as preview when no connected media exists.
- `src/components/urai/CinematicSceneStrip.tsx` uses `posterUrl` images for video-kind frames rather than playing video.
- Generated media, narrator voice, exports, spatial/XR, and provider-backed media systems remain gated unless a real authenticated job, owner-scoped storage, Firestore record, playback route, tests, deploy logs, and smoke evidence prove them.

## Launch Safety Decision

Do not wire the ambient sky/ground MP4 files into memory-film, onboarding, or private-user media surfaces as a substitute for real product videos. They are not proven browser-playable route assets, and they are not proven onboarding videos, memory preview videos, product walkthroughs, or user-generated memory films.

No fake or demo video is currently being presented as a real private user memory output. That claim remains safe only as long as sample/demo/preview labels stay visible and no `memory.videoUrl` points at a sample clip without clear copy.

## Current Verdict

Video-ready but needs exported video files. The player and fallback patterns exist, but branded launch videos and real memory-film outputs are not present or wired.
