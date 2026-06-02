# URAI V1 Product Spec

## Purpose

URAI V1 proves the core emotional product loop:

1. A user opens a cinematic symbolic environment.
2. They see a mood forecast and weekly reflection.
3. They explore a public memory constellation.
4. They interact with a calm companion narrator.
5. They join the waitlist for early access.

V1 should feel emotionally meaningful before it becomes technically exhaustive.

## Primary user promise

URAI helps people see their life as patterns, not noise.

## V1 scope

### In scope

- Cinematic home route at `/`
- Public constellation route at `/u/adamclamp`
- Seeded memory blooms
- Seeded star timeline
- Mood forecast card
- Weekly reflection card
- Companion chat UI
- Mocked companion narrator API
- Waitlist form
- Waitlist API with Firestore Admin persistence when configured
- Firestore rules/index scaffolding
- Demo seed JSON generation
- Optional Firestore seeding
- Waitlist CSV export
- V1 sanity check script

### Out of scope for V1

- Full passive sensor ingestion
- Production AI model orchestration
- AR/VR/spatial viewer
- Real user authentication flow
- Full marketplace
- Therapist-grade clinical claims
- Production mobile app packaging
- Monetized data exchange

## Key routes

| Route | Purpose |
| --- | --- |
| `/` | Main emotional entry point and product explanation |
| `/u/adamclamp` | Public demo constellation and conversion page |
| `/api/companion` | Companion narrator response API |
| `/api/waitlist` | Waitlist capture API |

## Core components

| Component | Purpose |
| --- | --- |
| `HomeScene` | Cinematic entry point with forecast, reflection, companion, and waitlist |
| `GroundLayer` | Symbolic vitality/recovery ground layer |
| `ForecastCard` | Current rhythm/mood forecast |
| `WeeklyReflectionCard` | Narrative weekly summary |
| `CompanionChat` | Client UI for companion narrator |
| `WaitlistForm` | Early-access capture |

## Data model

Canonical V1 schemas live in:

```txt
src/lib/urai-v1-schemas.ts
```

Demo data lives in:

```txt
src/lib/demo-data.ts
```

Firestore collection contract lives in:

```txt
docs/FIRESTORE_V1_COLLECTIONS.md
```

## Success criteria

V1 is successful if:

- The demo renders without backend dependency.
- The emotional loop is understandable in under one minute.
- The companion feels aligned with URAI's tone.
- A visitor can join the waitlist.
- The repo can pass sanity, unit, type, build, and preflight checks.
- Firebase rules/indexes can deploy.

## Definition of done

```bash
npm install
npm run check:v1
npm run seed:demo
npm run test:unit
npm run check:types
npm run build
npm run preflight
```

Then visually verify:

- `/`
- `/u/adamclamp`
- waitlist submission
- companion response
