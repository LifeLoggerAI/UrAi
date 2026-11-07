# Original UrAi — branch-exclusive head reconciliation closeout (2026-11-07)

**Estate scope:** `LifeLoggerAI/UrAi`; baseline frozen original `main` `8cac3ba513830c11261d57bc2b5dd7ad8b83e85a`. **Status:** HEAD comparison coverage COMPLETE for the existing 242 branch snapshot; exclusive commit union, all historical content, raw media and production acceptance remain INCOMPLETE. **No code promotion/deployment; Genesis HOLD.**

## Method and exact evidence

Independent readback of existing `docs/estate/REFS.json` (242 recorded refs) plus four `docs/estate/main-commit-history/part-0{1..4}-of-04.json` records (3,152 reachable-from-main SHAs) established a frozen branch-head reachability census. This comparison **does not** assume every branch tip is a unique body of work. Its permanent exact per-ref result is `docs/estate/branch-exclusive/head-census.json`, read-back Git blob hash recorded separately in the ledger.

Of 242 registered branch references, **130** tips are in the complete original-main commit set (127 distinct SHAs; duplicated branch aliases) and **112** tips are outside it (**112 distinct SHAs**). The 242 refs resolve to 239 unique tip SHAs.

For every one of the **112** outside-main tips, executed connected GitHub `compare_commits` with immutable `base=8cac3ba513830c11261d57bc2b5dd7ad8b83e85a` and the frozen tip SHA, preserving ten immutable machine-readable records on the existing UrAi documentation review branch:

- `docs/estate/branch-exclusive/compare-batch-01.json` — 12 records, Git blob `a569d34c2851e5bc9e3854f8174f88095cfd8293`
- `docs/estate/branch-exclusive/compare-batch-02.json` — 12 records, blob `b5f08d9b2b2294aea7f5452c83b99ebdb477cbb9`
- `docs/estate/branch-exclusive/compare-batch-03.json` — 12 records, blob `5543173d666f4c54404d2c6a8d9f39a27a7c4caf`
- `docs/estate/branch-exclusive/compare-batch-04.json` — 12 records, blob `5bd4c44227aa93035fffe0e7ef3b49ef2f3e53bb`
- `docs/estate/branch-exclusive/compare-batch-05.json` — 12 records, blob `b94da937a687799a5399139e544d74ff68781c2d`
- `docs/estate/branch-exclusive/compare-batch-06.json` — 12 records, blob `5f91ae63950f0e3e0ecc6faf6a4e754b2351970a`
- `docs/estate/branch-exclusive/compare-batch-07.json` — 12 records, blob `62178542bf1f1781a3faf7870da1dd82542bce3c`
- `docs/estate/branch-exclusive/compare-batch-08.json` — 12 records, blob `20744737e61026d3f0e50d870f750c114e40167a`
- `docs/estate/branch-exclusive/compare-batch-09.json` — 12 records, blob `5e3a72472bc92520e939cf48b92949ee498ef2e5`
- `docs/estate/branch-exclusive/compare-batch-10.json` — 4 records, blob `33e77b537ed8990ffde1b27d63520ddc8a4a9092`

All 10 files were fetched back, JSON-parsed and cross-checked: **112 unique tip comparison records, zero parsing/fetch errors, 105 GitHub `diverged`, 7 `ahead` with `behind_by=0`, and 78 distinct merge-base SHAs**.

**Critical limitation:** Sum of individual `ahead_by` counts is **1,315**, but branches share ancestry; **1,315 is NOT the number of distinct branch-exclusive commits** and cannot be used as a unique commit total or % full-history completion. The exact branch-exclusive commit SHA union has **not** been retrieved. GitHub Compare returned limited per-file listing and samples; this is not a complete byte inventory for all commits or all files ever authored.

## Highest-relevance donors and conflicting authorities

The following frozen branch heads were compared against original main:

