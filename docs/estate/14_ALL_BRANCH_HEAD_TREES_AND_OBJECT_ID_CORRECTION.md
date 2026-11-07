# Original UrAi — all accessible branch-head trees enumerated (2026-11-07)

**Source repository:** `LifeLoggerAI/UrAi`. **Baseline main:** `8cac3ba513830c11261d57bc2b5dd7ad8b83e85a`. **Release decision:** HOLD. This report supersedes the *counts* in prior interim branch-coverage reports; their original receipts remain historically preserved.

## Verified at current connection snapshot

**242 / 242 inventoried current branch HEADs had complete recursive GitHub API tree responses (`truncated:false`), zero failed tree requests.** The 242 registered names resolve to **239 distinct commit HEAD SHA values**. This is a complete **branch-head tree traversal at the frozen ref snapshot**, not a complete history of all commits or asset bytes.

- Earlier `docs/estate/BRANCH_TREE_SAMPLE.json` independently records 23 selected complete tree responses with main-relative file identities and sizes.
- This continuation added **19 separate JSON receipt files** at `docs/estate/branch-head-trees/batch-01.json` through `batch-19.json` for the other **219** registered branch heads. Each batch response was read back. All 219 records are distinct branch names, complete and free of reported request errors.
- The new 219 branch head responses cover a non-deduplicated aggregate of **355,945 blob positions across branch snapshots**. That number repeats the same file across branch heads and **must never** be presented as unique files or byte-complete estate coverage. Largest of these branch-head trees has **5,298** blob paths, smallest **994**; the historical main manifest is 2,489 tracked blobs / 604,647,401 Git-reported bytes.
- All 242 branch-head responses include recursive file-path/type/size/object-SHA metadata from GitHub at the time of request, but **only filtered/summarized path records** were persisted in the 19 batch files. Full per-file **per-branch** manifests are not claimed stored; re-fetch using immutable pinned commit to obtain them. No independent full-blob SHA-256 sweep or content review across all paths was performed.
- Legacy quarantine branch and original `main` were not mutated. Documentation branch `docs/genesis-estate-handoff-20261106` is itself moving because of this audit; its recorded head snapshot is not its final current head.

## Object-identity correction — IMPORTANT

GitHub `GET /git/trees/{commitSha}?recursive=1` successfully resolved the requested commit and returned a full `tree[]` array, but the response's top-level `sha` matched the **requested commit SHA** for all 219 new receipts. This is not the immutable Git **tree object SHA**, despite earlier batch entries using property `tree` for that returned value. Interpret `batch-*/branches[].tree` as **the source API's echoed/ref-resolved response SHA**, not an independently certified Git tree-object ID.

Independently fetched Git commit objects prove the distinction:
- `main` commit `8cac3ba513830c11261d57bc2b5dd7ad8b83e85a` has actual tree object `59b3539e0a5972c2aadfd8801bba43a9d76836c5`, while recursive API response top-level `sha` echoed the commit SHA.
- `bench/spatial-memory-pilot-20261011` commit `d23b35dfe7be29647dbca7e26604ffa4584154aa` has actual tree `9c26a8de17616185a2bac1bc29a4c3124f50f68d`.

**Required repair for machine users:** call `GET /repos/LifeLoggerAI/UrAi/git/commits/{headSha}` to obtain each `tree.sha` when actual tree-object identity is needed. Do not compare `branches[].tree` as if it were a separately validated tree SHA. The complete recursive list's individual blob `sha` values remain the Git-reported blob object IDs.

## Reconciliation result

The previously open **branch-head discovery and tree fetch** task is now **metadata COMPLETE at frozen snapshot (242/242)**. The following still are **NOT COMPLETE**:
1. Reachable commits, parent/merge graph, tags, dangling/orphaned historic objects, all PR diffs and branch ancestry.
2. Complete per-branch per-file persisted manifests, actual bytes and independent Git-object/SHA-256 verification for source, videos, audio, avatar, texture, models, LFS and archives.
3. Complete source/text/doc semantic reading and donor-to-canonical Spatial/Studio/Privacy/Jobs comparison.
4. Native original fixed-source builds, CI logs, real security emulators, signed consent/revocation, protected render/Replay/deletion and physical-device acceptance.
5. Independent review, IAM and deployment/source parity, legal/provider/billing readiness and founder GO.

The historical Ancient Signals consent flaw, reference public submission policy risks, older story-movie render primitive and interactive Home/Orb donors remain separately recorded in `10_`–`12_` documents. Original built source is preserved without asserting that the current integrated runtime is accepted.

**Certification:** Branch-head tree discovery **PASS (Git metadata only)**. Full forensic byte/history/security/production release **HOLD**.
