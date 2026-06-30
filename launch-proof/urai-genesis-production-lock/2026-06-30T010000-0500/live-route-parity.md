# Live Route Parity — URAI Genesis

Audit timestamp: 2026-06-30T01:00:00-05:00
Updated: 2026-06-30T01:25:00-05:00
Repo: LifeLoggerAI/UrAi

## Live route checks

| Live URL | Result in this pass | Evidence | Verdict |
| --- | --- | --- | --- |
| `https://urai.app/` | Opened with web checker; redirected to `/home`; returned public demo content. | Page exposed Ground/Life Map/XR links and launch-safety copy. | PASS for public demo root. |
| `https://urai.app/home` | Proven indirectly by root redirect to `/home`. | Root response content was home experience. | PASS for redirect/home shell. |
| `https://urai.app/ground` | Opened through live root link; rendered Ground page. | Page title/content included `URAI Ground World`, `Your private world helps your real life`, workforce helpers, world zones, inspectable objects, and launch-safety copy. | PASS; prior 404 drift appears fixed live. |
| `https://urai.app/status` | Opened through live root Status board link; rendered status page. | Page included `URAI status & reliability`, static-safe launch heartbeat, public preview mode, and private actions off. | PASS with copy caution. |
| `https://urai.app/life-map` | Opened through live root Life Map link; rendered Life Map preview. | Page included `Life Map galaxy`, `12 stars awake`, and owner-gated Replay/Passport copy. | PASS for public demo route. |
| `https://urai.app/xr` | Attempted through live root XR support link; web checker returned cache miss. | Root page says Enter VR is hidden because current browser/device does not report immersive-vr support. | NEEDS RETRY / not production proof. |
| `https://urai.app/system` | Direct live status still not proven in this pass because the web checker did not expose a root link to `/system` and direct open was blocked by URL-safety constraints. | Source route exists and is registry-backed. | BLOCKER for READY until direct receipt captured. |
| `https://urai.app/privacy-controls` | Not directly re-proven in this pass. | Source/prior proof indicate route exists; direct receipt still needed. | NEEDS RETRY. |

## Root live observations

The live root redirected to `/home` and displayed public-safe copy including:

- Firebase feedback/bug intake paused because Firebase is not configured in the environment.
- URAI Spatial described as a public-safe spatial surface.
- Private data, autonomous actions, and headset entry remain gated until proof passes.
- Ground route shown as a link.
- WebXR entry hidden because the browser/device does not report immersive-vr support.
- Launch safety copy says private account access, live sensing, generated private media, health inference, autonomous actions, and headset entry remain gated.

## Ground live receipt

`/ground` is no longer known-broken in this pass. It rendered the Ground page live with explicit launch-safety copy:

> Ground is a public, sample-data world preview. It does not claim autonomous action, passive sensing, medical inference, or private account access. It proves the route and product shape are live.

## Status live receipt

`/status` rendered live and included static preview language:

- Static-safe launch heartbeat.
- Public preview mode.
- Write actions and live service calls remain off on the public preview surface.

This is directionally safe, but `/status` also includes language about Firebase/Functions/Storage/narrator monitoring. That copy remains a P1 caution until real monitoring receipts exist.

## Drift analysis

The previous `/ground` 404 issue appears resolved on the current live surface. The remaining critical route-parity blocker is `/system`: source contains `src/app/system/page.tsx`, but direct live truth-marker proof still needs an external/browser/curl receipt.

## Required acceptance criteria before READY

1. Browser/smoke screenshot of `/ground` shows `URAI Ground World` and launch safety copy. Current text receipt is positive; screenshot still helpful.
2. `https://urai.app/system` returns 200.
3. Browser/smoke screenshot of `/system` shows `URAI release truth, locked before launch`, `Registry shape`, and blocked/deferred system sections.
4. Firebase release/deploy evidence maps the live site to the audited commit SHA.
5. Current CI/local validation logs pass for the latest source commit.
