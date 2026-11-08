# Original UrAi — continuation: branch coverage and frozen Council benchmark

**Audit checkpoint:** 2026-11-07, America/Chicago. **Release:** HOLD. **Pinned legacy main:** `8cac3ba513830c11261d57bc2b5dd7ad8b83e85a`.

## Coverage increment
Earlier audit enumerated 242 branch names/heads and independently fetched 23 selected recursive tree responses, see `BRANCH_TREE_SAMPLE.json`. This continuation fetched **84 additional** exact pinned branch-head trees in seven groups of 12, each with GitHub recursive Trees response `truncated:false`, and committed them to `docs/estate/branch-head-trees/batch-01.json` through `batch-07.json`. Therefore **107/242 branch HEAD trees** have been metadata-inspected in total; **135 remain**. All 84 newly inspected heads had distinct `tree` Git object IDs within this set (not a claim every historical implementation is unique). The 242 refs have 239 distinct commit SHAs, proving some branch aliases. Not all branch historical commits/tags or actual blob bytes were crawled.

Each batch records branch name, exact commit, exact immutable tree SHA, blob path count and Git-reported bytes; batches 02–07 also include main-relative added/missing/differing blob counts and selected paths. Batch 01 does **not** include full main-relative counts and instead includes root sizes / selected paths. Do not portray all seven batches as equivalent semantic audits.

## Donor priorities identified in newly scanned branches
- `bench/spatial-memory-pilot-20261011` at commit `d23b35dfe7be29647dbca7e26604ffa4584154aa` has 2,548 blobs (62 paths not on legacy main), including benchmark runners and frozen evaluation documentation. Source and outcomes must remain separately scoped from a production Council.
- `codex/ancient-signals-verification-ci` `2b64a60317cf4a2bdf9a4e0ba2435bb31e7f28f6` contains `.github/workflows/ancient-signals-verify.yml` blob `fc9a23bb1abfbb001bc3642386c4fed53713ac9f`; configuration installs app with Node20 and Functions with Node22. This proves historical workflow source, **not that historical sensitive-signal code met a positive-consent gate**. Main remains quarantined.
- Historical `codex/update-firestore-security-rules-and-tests` holds separate `firestore.rules` blob `4c44c540cc157ec32aee94f60b7eca7fb199a5a7`, reflecting earlier simple ownerUid-based rules. Do not substitute it for current protected Spatial/Privacy rules.
- `codex/update-audio-upload-storage-location` was registered by full tree metadata, but attempted `src/app/api/audio/upload/route.ts` source read was 404 because that path is not present at that ref. This filename error is explicitly uninspected, not evidence upload code absent elsewhere.

## Frozen Council benchmark: accurate historical verdict
Directly read `docs/benchmarks/URAI_HOLDOUT_V2_RESULTS.md` on branch `bench/spatial-memory-pilot-20261011`, Git blob `876e59b437eaf0ffa9635bbf6399494724da840e`. The report pins 2026-08-16 GitHub Actions run `31958485157`, frozen workflow commit `5f5b4fc7583c4c4067c8118053565f0d657b5f19`, one-shot evidence artifact ID `9267341252`, artifact digest `sha256:295a3139b91dbafeb5eb06e4e16af21dd4e3035fd29a8b919df7a95befc1e7fc`. These details are **historical report assertions**; actual linked artifact bytes and runner stdout were not independently downloaded this run.

The report states valid **720 expected provider-task trials**, with semantic accuracy:
- Direct canonicalized: **176/240, 73.33%**
- Self-refinement: **201/240, 83.75%**
- Council v3: **192/240, 80.00%**

**Primary preregistered verdict: NOT SUPPORTED.** Council minus self-refine was **-9 cases / -3.75 percentage points**, McNemar p **0.30567741986311836** and 95% interval **[-0.2416666667, 0.1208333333]**, failing the predeclared +5pp/significance rule. This must not be presented as model/assistant competitive superiority.

Two narrower positives in the original report:
- Council's preservation integrity gate passed: builder **183/240**, final Council **192/240**, **2/183** harmful replacement rate (1.09%, below predeclared 2.5% maximum).
- Council beat direct on a prespecified secondary comparison: +16/240 = +6.67pp; McNemar p **0.03648340000835981**.

The same report explicitly forbids post-hoc tuning of the frozen confirmatory holdout. Later `bench/hard-memory-reasoning-20261014` development documents (blob `5afaafdf8db0b205343883e6ff384401116e0070`) describe small exposed synthetic pilots, **not independent confirmations**. Current production Council, owner-memory provenance, emotional interpretation and protected personal-data intelligence remain unverified by this benchmark.

## Stop conditions
No runtime source, Rules or production deployment modified. No provider spend. No fresh native/emulator/cloud device certification in this continuation. Complete remaining branch heads and historical graph before claiming exhaustive repo recovery. Record actual SHA256 of original binary bytes separately; a Git blob SHA-1/tree alone does not mean full digital-asset review.
