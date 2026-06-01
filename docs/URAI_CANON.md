# URAI Canon

## Canonical Production Repo
- `LifeLoggerAI/UrAi`

## Canonical Route Map
- `/` -> Genesis home (`src/app/page.tsx`)
- `/home` -> Genesis home (`src/app/home/page.tsx`)
- `/app` -> app-shell Genesis entry (`src/app/app/page.tsx`)
- `/life-map` -> spatial life-map galaxy (`src/app/life-map/page.tsx`)
- `/focus` -> focus mode (`src/app/focus/page.tsx`)
- `/replay` -> replay mode (`src/app/replay/page.tsx`)
- `/app/life-map` -> spatial life-map galaxy (`src/app/app/life-map/page.tsx`)
- `/app/life-map/focus` -> focus mode (`src/app/app/life-map/focus/page.tsx`)
- `/app/life-map/replay` -> replay mode (`src/app/app/life-map/replay/page.tsx`)

## Canonical Home Component
- `src/components/urai/home/HomeScene.tsx`

## Canonical Life-Map Runtime
- All life-map/focus/replay routes render `src/components/spatial-life-map/SpatialLifeMap`.

## Canon Rules
- Do not reintroduce alternate generic/card-heavy home routes.
- Do not ship user-facing fallback/debug/demo/placeholder text.
- Keep root and app route trees behaviorally coherent.
