# Original UrAi — complete reachable `main` commit graph and 2025 source-lineage correction

**Audit checkpoint:** 2026-11-07 (America/Chicago). **Source repo:** `LifeLoggerAI/UrAi`. **Immutable main:** `8cac3ba513830c11261d57bc2b5dd7ad8b83e85a`. **Scope:** main's reachable ancestry only. **Production:** Genesis HOLD; legacy deploy quarantine intact.

## Completed source/commit preservation

GitHub REST `GET /repos/LifeLoggerAI/UrAi/commits?sha=8cac3ba513830c11261d57bc2b5dd7ad8b83e85a&per_page=100&page=N` was traversed **pages 1–32**. Pages 1–31 contain 100 commits each; page 32 contains 52; page 33 and later remain outside this documented API walk, but the prior check with 20-per-page returned empty page 159 and actual oldest entry is a zero-parent root. The manifest is pinned to an immutable SHA rather than moving `main`.

Four exact records of GitHub-returned **commit SHA, canonical Git tree object SHA, parent commit SHAs, author/committer UTC and first-line commit title** are committed on this documentation branch:

- `docs/estate/main-commit-history/part-01-of-04.json`: 800 commits, pages 1–8, Git blob `94be6813b000067a3d44c75cc5a200161ebabfad`.
- `docs/estate/main-commit-history/part-02-of-04.json`: 800 commits, pages 9–16, blob `ee3064311d57e190aaf6f8e7ba23492af0d30044`.
- `docs/estate/main-commit-history/part-03-of-04.json`: 800 commits, pages 17–24, blob `43bd609d073817004dc70d597a5351cc33f1c610`.
- `docs/estate/main-commit-history/part-04-of-04.json`: 752 commits, pages 25–32, blob `35872adcd8f5f1f74ae8ecbb395747c672a450a9`.

All four were **fetched and JSON-parsed back from GitHub**. Cross-part graph consistency analysis found **3,152 unique commits, 2,892 distinct tree IDs, 283 commits with multiple parents, one zero-parent root, 3,434 parent references and zero unresolved parent references** within the registered graph. This is the first complete **GitHub REST reachable-commit metadata index for this pinned `main`**, not a full independent reconstruction of Git commit bytes, a complete tags/refs scan, unique historical blob inventory, or full history across alternate branches. Git tree IDs are actual `commit.tree.sha` fields from GitHub commit records, not the earlier misidentified top-level recursive-Trees response SHA.

Reachable main root: `3696b985821e479c67d5df8a827367dc3f8fe172`, 2025-06-25 14:01:52 UTC, message `initial scaffold`, no parents, actual tree `da471f4e6eaffb5751d4599819dc9f3ce0309014`. Direct GitHub recursive tree API returned `truncated:false`, 63 entries, **55 blobs**, **513,429 reported bytes**; initial `src/app/page.tsx` blob `6ff53738586f3a3d34219a668e572d8ed90bf467` is an **empty Home component**, not a working life-recording app. Initial Genkit config `src/ai/genkit.ts` blob `cbf2594c61b52c9ecc244898faf647c3910772f9` chooses `googleai/gemini-2.0-flash`; package `575d1ccc1da4ba2f3e7ff1ac8b15c8de3f347c2f` includes Next and Genkit dependencies; `apphosting.yaml` `a55af7b17b5de7a862199a1ce104aa8bf7144b46` sets `maxInstances: 1`. This establishes a software scaffold and selected technology, **not a deployed working application or a verified earlier LifeLogger/LifeOS implementation**.

Main snapshots also independently fetched by true canonical Git tree object:

| Immutable main-ancestor SHA | True tree object SHA | Blobs / reported bytes | Interpretation |
|---|---|---:|---|
| `3696b985821e479c67d5df8a827367dc3f8fe172` | `da471f4e6eaffb5751d4599819dc9f3ce0309014` | 55 / 513,429 | June 2025 Firebase Studio scaffold; Home initially empty |
| `a632f85316d62dffecef8eafc8a3237ce02c16dd` | `6efdc3138420be5ce3871dc015db51e3627ea55b` | 1,187 / 598,829,130 | Late-September working-code and media history; reported mass includes `public` media and anomalous npm cache |
| `6d8acda6d8b60ca41bcd19bc3065732136ad331d` | `7fa458aee557bbc60865069d84f3430d02c7221e` | 1,226 / 598,895,854 | Sep 30 routes, media, Firestore emulator test source |
| `117aceb6c152dd3bbda9c324d38dcdf9d1400ee7` | `bba049324389fc2f6a52f06132b3809beb419b94` | 1,235 / 598,902,441 | Nov 18 original Home view and Orb fallback source |

All tree responses `truncated:false`; counts are metadata, not independently hashed asset bodies. Current October 2026 main remains **2,489 blobs / 604,647,401 Git-reported bytes**.

### 2025 original source: nuance and regression ancestry

