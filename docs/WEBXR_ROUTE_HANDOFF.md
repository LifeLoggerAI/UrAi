# WebXR Route Handoff (UrAi -> urai-spatial)

UrAi remains the launch-facing memory entry app. Immersive WebXR routes are delegated to `urai-spatial`.

## Contract
- UrAi emits memory, node, and scene references compatible with `docs/contracts/URAI_ECOSYSTEM_SCHEMA_V1.json`.
- UrAi does not claim production WebXR rendering ownership.
- UrAi links/redirects immersive session flows to spatial runtime routes (`/spatial`, `/life-map`).

## Blockers
- Live WebXR verification requires production secrets and deployment credentials not available in this workspace.
