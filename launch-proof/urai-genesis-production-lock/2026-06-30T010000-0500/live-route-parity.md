# Live Route Parity — URAI Genesis

Audit timestamp: 2026-06-30T01:00:00-05:00
Repo: LifeLoggerAI/UrAi

## Live route checks attempted

| Live URL | Result in this pass | Evidence / limitation | Verdict |
| --- | --- | --- | --- |
| `https://urai.app/` | Opened with web checker; redirected to `/home`; returned public demo content. | Page exposed Ground/Life Map/XR links and launch-safety copy. | Live root exists, demo-safe. |
| `https://urai.app/home` | Direct open through the web checker was limited by tool URL-safety restrictions after root redirect. | Root redirect showed `/home` content. | Partial proof only. |
| `https://urai.app/ground` | Direct live status not fully re-proven in this pass. | Source route exists; root page exposed Ground route link. Local container curl failed due DNS resolution limitation. | Needs external/current live smoke. |
| `https://urai.app/system` | Direct live status not fully re-proven in this pass. | Source route exists and is registry-backed; direct checker was limited. | Needs external/current live smoke. |
| `https://urai.app/status` | Direct live status not fully re-proven in this pass. | Source route exists. | Needs external/current live smoke. |
| `https://urai.app/life-map` | Direct live status not fully re-proven in this pass. | Root page exposed Life Map link. | Needs external/current live smoke. |
| `https://urai.app/xr` | Direct live status not fully re-proven in this pass. | Root page exposed XR support link and browser-safe WebXR copy. | Needs external/current live smoke. |
| `https://urai.app/privacy-controls` | Direct live status not fully re-proven in this pass. | Root page linked privacy/safety concepts; prior pass said route loaded. | Needs external/current live smoke. |

## Root live observations

The live root redirected to `/home` and displayed public-safe copy including:

- Firebase feedback/bug intake paused because Firebase is not configured in the environment.
- URAI Spatial described as a public-safe spatial surface.
- Private data, autonomous actions, and headset entry remain gated until proof passes.
- Ground route shown as a link.
- WebXR entry hidden because the browser/device does not report immersive-vr support.
- Launch safety copy says private account access, live sensing, generated private media, health inference, autonomous actions, and headset entry remain gated.

## Drift analysis

If `/ground` still returns 404 in an external/live smoke test, this is live/source route drift. Source contains `src/app/ground/page.tsx`, so the 404 would most likely come from stale deployment, wrong Firebase hosting target, wrong App Hosting bundle, build output mismatch, or a deployed bundle that predates the Ground route.

If `/system` does not show the registry truth markers live, this is also live/source route drift. Source contains `src/app/system/page.tsx`, which explicitly renders registry-generated status, canonical app, registry shape, launch posture, deferred systems, external surfaces, and legacy/sandbox warnings.

## Required acceptance criteria

Before READY:

1. `curl -I https://urai.app/ground` returns 200 or an intentional non-404 route behavior.
2. Browser/smoke screenshot of `/ground` shows `URAI Ground World` and launch safety copy.
3. `curl -I https://urai.app/system` returns 200.
4. Browser/smoke screenshot of `/system` shows `URAI release truth, locked before launch`, `Registry shape`, and blocked/deferred system sections.
5. Firebase release/deploy evidence maps the live site to the audited commit SHA.