This directly **corrects** an overly broad interpretation in the previous audit. The dangerous no-auth public-storage transcription endpoint on alternate branch `codex/update-routing-and-layout-for-onboarding` (`d56a01b277ac42b2e0f9861c91e824c035969afb`, `src/app/api/transcribe/route.ts` blob `688dec92d6dd7127bd6222a7d65d69d9c0b5a9f7`) is **not the only original audio design**.

At main's 2025-09-30 ancestor `6d8acda6d8b60ca41bcd19bc3065732136ad331d`:

- `src/app/api/transcribe/route.ts`, blob **`7ab770445250741232e089820bcb968b0f45ac5f`**, explicitly rejects missing `TRANSCRIBE_API_KEY`, rejects unauthenticated bearer, writes temporary audio to `.uploads/audio` outside `public/` and removes its temporary file in `finally`. It still returns a literal **dummy transcription**, saves local JSON, uses user-supplied original filename without sufficient independent validation in the inspected handler and has no per-user signed-consent/provenance proof. Thus `fail-closed API key` does **not** establish modern owner authorization.
- `src/app/record/page.tsx`, blob `813190aaa4529a5f0b59c1f2d77fd947f2d45a40`, has real `MediaRecorder` capture and form submission UI; no actual transcriber-model invocation was observed.
- `src/app/api/journal/route.ts`, blob `4a78723c9261256c03e6b3f24c8981cae6600022`, implements local JSON journal title updates by timestamp and has **no authentication** in the directly inspected PUT handler. Historical source concern, not proof of a live endpoint.
- `storage.rules`, blob `f08744f032ed3a207ebd8f0155c6f719665c0e7c`, explicitly denies every client Storage read/write. `firestore.rules`, blob `5806a8f5c1d81b72fa9cdb95ba1ca59bb4ff5f45`, includes `ownerUid`-shaped ownership for many top-level collections and owner-specific user path; the source test `tests/rules/firestore.rules.test.js`, blob `5a2ce0849641067d45359860524a33fc3c6a4913`, contains seven owner/cross-owner assertions across three sample collections (21 parameterized cases in source), **not executed in this continuation**. Effective deployed Firestore/Storage Rules not independently read back.
- `functions/src/index.ts`, blob **`5364c2e23f058b0f4b194394f8b4d9225cff9e2d`**, implements `renderStoryMovieMP4(movieId,movie)` with Firebase Admin bucket reads, FFmpeg `spawn`, 1920x1080 composed video, black intro/outro, optional title image, music or silence, `libx264`/`aac`, optional crossfades and local MP4 output. **This is a real earlier renderer primitive in 2025 main ancestry**, not merely later branch `feature/life-map-full-implementation`. It does not itself prove final uploaded output, protected signed URLs or owner Replay. Compare with modern Studio and Jobs contracts; preserve history and never restore privileged media writing unsafely.
- `firebase.json`, blob `95b84bbdd189c06b498e93dccb79f8d95228fcd1`, has `hosting.site="urai-4dc1d"`; `src/lib/firebase.ts` blob `74156e42706289ad8c9aaee6b3c604d1e254d993` requires Firebase app/auth/storage/firestore environment configuration. **Source binding is not provider-side deployment confirmation**.
- `src/app/page.tsx`, blob `71f02e1c7396978110ce393cbe824fe86d3301ea`, renders `HomeScene` (blob `e7794acb7f6f66e35d0b4580aea13904f8a1a661`) with layered sky, ground and avatar video. This is **visual playback source**, not proof of 3D world interactivity or actual protected personal memories.

**Lineage lesson:** Genkit starter (June) → actual audio/journal, media and movie source (September) → spatial and richer home evolution (2026) → quarantined legacy `main` (October) is a demonstrated *subset* of the history; the early 2024 LifeLogger/LifeOS source needs independent archive recovery. Source chronology distinguishes built primitives, partial integrations and separately regressed branches. Never promote a prior checklist's `completed` assertion into current acceptance.

### Outstanding exact work

**P0:** retain unsafe alternate audio endpoint and Ancient Signals absent-consent code as nonactive history; modern Privacy owner-signed positive consent, source rights and revocation, single protected output writer/IAM denial, authenticated Replay, deletion ACK and effective cloud Rules readback are required before production. **P1:** compare original Home/Orb/Replay, movie, avatar and data/ownership semantics against latest reviewed Spatial/Privacy/Studio/Jobs/Dev/Prod source and test them in integrated runtime/device. **P2:** expand from this complete reachable-`main` history to **branch-exclusive commits**, tag attempts and all historical blob payloads; preserve LFS, licenses, 2024–25 archives and original human/AI co-creation evidence. **P3:** label older conflicting deployment, demo, route and placeholder documents; deduplicate only after evidence preservation.

**Test classification:** This pass ran GitHub API retrieval and a deterministic consistency inspection of four committed metadata partitions, **not a Node-native original repository build, Firebase emulator test, FFmpeg render, hardware acceptance or deployment**. Graph integrity is not a runtime security certificate. **Production HOLD.**
