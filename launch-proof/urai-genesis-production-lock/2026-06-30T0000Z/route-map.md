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
| `/api/companion/respond` | `src/app/api/companion/respond/route.ts` | provider-capable / not live-proven | Can call OpenAI through `generateAIReply` when server env is configured; falls back locally. Requires deployed provider proof before AI launch claim. |
| `/api/admin/status` | `src/app/api/admin/status/route.ts` | source route listed by verifier / not inspected in this route-map pass | Must remain admin/operator-safe and smoke-tested before production use. |

## Existing route verifier inventory

`scripts/verify-routes.mjs` currently checks 21 critical routes, including `/`, `/home`, `/launch`, `/demo`, `/early-access`, `/login`, `/life-map`, `/mirror`, `/orb-chat`, `/ground`, `/sky`, `/horizon`, `/passport`, `/status`, `/xr`, `/u/adamclamp`, `/admin`, `/api/companion/respond`, `/api/waitlist`, and `/api/admin/status`.

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
6. Confirm `/api/companion/respond` provider path only claims live AI after safe deployed provider smoke evidence exists.
