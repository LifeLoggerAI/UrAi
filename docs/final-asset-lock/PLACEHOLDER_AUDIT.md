# URAI Critical Placeholder / Fallback Audit

Date: 2026-08-11
Scope: critical entries in `src/lib/assets/uraiAssetManifest.ts` plus the legacy Genesis orb registry reference.

The application currently has safe fallbacks, but these eight critical slots are not eligible for final asset lock.

| Manifest key | Current reference | Non-final condition | Required final runtime target | Priority |
| --- | --- | --- | --- | --- |
| `skyBackground` | `/assets/sky/bloom/fallback-sky-bloom-12.webp` | fallback scene art | `/assets/genesis/sky/sky-background.png` | P0 |
| `bodySilhouetteBase` | `TRANSPARENT_PIXEL` | transparent fallback | `/assets/genesis/body/body-silhouette-base.png` | P0 |
| `bodySilhouetteGlow` | `TRANSPARENT_PIXEL` | transparent fallback | `/assets/genesis/body/body-silhouette-glow.png` | P0 |
| `auraField` | `TRANSPARENT_PIXEL` | transparent fallback | `/assets/genesis/body/aura-field.png` | P0 |
| `orbCore` | `/assets/images/genesis-orb-placeholder.svg` | explicit placeholder | `/assets/genesis/orb/orb-core.png` | P0 |
| `orbGlow` | `TRANSPARENT_PIXEL` | transparent fallback | `/assets/genesis/orb/orb-glow.png` | P0 |
| `groundBase` | `/assets/ground/bloom/fallback-ground-bloom-12.png` | fallback scene art | `/assets/genesis/ground/ground-base.png` | P0 |
| `foregroundVignette` | `TRANSPARENT_PIXEL` | transparent fallback | `/assets/genesis/overlays/foreground-vignette.png` | P0 |

## Additional registry cleanup

`src/lib/assets/assetRegistry.ts` also points `images.genesisOrb` at `/assets/images/genesis-orb-placeholder.svg`. When the final orb core lands, update this registry so no production-facing registry continues to advertise the placeholder.

## Lock rule

A critical slot is cleared only when all of these are true:

1. the target file exists at the final runtime path;
2. the manifest entry points to that target rather than `TRANSPARENT_PIXEL`, a `placeholder` path, or a `fallback-` path;
3. any duplicate/legacy registry reference is updated;
4. visual QA passes at 375, 430, 768, 1024, and 1440 px widths where applicable;
5. technical QA confirms load/path/transparency/texture integrity;
6. experience QA confirms the layer works in the composed scene and transitions;
7. QA evidence is stored in the Drive `05_QA_EVIDENCE` lane.

## Current status

All eight rows remain **OPEN** until replacement assets are physically present and wired. The source-controlled checker in `scripts/check-final-asset-lock.mjs` is designed to fail while any one of them remains unresolved.
