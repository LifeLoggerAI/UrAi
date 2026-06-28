# URAI Genesis Public Completion Audit

Generated: 2026-06-27

## Verdict Boundary

URAI Genesis is a public-safe cinematic preview surface. It can show the Genesis home, Life Map, Focus, Replay, Orb, Passport, Mirror, onboarding, and guarded system surfaces with sample/demo assets. It must not claim production-generated private life movies, live AR/VR/XR worlds, passive sensing, autonomous jobs, data marketplace activity, provider-backed media generation, or full AI council governance without separate production evidence.

## Route Inventory

| Route | Decision | Public status |
| --- | --- | --- |
| `/` | Canonical public entry | Live Genesis preview |
| `/home` | Canonical product entry | Live Genesis preview |
| `/launch` | Public launch proof | Live preview/status |
| `/life-map` | Primary Genesis world | Live preview with sample memory language |
| `/life-map/star/[starId]` | Deep route hardened | Known demo stars only; unknown/private stars fail closed |
| `/mirror` | Canonical cognitive mirror | Live preview |
| `/cognitive-mirror` | Duplicate route | Redirects to `/mirror` |
| `/memory/[id]` | Deep route hardened | Known demo memories only; unknown/private memories fail closed |
| `/replay` | Replay preview | Demo/sample only unless real artifacts exist |
| `/replay/[replayId]` | Deep route hardened | Sample replay only; unknown/private replays fail closed |
| `/focus` | Focus/reflection preview | Live Genesis preview |
| `/focus/session/[sessionId]` | Deep route hardened | Sample session only; unknown/private sessions fail closed |
| `/orb` | Orb identity surface | Live Genesis preview |
| `/orb-chat` | Orb companion surface | Live preview/local-safe |
| `/ochat` | Duplicate route | Redirects to `/orb-chat` |
| `/ground` | Ground layer preview | Live Genesis preview |
| `/sky` | Sky/Life Map layer preview | Live Genesis preview |
| `/horizon` | Horizon layer preview | Live Genesis preview |
| `/passport` | Data ownership/trust surface | Live privacy/passport preview |
| `/status` | Platform health surface | Live truth/status surface |
| `/demo` | Demo walkthrough | Live sample/demo route |
| `/early-access` | Early access shell | Guarded/waitlist |
| `/onboarding` | Genesis onboarding film | Launch-safe preview/fallback media |
| `/studio` | Newly guarded route shell | Gated; not a live creator/admin console |
| `/motion` | Newly guarded route shell | Preview-only; not live media generation |
| `/music-video` | Newly guarded route shell | Gated; not live user music-video generation |
| `/xr` | Newly guarded route shell | Gated; not live AR/VR/XR production |
| `/invite/[code]` | Deep route hardened | Invite codes are not echoed; unavailable state is safe |
| `/u/[handle]` | Deep route hardened | Known public profile only; unknown handles fail closed |
| `/waitlist` | Public access CTA | Live waitlist/interest surface |
| `/privacy` | Public privacy page | Live policy surface |
| `/terms` | Public terms page | Live legal surface |
| `/support` | Public support page | Live support surface |
| `/system` | System registry | Public-safe truth dashboard |

## Asset Inventory

The following local asset groups are treated as critical for the Genesis public surface:

- Social/share: `public/og/urai-genesis-preview.png`, `public/og/urai-public-demo.svg`
- App shell: `public/icon.svg`, `public/site.webmanifest`, `public/robots.txt`, `public/sitemap.xml`
- Genesis hero/orb: `public/assets/genesis/hero/urai-genesis-hero-1600x1000.png`, `public/assets/genesis/orb/orb-core.png`, `public/assets/genesis/orb/orb-glow.png`
- Life Map: `public/assets/genesis/life-map/life-map-background-1600x1000.png`, `public/assets/genesis/life-map/life-map-card-memory-sample.png`
- Replay/media fallback: `public/assets/genesis/memory-film/memory-film-preview-sample.png`, `public/assets/genesis/fallbacks/media-thumbnail-sample.png`
- Passport/privacy: `public/assets/genesis/passport/passport-privacy-card.png`, `public/assets/genesis/privacy/consent-shield-card.png`
- Spatial preview: `public/assets/genesis/spatial/spatial-xr-preview-sample.png`
- Onboarding: `public/genesis/onboarding/final-manifest.json`

`npm run verify:assets` now checks this inventory and writes `launch-proof/public-assets/latest-asset-inventory.json`.

## Claim Safety

Allowed public language:

- Genesis preview
- sample/demo/fallback
- cinematic memory interface
- privacy-first and consent-bound
- gated, private beta, roadmap, or coming later

Blocked public-live claims without evidence:

- production life movies for every user
- live passive sensing
- live AR/VR/XR memory worlds
- autonomous jobs/agents acting in the world
- data marketplace payouts or sales
- provider-backed generated music videos for everyone
- therapy, diagnosis, or guaranteed mental-health outcomes

## Remaining Limitations

- Public Genesis routes are launch/demo surfaces, not proof of full production ecosystem readiness.
- Provider-backed generated media remains gated until Asset Factory/provider configuration, artifact storage, callback validation, tests, deploy logs, and live smoke evidence exist.
- Private app/admin/production-spine routes are outside this public completion pass unless explicitly surfaced as guarded public shells.
