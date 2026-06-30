# Audit

## Project structure

- Framework: Next.js app router.
- Primary package manager scripts: npm scripts in `package.json`.
- Build command: `npm run build` -> `node scripts/ensure-next-cache.mjs && next build`.
- Typecheck: `npm run typecheck` or `npm run check:types`.
- Lint: `npm run lint`.
- Test: `npm run test`, plus unit, integration, e2e, rules, and launch scripts.
- Hosting config: Firebase Hosting.
- Firebase project/site found in repo config: `urai-4dc1d`.

## Audited home/root state

- `/home` renders `src/components/urai/home/NewHomeScene.tsx`.
- `/` previously rendered a separate public demo page, not the URAI Spatial landing surface visible in the user's screenshot.
- This pass made `/` render `NewHomeScene` so the primary domain resolves to the same polished spatial product surface.

## Main UX risks found

- The visual identity was strong but the click path needed a clearer central primary CTA.
- Route labels needed explicit truthful state: live, preview, or gated.
- The bottom navigation needed stronger spatial dock treatment and readable touch targets.
- Small panel copy needed better contrast, weight, and spacing.
- XR copy needed to remain truthful and not imply headset support when unsupported.

## Route and interaction audit

Primary surface interactions after this pass:

- `Step inside Ground` -> `/ground`.
- `Open Life Map preview` -> `/life-map`.
- `Check XR support` -> `/xr`.
- Sky card -> `/life-map` and labeled preview.
- Ground card -> `/ground` and labeled live.
- Orb companion panel -> `/status`.
- Self-state panel -> `/privacy-controls`.
- Workforce panel -> `/ground`.
- Bottom dock routes: `/home`, `/ground`, `/life-map`, `/focus`, `/replay`, `/mirror`, `/passport`, `/status`.

## Honesty posture

No fake VR, fake AI companion, fake private-world access, or fake autonomous workforce action was added. Private and autonomous features remain described as gated until consent/support/proof exists.
