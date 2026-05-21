# URAI Home Route Audit Addendum

Branch: `urai-spatial-sacred-tech-polish`

## Finding

The repo contains a real `src/app/home/page.tsx` route that renders the HomeWorld surface. Existing Playwright smoke coverage visits `/home` and expects `main[aria-label="URAI Home World"]` plus HomeWorld data attributes and controls.

Before this branch, `next.config.mjs` redirected `/home` to `/`, which prevented `/home` from being independently inspected as a route-level HomeWorld contract.

## Change made

Removed the `/home` to `/` redirect from `next.config.mjs`.

## Why this is safe

- No package scripts were removed.
- No Firebase rules, data contracts, API routes, env handling, or launch gates were changed.
- `/` still renders through the existing app route implementation.
- `/home` can now render its actual route for smoke tests, QA, and direct route auditing.

## Required verification

Run in CI or a local checkout:

```bash
npm run check:v1
npm run check:types
npm run lint
npm run test:unit
npm run build
npm run test:smoke
```

No command is claimed as passed until it is actually run in a checkout or CI environment.
