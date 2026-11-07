# Original UrAi — historical recording, Home, Replay and asset donors: exact-source reconciliation

**Audited:** 2026-11-07 (America/Chicago). **Repository:** `LifeLoggerAI/UrAi`. **Current quarantined main:** `8cac3ba513830c11261d57bc2b5dd7ad8b83e85a`. **Status:** historical/source-only reconciliation; **Genesis production HOLD**. This document is additive to [UrAi Genesis PR #396](https://github.com/LifeLoggerAI/UrAi/pull/396), not an engineering merge or production authorization.

## Scope and method

Independently fetched and parsed all nineteen existing `docs/estate/branch-head-trees/batch-01.json` … `batch-19.json` receipts on the Genesis documentation branch: **19/19 readable**, representing **219/219 distinct branch-head summary records** in addition to the prior 23-head sample. This is *reconciliation of existing recorded GitHub tree summaries*, not another independently executed 219-request Git Trees crawl. Records retain only selected `unique_paths` examples, not full per-branch blob manifests. The prior 242/242 head-tree retrieval result stands as **metadata-only**; full commit graph, every per-branch path and raw-byte SHA-256 remain open.

The inspected source below was fetched by immutable branch head or named branch and GitHub reported the listed content blob SHA-1. Path contents were read; no production execution or claimed standalone native build. Never equate Git object hash with an independently verified payload SHA-256.

## P0 historical recording/privacy donor: do not reactivate

| Provenance | Exact evidence | Finding |
|---|---|---|
| **Historical** `codex/update-routing-and-layout-for-onboarding` at `d56a01b277ac42b2e0f9861c91e824c035969afb` | `src/app/(main)/record/page.tsx`, blob `d0bd1196cdd2edcda49f5be5d0307ed950b38855` | Real microphone permission/MediaRecorder UI, webm buffer, POST `/api/transcribe`. The source has no visible exception flow and does not stop its microphone stream tracks on stop. Historical donor only. |
| **Historical** same branch | `src/app/api/transcribe/route.ts`, blob `688dec92d6dd7127bd6222a7d65d69d9c0b5a9f7` | The POST handler has no visible authentication or consent validation, saves raw uploaded bytes beneath `public/audio/`, appends `data/transcriptions.json` and `data/journal-entries.json`, and returns literal dummy transcription. No retention/revocation/deletion enforcement is visible in this route. **Do not reinstate** this old implementation. |
| **Current legacy main** `8cac3ba513830c11261d57bc2b5dd7ad8b83e85a` | Same `src/app/api/transcribe/route.ts`, blob `bc9a2536c23be336e99a22406bb9d95d85e717d6` | Does **not** save audio; responds `501 provider_not_configured` after request checks. The helper `hasValidBearerToken` returns true if `TRANSCRIBE_API_KEY` is unset, so this is **processing fail-closed**, not a future-proof authentication design. Protect that distinction before any transcription provider is enabled. |

**Risk classification:** high-risk *historical source*, not a demonstrated deployed public-media leak. Required future canonical acceptance: authenticated owner binding, positive purpose/source consent, private storage rather than public static assets, filename normalization and size/type limits, provider isolation, stream shutdown, revocation/deletion/export, negative cross-owner tests and signed audit receipts. Keep legacy deploy quarantine and avoid unsafe automatic porting.

## Recovery ledger for other historical source donors

| Donor/ref | Verified source object | What exists | What is not established |
|---|---|---|---|
| `genesis-safe-consolidation` `d826aef23832e272abd69868c88d5df7675a4cdd` | `src/components/genesis/LayeredGenesisScene.tsx` blob `ff3fc2a4a828f84b3f97eb234de1506bde8975b7` | Functional React **layered-image** Home composition, nine mood opacity presets, Orb visual, audio/voice hooks, sky/Ground/Passport/Settings event callbacks and reduced-motion CSS | Actual 3D/XR world, asset bytes, callback integration or canonical Spatial parity; file absent at current legacy main |
| Same frozen donor | `src/lib/urai-genesis/firestore.ts` blob `936a55634a9a29c2d38b351a20b68e942c6721eb` | Typed collection names and document/query helpers spanning signals, audio, identity, mental load, memories, Council, exports and audit | Authenticated persistence, effective Rules, role enforcement or source provenance |
| Same frozen donor | `src/lib/urai-genesis/intelligence.ts` blob `509f506a2572452998288b2652bafc7982ccb4ec`; `tests/unit/urai-genesis.intelligence.test.ts` blob `227dcc059f7d16307abbea572b83e794f2ec2449` | Deterministic mental-load/mood/Orb/narrator functions, text-based unsafe-certainty phrase checks and **six test cases in source** | Clinical correctness, model evaluation, positive permission enforcement or freshly executed tests; heuristic phrase list is not a general safety classifier |
| `urai-production-polish-pass` `37e68d75b7b0c7faa34441f420ed7c487b998cf0` | `src/components/life-map/ReplayThreadView.tsx` blob `c9618e70a8b46f2782d1ff53dd96b100228190d9` | Select/exit and within-constellation memory beat navigation, `reducedMotion` presentation option | Actual private media decoding, playback authorization, signed URL or deletion races; file absent at legacy main |
| Same frozen donor | `src/components/life-map/HomeAuraScene.tsx` blob `d0ca0e43341647581044e6a81f10b23aad4681ab` | CSS/React atmospheric Orb Home enter button, keyboard focus and reduced motion | Real 3D first-person Ascent, mobile/XR performance |
| `urai-asset-factory` `98526c7bc2ec85906af042cc03b5929612bbd9f1` | `public/assets/urai/manifest.json` blob `ecda96bb7d21a6294dd89e695b03163da799b082`; `fallbacks/launch-critical-placeholders.json` blob `40781216c10390ad5e2dc981ddb586a9d6594a02` | **Twelve declared launch-critical assets**, mapped to Home, Ground, Life Map, Focus, Replay and Passport; each marked `status: "placeholder"`, `file_path: null` | Shipped GLB/rendered final model for these twelve entries; this does **not** mean other historical GLB assets elsewhere are absent |
| `genesis-public-launch` `000147f432ab309a49fe0736ed5cc4ed32ba2199` | `public/assets/audio/genesis/mood/calm-bed.wav` and `hopeful-bed.wav`, both blob `18e33261300fde73b6aa2a31a23b1f0a52ee75a5` | Each fetched "WAV" file consists of an identical **130-byte Git LFS pointer** with external oid `sha256:1dec5f5d84deadeb3fd86553faed3abac54828f478d9c8cc72da1e3365668413` and declared payload size 63,548 bytes | Distinct real mood sounds, downloadable original payload or playback acceptance. Pointer SHA-256 is **claimed by LFS metadata**, not rehashed payload bytes |
| Same launch branch | `docs/asset-generation/genesis-audio-voiceover.md` blob `43b0205a9d96aaeac149380144a9bba6afe2aa1e` | Script/cue/caption directions; the document explicitly says final music and voiceover were not generated there | A mastered/approved launch soundtrack |

**Keep donors, don't substitute them:** The original main Home, Life Map and Replay source observations remain described in `03_ARCHITECTURE_AND_CONNECTIONS.md`. An earlier interactive layered Home is not the same as the later 3D Home; a Replay thread UI is not owner-locked private media; a declared asset is not a rendered 3D model. Compare exact behavior against current `LifeLoggerAI/urai-spatial` / `urai-tier1` and specialized Privacy/Jobs/Studio before choosing to port selected implementation or art.

## Branch-head snapshot outliers — inspect, do not infer completion

The recorded **219** branch summary records include:

- `copilot/fix-d95f7a09-19e3-4778-8582-5937fce8e126` at `f9b59364763c39257ce863a88a6aeefdc8158490`: **5,298 blobs**, **1,160,967,219 Git-reported bytes**, 4,242 paths reported missing on legacy main.
- `copilot/fix-346bd111-e126-488a-8b6a-9644d577afde` at `d32225a886ac786a679d2c25305c86f2231b8213`: **5,247 blobs**, **1,160,332,442 Git-reported bytes**, 4,191 paths absent from main.
- Example historical `checklists/URAI_Completion_Board_Master_Checklist_All_Completed_2081-2100.md` on the first branch, blob `0b8c6b1e81495f1612a8ee661678d6771814d8b5`, says all items are checked but contains **no executable receipt**. It is a historical checklist claim, not all-feature certification.
- `genesis-public-launch` and `genesis-safe-consolidation` **diverge** from main. GitHub Compare reports respectively 38 ahead/434 behind and 8 ahead/580 behind; merge-base diffs do not enumerate every snapshot-only path. No direct branch merge recommended.

These counts are from previously recorded Git Trees responses, not independent recomputed asset download bytes or unique content totals. Need exact full path/tree checks on both large branches, distinguish cache/duplicate/checklists/media from useful code, and read any new meaningful donors before certifying historical completeness.

## Exact verification and next actions

**This continuation newly completed:** 19/19 stored branch-summary file readback, targeted original historical source reads including security-sensitive audio handlers, current-main equivalent route readback, two main-path absence checks, branch comparison metadata and documented consent boundary. **Not executed:** Git checkout, frozen installs/builds, real Firestore/Auth/Storage emulators, private media rendering, physical-device tests, production deployment, LFS object download, all-commit history graph. GitHub APIs remain available; direct container Git access previously failed due remote DNS.

- **P0:** Retain old audio route and Ancient Signals consent-defect quarantine; enforce current single canonical private audio/consent/owner pathway and sole protected output-writer IAM before enabling real data or rendering. Resolve effective shared Firebase Rules publishers; obtain signed positive C6, writer post-revocation 403, drain/deletion ACK and real owner-only Replay.
- **P1:** Compare these specific donor behaviors to the canonical Spatial implementation without replacing it; verify the full nine-stage journey with owner data, Orb, Council, accessibility/reduced motion, supported languages and device hardware.
- **P2:** Traverse all reachable commits and tags; persist full per-branch path/blob manifests; independently SHA256 actual assets and LFS payloads, examine two 1.16 GB branch outliers, historical Drive lineage and license/source attribution.
- **P3:** Retain and label superseded audio/transcription, asset placeholders, checklist and visual route docs; decide deduplication only after preservation and compatibility proof.

**Result:** Historical donor source and risks more precisely recovered; neither original UrAi core nor One UrAi integrated production is declared complete. **HOLD.**
