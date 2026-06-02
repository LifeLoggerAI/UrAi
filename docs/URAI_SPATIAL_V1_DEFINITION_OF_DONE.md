# URAI Spatial V1 Definition of Done

Status: staged V1 public demo boundary.

URAI Spatial V1 is complete only when the shipped experience is truthful, safe, buildable, and gated.

## Required V1 experience

- The `/spatial` surface renders a magical home/spatial shell with ground, orb, sky, portal, companion/chat, and memory/spatial preview layers.
- Unsupported live capabilities are clearly labeled as staged, private beta, preview, or off by default.
- The public demo remains usable without privileged providers.
- Reduced-motion users receive a calm dissolve/fallback path.
- Mobile users can use the spatial shell without scroll traps or unreachable controls.
- Canvas or WebGL experiences have accessible non-canvas summaries and keyboard-accessible controls.

## Required safety gates

- No public V1 copy claims unsupported live sensing, clinical capability, live XR, marketplace, enterprise/admin, or studio/export readiness.
- Sensitive collection access is owner-scoped or admin-only.
- Production APIs do not trust client-supplied user or tenant headers for privileged operations.
- Consent-gated features stay disabled unless consent, server-side config, and smoke tests are verified.
- Feature flags accurately report staged, beta, and live states.

## Required engineering proof

Before calling V1 complete, run and pass:

```bash
npm install
npm run check:v1
npm run check:firestore-contract
npm run check:public-copy
npm run check:types
npm run lint
npm run test:unit
npm run build
npm run release:p1
```

If a command is unavailable or environment-bound, document the limitation in the launch audit and keep the affected feature gated.

## Required launch evidence

- `/spatial` and `/api/spatial/health` smoke-test successfully.
- Readiness endpoints list blockers honestly.
- Firestore rules deny unauthorized reads/writes in emulator tests.
- Public copy checker scans public docs, routes, metadata, constants, and accessibility text.
- V1 docs identify which systems are live, staged, deferred, or blocked.

Final status must be one of:

- `public-demo-ready`
- `private-beta-ready`
- `production-live-ready`

Do not use `production-live-ready` until all external providers, secrets, deploy targets, rules, tests, and smoke checks pass.
