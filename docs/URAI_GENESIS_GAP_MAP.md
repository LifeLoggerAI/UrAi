# URAI Genesis Gap Map

Last updated: 2026-06-01

## Current implementation status

### Done

- Added Genesis shared TypeScript models under `src/lib/urai/types.ts`.
- Added consent and URAI Passport state primitives under `src/lib/urai/consent.ts`.
- Added Genesis narrator reflection primitive under `src/lib/urai/narrator.ts`.
- Added memory-star creation primitive under `src/lib/urai/memory-stars.ts`.
- Added default Genesis home-state factory under `src/lib/urai/genesis.ts`.
- Added Firestore path helpers under `src/lib/urai/firestore-paths.ts`.
- Added persistence adapter under `src/lib/urai/storage.ts` with Firebase-first and localStorage fallback behavior.
- Added reusable signal pipeline under `src/lib/urai/signal-pipeline.ts`.
- Added sound hook utility under `src/lib/urai/sound.ts`.
- Updated `src/app/home-view.tsx` to render the Genesis loop: immersive world, orb, narrator reflection, memory star, permissions, Passport, orb chat, and Bloom Moment action.

## Working Genesis loop

```txt
Open app
-> Genesis home renders
-> Orb appears inside immersive world
-> Initial system signal creates first reflection
-> First memory star appears
-> Permissions panel controls consent state
-> Passport panel displays private control mode
-> Bloom Moment creates a new signal, reflection, and memory star
-> Genesis snapshot attempts Firebase persistence when configured, otherwise localStorage
```

## Launch blockers

### 1. Build and type validation

Run and fix all issues from:

```bash
npm install
npm run lint
npm run build
```

The GitHub connector updated files directly, but no local CI/build runtime was available from this session.

### 2. Firebase rules and schema hardening

The client persistence adapter writes to:

```txt
uraiGenesis/{userId}/state/consent
uraiGenesis/{userId}/state/passport
uraiGenesis/{userId}/state/moodWeather
uraiGenesis/{userId}/signals/{signalId}
uraiGenesis/{userId}/reflections/{reflectionId}
uraiGenesis/{userId}/memoryStars/{starId}
```

Firestore rules should restrict users to their own `userId` branch before production use.

### 3. Real platform permission requests

The current permissions UI controls URAI consent state. It does not yet call native/browser permission APIs for microphone, location, notifications, motion, health, calendar, or contacts.

### 4. Real passive capture adapters

The current Bloom Moment uses a manual system event. Production Genesis needs adapters for:

- microphone/audio capture
- location capture
- notification permission/cadence
- motion/device activity where supported
- future health/calendar/contact integrations

### 5. Sound asset delivery

`sound.ts` expects files under:

```txt
/sounds/urai/home-ambient.mp3
/sounds/urai/orb-open.mp3
/sounds/urai/orb-close.mp3
/sounds/urai/memory-star-open.mp3
/sounds/urai/passport-open.mp3
/sounds/urai/permissions-open.mp3
/sounds/urai/life-map-transition.mp3
```

Missing files should not break the UI, but final sound design requires real assets.

## Production polish checklist

- Remove or hide all user-facing demo/debug/test labels.
- Confirm mobile layout for home, Passport, permissions, star card, and orb chat.
- Confirm `/life-map` exists and feels connected to Genesis.
- Confirm `OrbChatDrawer` safely handles the Genesis context payload.
- Confirm Firebase environment variables are present in deployed environments.
- Add Firestore rules for the Genesis data tree.
- Add smoke tests for consent state, Bloom Moment, and Passport display.

## Post-Genesis items

- Real-time passive signal ingestion.
- Full mood weather engine.
- Galaxy/life-map expansion.
- Mirror, Shadow, Legacy deeper data models.
- URAI Passport export/review flows.
- AR/VR/XR portals.
- Advanced emotional field reconstruction.
- Enterprise/data marketplace layers.
