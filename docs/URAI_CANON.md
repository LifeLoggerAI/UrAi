# URAI Canon

## Canonical Production Repo
- `LifeLoggerAI/UrAi`

## Canonical Route Map
- `/` -> Genesis home (`src/app/page.tsx`)
- `/home` -> Genesis home (`src/app/home/page.tsx`)
- `/app` -> app-shell Genesis entry (`src/app/app/page.tsx`)
- `/life-map` -> contract-safe life-map route (`src/app/life-map/page.tsx`)
- `/focus` -> contract-safe focus route (`src/app/focus/page.tsx`)
- `/replay` -> contract-safe replay route (`src/app/replay/page.tsx`)
- `/app/life-map` -> spatial life-map galaxy (`src/app/app/life-map/page.tsx`)
- `/app/life-map/focus` -> spatial focus mode (`src/app/app/life-map/focus/page.tsx`)
- `/app/life-map/replay` -> spatial replay mode (`src/app/app/life-map/replay/page.tsx`)

## Canonical Home Component
- `src/components/urai/home/HomeScene.tsx`

## Runtime Split (Current)
- Root routes keep `LifeMapUniverse` behavior to satisfy existing smoke contracts.
- App-scoped life-map routes use `src/components/spatial-life-map/SpatialLifeMap` for immersive 3D flow.

## Canon Rules
- Do not reintroduce alternate generic/card-heavy home routes.
- Do not ship user-facing fallback/debug/demo/placeholder text.
- Keep root and app route trees behaviorally coherent.
