# URAI Genesis Route Map Evidence

Generated: 2026-06-30 America/Chicago
Repo: LifeLoggerAI/UrAi

## Source routes verified by file inspection

| Route | Source file | Status | Notes |
| --- | --- | --- | --- |
| `/` | `src/app/page.tsx` | public demo | Renders `NewHomeScene`. |
| `/home` | `src/app/home/page.tsx` | public demo | Renders `NewHomeScene`. |
| `/ground` | `src/app/ground/page.tsx` | source exists / live drift | Real public sample-data world preview; live `/ground` returned 404 in this pass. |
| `/xr` | `src/app/xr/page.tsx` | source exists / gated | WebXR capability-gated foundation, not universal XR claim. |
| `/system` | `src/app/system/page.tsx` | source exists / live parity needs proof | Registry-backed production-truth route in source. Prior live proof said deployed `/system` did not show new markers. |
| `/dashboard` | `src/app/dashboard/page.tsx` | gated | Honest private dashboard gate. |
| `/login` | `src/app/login/page.tsx` | gated | Honest private beta login gate. |
| `/signup` | `src/app/signup/page.tsx` | gated | Waitlist-first signup gate. |
| `/api/waitlist` | `src/app/api/waitlist/route.ts` | partial | Validates email, has rate-limit hook, dry-run mode, and Firebase Admin write when configured. |
| `/api/companion` | `src/app/api/companion/route.ts` | mocked/demo | Deterministic companion reply, not real provider-backed AI. |

## Live routes checked through web/browser fetch in this pass

| URL | Observed result | Notes |
| --- | --- | --- |
| `https://urai.app/` | Redirected to `/home`, content loaded | Public-demo framing present. |
| `https://urai.app/status` | Loaded | Static preview/status language present; private actions off. |
| `https://urai.app/life-map` | Loaded shell/content | Parsed text limited but HTTP content returned. |
| `https://urai.app/privacy-controls` | Loaded | Privacy controls content returned. |
| `https://urai.app/ground` | 404 | Source exists, so deploy/hosting route drift suspected. |
| `https://urai.app/orb-chat` | fetch cache miss | Linked route needs live parity verification. |

## Route parity action items

1. Generate source route inventory automatically from `src/app`.
2. Generate home dock/link inventory from rendered pages.
3. Smoke every internal href on the deployed domain.
4. Block launch if any linked source route returns 404/500/redirect loop.
5. Confirm `/system` live HTML contains registry markers: `URAI release truth`, `Production lock`, `launch mode`, `demo-only`, and `launch-eligible`.
