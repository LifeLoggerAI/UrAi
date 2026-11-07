# Original UrAi — selected full historical Git trees and media provenance, pass 19

**Observed:** 2026-11-07. **Authority:** `LifeLoggerAI/UrAi` legacy reference only. **Canonical current runtime:** `LifeLoggerAI/urai-spatial`. **Release:** HOLD.

## Method

Rechecked PR #396 and master Labs PR #262, their `docs/estate/00_START_HERE.md`, and previous 4,009-commit union before selecting representative source. Fetched eight immutable **true commit-tree SHA** objects from the GitHub Git Trees API with `recursive=1`, each reporting `truncated:false`, and preserved full returned path/type/Git object ID/mode/reported-size records in:

- `docs/estate/historical-trees/priority-batch-01.json` — commit `a45bd8654f2d8f98dcd8703c83fb410d8eeef871`, Git blob SHA `cb77897741ca3fcdb6270a5ddc1df9991962ba95`.
- `docs/estate/historical-trees/priority-batch-02.json` — commit `c238709e92eff4187a7f677e9a9bea119fe62b36`, Git blob SHA `cf48f7f8a67c40c212ca932b6ad48f47cf5347e7`.
- `docs/estate/historical-trees/PRIORITY_TREE_SUMMARY.json` — compact joined readback/summary, source SHA read back independently.

The first two JSON blobs are approximately 1.93 MB and 2.06 MB. The `fetch_file` wrapper returned **empty inline content** for these large files even though it returned their blob SHA, so we explicitly used the approved GitHub contents URL `GET /repos/LifeLoggerAI/UrAi/contents/docs/estate/historical-trees/<filename>?ref=docs/genesis-estate-handoff-20261106` to fetch the actual JSON content. **Both were fetched, JSON-parsed and cross-checked** through that alternate read path. This is not a failed audit or evidence that the large original content is absent. Raw binary files remain unverified.

## Selected source snapshots (metadata-only)

| Immutable commit snapshot | True Git tree ID | Blob paths | Reported bytes |
|---|---|---:|---:|
| 2025-09-30 original main `6d8acda6d8b60ca41bcd19bc3065732136ad331d` | `7fa458aee557bbc60865069d84f3430d02c7221e` | 1,226 | 598,895,854 |
| 2026-05-17 immersive 3D Home `ba4323ca0ec76f125e50c46fcbcc2815e7ad4c80` | `8e0ef16f5f747adcc197e80cda05f2db1b4317cd` | 1,502 | 599,942,708 |
| 2026-05-07 Ancient Signals branch `925d018f03e05f3e7be7bd4c15867d15c41da2e8` | `0f4267e057d367d548356493a56582800742d271` | 1,283 | 599,095,662 |
| 2026-08-11 six-human Council `9f59147b2d46b27583d02ff7a04cc47a7f727f87` | `30672a6c3bd00a0c8d7f8a7240b77fc4aad81a54` | 2,486 | 604,630,623 |
| 2025-09-26 regressive audio route `d56a01b277ac42b2e0f9861c91e824c035969afb` | `1c054900873068f2ca21cd909656e53ec9d9e6f5` | 1,169 | 598,767,946 |
| 2026-06-03 Genesis visual-supremacy `f935befbebfca9289a74920a4fcb62411a339764` | `922ec67e8544a9d4658fa48bce3a3b468d706ec8` | 1,710 | 601,220,285 |
| 2026-06-07 Genesis mood layer `d826aef23832e272abd69868c88d5df7675a4cdd` | `9274298736056672a5f09b83aeb45d4a09fef771` | 2,153 | 602,364,142 |
| 2026-07-09 UrAi asset factory `98526c7bc2ec85906af042cc03b5929612bbd9f1` | `c725de0cbfcb8daacf150996efb8cbd525c96503` | 2,481 | 605,019,096 |

The snapshots are **not an ordered eight-step ancestry chain**; they were selected for materially different code/product donors. Count of distinct Git **blob SHA-1 identities** appearing across these eight snapshots is **2,942**. Same blob repeated in multiple branches does not constitute independently implemented features or different media, and the SHA-1 from Git is not a verified user-download SHA-256.

## Large committed visual assets actually present in tree metadata

The eight-tree combined index repeatedly exposes:
- `public/assets/sky/cosmic/sky-cosmic-09a.mp4` — Git blob `fd6b23ba382449df964fcbd42168b0b5b6c41a6d`, **34,780,725 reported bytes**
- `public/assets/sky/cosmic/sky-cosmic-09.mp4` — `2b17bfe975694d07637a2c41f4b2c2fdb9fb8689`, **29,013,200 bytes**
- `public/assets/ground/energy/ground-energy-15.mp4` — `5ac22e9ddf1e224f04cf0126614dfa20db8c411b`, **19,012,939 bytes**
- `public/assets/ground/energy/ground-energy-15a.mp4` — `29949daab388d3636b2447348b593fc6ec2e7bb9`, **18,277,888 bytes**
- `public/assets/avatar/Texture.png` — `e23b83da27083c1629629b330fe38304548c18da`, **12,002,243 bytes**

These real Git objects are strong **stored-content metadata evidence**, not playback verification, asset licensing/provenance, or a guarantee the current canonical Spatial build still uses them. Distinct media duplicates and actual semantic differences remain to be checked against modern Spatial/Studio assets.

The largest item is still an anomalously committed **47,344,467-byte npm-cache blob** under a path starting with `:USERPROFILE\npm-cache-fresh`. This historical byte mass is real tracked metadata but **must not** be conflated with production media or automatically copied into current release builds.

## Source relationships and next execution gates

Ancient Signals branch preserves real inference/rollup source with missing-positive-consent problem; old 2025 alternate recording branch preserves unsafe `public/audio` handler; modern original-main routes preserve quarantine. Home, Orb, Council, avatar and cinematic donors are real source families but not present-day Spatial user-journey acceptance. The selected snapshot shows `functions/src/storyMovieRenderer.ts` as a 2026 donor while the previous pass independently verified FFmpeg rendering in 2025 main's `functions/src/index.ts`; this is a concrete historical lineage to compare, not two independently certified modern Studio pipelines.

**P0:** Keep historic ingestion/rendering paths quarantined and obtain owner-signed positive consent, effective cloud Rules, authenticated Jobs/Studio protected processing, owner Replay and revocation/deletion. **P1:** direct source/asset crosswalk of original Home→Ascent→Life Map→Focus→Replay to current Spatial and Studio/Privacy/Jobs including physical accessibility/device. **P2:** remaining **3,693** distinct commit-tree IDs and full historical paths/blob content SHA-256, LFS and original Drive estate license/source evidence. **P3:** legacy cache and superseded docs are historical data; no destructive cleanup before preservation.

**Evidence level:** eight full Git tree metadata reads PASS; 2,942 distinct Git blob IDs in these samples PASS; actual blob payload SHA-256 NOT done; original full native build/emulators NOT run; protected media/cross-service/browser/XR acceptance NOT done. **Production HOLD.**
