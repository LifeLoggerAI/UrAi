# Original UrAi — evidence-bounded lineage and historical implementation

**Source baseline:** `8cac3ba513830c11261d57bc2b5dd7ad8b83e85a`. GitHub current main is a legacy/reference snapshot; it does not represent all 2024–2026 LifeLogger/LifeOS/UrAi source trees. The complete 242 current branch heads are in [REFS.json](REFS.json).

## Timeline and source branches
- **2024–2025 original lineage:** LifeLogger, LifeOS, and UrAi were built over time. Reconstruct dates and source ownership from original exported conversations, independent archives and surviving commits; do not infer actual code from design messages. Historical source investigation is incomplete.
- **2025 / early 2026:** original product/data and visual work survives as source, assets, models, shaders and docs across legacy repositories; importing this into the canonical runtime needs exact lineage, license and tests.
- **May–June 2026:** UrAi main retains Home/Memory/Focus/Replay, public demo, Firebase rules and tier lock work. Significant merged or recorded PRs include #237 immersive 3D Home/Life Map, #244 Life Map hydration/polish, #253 attachment canon, #264 Focus/Replay contracts, #287–#292 system contracts/spatial universe, #298 Tier 1–5 freeze, #309 memory-to-world root and #325–#328 competing route consolidation.
- **July–August 2026:** #329 legacy visual-supremacy branch was explicitly superseded; #352, #359, #370 and later main-line controls removed legacy production authority; #374 contains historic real GLB worlds/human Council work, #375 Council benchmark harness, #378 legacy quarantine/WebXR guard improvements. These donors remain important; don't re-promote obsolete deployment code.
- **October 2026:** main `8cac3ba513830c11261d57bc2b5dd7ad8b83e85a` (last recorded main commit October 5) uses current legacy public launch surface. Current open draft engineering PR [#394](https://github.com/LifeLoggerAI/UrAi/pull/394), head `12794cbb2599e644fbb982c2d5be244f4879e35e` when inspected, contains benchmark V2 synthetic oracle repairs. This evidence is scoped to offline testing, not Council performance certification.
- **November 2026:** repository Genesis documentation [#396](https://github.com/LifeLoggerAI/UrAi/pull/396) preserves source-pinned audit; Labs private master registry [#262](https://github.com/LifeLoggerAI/urai-labs-llc/pull/262) coordinates the 19-repository estate.

## Precise canon conflict
`docs/REPO_CANONICAL_STATUS.md` (June 25, blob `4b202d12fc61a4d3be3e67fbedaf93edef706466`) and `docs/URAI_CANON.md` (blob `ed9da27ca725341e680527fe6292cd79f06468eb`) call `UrAi` canonical. Current `README.md` (blob `cc011d955af19a7c700b4a97163951f0be8bc994`) and active fail-closed code explicitly assign `urai.app` authority to `LifeLoggerAI/urai-spatial` → `urai-tier1` → `main`. Record older documents as **historical provenance**, not as authority to deploy.

## Gaps
No exhaustive first-commit-to-current graph or 242-branch ancestry walk, historical binary/digest comparison, PR diff full coverage, provenance signature or complete LifeLogger/LifeOS transition is claimed. GitHub tag-reference listing returned 404 on this connection; this does not establish tag absence. The releases listing returned an empty page.
