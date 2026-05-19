# URAI Attachment Canon Implementation Ledger

Date: 2026-05-19
Branch: `audit/attachment-canon-system-pass`
Base: merged `main` after PR #252

## Purpose

This document converts the uploaded production attachments into a repo-visible canon and implementation ledger. It does not claim the full AAA spatial product is complete. It defines what is canonical, what is now wired, and what remains blocked or deferred behind tier gates.

## Attachment requirement inventory

| Attachment / spec area | Canonical requirements extracted | Repo implementation response in this pass |
| --- | --- | --- |
| Ground / floor | Moonlit sacred-tech ritual floor; dark reflective glass-stone; restrained reflections; central artifact framing; UI-safe low-noise zones; subtle embedded geometry, frost, mist, and under-surface energy. | Captured in `URAI_VISUAL_TOKENS` and this ledger as canonical visual constraint. Full 3D material/shader implementation remains Tier 4/5. |
| Deployment / hard contracts | Canonical data contract; source-of-truth ownership; direct route contract; permission matrix; AI output contract; asset manifest contract; design token lock; empty/failure states; strict freeze evidence. | Added `src/lib/urai-canon/system.ts` with route contracts, privacy matrix, canonical object fields, AI contract fields, asset manifest fields, failure states, empty-state canon, route transition intent, and integrity check. |
| Camera and route transitions | `/home` to `/life-map` is continuous ascent; `/life-map` star to `/focus`; `/focus` to `/replay`; ESC/back unwind from replay to focus, focus to map, map to home; no page-swap feeling; reduced-motion branch required. | Added transition canon in `URAI_ROUTE_TRANSITIONS`; direct-load child routes now exist for star/session/replay. Full cinematic camera controller remains Tier 3/4. |
| Orb | Orb is sacred-tech celestial artifact; controlled glow; internal rings/glyphs/filaments; no cheap neon; orb behavior drives transition continuity. | Captured in visual canon and route shell copy. Full orb anatomy/component remains Tier 4 asset/system work. |
| Sky / horizon | Deep navy/blue-violet sky, crescent moon, sparse stars, horizon glow, mist layers, UI-safe negative space, no wallpaper feel. | Captured in visual token canon and shared shell. Full sky/horizon renderer remains Tier 3/4. |
| Avatar | Symbolic embodied self, faceless, gender-neutral, calm, readable silhouette, abstract biological shrine; no mascot/robot/profile likeness. | Captured in ledger as home-shell requirement. Full avatar component/state zoning remains Tier 3+. |
| Home | `/home` is grounded sanctuary with avatar, orb, sky, ground, quiet UI, and transition entry to Life Map. | Existing `/home` remains; route transition canon now defines `/home` unwind and ascent role. |
| Life Map | Private spatial intelligence map; stars/memories/goals/relationships/chapters; anti-clutter; evidence-grounded AI; user-owned corrections; privacy-first. | Added route contracts and canonical schemas; direct `/life-map/star/[starId]` route exists and restores selected star context. |
| Focus | Intelligent focus chamber, not Pomodoro; session selection/start/recovery/completion; AI is quiet operator; privacy-first; low-stimulation/reduced-motion modes. | Added direct `/focus/session/[sessionId]` route and canon entries for `FocusSession`. Full session engine remains follow-up product work. |
| Stars and constellations | Stars are meaningful nodes, not wallpaper; protected orb clarity zone; taxonomy; interaction states; sparse premium sky; star click opens focus. | Added direct star route and visual token clarity zone. Full constellation renderer remains Tier 3. |
| Tier 1 through 5 build order | Foundation shell/routes/contracts first; Tier 1 core loop; Tier 2 personalization; Tier 3 constellations; Tier 4 replay/artifacts; Tier 5 maturity. | Added hard route/canon layer and tests. This pass is Foundation/Tier-1 enabling work, not Tier 5 completion. |
| Replay | Private cinematic memory theater; truth modes; evidence rail; provenance; correction/redaction; sensitive preview; no fake movie/no surveillance. | Added direct `/replay/[replayId]` route and `Replay`, `ReplayScene`, `ReplayJourney`, `AIInsight` canon fields. Full replay theater remains follow-up. |
| Run-first / master prompt | Full attachment extraction, repo audit, implementation, verification, docs, honest blockers. | This document plus canonical system file and tests are the implementation response for this pass. |

## Canonical architecture added

### `src/lib/urai-canon/system.ts`

Defines:

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

### Direct-load routes added

- `src/app/life-map/star/[starId]/page.tsx`
- `src/app/focus/session/[sessionId]/page.tsx`
- `src/app/replay/[replayId]/page.tsx`

These routes direct-load, pass the route ID into the shared shell, and avoid blank/dead route behavior.

### Shared shell update

`src/components/life-map/LifeMapUniverse.tsx` now accepts:

- `selectedStarId`
- `sessionId`
- `replayId`
- `routeNotice`

and displays restored route context.

### Unit tests added

`tests/unit/urai-canon/system.test.ts` verifies:

- All required routes have direct-load, refresh-safe, loading, empty, error, reduced-motion, and mobile-safe contracts.
- AI cannot read sensitive, vaulted, or deleted privacy states.
- Canonical schemas, asset manifest fields, empty-state rules, and visual tokens exist.
- Route transition intent is defined.
- Canon integrity has no failures.

## Repo audit summary

### Completed / verified before this pass

- PR #252 landed prior verification fixes into `main`.
- Reported local evidence shows `test:rules`, `typecheck`, and `build` passed.
- Reported local evidence shows `check:v1` and `check:tier2-access` passed.
- P0 and P1 gates are structurally ready but require evidence/signoff variables.

### Partial / now improved

- Required direct routes existed in product specs but not all as direct-load child routes. Added missing star/session/replay routes.
- System contracts existed in docs/prompts but not as code-enforced canon. Added `urai-canon` module and tests.
- Visual rules were spread across attachments. Added token baseline and ledger.

### Still not complete

- Full cinematic 3D camera controller.
- Full orb anatomy implementation.
- Full symbolic avatar system.
- Full reflective floor shader/material system.
- Full sky/horizon renderer.
- Full constellation renderer and dense-map LOD.
- Full focus session engine.
- Full replay evidence/provenance theater.
- Full asset manifest validator and governed asset pipeline.
- Full analytics/observability dashboards.
- Full browser smoke on the restricted host, because the host lacks required Chromium OS libraries.

## Production acceptance criteria carried forward

A requirement may only be marked done when it is:

1. Implemented in code or explicitly documented as deferred behind a tier flag.
2. Wired into the relevant route or system owner.
3. Covered by unit, smoke, rules, build, type, visual, or manual evidence as appropriate.
4. Safe for privacy, deleted/archived/locked states, and reduced motion.
5. Documented with exact limitations and release blockers.

## Verification commands for this branch

```bash
git fetch origin
git checkout audit/attachment-canon-system-pass
git pull origin audit/attachment-canon-system-pass
npm install
npm run test:unit
npm run typecheck
npm run lint
npm run build
npm run test:rules
```

Browser smoke must run only on a Playwright-capable host:

```bash
npx playwright install --with-deps chromium
npm run test:smoke
```

## Freeze status

- Tier 1: not frozen until P0 full evidence gate, browser smoke on a valid host, manual desktop/mobile proof, waitlist persistence proof, rules/index deploy proof, private data proof, and demo recording are attached.
- Tier 2: not frozen until Tier 1 is frozen and Tier-2 evidence/signoff gates are satisfied.

## Release decision

Do not deploy as final production from this branch alone. This branch should be reviewed and merged as canon/route-foundation work after verification passes.
