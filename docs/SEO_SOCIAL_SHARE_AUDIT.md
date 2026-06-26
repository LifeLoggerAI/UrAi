# URAI SEO + Social Share Audit

Generated: 2026-06-26

## Scope

This pass reviewed the canonical public/demo app metadata surfaces for `LifeLoggerAI/UrAi` and updated launch-facing SEO/social preview behavior without claiming production readiness.

Covered routes and assets:

- `/` homepage metadata and page-level OpenGraph/Twitter fields
- `/system` registry/truth dashboard metadata and noindex policy
- `/privacy` privacy metadata and launch-safe privacy copy
- `/terms` terms metadata and launch-safe terms copy
- `/robots.txt` public-demo crawler policy
- `/sitemap.xml` public-demo sitemap entries
- `/icon.svg` favicon/app icon asset
- `/og/urai-public-demo.svg` social share image
- `/site.webmanifest` browser install/share metadata

## Metadata Changes

### Homepage

- Added page-level title: `URAI Public Demo | Symbolic Life Map`.
- Added a launch-safe description focused on public demo, sample data, real CTAs, and labeled roadmap systems.
- Added canonical `/`, OpenGraph, and Twitter large-card metadata.
- Root layout now provides global metadata base, manifest, icon, theme color, OpenGraph/Twitter defaults, and launch-safe robots defaults.
- Replaced stale missing share image reference with `/og/urai-public-demo.svg`.

### System Status

- Kept `/system` available as a truth dashboard, not a marketing landing page.
- Added `robots.index=false`, `robots.follow=false`, and Googlebot noimageindex metadata.
- Added explicit registry/truth-dashboard description and OpenGraph metadata only for controlled link previews.
- Restored the full registry-backed page after a partial metadata write truncated the route during this pass.

### Privacy

- Standardized metadata from `UrAi` to `URAI`.
- Added canonical `/privacy`, OpenGraph, and Twitter metadata.
- Reworded privacy body copy so private inputs and future signal types are clearly gated behind consent, owner-only access, export/delete, retention, and audit proof.

### Terms

- Standardized metadata from `UrAi` to `URAI`.
- Added canonical `/terms`, OpenGraph, and Twitter metadata.
- Reworded public terms copy to avoid implying production-ready V1 status.

### Robots And Sitemap

- `robots.ts` now allows public-demo pages and disallows internal, protected, gated, API, dashboard, auth, system, memory, replay, focus, and spatial surfaces.
- `sitemap.ts` now lists only launch-safe public-demo pages:
  - `/`
  - `/about`
  - `/launch`
  - `/demo`
  - `/life-map`
  - `/waitlist`
  - `/privacy`
  - `/terms`
  - `/u/adamclamp`
- `/system` is intentionally excluded from the sitemap.

## Claims Safety

No metadata in this pass claims that passive sensing, therapy, communications, monetization, autonomous jobs, user-data marketplace behavior, provider integrations, or user-derived intelligence are live production systems.

The launch-safe framing is:

- Public demo is live-facing copy.
- Sample/demo surfaces are allowed.
- Roadmap/gated systems remain labeled until evidence exists.
- Privacy, consent, export/delete, retention, admin audit, monitoring, rollback, and live smoke evidence are required before stronger claims.

## Remaining SEO / Share Blockers

- Build, lint, and typecheck could not run in this workspace because `npm` is not installed or available on PATH.
- Visual QA was not run because this pass changed metadata/assets/crawler policy and the current desktop browser tooling is not available in this sandbox session.
- Social preview rendering should still be verified after deployment with real preview/debugger tools because many platforms cache OpenGraph aggressively.
- If a PNG/JPEG share image becomes required by a target platform, generate a raster version of `/og/urai-public-demo.svg` and update metadata accordingly.
- Production-ready wording must remain blocked until live deploy, smoke, monitoring, rollback, DNS/SSL, and privacy-gate evidence are current.

## Commands Run

| Command | Result | Notes |
| --- | --- | --- |
| `npm run build` | Failed | `npm` command not found in this workspace. |
| `npm run lint` | Failed | `npm` command not found in this workspace. |
| `npm run typecheck` | Failed | `npm` command not found in this workspace. |

## Follow-Up Acceptance Criteria

- Build passes in a Node/npm-capable checkout.
- `/` source contains canonical, OpenGraph, Twitter, manifest, favicon, and theme-color metadata.
- `/system` response includes noindex metadata and remains excluded from sitemap.
- `/privacy` and `/terms` show URAI-standard titles/descriptions and avoid overclaiming live private-data systems.
- `/robots.txt` and `/sitemap.xml` expose only public-demo-safe routes.
- Social preview is verified after deploy with the live URL and platform preview tools.
