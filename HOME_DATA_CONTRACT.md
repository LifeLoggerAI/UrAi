# HOME DATA CONTRACT

Status: PARTIALLY VERIFIED
Route: `/home`
Canonical component: `src/components/urai/UraiResolvedHomeScene.tsx`
Canonical hook: `src/lib/use-urai-home-state.ts`

## Purpose

This document defines the data contract for the final URAI `/home` field. `/home` must prefer authenticated live Firebase/Firestore data and use demo/unconfigured data only as explicit fallback behavior.

## Canonical client model

`UraiHomeViewModel` is the normalized render model consumed by `/home`.

Required normalized fields:

- `moodWeather: string`
- `rhythmState: stable | focused | overstimulated | offRhythm | recovering`
- `visualState: calm | focused | overstimulated | offRhythm | recovery | threshold | socialHigh | socialSilence | empty`
- `auraColor: string`
- `auraSecondaryColor: string`
- `recoveryScore: number`
- `recoveryDirection: rising | flat | falling`
- `bloomReady: boolean`
- `memoryNodeCount: number`
- `forecastSummary: string`
- `forecastMessage: string`
- `companionMode: quiet | listening | reflecting | forecasting | ritual | protective`
- `narratorWhisper: string`
- `socialEnergy: high | balanced | low | silent | strained`
- `shadowLoad: number`
- `cognitiveLoad: number`
- `thresholdRisk: number`
- `moodConfidence: number`
- `insight: UraiHomeInsight`
- `nodes: UraiLifeMapNode[]`
- `source: firestore | demo | unconfigured`
- `loading: boolean`
- `error?: string`

## Firestore paths

All live reads are scoped under the authenticated user:

- `users/{uid}/homeState/current`
- `users/{uid}/moodForecasts/current`
- `users/{uid}/companionState/current`
- `users/{uid}/visualState/current`
- `users/{uid}/lifeMapNodes/*` with a current query limit of 24

## Expected document shapes

### `users/{uid}/homeState/current`

Supported nested fields:

```ts
{
  mood?: {
    label?: string;
    confidence?: number;
  };
  rhythm?: {
    state?: "stable" | "focused" | "overstimulated" | "offRhythm" | "off_rhythm" | "recovering";
  };
  stress?: {
    thresholdRisk?: number;
    shadowLoad?: number;
    cognitiveLoad?: number;
  };
  recovery?: {
    score?: number;
    direction?: "rising" | "flat" | "falling";
    bloomReady?: boolean;
  };
  forecast?: {
    label?: string;
    message?: string;
  };
  memory?: {
    nodeCount?: number;
    recentStars?: UraiLifeMapNodeLike[];
  };
  social?: {
    energy?: "high" | "balanced" | "low" | "silent" | "strained";
  };
  insight?: {
    id?: string;
    title?: string;
    body?: string;
    ctaLabel?: string;
    ctaRoute?: string;
    confidence?: number;
  };
  companion?: {
    state?: "quiet" | "listening" | "reflecting" | "forecasting" | "ritual" | "protective";
    message?: string;
  };
  visual?: {
    state?: string;
    auraColor?: string;
    auraSecondaryColor?: string;
  };
}
```

Top-level fallback aliases are also supported by `useUraiHomeState`, including `moodWeather`, `moodLabel`, `rhythmState`, `visualState`, `auraColor`, `auraSecondaryColor`, `recoveryScore`, `thresholdRisk`, `shadowLoad`, `cognitiveLoad`, `memoryNodeCount`, `forecastSummary`, `forecastMessage`, `companionMode`, `narratorWhisper`, `socialEnergy`, and `recentStars`.

### `users/{uid}/moodForecasts/current`

Supported fields:

```ts
{
  summary?: string;
  forecastSummary?: string;
  message?: string;
}
```

### `users/{uid}/companionState/current`

Supported fields:

