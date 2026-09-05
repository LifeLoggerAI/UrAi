# Legacy production deployment disabled

Date: 2026-07-10

`LifeLoggerAI/UrAi` is not authorized to deploy `https://urai.app` or the shared Firebase project `urai-4dc1d`.

The canonical and sole production authority is:

- repository: `LifeLoggerAI/urai-spatial`
- runtime root: `urai-tier1`
- branch: `main`
- release workflow: `.github/workflows/spatial-live-deploy.yml`

The legacy deployment workflows in this repository were removed to prevent accidental overwrite of the canonical Spatial production release.

This repository remains available as a legacy implementation and reviewed feature-extraction source. Any future migration into production must be ported into `urai-spatial/urai-tier1`, reviewed there, and released through the canonical exact-SHA workflow.
