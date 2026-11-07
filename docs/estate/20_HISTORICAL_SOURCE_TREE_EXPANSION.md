# Original UrAi — historical source-tree expansion (pass 20, 2026-11-07)

**Production HOLD.** Documentation-only; original UrAi remains quarantined, current consumer runtime authority stays with `urai-spatial`. This report follows pass 19 and adds six **distinct** immutable historical Git trees (not already in the initial eight). All Git Trees responses returned `truncated:false`, matched the requested tree IDs, and yielded full file-path, mode, Git object ID and Git-reported blob-size metadata. No binary payloads were retrieved and no source builds, private media or device tests were executed.

## New snapshots

| Frozen topic | Commit | Git tree | Blob paths | Reported blob bytes |
|---|---|---|---:|---:|
| 2025-09-tilt-cinematic | `cf719f2b03a383cd6aa3a0011812184d592e02eb` | `7bc25301b5ff0249197d6f5283b38de61bf9281e` | 7049 | 2003470993 |
| 2025-11-interactive-home | `907ddd125ba46d85d653a1d4260129130ed3f37a` | `39fb4eff474c9458c55c22e32a7f8ca68f66df8c` | 1233 | 598900827 |
| 2026-05-orb-avatar-ascent | `531fd5d54e0b5a4878239018cc2340905709613e` | `007fbc6e6b49c8d5b139b8f61119a3abecdbf2f9` | 1379 | 599450291 |
| 2026-05-memory-galaxy-refactor | `26f3d25ba5f09a42142a5da76f6f0f1db5684b0d` | `4b3fec3830122af27e7d2933356d2ed7899697b1` | 1434 | 599711973 |
| 2026-05-predictive-mirror | `175f037ebad14390b500456a5e265e9f3229ba11` | `4d714e4d1b68f7bfe2533ea24a6bdec90474efb8` | 1259 | 598947080 |
| 2026-06-genesis-consent-model | `346bc3805fc37ff9b1362abddb088e1fb158fffc` | `2ea719ab783bf9325d73f15af3a4e8cc53ad35f7` | 1686 | 601269615 |

**New pass:** 6/6 full recursive trees, **7636 distinct Git blob SHA-1 IDs within this six-snapshot sample** (do not add to 2,942 initial-sample unique objects without deduplication). Across the frozen metadata union, the distinct historical tree total remains 3,701; priority trees inventoried now rise from 8 to 14 and **3,687 historical tree IDs remain uninspected**. These identities are metadata only; Git-reported bytes are not independently downloaded/rehash-verified SHA-256.

**Source files:** [priority-batch-03.json](historical-trees/priority-batch-03.json), [priority-batch-04.json](historical-trees/priority-batch-04.json). They preserve every returned path, object ID, mode, type and reported blob size. The results capture true commit-tree SHA rather than confusing a commit SHA with a tree object.

**Scope:** the 2025 cinematic motion, 2025 interactive Home, 2026 Orb/Ascent and Memory Galaxy/Mirror source families and June 2026 Genesis consent source history. Path existence does not certify behavior, private governance, applied consent, native builds or modern Spatial parity. Older 2024 LifeLogger/LifeOS history is archived separately in Drive: its 2024 founder event timestamp does not constitute a Git commit in this 2025–26 repo graph.

**P0:** live consent issuer, owner isolation, effective Firebase Rules, authenticated Jobs→Studio private render→Replay, revoke/delete, independent approval. **P1:** exact historical behavior/assets to Spatial/Studio/Privacy/Jobs reconciliation and nine-step device/accessibility acceptance. **P2:** inspect remaining 3,687 historical Git trees, historical byte payload SHA-256/LFS, tags/unadvertised refs and Drive archive source. **P3:** preserve/label donor duplicates; no destructive asset cleanup.

No production code, deployments, CI assertions, billing or credentials changed.
