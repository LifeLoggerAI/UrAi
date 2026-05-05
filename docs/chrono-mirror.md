# ChronoMirror

ChronoMirror is URAI's felt-time cognition engine.

Instead of measuring only objective time, ChronoMirror models:
- subjective time dilation
- memory density
- emotional frame rate
- narrative velocity
- future horizon
- temporal identity orientation
- replay resonance

## Core Runtime Module

Location:

```txt
src/lib/chronoMirror.ts
```

Primary exports:

```ts
computeChronoMirror()
computeChronoValidation()
computeFeltTimeReplaySegments()
```

---

# Firestore Schema

Collection:

```txt
chronoMirrorSnapshots
```

Document shape:

```ts
{
  userId: string;
  createdAt: Timestamp;
  perceivedSpeed: 'compressed' | 'normal' | 'dilated';
  timeDilationScore: number;
  timeCompressionScore: number;
  realityDensity: number;
  emotionalFrameRate: number;
  memoryDensity: number;
  futureHorizon: number;
  lifeDragIndex: number;
  autopilotCollapse: number;
  anticipationStretch: number;
  aftermathDuration: number;
  emotionalHalfLife: number;
  timeToMeaning: number;
  identityDistance: number;
  narrativeVelocity: number;
  chronoTherapyMode: string;
  temporalOrientation: string;
  recurrenceLoops: string[];
  visualState: {
    skyTempo: string;
    particleDensity: number;
    shadowLength: number;
  };
}
```

---

# Analytics Event Schema

Event:

```txt
chrono_validation_events
```

Payload:

```ts
{
  userId: string;
  timestamp: Timestamp;
  insightResonanceScore: number;
  replayCount: number;
  pauseDurationMs: number;
  returnedWithin24h: boolean;
  returnedWithin72h: boolean;
  sharedInsight: boolean;
  savedInsight: boolean;
  replayResolved: boolean;
}
```

Purpose:
- emotional resonance learning
- replay optimization
- narrator tuning
- forecasting validation
- symbolic reinforcement learning

---

# Felt-Time Replay Engine

Chronological time is NOT equal to replay duration.

Replay weighting is computed from:
- emotional frame rate
- memory density
- anticipation stretch
- aftermath duration
- time-to-meaning
- reality density

Example:

```txt
Monday: 42%
Tuesday: 4%
Wednesday: 11%
Thursday: 28%
Friday: 15%
```

This allows traumatic, transformative, or emotionally dense periods to occupy more replay space.

---

# UI Integration

Component:

```txt
src/components/chrono/ChronoMirrorCard.tsx
```

Integrated into:

```txt
src/app/cognitive-mirror/page.tsx
```

Current UI surfaces:
- perceived speed
- life drag
- reality density
- future horizon
- replay tempo
- chrono therapy mode
- temporal orientation
- recurrence loops

---

# Future Integration Targets

## Sky Engine
Map chrono states to:
- Rive animations
- particle velocity
- atmospheric lighting
- constellation activity
- cloud density

## Narrator Engine
Adapt:
- pacing
- silence
- tone
- cadence
- emotional intensity

## Threshold Detection
Detect:
- identity transitions
- collapse periods
- rebirth periods
- symbolic chapter shifts

## Forecast Engine
Predict:
- burnout windows
- emotional slowdown
- dissociation periods
- recovery windows
- anticipation spikes

## Memory Density Map
Render:
- high-resolution life chapters
- memory deserts
- trauma wells
- transformation constellations

---

# Philosophy

ChronoMirror is designed to model:

```txt
How consciousness experienced time.
```

Not merely:

```txt
What objectively happened.
```
