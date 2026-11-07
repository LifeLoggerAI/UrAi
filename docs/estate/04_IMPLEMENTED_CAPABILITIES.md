# Original UrAi — source-pinned capability ledger

**Classification:** `source_verified` means files were directly read at `8cac3ba513830c11261d57bc2b5dd7ad8b83e85a` or manifest-listed where marked `path_observed`; it does NOT mean built, integrated, device-verified or production-certified.

| Capability / family | Source evidence | Status in this original repository | Integration obligation |
|---|---|---|---|
| Public launch home and trust/waitlist | `src/app/page.tsx`, `src/components/launch/LaunchShell.tsx` | **Source-verified** public shell | Test provenance, client write rules and private/public boundary |
| First-person cinematic Home and Ascent | `src/app/app/page.tsx`, `src/components/urai/home/HomeScene.tsx`, `GenesisSceneShell.tsx`; other `urai/home/` models | **Partially wired** on the inspected app-scoped route; no-op handlers/empty canvas child | Use canonical spatial implementation; prove nine-stage navigation |
| Spatial Life Map, star selection and Focus | `src/components/spatial-life-map/SpatialLifeMap.tsx`, `LifeGalaxyScene.tsx` and hooks | **Source-verified** star/focus scene, mock fallback | Bind owner token and real memory stars; test focus-to-focus interactions |
| Replay | `src/app/replay/page.tsx`, app-scoped replay wrapper, `src/components/replay/` | **Demo preview** at root; app-scoped mode lacks equivalent protected playback body | Connect private signed replay in canonical spatial owner scope |
| Orb and companion | `src/app/api/companion/route.ts`, `src/components/orb/`, `src/components/urai/home/MemoryOrb.tsx` | Deterministic companion endpoint and visual source **exist** | Authenticate consented context, Council coordination and safe behaviors |
| Council | `src/app/app/council/page.tsx` → `src/components/urai/council/CouncilWorld.tsx`; benchmark #394 | Source path observed; benchmark isolated/draft | Independent Council intelligence, provenance, real interactive test |
| Mirror/Shadow/Passport | `src/app/app/mirror/page.tsx`, `src/components/mirror/`, `shadow/`, `passport/` | Source families observed; UI not qualified as owner-data production | Verify distinct modes, actual privacy and source lineage |
| Realistic human/avatar/XR | `src/components/urai/humans/RealHumanPresence.tsx`, `urai/real3d/RuntimeGLB.tsx`, `urai/home/HomeXRInteractionLayer.tsx`; `public/assets/avatar/` | Tracked source/assets, historic #374 donor | Device performance, accessibility, rights/license, authentic GLB rendering |
| Mood/emotional layers / memory intelligence | `src/components/urai/home/EmotionalNebulaLayer.tsx`, `src/lib/intelligence/`, `src/lib/spatial-life-map/` | Source families observed, mixed demo/rules | Govern purpose, consent, inference transparency, no medical overclaim |
| Stored owner memory graph | `src/lib/spatial-life-map/lifeMap.firebase.ts`, `firestore.rules`, `storage.rules` | Owner-shaped document paths and Rules sources | Real auth/Rules/Storage positive/negative emulator + cloud proof |
| Waitlist and events | `src/lib/launch/firebaseClient.ts` vs `src/app/api/waitlist/route.ts` | **Competing client/server collection models** | Resolve with Rules and approved authority; no automatic schema merge |
| Privacy/signing | `src/app/api/spatial/consent/route.ts` static placeholder, `src/lib/privacy/` | Prototype / boundary contracts | Use dedicated Privacy real signed positive consent and revocation |
| Governed deployment | `scripts/block-legacy-production-deploy.mjs`, quarantine workflow files | Explicit fail-closed legacy deployment source | Preserve; only Spatial controls production |
| Unit/e2e/security/CI | `tests/`, `src/**/__tests__/`, `.github/workflows/` | 66 named test files and 28 workflow files **path-observed** | Native execution on exact clean source; track logs and exit codes |

Historical `docs/FEATURE_STATUS_MATRIX.md` blob `9386f169ba5422dcf8c2450e1bea763f167ead9e` lists missing/future features for the June V1 DEMO; it is not a verdict on the full November 19-repository architecture. Real implementation must be reconciled from original donors, newer specialized repos and current integration proof before any feature is called never built.
