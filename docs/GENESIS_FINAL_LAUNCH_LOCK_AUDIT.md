# URAI Genesis Final Launch-Lock Audit

Generated: 2026-06-28

Branch: `genesis-public-launch`

Commit audited before this report: `ffdd118f Complete Genesis public route and asset audit`

Proof folder: `launch-proof/final-lock/2026-06-28T00-03-49-676Z`

## Security Findings

- Service-account/env/private-key filename inventory: no service-account JSON, env file, PEM, P12, or private-key files found in the repo source/public/docs/scripts/test tree scanned for this pass.
- Redacted secret-pattern scan: no findings after replacing the CI workflow's PEM-shaped placeholder with a non-PEM placeholder.
- `.gitignore` now explicitly blocks common service-account JSON names: `serviceAccount*.json`, `*service-account*.json`, `*service_account*.json`, and `scripts/serviceAccountKey.json`.
- No secret values were printed during the audit.

## Claims Findings

- `npm run check:production-claims` passed: 382 public files scanned, 7 qualified/gated claims, 0 evidence-backed live claims.
- `npm run check:public-copy` passed.
- No public-live claims were added for ARR, revenue, customers, pilots, SOC2, patents, F500/Fortune, DAU, NRR, enterprise readiness, marketplace payouts, passive sensing, production life movies, XR worlds, autonomous jobs, model council governance, private memory AI, or provider-backed media generation.

## Route Guard Decisions

- Public Genesis preview routes remain shareable: `/`, `/home`, `/launch`, `/life-map`, `/focus`, `/replay`, `/orb`, `/orb-chat`, `/ground`, `/sky`, `/horizon`, `/passport`, `/status`, `/demo`, `/early-access`, `/onboarding`, `/waitlist`, `/privacy`, `/terms`, `/support`, `/system`.
- Deep links are guarded by the completed deep-route pass: `/memory/[id]`, `/life-map/star/[starId]`, `/replay/[replayId]`, `/focus/session/[sessionId]`, `/invite/[code]`, and `/u/[handle]` fail closed unless a known public/demo id is allowed.
- Duplicate public routes are redirected: `/cognitive-mirror` to `/mirror`, `/ochat` to `/orb-chat`.
- Public shells for `/studio`, `/motion`, `/music-video`, and `/xr` are guarded/truth-labeled. They do not claim live creator consoles, generated music videos, production motion/video generation, or live XR worlds.
- Admin/app/API production-spine routes remain outside the public Genesis claim boundary. Their existence in the build is not proof of public-live capability.

## Asset And Content Findings

- `npm run verify:assets` passed with 20 critical asset paths.
- Missing share/SEO assets were fixed in the previous public completion commit with `public/og/urai-genesis-preview.png`, `public/robots.txt`, and `public/sitemap.xml`.
- Final asset inventory is written to `launch-proof/final-lock/2026-06-28T00-03-49-676Z/asset-inventory.json`.
- Visual/runtime smoke report is written to `launch-proof/final-lock/2026-06-28T00-03-49-676Z/visual-smoke-report.json`.

## Verification Results

- `npm run check:types`: passed
- `npm run lint`: passed with 5 existing warnings, 0 errors
- `npm test -- --runInBand`: passed, 71 suites / 478 tests
- `npm run test:rules`: passed, 13 suites / 174 tests
- `npm run build`: passed
- `npm run check:genesis`: passed
- `npm run check:public-copy`: passed
- `npm run check:production-claims`: passed
- `npm run verify:privacy`: passed
- `npm run verify:routes`: passed
- `npm run verify:assets`: passed
- `npm run check:firebase`: passed for `urai-4dc1d/urai-4dc1d`
- `npm run check:onboarding`: passed
- `npm run check:system-registry`: passed
- `npm run check:production-lock`: passed as an internally consistent lock; wider ecosystem remains demo/gated/blocked where evidence is missing
- `npm run smoke:genesis-spine`: passed for required URLs; staging registry/health remain evidence-gap warnings
- Final Playwright visual/runtime smoke: 156 route/viewport checks, 156 screenshots available, 0 blockers

## Safe To Claim Live

- URAI Genesis public preview/demo surface
- Life Map preview with sample/demo memories
- Focus preview
- Replay preview/demo fallback
- Orb and Orb Chat public preview surfaces
- Passport/privacy/status/support public-safe surfaces
- Onboarding film with launch-safe fallback media
- Truth-labeled public system/launch/waitlist surfaces

## Still Gated Or Roadmap

- Production generated life movies for every user
- Provider-backed generated media
- Music videos for every user
- AR/VR/XR memory worlds
- Passive sensing
- Data marketplace
- Autonomous jobs/agents
- Full AI model council governance
- Enterprise/customer/traction claims
- Any use of private user memory data without consent, export/delete, and live smoke evidence

## Remaining Launch Blockers

None found for the public Genesis preview/demo launch surface.

Known non-blockers:

- Existing lint warnings for `<img>` usage and one style mock export warning remain non-blocking.
- Production lock intentionally keeps the wider URAI ecosystem gated/demo/blocked until privacy, rollback, provider, deploy, and live smoke evidence exists.
- The working tree contains substantial unrelated pre-existing uncommitted production-spine work that was not staged by this launch-lock pass.
