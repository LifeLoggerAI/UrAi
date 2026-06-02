# Ancient Signals Engine

Ancient Signals is URAI's before-words intelligence layer. It models signals that can shift before a user has language for them: rhythm, silence, touch/digital friction, movement, distance, recovery pulse, and toward/away behavior.

This implementation is intentionally gentle and non-diagnostic. It should describe soft body-weather patterns, not medical certainty, deception, or unsupported scent claims.

## Product Role

Ancient Signals powers:

- HomeView ambient body-weather overlay
- GroundLayer atmosphere inputs
- Firestore snapshots at `ancientSignals/{id}`
- passive rollups from existing URAI signal collections
- daily scheduled rollups for persisted background state
- narrator-safe language seeds

## Runtime Modules

```txt
src/lib/ancientSignals.ts
```

Core frontend-safe scoring engine:

- `computeAncientSignals(input)`
- `mapUserDataToAncientSignals(rawData)`
- preverbal state classification
- aura atmosphere generation
- toward/away vector generation
- HomeView visual bindings
- narrator hint generation

```txt
src/lib/ancientSignalsRepository.ts
```

Firestore client helpers:

- `createAncientSignalSnapshot(ownerUid, rawData, options)`
- `createAncientSignalSnapshotFromSignals(ownerUid, input, options)`
- `getLatestAncientSignalSnapshot(ownerUid)`
- `getRecentAncientSignalSnapshots(ownerUid, count)`

```txt
src/lib/useAncientSignals.ts
```

Client hook that prefers persisted snapshots for signed-in users and falls back to demo Ancient Signals data.

## UI Integration

```txt
src/components/ancient-signals/AncientSignalAmbientLayer.tsx
src/components/HomeScene.tsx
```

HomeScene keeps the current V1 demo spine and adds Ancient Signals as a background/environment layer.

Ancient Signals maps into `GroundLayer` as:

| Ancient Signal | Ground/HomeView mapping |
| --- | --- |
| `auraAtmosphere.warmth` | mood score |
| `preverbalState` | rhythm state |
| `recoveryPulseScore` | recovery score |
| `seekingScore` | vitality score |
| `signalDepth.auraAtmosphere` | symbolic intensity |
| `activationScore` | shadow stress |

## Firestore

Collection:

```txt
ancientSignals
```

Owner-scoped access is added in `firestore.rules`:

```txt
match /ancientSignals/{id} { allow read/create/update/delete with ownerUid rules }
```

Indexes added in `firestore.indexes.json`:

```txt
ownerUid ASC, createdAt DESC
ownerUid ASC, source ASC, rollupDate ASC
```

The first supports latest/recent reads. The second supports scheduled duplicate checks.

## Functions

```txt
functions/src/ancientSignalCompute.ts
functions/src/ancientPassiveRollups.ts
functions/src/ancientCallableFunctions.ts
functions/src/ancientScheduledRollups.ts
functions/src/index.ts
```

Exports:

- `generateAncientSignalsSnapshot`
- `generateAuraAtmosphere`
- `generatePreverbalInsight`
- `rollupAncientSignalsDaily`
- `scheduledAncientSignalsDailyRollup`

### Callable Examples

Persist a snapshot from passive rollups:

```ts
await httpsCallable(functions, "generateAncientSignalsSnapshot")({
  usePassiveRollups: true,
  daysBack: 1,
});
```

Generate a specific daily rollup:

```ts
await httpsCallable(functions, "rollupAncientSignalsDaily")({
  date: "2026-05-06",
});
```

Preview atmosphere without persisting:

```ts
await httpsCallable(functions, "generateAuraAtmosphere")({
  usePassiveRollups: true,
  daysBack: 1,
});
```

## Passive Rollup Sources

The first-pass adapter reads likely URAI collections and tolerates missing collections/fields:

- `moods`
- `moodForecasts`
- `shadowMetrics`
- `obscuraPatterns`
- `passiveSignals`
- `chronoMirrorSnapshots`
- `relationshipSignals`
- `events`
- `recoveryBlooms`

It maps numeric fields into:

- `positiveValence`
- `moodIntensity`
- `mentalLoadScore`
- `recoverySignal`
- `nocturnalDrift`
- `shadowScore`
- `obscuraScore`
- `frictionTapScore`
- `hesitationScore`
- `cancelLoopScore`
- `scrollVelocityScore`
- `motionJitter`
- `stagnationScore`
- `notificationFriction`
- `chronoCompression`
- `chronoDilation`
- `wordDisclosure`
- `socialAbsence`
- `connectionPull`
- `conflictResidue`
- `voiceTension`
- `pauseDensity`
- `speechCompression`
- `silenceWeight`

## Scheduled Rollup

```txt
scheduledAncientSignalsDailyRollup
```

Behavior:

- schedule: every day at 03:30 UTC
- source window: prior UTC day
- user pagination: 250 users/page
- run cap: 5,000 users
- duplicate protection: `ownerUid + source + rollupDate`
- source: `scheduled_rollup`

Skips users when:

- `featureFlags.ancientSignals.enabled === false`
- `featureFlags["ancientSignals.enabled"] === false`
- `consents.healthWellnessInsights === false`

## Safety Boundaries

Do not claim:

- diagnosis
- deception detection
- scent detection without hardware
- certainty about internal state

Use language like:

```txt
Your rhythm looks more guarded than usual.
Your body-weather looks heavier tonight.
Something in you may be coming back online.
```

## Verification

Recommended local checks:

```bash
npm install
npm run check:types
npm run build
cd functions && npm install && npm run build
firebase deploy --only firestore:rules,firestore:indexes,functions
```