| Historical source branch | Exact tip SHA | Ahead / behind | Source inference and required action |
|---|---|---:|---|
| `codex/hard-benchmark-oracle-repair-20261014` | `12794cbb2599e644fbb982c2d5be244f4879e35e` | 78 / 29 | Distinct benchmark/oracle code; no production Council benchmark superiority. Preserve integrity/holdout conditions and evaluate with published runner evidence |
| `bench/hard-memory-reasoning-20261014` | `741f98a52b379955da45613e81e4ec468befe514` | 73 / 29 | Shares same merge base `cf497899c9943ea14d9a06a162fa842c25c3a415` with frontier benchmark branches: nested/overlapping work, not independent successes |
| `genesis-visual-supremacy` | `f935befbebfca9289a74920a4fcb62411a339764` | 49 / 1142 | Actual rich Home/Orb donor, **superseded production control** by canonical Spatial |
| `genesis-public-launch` | `000147f432ab309a49fe0736ed5cc4ed32ba2199` | 38 / 434 | Staged onboarding/assets/captions; large changes may include cache deletion, placeholder audio and nonfinal assets |
| `feature/ancient-signals-engine` | `925d018f03e05f3e7be7bd4c15867d15c41da2e8` | 29 / 2176 | Real computed engine with documented **absent positive consent** historical defect; must never re-enable as-is |
| `urai-asset-factory` | `98526c7bc2ec85906af042cc03b5929612bbd9f1` | 62 / 105 | Historical asset registry and fallback files, 12 launch-critical entries marked placeholders; do not equate names with packaged GLBs |
| `urai-production-polish-pass` | `37e68d75b7b0c7faa34441f420ed7c487b998cf0` | 6 / 1710 | CSS Home/Replay thread and Focus UI; not current private owner media Replay |
| `codex/update-routing-and-layout-for-onboarding` | `d56a01b277ac42b2e0f9861c91e824c035969afb` | 1 / 2271 | Historical regressive public-audio upload/transcription handler; preserve as security negative example |
| `genesis-safe-consolidation` | `d826aef23832e272abd69868c88d5df7675a4cdd` | 8 / 580 | Layered Genesis Home, Orb and emotional-state computation/unit-source; current legacy main lacks particular component |
| `integrate-cinematic-urai-redesign` | `0f2294a5a9f9f082bf84ad643743eca6ab70f526` | 37 / 1875 | Historical cinematic 3D scene and emotional nebula pieces; compare to Spatial rather than blindly resurrect |
| `chore/quarantine-legacy-production-authority-v2-20260715` | `5f749548a18f07a113dab33201d943ec905e0858` | 56 / 81 | Historical safety/canon quarantine branch. Review, do not restore legacy deployment workflows |
| `fix/legacy-launch-gate-chromium-20261009` | `305fc519485b867cec57b971bfcb724ca264d1f3` | 9 / 0 | Branch ahead of frozen main; experimental guard/dependency changes require independent review, not proof of production |

**Duplicate ledger:** `implement-system-release-readiness`, `system-of-systems-backbone` and `system-of-systems-verifier-satisfaction` all point to the same tip SHA `203df0eff5eb17884b6050a976d6b0759723b18d`. `fix/firestore-rules-ci` and `home/final-lock` both resolve to `8b09b709ad85643463c4bd2d674b3974097cdd1d`. One SHA means same tip snapshot, not separate independently certified capabilities.

**Production authority:** UrAi original remains legacy/reference/quarantined. `LifeLoggerAI/urai-spatial` controls current consumer Spatial runtime, with distinct Studio, Privacy, Jobs authorities pending safe cross-service integration and independent acceptance. This comparison authorizes **no merge** of its historical branches. Subsequent canonical-current comparisons must pin the active sibling PR heads, not historic summaries.

## Test/certification matrix for this continuation

| Evidence class | Result |
|---|---|
| Main reachable commit graph | Previous pass **3,152 unique commits; parent closure verified** |
| Frozen branch-head metadata membership | **242/242 refs classified** |
| Frozen outside-main branch-tip GitHub comparisons | **112/112 fetched, saved, parsed** |
| Exclusive-commit union across 112 branches | **Not counted; overlaps unenumerated** |
| Full historical per-commit files/bytes / Git LFS download and SHA256 | **Open** |
| Original native build/security tests at pinned source | **Not run** |
| Authenticated owner Privacy→Jobs→Studio→Replay runtime | **Uncertified** |
| Physical device, XR, accessibility, production release | **HOLD** |

## P0–P3 work list

**P0:** Keep historical unsafe upload and absent-consent Functions disabled; obtain actual effective Firestore/Storage Rules, signed positive owner consent, right-to-use provenance, real private rendering, post-revocation write denial, cancellation/deletion receipts and owner-only Replay across native integrated services. No production release until independent acceptance.

**P1:** Exact-source behavioral crosswalk of Home/Ascent/Life Map/Focus/Replay, Orb/Council/Mirror/Passport, protected family avatars, accessibility and device transitions with current `urai-spatial`, `urai-privacy`, `urai-jobs`, `urai-studio`, `UrAi-Dev`, `UrAiProd`. Preserve donors but never give original legacy repo parallel production control.

**P2:** Fetch and deduplicate actual **branch-exclusive commit SHAs and their parents**, then all unique reachable history trees/blobs, Git LFS payloads, large original media and private Drive archive. Distinguish historical source existence from executed tests. Recover 2024–25 LifeLogger/LifeOS lineage. Tags listing remains unresolved (404 previously); empty releases listing does not establish no tags.

**P3:** Preserve historical docs, incomplete sample assets, superseded variants and repeated CI/test claims until binary provenance, licenses and replacement acceptance are recorded; do not erase the npm cache or other history merely because it is not modern release content.

**Conclusion:** This closes the selected 242-branch **tip ancestry-comparison** layer, while deliberately keeping *full historical commit-union, per-file contents and production acceptance* open. **No deployed changes and no paid compute.**
