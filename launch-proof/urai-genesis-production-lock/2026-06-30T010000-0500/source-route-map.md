# Source Route Map — URAI Genesis

Audit timestamp: 2026-06-30T01:00:00-05:00
Repo: LifeLoggerAI/UrAi

## Required route map

| Route | Source path | Class | Expected behavior | Source status | Production verdict |
| --- | --- | --- | --- | --- | --- |
| `/` | `src/app/page.tsx` | public | Root/front door, currently redirects or renders public demo shell depending build behavior | Present | Partial until deployed SHA/parity proof |
| `/home` | `src/app/home/page.tsx` | public | Public Genesis home/new home scene | Present | Partial until deployed SHA/parity proof |
| `/system` | `src/app/system/page.tsx` | public/noindex truth route | Registry-backed production-lock truth markers | Present | Critical live parity proof required |
| `/status` | `src/app/status/page.tsx` | public status | Platform health/status copy | Present | Copy must not imply unproven service monitoring |
| `/ground` | `src/app/ground/page.tsx` | public demo | Ground World sample-data real-life layer preview | Present | If live 404 persists, deploy drift likely |
| `/life-map` | `src/app/life-map/page.tsx` or component-backed route | public demo | Sample-safe symbolic Life Map surface | Present by README/source search | Partial |
| `/xr` | `src/app/xr/page.tsx` | public gated XR | WebXR capability-gated route | Present | Correctly gated if no fake headset claim |
| `/dashboard` | source route / gated page per README | protected/gated | Gated until private-account evidence passes | Present/gated per README | Must remain gated |
| `/login` | source route / gated page per README | protected/gated | Gated until private account release evidence passes | Present/gated per README | Must remain gated |
| `/signup` | `src/app/signup/page.tsx` | public/gated waitlist | Waitlist-first signup gate | Present | Partial until waitlist persistence proof |
| `/privacy` | source route per README | public legal/trust | Privacy page | Present by README | Needs privacy gate proof for full launch |
| `/terms` | source route per README | public legal/trust | Terms page | Present by README | Needs legal review proof |
| `/privacy-controls` | source route per prior live proof/README | public/gated control | Privacy controls surface | Present by prior proof | Must not imply live delete/export until proven |
| `/api/waitlist` | `src/app/api/waitlist/route.ts` | API | Validate, rate-limit hook, dry-run or Firestore Admin write | Present | Persistence not claimed until tested |
| `/api/companion` | `src/app/api/companion/route.ts` | API | Deterministic companion reply | Present | Demo/mock; not provider-backed AI |
| `/admin/*` | `src/app/admin/*` | admin/internal | Admin/export/system routes appear in source search | Present | Must be protected/no public sensitive data |
| `/app/*` | `src/app/app/*` | app/private-ish | App dashboard/story/settings/etc. appear in source search | Present | Must remain gated or demo-safe until account proof |

## Critical drift finding

`src/app/ground/page.tsx` exists and contains a real Ground page implementation. Therefore a live 404 on `/ground` is not explained by missing source. The likely causes are stale deployment, route not included in deployed build, wrong hosting target, or Firebase/App Hosting serving an older bundle.

## Source safety finding

The Ground page includes explicit launch-safety copy: it says Ground is public sample-data preview and does not claim autonomous action, passive sensing, medical inference, or private account access.
