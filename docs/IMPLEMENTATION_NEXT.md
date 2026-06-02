# URAI V1 Implementation Next

This file locks the next implementation target: a working V1 demo spine, not more speculative roadmap work.

## Objective

Make URAI render a beautiful, testable public demo at `/u/adamclamp` with a minimal but complete product spine:

- cinematic home scene
- public memory timeline
- seeded memory stars
- mood forecast
- weekly reflection
- companion narrator chat
- canonical TypeScript schemas
- demo seed data
- Firebase environment template
- validation commands

## Required routes

| Route | Purpose |
| --- | --- |
| `/` | Cinematic URAI home scene with companion entry point |
| `/u/[handle]` | Public symbolic timeline demo for a user handle |
| `/api/companion` | Safe companion narrator response endpoint |

## Required components

- `HomeScene`
- `CompanionChat`
- `ForecastCard`
- `WeeklyReflectionCard`
- public timeline/star cards in `/u/[handle]`

## Canonical V1 collections

These collections define the V1 contract. They can be backed by real Firestore later, but the UI should work with seeded data now.

- `users`
- `timelineEvents`
- `memoryBlooms`
- `moodForecasts`
- `weeklyReflections`
- `companionMessages`
- `narratorInsights`
- `rituals`
- `relationshipSignals`
- `passiveSignals`
- `symbolicStates`
- `waitlistSignups`

## Seed data

The seed layer should provide one full public demo profile:

- handle: `adamclamp`
- 10-20 timeline events
- 2-3 memory blooms
- one current mood forecast
- one weekly reflection
- companion state
- symbolic state

## Validation commands

Run these before treating the demo spine as complete:

```bash
npm run check:types
npm run build
npm run preflight
```

## Definition of done

- `/` renders without requiring heavy assets.
- `/u/adamclamp` renders without live backend data.
- `/api/companion` returns structured JSON.
- Companion chat works from the UI.
- Demo data is centralized and typed.
- Firebase environment requirements are documented.
- Build and typecheck pass.

## Do not implement yet

Do not prioritize AR/VR, marketplace, full AI therapist replay, full symbolic ontology, or production monetization until the V1 demo spine is stable.