```ts
{
  mode?: "quiet" | "listening" | "reflecting" | "forecasting" | "ritual" | "protective" | "ambient";
  companionMode?: string;
  narratorWhisper?: string;
  whisper?: string;
}
```

### `users/{uid}/visualState/current`

Supported fields:

```ts
{
  visualState?: string;
  rhythmState?: string;
  moodWeather?: string;
  auraColor?: string;
  auraSecondaryColor?: string;
}
```

### `users/{uid}/lifeMapNodes/{nodeId}`

Supported fields:

```ts
{
  type?: string;
  starType?: string;
  title?: string;
  label?: string;
  subtitle?: string;
  detail?: string;
  summary?: string;
  narratorLine?: string;
  emotionalWeight?: number;
  weight?: number;
  importance?: number;
  intensity?: number;
  emotionalIntensity?: number;
  glow?: number;
  x?: number;
  y?: number;
  positionX?: number;
  positionY?: number;
  position?: { x?: number; y?: number };
  auraColor?: string;
  color?: string;
}
```

## Normalization rules

- Numeric probabilities are clamped to valid ranges.
- Percentage-style coordinates are clamped between 5 and 95.
- Missing strings use safe symbolic fallback copy.
- Missing life-map nodes use explicit demo fallback nodes only when no live nodes exist.
- Unsupported node types normalize to `memory`.
- `off_rhythm` normalizes to `offRhythm`.
- Companion `ambient` normalizes to `quiet`.

## Fallback behavior

Allowed fallback states:

- `source: firestore`: authenticated live data is active.
- `source: demo`: unauthenticated user or no live user context.
- `source: unconfigured`: Firebase config is unavailable.

Fallback data must not be represented as confirmed live user data.

## Empty state behavior

If live docs exist but specific fields are absent, `/home` must still render partial data using normalized safe defaults. Empty memory nodes fall back to demo constellation nodes until a dedicated empty-star UX is added.

## Error state behavior

Snapshot errors set `error` and return safe demo fallback UI. This protects runtime stability but does not satisfy final LOCKED status without emulator/rules proof.

## Firestore rules expectations

Rules must prove:

- Authenticated users can read only their own `/home` data.
- Users cannot read another user's home state.
- Unauthenticated users cannot read private home state.
- Telemetry writes, if present, are scoped and sanitized.
- Trust/privacy settings are scoped to the user.
- Companion logs, if stored, are scoped to the user.
- Admin/debug surfaces require admin authorization.

## Index expectations

The current query on `lifeMapNodes` uses `limit(24)` without an explicit order. No composite index is expected for the current implementation. Add indexes if ordering/filtering is introduced.

## Emulator seed sample

```json
{
  "users/test-user/homeState/current": {
    "mood": { "label": "Mirror Clarity", "confidence": 0.9 },
    "rhythm": { "state": "focused" },
    "recovery": { "score": 74, "direction": "rising", "bloomReady": true },
    "stress": { "thresholdRisk": 0.12, "shadowLoad": 0.18, "cognitiveLoad": 0.31 },
    "forecast": { "label": "Mirror Pattern active", "message": "Signals suggest a focused recovery rhythm." },
    "social": { "energy": "balanced" },
    "companion": { "state": "reflecting", "message": "Your patterns are becoming visible." },
    "visual": { "state": "recovery", "auraColor": "#7ee7ff", "auraSecondaryColor": "#fbbf24" }
  },
  "users/test-user/lifeMapNodes/node-1": {
    "type": "becoming",
    "title": "Blueprint Locked",
    "subtitle": "A foundation has formed.",
    "emotionalWeight": 0.86,
    "x": 38,
    "y": 39,
    "auraColor": "hsl(205deg 90% 72%)"
  }
}
```

## Current verification status

- Client data hook exists and reads authenticated Firestore paths.
- Normalization exists for live, partial, demo, and unconfigured states.
- Emulator/rules proof still must be run before `/home` can be marked LOCKED.
