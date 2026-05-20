# URAI Attachment Canon Implementation Ledger

Date: 2026-05-19
Branch: `main`
Current production line: `068fec5f477aa2f1b1a00fafda3b5d42ba1097f9` and later mainline commits

## Purpose

This document converts the uploaded production attachments into a repo-visible canon, implementation ledger, and release-readiness record. It is intentionally strict: it distinguishes implemented/wired/verified work from deferred Tier 3+ cinematic depth. The goal is a coherent system-of-systems, not a beautiful mock.

## Source attachments treated as canonical input

The uploaded requirement set defines the product as a private moonlit sacred-tech spatial operating environment with a coherent `/home` → `/life-map` → `/focus` → `/replay` loop, hard route contracts, AI truth discipline, privacy boundaries, visual token discipline, and deployment/freeze gates. The master prompt requires inventory, audit, implementation, verification, docs, and honest blockers before final deploy. fileciteturn205file0

## Attachment requirement inventory

| Attachment / spec area | Canonical requirements extracted | Repo implementation response |
| --- | --- | --- |
| Master completion prompt | Full attachment extraction, repo audit, implementation, verification, docs, deploy readiness, no fake completion. | Canon ledger exists, route contracts exist, P1 release gate workflow exists, deploy workflow exists, production verification added. |
| Ground / floor | Moonlit sacred-tech ritual floor; dark reflective glass-stone; restrained reflections; central artifact framing; UI-safe low-noise zones; subtle embedded geometry, frost, mist, and under-surface energy. | Captured as visual canon and shared home/life-map aesthetic. Full shader/material depth remains Tier 4/5 asset work. |
| Deployment / hard contracts | Canonical data contract; source-of-truth ownership; direct route contract; permission matrix; AI output contract; asset manifest contract; design token lock; empty/failure states; strict freeze evidence. | Implemented through `src/lib/urai-canon/system.ts`, unit coverage, release gates, deploy workflows, status endpoint truth correction, and production verification workflow. |
| Camera and route transitions | `/home` to `/life-map` ascent; `/life-map` star to `/focus`; `/focus` to `/replay`; ESC/back unwind; reduced-motion branch; no page-swap feeling. | Transition canon exists and smoke tests cover current route surfaces. Full cinematic camera controller remains Tier 3/4. |
| Orb | Sacred-tech celestial artifact; controlled glow; internal rings/glyphs/filaments; no cheap neon; orb drives continuity. | Visual standard is enforced through app styling/spec docs. Full orb anatomy and asset system remain Tier 4. |
| Sky / horizon | Deep navy/blue-violet sky, crescent moon, sparse stars, horizon glow, mist layers, UI-safe negative space, no wallpaper feel. | Home and life-map scenes use the visual canon; full sky renderer remains Tier 3/4. |
| Avatar | Symbolic embodied self, faceless, gender-neutral, calm, readable silhouette, no mascot/profile likeness. | Captured in canon; full avatar subsystem/region zoning remains Tier 3+. |
| Home | Grounded sanctuary with avatar/orb/sky/ground and entry to Life Map. | `/home` exists, direct-loads, and smoke tests cover core controls. |
| Life Map | Private spatial intelligence map; stars/memories/goals/relationships/chapters; anti-clutter; evidence-grounded AI; privacy-first. | `/life-map` and `/life-map/star/[starId]` exist. Star route direct-loads selected star context. Full constellation LOD remains Tier 3. |
| Focus | Intelligent focus chamber, not Pomodoro; session selection/start/recovery/completion; quiet AI operator; low-stimulation/reduced-motion. | `/focus` and `/focus/session/[sessionId]` exist. Full standalone focus engine remains follow-up Tier 2/3 product work. |
| Stars and constellations | Meaningful nodes, not wallpaper; orb clarity zone; taxonomy; interaction states; star click opens focus. | Star route and smoke coverage exist. Full constellation renderer remains Tier 3. |
| Tier 1 through 5 | Foundation shell/routes/contracts first; Tier 1 core loop; Tier 2 personalization; Tier 3 constellations; Tier 4 replay/artifacts; Tier 5 maturity. | Foundation and P1/P0 release gates are wired. Tier 3+ cinematic/asset systems remain explicitly deferred behind tier gates. |
| Replay | Private memory theater; truth modes; evidence/provenance; correction/redaction; sensitive preview; no fake movie/no surveillance. | `/replay` and `/replay/[replayId]` exist. Full evidence rail/provenance theater remains Tier 3/4. |

