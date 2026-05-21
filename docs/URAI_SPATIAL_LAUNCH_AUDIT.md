# URAI Spatial Launch Audit

Date: 2026-05-20
Scope: URAI Spatial V1 launch-readiness audit for the main `LifeLoggerAI/UrAi` repo and related standalone `LifeLoggerAI/urai-spatial` evidence.
Status: conditional public demo readiness; not production-live readiness.

## Executive summary

URAI Spatial should be treated as a staged V1 spatial shell, not a fully live XR, sensing, clinical, marketplace, enterprise, or studio/export product. The public V1 must preserve the magical home experience while keeping every unsupported capability behind clear gates.

The main repo contains V1 launch checks, public-copy checks, Firebase contract checks, type/lint/test/build scripts, and release gates. The standalone `urai-spatial` repo confirms the intended Spatial architecture: a runtime app rooted in `urai-tier1`, explicit fallback/demo mode, future provider seams, and live-provider requirements before claiming AR/WebXR, biometric, wearable, memory-grounded, Firebase, Stripe, or Asset Factory production readiness.

## Launch-readiness score

Current score: **62 / 100** for public-demo V1.

Current score: **38 / 100** for production-live Spatial.

The public demo path is substantially closer because it can ship with staged copy and safe fallbacks. Production-live is blocked by provider verification, consent persistence, XR/device validation, deploy smoke tests, Firestore emulator proof, and external secret configuration.

## Findings

### Finding 1

- Severity: Critical
- Exact file or area: Spatial V1 public claims and route copy
- What is wrong or incomplete: Public copy must not imply unsupported live XR, passive sensing, clinical, marketplace, enterprise/admin, or studio/export readiness.
- Why it matters: Overclaiming exposes users and the product to safety, legal, and trust risk.
- Recommended fix: Keep unsupported features labeled as staged, gated, private beta, preview, or not live in V1.
- Action taken: Added V1 definition-of-done documentation requiring public-copy and feature-gate proof before launch.
- Blocks launch: Blocks production-live launch; does not block a clearly labeled public demo.

### Finding 2

- Severity: Critical
- Exact file or area: `scripts/check-public-copy.mjs`
- What is wrong or incomplete: The checker uses encoded regex construction, skips `src/app/spatial`, and skips accessibility/public prop text such as aria labels.
- Why it matters: The launch gate can miss risky public copy exactly where Spatial users encounter it.
- Recommended fix: Replace encoded patterns with readable regex literals, include `src/app/spatial`, scan page metadata/constants/accessibility text, and avoid scanning implementation internals that create false positives.
- Action taken: Patch attempted through GitHub write API but blocked by connector safety because the checker must contain risky terms it detects. Patch is documented in the final response for manual/Codex application.
- Blocks launch: Yes for audited production launch until fixed and passing.

### Finding 3

- Severity: High
- Exact file or area: Spatial feature flags and readiness reporting
- What is wrong or incomplete: Readiness endpoints must distinguish public demo, private beta, and production-live readiness.
- Why it matters: A green health endpoint that hides staged blockers creates false confidence.
- Recommended fix: `/api/spatial/health` should report mode, enabled providers, disabled providers, blockers, and required next checks.
- Action taken: Added definition-of-done requirement. Code still requires implementation verification.
- Blocks launch: Blocks production-live; public demo may proceed with honest degraded readiness.

### Finding 4

- Severity: High
- Exact file or area: Auth and ownership boundaries for spatial data
- What is wrong or incomplete: Production APIs must not trust client-supplied uid or tenant headers for privileged operations.
- Why it matters: Header-only identity allows data access escalation if used in production.
- Recommended fix: Verify Firebase ID tokens or server sessions; scope all user data by authenticated owner.
- Action taken: Documented as a V1 safety gate.
- Blocks launch: Blocks production-live APIs.

### Finding 5

- Severity: High
- Exact file or area: Firestore rules and contract coverage
- What is wrong or incomplete: Spatial collections named in product contracts must have owner/admin-scoped rules and emulator tests.
- Why it matters: Spatial memory, anchors, consent, scenes, asset links, and companion data are sensitive.
- Recommended fix: Add explicit rules and tests for each user-owned collection.
- Action taken: Documented as launch evidence requirement.
- Blocks launch: Blocks production-live data persistence.

### Finding 6

- Severity: Medium
- Exact file or area: Spatial engine and UI
- What is wrong or incomplete: The V1 shell must include ground, orb, sky, portal, companion/chat, memory/spatial layers, mobile responsiveness, reduced-motion fallback, and empty/error states.
- Why it matters: This is the minimum magical V1 experience.
- Recommended fix: Treat these as V1 acceptance criteria and avoid shipping generic placeholder UI.
- Action taken: Added to definition of done.
- Blocks launch: Blocks public-demo polish if missing.

### Finding 7

- Severity: Medium
- Exact file or area: Asset Factory / export pipeline
- What is wrong or incomplete: Asset generation/export should remain server-gated and not publicly claimed as live unless credentials, base URL, auth, queue/worker checks, and smoke tests pass.
- Why it matters: Broken asset promises undermine launch and may expose privileged endpoints.
- Recommended fix: Keep asset pipeline private-beta or deferred in V1.
- Action taken: Added to V1 safety language.
- Blocks launch: Blocks studio/export claims, not public demo.

## Commands to run before launch

```bash
npm install
npm run check:v1
npm run check:firestore-contract
npm run check:public-copy
npm run check:types
npm run lint
npm run test:unit
npm run test:rules
npm run build
npm run release:p1
```

If a command fails because of missing external secrets or provider services, keep that feature disabled and record the limitation.

## Current decision

URAI Spatial can move toward **public-demo-ready** only after the public-copy checker is fixed, the V1 gates pass, and `/spatial` plus `/api/spatial/health` smoke-test successfully.

URAI Spatial is **not production-live-ready** until real provider, consent, Firestore, Firebase deploy, XR, Asset Factory, and smoke-test evidence exists.
