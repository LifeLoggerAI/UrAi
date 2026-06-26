# Next Wiring Tasks

Updated: 2026-06-25

## Priority 0

1. Repair `LifeLoggerAI/UrAi` checkout on a filesystem that supports the repo's tracked paths or remove the invalid tracked `:USERPROFILE` cache paths safely.
2. Restore Node 20, npm, corepack/pnpm, and Firebase CLI access in the validation environment.
3. Run `npm run check:system-registry`, `npm run check:v1`, `npm run check:types`, `npm run lint`, `npm test`, and `npm run build` in `UrAi`.
4. Deploy the latest `/system` route to staging only and rerun `npm run smoke:genesis-spine`.
5. Keep `UrAi-Dev` and `UrAiProd` out of runtime truth.

## Priority 1

1. Deploy `urai-staging` only after `npm run check:deploy` passes.
2. Prove `https://urai-staging.web.app/system-registry.json` returns the staging registry.
3. Prove `https://urai-staging.web.app/api/healthz` or the correct documented health route returns a safe JSON health payload.
4. Add/verify staging aliases for `urai-privacy`, `urai-admin`, and `urai-jobs` before staging deploys.
5. Keep `urai-content` consumed as a source package until its standalone deploy blocker is intentionally cleared.

## Priority 2

1. Prove `asset-factory` only after provider and custom-domain evidence is complete.
2. Prove `urai-spatial` only after privacy-safe staging behavior is documented.
3. Prove `urai-analytics` only after privacy and durable storage evidence.
4. Keep `urai-communications` disconnected until privacy/provider proof is complete.
5. Keep `urai-storytime` disconnected until safety/legal/provider proof is complete.
6. Complete `urai-foundation` DNS cutover.
