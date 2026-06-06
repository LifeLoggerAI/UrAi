# URAI Repo Execution Lock

Last updated: 2026-06-06

This file is the working lock for coordinating the URAI repositories after the cross-repo audit. It is intentionally conservative: only implemented, tested, consent-safe, and deployment-verified surfaces may be described as live product capability.

## Canonical source of truth

`LifeLoggerAI/UrAi` remains the canonical production app and launch coordination repo.

Canonical production facts:

- Canonical app repo: `LifeLoggerAI/UrAi`
- Firebase project/site currently documented for canonical production: `urai-4dc1d`
- Canonical deploy command from this repo: `npm run ship:urai`
- Non-canonical app repos must not be deployed directly as production URAI.

## Current product state

URAI is currently a launch-focused public demo spine, not the fully integrated passive life operating system yet.

Verified or launch-safe V1 surfaces inside the canonical app:

- `/` memory-to-world / cinematic home entry
- `/home` deeper symbolic home experience
- `/u/adamclamp` public constellation demo
- `/api/companion` deterministic mocked companion narrator endpoint with safety boundaries
- `/api/waitlist` early-access capture endpoint
- seeded demo data for timeline stars, memory blooms, mood forecast, and weekly reflection
- Firebase rules/index scaffolding for V1 launch collections

## Repository roles

| Repo | Current role | Execution decision |
| --- | --- | --- |
| `LifeLoggerAI/UrAi` | Canonical app and launch coordination repo | Keep as production source of truth. All user-visible production features must land here or be explicitly wired through this repo. |
| `LifeLoggerAI/UrAi-Dev` | Development/staging sandbox | Use as reference only. Port anything production-worthy into `UrAi` and pass canonical checks. |
| `LifeLoggerAI/UrAiProd` | Legacy production archive/reference bundle | Do not deploy directly. Mine only for migration candidates. |
| `LifeLoggerAI/urai-spatial` | Deployable spatial experience layer candidate | Treat as the next major integration candidate for the true 3D/spatial home direction. It is not production-canonical until ported/wired into `UrAi` and verified. |
| `LifeLoggerAI/asset-factory` | Multimodal asset/studio pipeline candidate | Keep separate until launch-readiness gates, secrets, provider mode, storage paths, and custom-domain/API evidence are complete. |
| `LifeLoggerAI/urai-admin` | Admin/operations console candidate | Keep separate until production lock evidence, auth gating, owner bootstrap, DNS/SSL, monitoring, and verification are complete. |
| `LifeLoggerAI/urai-privacy` | Privacy/compliance support layer | Reference and eventually consolidate privacy controls into canonical app docs and UI. |
| `LifeLoggerAI/urai-studio` | Studio/media layer candidate | Future integration after V1/spatial/admin/asset-factory locks. |
| Other support repos | B2B, analytics, communications, content, jobs, foundation, marketing, investors, company/legal | Keep as modular support repos until they have explicit contracts, tests, and integration routes. |

## Immediate execution order

1. Stabilize and verify canonical `UrAi` V1 demo spine.
2. Promote `urai-spatial` into a formal integration plan for the true spatial home layer.
3. Decide whether spatial becomes:
   - directly ported into `UrAi`, or
   - a package/sub-app consumed by `UrAi`, or
   - a separately deployed surface linked from `UrAi` with explicit product boundaries.
4. Keep `asset-factory` as a near-ready subsystem, but do not present it as live production core until launch-readiness evidence closes.
5. Keep `urai-admin` as a separate operations product until production lock evidence is complete.
6. Do not activate passive capture, GPS, device sensing, therapy claims, data marketplace, AR/VR, or monetization claims until consent, safety, rules, tests, and deployment evidence exist.

## Canonical verification path

Run from `LifeLoggerAI/UrAi` before treating the demo spine as shippable:

```bash
npm run check:v1
npm run check:firestore-contract
npm run seed:demo
npm run check:types
npm run lint
npm run test:unit
npm run build
npm run preflight
```

For deployment readiness, use the repo's launch/deploy scripts and evidence checks rather than deploying from legacy repos.

## Spatial integration acceptance criteria

Before `urai-spatial` becomes canonical product surface, the integration must prove:

- `/`, `/home`, and any spatial route render from the canonical app path or a clearly documented sub-app boundary.
- True 3D/spatial scene contracts are documented in `UrAi`.
- Launch-safe fallback data works without private production data.
- Firebase reads are user-scoped and rules-tested.
- No raw passive telemetry, raw audio, camera captures, private media, secrets, or unreviewed inference records are exposed.
- Typecheck, lint, build, smoke tests, and route verification pass in the canonical repo.
- Public copy uses demo/preview language until production data, consent, and live services are verified.

## Non-negotiable launch-copy boundary

Do not publicly claim the following as live until code, consent gates, tests, security rules, and deployment evidence exist:

- full passive audio capture
- GPS/location intelligence
- device/activity signals
- autonomous therapy, diagnosis, crisis service, or clinician-equivalent support
- data marketplace or user data sale flows
- live relationship intelligence
- production AR/VR/XR
- production asset generation/export pipeline
- production admin/B2B/analytics/communications systems

## What can be said now

Safe current positioning:

URAI has a working memory-to-world demo spine, symbolic home/demo routes, seeded public constellation data, a mocked companion safety shell, waitlist capture, and several advanced subsystem repositories under integration review, including spatial, asset-factory, and admin.
