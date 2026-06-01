# URAI Canon

## Canonical Production Repo
- `LifeLoggerAI/UrAi`

## Canonical Route Map
- `/` -> Genesis home (`src/app/page.tsx`)
- `/home` -> Genesis home (`src/app/home/page.tsx`)
- `/app` -> app-shell Genesis entry (`src/app/app/page.tsx`)
- `/app/life-map` -> spatial life-map galaxy (`src/app/app/life-map/page.tsx`)
- `/app/life-map/focus` -> focus mode (`src/app/app/life-map/focus/page.tsx`)
- `/app/life-map/replay` -> replay mode (`src/app/app/life-map/replay/page.tsx`)

## Canonical Home Component
- `src/components/urai/home/HomeScene.tsx`
- App route uses `HomeScene` with `ascentTarget="/app/life-map"` to keep transitions in the app route tree.

## Canonical Life-Map Component
- `src/app/app/life-map/page.tsx` using `src/components/spatial-life-map/SpatialLifeMap`

## Focus and Replay Components
- Focus route uses `SpatialLifeMap` with `initialMode="focus"`
- Replay route uses `SpatialLifeMap` with `initialMode="replay"`

## Canon Rules
- Do not reintroduce alternate generic/card-heavy home routes.
- Do not ship user-facing fallback/debug/demo/placeholder text.
- Keep `/`, `/home`, and `/app` aligned to one product identity.
- Keep `/app/life-map` as visual source of truth for galaxy language.
