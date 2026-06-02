# URAI Ecosystem Integration Contract V1

## Purpose
This contract locks cross-repo runtime compatibility for the launch chain:

`UrAi -> urai-jobs -> urai-content -> asset-factory -> urai-spatial -> urai-studio -> B2Bportal`

## Shared schema
All repos must treat [URAI_ECOSYSTEM_SCHEMA_V1.json](./URAI_ECOSYSTEM_SCHEMA_V1.json) as the canonical cross-repo data contract for:

- users
- memories
- emotional fields
- LifeMap nodes
- generated assets
- spatial scenes
- jobs
- content packs
- B2B accounts
- XR scene objects

## Integration assumptions
- `UrAi` is the launch-facing public memory-to-world entry and consent-gated waitlist surface.
- `urai-jobs` is the internal async execution fabric and owner of durable queue status.
- `urai-content` is content schema + content pack governance owner.
- `asset-factory` is deterministic asset generation owner (2D + 3D + audio bundles).
- `urai-spatial` is immersive scene runtime owner (LifeMap, focus, replay, XR routes).
- `urai-studio` is creator/admin orchestration owner.
- `B2Bportal` is enterprise intake + account operations owner.

## Naming and IDs
- Use stable string IDs across repos.
- Keep explicit `jobType`, `assetType`, `sceneKey`, `contentPack.slug`, and `b2bAccount.status` fields.
- Preserve uppercase job terminal states in jobs runtime (`PENDING`, `LEASED`, `RUNNING`, `SUCCESS`, `FAILED`, `DEAD`, `CANCELLED`).

## Environment contract
Each repo must keep a local-safe env template and fail-safe diagnostics when secrets are missing.

Minimum expected groups:
- Firebase web app config
- Firebase admin/server config
- Inter-repo endpoint URLs
- Optional provider credentials guarded behind fallback mode

## Security + privacy
- Default to privacy-safe fallback behavior when provider secrets are absent.
- Do not expose private memory payloads in public demo routes.
- Keep CORS allowlists explicit per deployment target.
- Keep security headers active for API and app routes.

## Verification gates
Per-repo release checks must include:
- install
- lint
- typecheck
- tests
- build
- smoke checks
- deployment evidence or explicit credential blocker notes

## Blocking conditions
Launch is blocked if any of the following is true:
- schema drift from `URAI_ECOSYSTEM_SCHEMA_V1.json`
- incompatible queue/job status transitions
- asset pack format mismatch between asset-factory and spatial/studio consumers
- missing environment contract for a required production route
- unverified deployment evidence for a claimed live surface
