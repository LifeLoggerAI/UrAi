# Ancient Signals Engine

Ancient Signals is URAI's before-words intelligence layer.

Instead of only interpreting what a user says, it models older signals beneath speech:

- voice rhythm and silence
- touch and digital friction
- movement and stillness
- sleep and nocturnal drift
- social distance and connection pull
- recovery pulses
- toward/away behavioral vectors
- aura atmosphere for symbolic HomeView rendering

Core idea:

```txt
Words explain the user. Preverbal signals reveal what changed before the user had words for it.
```

## Core Runtime Module

Location:

```txt
src/lib/ancientSignals.ts
```

Primary exports:

```ts
computeAncientSignals()
computePreverbalState()
computeAuraAtmosphere()
computeTowardAwayVector()
mapAncientSignalsToVisualState()
mapAncientSignalsToNarratorPrompt()
mapUserDataToAncientSignals()
buildAncientSignalSnapshot()
buildAncientSkyParams()
buildAncientNarratorProfile()
```

## Firestore Repository Module

Location:

```txt
src/lib/ancientSignalsRepository.ts
```

Primary exports:

```ts
createAncientSignalSnapshot()
createAncientSignalSnapshotFromSignals()
getLatestAncientSignalSnapshot()
getRecentAncientSignalSnapshots()
```

## Callable Functions

Location:

```txt
functions/src/index.ts
```

Exported functions:

```txt
generateAncientSignalsSnapshot
generateAuraAtmosphere
generatePreverbalInsight
rollupAncientSignalsDaily
```

---

# Runtime Status

## Implemented

- Ancient Signals scoring engine
- Preverbal state classifier
- Aura atmosphere mapper
- Toward/away vector mapper
- HomeView/Rive-compatible visual bindings
- Narrator profile bindings
- Firestore snapshot type
- Raw telemetry mapper
- Firestore repository wrapper
- Authenticated callable snapshot persistence
- Aura/preverbal callable helpers
- Daily rollup callable scaffold
- Firestore owner-scoped security rule
- Firestore composite index for `ownerUid + createdAt desc`
- Firebase deploy config for Firestore rules/indexes/functions
- System contract registration
- Cognitive Mirror UI card
- Unit tests

## Remaining Production Tasks

### Build Verification

Run locally:

```bash
npm install
npm run check:types
npm test -- ancientSignals
npm run build
cd functions && npm install && npm run build
firebase deploy --only firestore:rules,firestore:indexes
```

### Cloud Functions Verification

Run locally after function dependencies are installed:

```bash
cd functions
npm run build
firebase emulators:start --only functions,firestore
```

### Real Passive Signal Sources

Connect:

- Shadow Cognition metrics
- Obscura Patterns
- Mental Load scores
- ChronoMirror snapshots
- Mood Weather
- relationship/social graph rollups
- notification friction
- sleep/motion systems
- location rhythm when consented
- audio rhythm and pause features when consented

### HomeView Integration

Cognitive Mirror currently previews Ancient Sky/HomeView bindings. The next visual task is to consume these values inside the actual HomeView atmosphere/orb/sky scene.

---

# Firestore Schema

Collection:

```txt
ancientSignals
```

Document shape:

```ts
{
  id?: string;
  ownerUid: string;
  userId: string;
  source: 'live' | 'demo' | 'imported' | 'rollup';
  rawData?: Record<string, unknown> | null;
  input?: Record<string, unknown>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  sourceWindow?: {
    startAt: string;
    endAt: string;
    durationMinutes: number;
  } | null;
  preverbalState: 'settled' | 'activated' | 'guarded' | 'seeking' | 'withdrawing' | 'overloaded' | 'recovering' | 'numb' | 'unknown';
  activationScore: number;
  withdrawalScore: number;
  recoveryPulseScore: number;
  numbnessScore: number;
  seekingScore: number;
  signalDepth: {
    words: number;
    voice: number;
    gesture: number;
    bodyRhythm: number;
    socialField: number;
    auraAtmosphere: number;
    towardAway: number;
  };
  auraAtmosphere: {
    warmth: number;
    heaviness: number;
    staticCharge: number;
    haze: number;
    pressure: number;
    bloomPotential: number;
  };
  towardAwayVector: {
    towardPeople: number;
    awayFromPeople: number;
    towardRest: number;
    awayFromRest: number;
    towardMeaning: number;
    awayFromMeaning: number;
  };
  confidence: number;
  consentBasis: {
    audioProcessing?: boolean;
    locationContext?: boolean;
    relationshipInsights?: boolean;
    healthWellnessInsights?: boolean;
  };
  visualState: {
    orbPulseRate: number;
    auraDensity: number;
    skyHaze: number;
    groundTension: number;
    constellationDrift: number;
    shadowStatic: number;
    bloomReadiness: number;
  };
  narratorHint: {
    mode: string;
    tone: string;
    shouldSpeak: boolean;
    messageSeed: string;
    reason: string;
  };
  safetyFlags: string[];
}
```

---

# Firestore Rules

`firestore.rules` protects:

```txt
ancientSignals/{id}
```

with the existing owner-scoped helper pattern:

```txt
read/update/delete require resource.data.ownerUid == request.auth.uid
create requires request.resource.data.ownerUid == request.auth.uid
```

---

# Firestore Index

`firestore.indexes.json` includes:

```txt
collectionGroup: ancientSignals
ownerUid ASC
createdAt DESC
```

This supports:

```ts
getLatestAncientSignalSnapshot(ownerUid)
getRecentAncientSignalSnapshots(ownerUid)
```

---

# Consent Model

Ancient Signals uses existing gates from `src/lib/system-of-systems-contract.ts`.

```ts
ANCIENT_SIGNAL_CONSENT_GATES = {
  voiceProxy: 'audioProcessing',
  movementContext: 'healthWellnessInsights',
  locationRhythm: 'locationContext',
  socialField: 'relationshipInsights',
  narratorOutput: 'healthWellnessInsights',
}
```

Production rule:

```txt
No consent, no sensitive signal ingestion.
```

User-facing language must stay soft. Avoid diagnostic or certainty claims.

Do not say:

```txt
You are lying.
You are sick.
You smell stressed.
```

Say:

```txt
Your rhythm looks more guarded than usual.
Your body-weather looks heavy tonight.
Your signals suggest a lower-stimulation mode may help.
```

---

# UI Integration

Implemented component:

```txt
src/components/ancient-signals/AncientSignalCard.tsx
```

Recommended next components:

```txt
src/components/ancient-signals/AuraAtmosphere.tsx
src/components/ancient-signals/PreverbalStateBadge.tsx
src/components/ancient-signals/SignalDepthStack.tsx
src/components/ancient-signals/TowardAwayCompass.tsx
```

Recommended surfaces:

- HomeView atmosphere
- Cognitive Mirror
- Mood Weather
- Life Map star details
- Replay Mode
- Companion narrator
- Ritual suggestion engine

Visual mapping:

| Ancient signal | URAI visual |
| --- | --- |
| activation | faster orb pulse, static aura |
| withdrawal | constellation drift, sky haze |
| recovery | dawn bloom, warm aura |
| numbness | muted saturation, slower particles |
| social absence | wider relationship orbit |
| mental load | ground tension |
| recovery pulse | bloom readiness |

---

# Philosophy

URAI should notice without accusing.

```txt
Before words, there is rhythm.
Before rhythm, there is tension.
Before tension, there is movement toward or away.
Ancient Signals maps the body and behavior's older language into gentle visual guidance.
```