## Canonical architecture now in repo

### Code contracts

`src/lib/urai-canon/system.ts` defines:

- Required canonical routes.
- Direct-load/refresh-safe route contracts.
- Invalid/locked/deleted/archived fallback behavior.
- Route unwind targets.
- Permission matrix for public/private/sensitive/vaulted/shared/archived/deleted states.
- Canonical object fields.
- Canonical schema names.
- AI output required fields and prohibited claim classes.
- Asset manifest required fields.
- Visual tokens for color, motion, and clarity zones.
- Failure-state canon.
- Empty-state canon.
- Route transition emotional intent and phase timing.
- Integrity assertion for unsafe canon drift.

### Direct-load routes

- `src/app/home/page.tsx`
- `src/app/life-map/page.tsx`
- `src/app/life-map/star/[starId]/page.tsx`
- `src/app/focus/page.tsx`
- `src/app/focus/session/[sessionId]/page.tsx`
- `src/app/replay/page.tsx`
- `src/app/replay/[replayId]/page.tsx`

### Production workflows

- `.github/workflows/playwright-smoke.yml` verifies browser smoke in a browser-capable runner.
- `.github/workflows/p1-release-gate.yml` runs strict P1 with command evidence.
- `.github/workflows/deploy.yml` validates the Firebase target, builds, deploys to `urai-4dc1d`, then verifies `/`, `/home`, `/status`, and browser smoke against production.
- `.github/workflows/post-deploy-verify.yml` provides a manual production verification workflow.

## Verification record

- P1 Release Gate completed successfully in GitHub Actions.
- Playwright smoke was stabilized for current home/life-map UI and passed before production workflow work.
- Deploy workflow now performs post-deploy verification instead of stopping after upload.
- `/api/status` now reports configuration/runtime truth carefully and does not invent external-service health.

## Completed / verified

- Canonical routes exist.
- Direct child routes exist for star, focus session, and replay detail.
- P1 gate passed.
- Production deployment workflow exists and targets `urai-4dc1d`.
- Production verification workflow exists.
- npm cache failure path is patched through workflow and deploy script cache controls.
- Firebase target validation matches `.firebaserc` and `firebase.json`.
- Status endpoint avoids false claims.

## Still not complete / deferred beyond current mainline

These are not blockers for the current web deployment shell, but they block any honest claim of full Tier 5 cinematic maturity:

- Full 3D camera controller.
- Full orb anatomy implementation.
- Full symbolic avatar state/region system.
- Full reflective floor shader/material pipeline.
- Full sky/horizon renderer.
- Full constellation renderer and dense-map LOD.
- Full focus session engine with persistence, distraction defense, and AI recovery flows.
- Full replay evidence/provenance theater with redaction/correction/export pipelines.
- Full asset manifest validator and governed asset pipeline.
- Full analytics/observability dashboards.
- Full Storybook/component state catalog.

## Production acceptance criteria carried forward

A requirement may only be marked done when it is:

1. Implemented in code or explicitly documented as deferred behind a tier flag.
2. Wired into the relevant route or system owner.
3. Covered by unit, smoke, rules, build, type, visual, or manual evidence as appropriate.
4. Safe for privacy, deleted/archived/locked states, and reduced motion.
5. Documented with exact limitations and release blockers.

## Current release decision

The mainline is deploy-ready when `.github/workflows/deploy.yml` completes successfully, because that workflow now includes build, Firebase target validation, production deploy, HTTP verification, and production browser smoke. If that workflow fails, the failure log is the current blocker and should be patched as a concrete repo/tooling issue or identified as an external secret/permission issue.

## Remaining external risk

The repo cannot prove Firebase credential authority. Production deploy still depends on `secrets.FIREBASE_SERVICE_ACCOUNT` being present and authorized for `urai-4dc1d`. If that secret is missing or lacks permission, the workflow will fail outside of code control.
