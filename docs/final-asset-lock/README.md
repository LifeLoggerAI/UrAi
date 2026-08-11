# URAI Final Asset Lock

Status: production control package
Date: 2026-08-11
Branch: `agent/final-asset-lock`

This directory is the source-controlled control layer for taking URAI Genesis from asset-backed architecture to a no-placeholder, demo-grade final world.

## Order of operations

1. **Folder structure** — separate source, review, approved-final, runtime, QA evidence, audio, 3D, 2D, motion, UI/glyphs, exports, and archive.
2. **14-day production sprint** — lock the golden path first, then realm depth and final QA.
3. **Master asset tracker** — the native Google Sheet is the operational lock authority for the full asset-by-asset ledger.

## Authority model

- **Google Drive** stores source masters, work-in-review, approved-final masters, evidence, and production handoff artifacts.
- **GitHub** stores runtime-ready exports, manifests/registries, lock rules, verification scripts, and implementation docs.
- **Master tracker** controls asset priority, sprint day, runtime target, Drive destination, current source status, visual/technical/experience QA, and final lock state.

## Current critical truth

The current Genesis manifest still contains eight critical non-final slots. These are not treated as complete even when the app can safely hide or fall back around them:

- `skyBackground` — fallback scene art
- `bodySilhouetteBase` — transparent pixel fallback
- `bodySilhouetteGlow` — transparent pixel fallback
- `auraField` — transparent pixel fallback
- `orbCore` — explicit placeholder SVG
- `orbGlow` — transparent pixel fallback
- `groundBase` — fallback scene art
- `foregroundVignette` — transparent pixel fallback

See `PLACEHOLDER_AUDIT.md` for exact target paths.

## Golden path definition

The P0 demo path is:

**Home / Ground -> Orb / Council -> Sky / Galaxy -> Memory Bloom / Replay -> Return Home**

The path is not locked merely because navigation works. It is locked only when the visual, technical, and experience gates all pass and no critical runtime reference is a placeholder, transparent fallback, or fallback scene asset.

## Final definition of done

A demo-facing asset can be marked `LOCKED` only when:

1. approved-final source exists in the Drive production tree;
2. runtime export exists at the assigned GitHub path;
3. registry/manifest reference points to the final runtime export;
4. visual QA passes at required breakpoints;
5. technical QA passes with no missing textures/assets, broken loops, or invalid paths;
6. experience QA passes in context with animation, camera, audio, and interaction;
7. the final-lock checker passes for the critical Genesis set.

Run the final critical gate only when final replacements have landed:

```bash
node scripts/check-final-asset-lock.mjs
```

Do not add that command to required CI until the eight critical replacements have been completed, otherwise the current known non-final state will correctly fail the build.
