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
- System contract registration
- Unit tests

## Remaining Production Tasks

### Build Verification

Run locally:

```bash
npm install
npm run check:types
npm test -- ancientSignals
npm run build
```

### Firestore Persistence

Create production write path for:

```txt
ancientSignals/{snapshotId}
```

Document shape is represented by:

```ts
AncientSignalSnapshot
```

### Firestore Rules

Protect:

```txt
ancientSignals
```

so users only access documents where `ownerUid == request.auth.uid`.

### Firestore Indexes

Add:

```txt
ownerUid + createdAt desc
```

### Cloud Functions

Registered function names:

```txt
generateAncientSignalsSnapshot
rollupAncientSignalsDaily
generateAuraAtmosphere
generatePreverbalInsight
```

Expected flow:

```txt
ingestEvent
  -> enrichEvent
  -> rollupDailyMetrics
  -> generateAncientSignalsSnapshot
  -> generateMoodForecast / generateDailyInsights / generateLifeMapStar
  -> HomeView + Cognitive Mirror + Companion + Replay
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

---

# Firestore Schema

Collection:

```txt
ancientSignals
```

Document shape:

```ts
{
  id: string;
  ownerUid: string;
  createdAt: string;
  updatedAt: string;
  sourceWindow: {
    startAt: string;
    endAt: string;
    durationMinutes: number;
  };
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

Recommended components:

```txt
src/components/ancient-signals/AncientSignalCard.tsx
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
