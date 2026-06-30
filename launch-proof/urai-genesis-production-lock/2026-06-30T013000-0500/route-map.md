# Route Map

Generated: 2026-06-30T01:30:00-05:00
Repo: LifeLoggerAI/UrAi
Branch: main
Starting SHA: 409dda09c0381510ee95923a5851eade5e6733ea
Ending SHA: captured in final response

## Critical source routes

| Route | Source status | Public/gated/private | Claim status |
| --- | --- | --- | --- |
| `/` | Source exists; redirects/serves Home scene | Public | Public demo/front door only |
| `/home` | Source exists | Public | Public demo/home threshold |
| `/system` | Source exists | Public/noindex status truth | Registry-backed truth; live proof still blocked by web fetch/cache miss |
| `/status` | Source exists | Public | Static preview/status, not full monitoring proof |
| `/life-map` | Source exists | Public demo | Sample-safe symbolic map |
| `/ground` | Source exists | Public demo | Live route now loads; public sample-data world preview |
| `/xr` | Source exists | Public gated | WebXR capability gate, not universal headset claim |
| `/privacy-controls` | Source exists/linked | Public trust/control preview | Truthful controls route, privacy gate still not passed |
| `/privacy` | Source expected and linked | Public legal/trust | Needs live curl/browser proof |
| `/terms` | Source expected and linked | Public legal/trust | Needs live curl/browser proof |
| `/dashboard` | Source exists | Gated | Private dashboard not open |
| `/login` | Source exists | Gated | Private beta login gate |
| `/signup` | Source exists | Gated/waitlist-first | Public signup not open |
| `/api/waitlist` | Source exists | Public API | Validation/rate-limit/Admin write path; deployed persistence not proven |
| `/api/companion` | Source exists | Public/demo API | Deterministic/local/demo |
| `/api/companion/respond` | Source exists | Provider-capable API | OpenAI only if server env configured; deployed provider smoke missing |
| `/api/admin/status` | Source exists | Admin/demo-gated API | Header gate disabled in production unless explicit local/demo env enabled |

## Route smoke support added

Added `scripts/smoke-linked-routes.mjs` and package scripts:

- `npm run smoke:linked-routes`
- `npm run smoke:linked-routes:live`

This checks response status and text markers for the critical linked routes. It must be run in a real Node 20 checkout after build/deploy.
