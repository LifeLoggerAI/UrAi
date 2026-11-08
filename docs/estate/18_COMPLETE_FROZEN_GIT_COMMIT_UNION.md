# Original UrAi — full frozen-branch Git commit union and parent-closure certificate (2026-11-07)

**Status:** COMPLETE for **Git commit metadata reachable from the previously frozen 242 branch heads**, but **NOT** complete for all historical tree/blob bodies, raw binary byte hashes, LFS payloads, tags/unadvertised refs, source runtime or production certification. Canonical current experience remains `urai-spatial`; legacy original `UrAi` must stay quarantined. **Genesis production HOLD.**

## Exact scope and evidence

Original `main` pinned to `8cac3ba513830c11261d57bc2b5dd7ad8b83e85a`, with **3,152 unique reachable commit records** preserved in `docs/estate/main-commit-history/part-01-of-04.json` through `part-04-of-04.json`. Previous audit registered **242 branch refs**, 239 distinct heads, 130 refs reaching already-covered main commits and **112 branch heads outside main**. All 112 outside-main heads were previously compared against the immutable main SHA (105 diverged, 7 ahead, 78 merge-base identities), with exact parameters and commits preserved.

This continuation **retrieved the actual full `commits[]` arrays** from GitHub REST `GET /repos/LifeLoggerAI/UrAi/compare/<main>...<frozen-head>?per_page=100&page=1` for **all 112 frozen outside-main heads**. Every returned count equals `ahead_by` (maximum observed branch comparison 78, therefore no 100-commit pagination boundary crossed); every final returned commit equals the requested tip SHA; no tool/request errors. These arrays include commit SHA, true `commit.tree.sha`, parent SHAs, author/committer timestamps and first-line title; **not raw commit object downloads or per-file contents**.

All ten per-branch metadata files are permanently committed and read back:
`docs/estate/branch-exclusive/commit-union-batch-01.json` through `commit-union-batch-10.json`. Exact Git blob SHA-1 from readback:

| File | Git blob SHA-1 | Branch comparisons | Nonunique commit entries |
|---|---|---:|---:|
| 01 | `3a38cfc3acf1a59874b05dcec98fe31ef5f95d55` | 12 | 423 |
| 02 | `ee99a136d2cb1853c700fbb7022f4224b576b9c6` | 12 | 148 |
| 03 | `95c18375d016e31a42c5f045e94df079c4ce1f36` | 12 | 95 |
| 04 | `8d4f4e02c1ffd3c25eb27b3914d58eb151f1c1d4` | 12 | 83 |
| 05 | `ac9d5b5ef334fb643009cac818fbf96f0521468e` | 12 | 56 |
| 06 | `eb5860748fd0896b26ed6d3d9eb8a77c31a0da17` | 12 | 117 |
| 07 | `5d0a5afe09234c480fbbf3dfe5c9a04de1e31d00` | 12 | 75 |
| 08 | `0962eb02847d2d3c575c3d35767e045693fd725d` | 12 | 120 |
| 09 | `f07f561b76feee6a2bc00c08054b56740a960831` | 12 | 145 |
| 10 | `063128fff21ca236b89c308d68b47e41b8a20e4b` | 4 | 53 |

Per-branch total = **1,315 commit references, with 458 duplicate appearances**. SHA-unique exclusive total = **857**. Deduplicated source metadata is now in `docs/estate/branch-exclusive/UNIQUE_EXCLUSIVE_COMMITS.json`, Git blob SHA-1 **`1e18bbdd1c0b120f7aca7f15f2b9cf12513d9033`**, 857 commit records, each with Git tree SHA and parents. This file and all four main partitions were fetched again, JSON parsed and cross-checked in the same session.

**Final cross-graph accounting for frozen sources:**

| Measure | Evidence result |
|---|---:|
| Original pinned main reachable Git commits | 3,152 |
| Distinct commit SHAs outside main across all 112 frozen branch heads | 857 |
| **Unique combined Git commit IDs** | **4,009** |
| **Distinct commit-tree Git object IDs** | **3,701** |
| Parent edges in combined graph | 4,305 |
| Missing parent references in combined graph | **0** |
| Inconsistent tree/parent records for same commit SHA | **0** |
| Root commits in combined graph | **1**: `3696b985821e479c67d5df8a827367dc3f8fe172` |

These are **metadata integrity** checks, not cryptographic byte content verification, runtime builds or deploy evidence. The existing 242 branch-tip tree snapshots already have `truncated:false` metadata records; **3,701 distinct historical tree IDs do not imply 3,701 fully downloaded tree contents**, and Git blob/media contents remain uninspected at large. Tags listing previously returned 404 through the connector; this is NOT a confirmed absence of tags. The generated docs-branch commits after the frozen reference snapshot likewise are intentionally not counted as original historical source.

## Donor preservation and security context

Original 2025 main ancestry has actual Firebase/Genkit, Home sky/ground/avatar video, bearer-gated temporary audio recorder, journal source, owner-shaped Firestore Rules, deny-all Storage Rules and FFmpeg cinematic primitive. Historical alternate branches add 3D/Council/Orb/layered Home, Replay UI, Ancient Signals, upload and richer visual concepts. Their runtime security must be checked before any migration:

- Ancient Signals scheduled task historically allows missing positive wellness consent; quarantine. Its owner-shaped rules do not replace issuer-verified purpose-scoped consent.
- A historical alternate transcription endpoint writes unconsented raw audio to public assets with no auth in that branch; never restore. The old 2025 main's temporary audio implementation was different and bearer-gated; current quarantined main declines transcription with `501`.
- A Replay thread UI is not verified signed private media playback. Historical asset manifests with placeholders are not complete current-world assets; LFS pointers are not downloaded/hashed media.
- Seven overlapping Frontier/Council benchmark branches share a merge base; do not count their assertions as separate certifications. Original core does **not** regain production authority by virtue of a historical head/branch/PR.
- Source names that mention `urai-4dc1d` are code/config bindings only until cloud provider, IAM and deployment receipts independently prove production association.

## Acceptance and prioritized remaining work

**P0** — Safe authenticated Privacy positive consent → owner/source provenance → Jobs generation/cancel/revoke → Studio private rendering → protected owner Replay → deletion/GC revocation, real effective Firebase Rules and cloud IAM readbacks, production owner approval and independently observed denial/receipt evidence. Retain release HOLD.

**P1** — Canonical `urai-spatial` proof of Home→Ascent→Life Map→Focus→Replay→Escape→Focus→Life Map→Home; Orb, Council, avatars, accessibility/reduced motion, mobile/desktop/XR and supported languages. Crosswalk donor exact source to Spatial, Privacy, Jobs, Studio, UrAi-Dev and UrAiProd before proposing any code transfer.

**P2** — Now that the **4,009 commit metadata union is identified**, obtain every tree/path/blob across the **3,701 distinct historical tree IDs**, independently verify text source and binary bytes/LFS with actual SHA-256 and file sizes, crosswalk Drive original archive, tags and nonadvertised historical refs, historical 2024–25 LifeLogger/LifeOS code/source chronology and licenses.

**P3** — Curate superseded docs/duplicated source, stale checklists and npm cache only after preservation, source ownership and test receipt disposition.

**Not executed in this pass:** repository native build, full Git object download, complete binary or media decode, unit/emulator integration, protected movie output, physical device/XR tests or production deployment. No paid compute or production code changes. **Metadata graph closure PASS; integrated production HOLD.**
