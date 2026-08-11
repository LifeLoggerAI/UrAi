# URAI Final Asset Folder Structure

This structure is mirrored in Google Drive under `URAI/URAI Final Asset Lock — 2026-08-11` and maps approved assets to runtime destinations in `LifeLoggerAI/UrAi`.

## Drive production tree

```text
URAI Final Asset Lock — 2026-08-11/
├── 00_MASTER_TRACKER/
├── 01_REFERENCE_AND_SOURCE/
├── 02_WORKING_REVIEW/
├── 03_APPROVED_FINAL/
│   ├── 00_HOME_GROUND/
│   ├── 01_SKY_WEATHER/
│   ├── 02_ORB_COUNCIL/
│   ├── 03_GALAXY_LIFEMAP/
│   ├── 04_MEMORY_BLOOM_REPLAY/
│   ├── 05_MIRROR/
│   ├── 06_SHADOW/
│   ├── 07_LEGACY/
│   ├── 08_PASSPORT/
│   ├── 09_PORTALS/
│   ├── 10_VFX_SHADERS/
│   ├── 11_UI_GLYPHS/
│   ├── 12_MOTION_CAMERA/
│   ├── 13_AUDIO_VOICE/
│   └── 14_EXPORT_TEMPLATES/
├── 04_RUNTIME_EXPORTS/
├── 05_QA_EVIDENCE/
├── 06_AUDIO_AND_VOICE/
├── 07_3D_SOURCE_MODELS/
├── 08_2D_SOURCE_GRAPHICS/
├── 09_MOTION_CAMERA/
├── 10_UI_GLYPHS_BRAND/
├── 11_STORY_EXPORTS/
└── 12_ARCHIVE_SUPERSEDED/
```

## Runtime mapping

| Approved-final lane | Primary GitHub runtime target |
| --- | --- |
| Home / Ground | `public/assets/genesis/ground/`, `public/assets/genesis/body/` |
| Sky / Weather | `public/assets/genesis/sky/`, `public/assets/genesis/overlays/` |
| Orb / Council | `public/assets/genesis/orb/`, Council runtime assets/components |
| Galaxy / Life Map | `public/assets/genesis/galaxy/`, star/constellation runtime assets |
| Memory Bloom / Replay | `public/assets/genesis/memory/`, replay runtime assets |
| Mirror | `public/assets/genesis/realms/mirror/` |
| Shadow | `public/assets/genesis/realms/shadow/` |
| Legacy | `public/assets/genesis/realms/legacy/` |
| Passport | `public/assets/genesis/realms/passport/` plus approved UI assets |
| Portals | `public/assets/genesis/portals/`, `public/assets/genesis/transitions/` |
| VFX / Shaders | runtime shader/VFX directories and optimized textures |
| UI / Glyphs | `public/assets/icons/`, Genesis UI assets, typed registries |
| Motion / Camera | animation/state-machine/camera configuration files |
| Audio / Voice | `public/assets/audio/` and realm-specific audio assets |
| Export Templates | export/story template assets and implementation files |

## Source -> runtime rule

1. Raw/source files live in source lanes, not runtime folders.
2. Iterations live in `02_WORKING_REVIEW` and are never referenced by production manifests.
3. Only explicitly approved masters move into `03_APPROVED_FINAL`.
4. Runtime exports are optimized derivatives of approved masters.
5. GitHub registries/manifests point only to runtime exports.
6. Superseded approved assets move to `12_ARCHIVE_SUPERSEDED`; do not silently overwrite provenance.
7. Final lock requires matching QA evidence in `05_QA_EVIDENCE`.

## Naming convention

Use:

```text
urai_[system]_[asset-name]_[state]_[version].[ext]
```

Examples:

```text
urai_orb_core_idle_v01.png
urai_sky_weather_recovery_v02.webp
urai_portal_galaxy_active_v01.glb
urai_memory_bloom_entry_v03.webm
```

Runtime filenames that are already contractually expected by the Genesis manifest may retain the stable manifest filename (for example `orb-core.png`) while provenance/version information stays in Drive and the tracker.

## Export families

- 2D master/overlay: PNG; WebP runtime optimization where appropriate.
- Glyph/icon: SVG plus PNG/WebP derivatives when required.
- 3D runtime: GLB/GLTF; FBX only when required by the animation toolchain.
- Motion preview: WebM/MP4; Rive/Lottie/JSON where the runtime system uses them.
- Audio: WAV master; runtime OGG/MP3/other supported compressed derivative.
- Full vertical scenic layer: 1440 x 3120 where the existing Genesis contract calls for that canvas.
- Orb/square assets: normally 1024 x 1024 unless the runtime model replaces the 2D representation.
