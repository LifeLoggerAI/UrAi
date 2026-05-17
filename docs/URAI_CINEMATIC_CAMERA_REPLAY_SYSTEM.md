# URAI Cinematic Camera + Replay System

This is the production contract for the Ascent, Focus, and Replay experience. It is backed by `src/components/lifemap/cinematicLifeMapSystem.ts` and is designed to keep the visual layer shippable without requiring heavy 3D.

## Production System Overview

URAI uses a 2.5D cinematic world model: Home Field -> Ascent -> Symbolic Life Map -> Focused Memory Bloom -> Replay. The system is data-driven, motion-safe, and privacy-aware.

## Camera Phase Map

Phases:

- `idle`: Home field is grounded and interactive.
- `preAscent`: Input is locked, the orb/sky prepares to open.
- `ascending`: Ground and body soften while stars and weather depth reveal.
- `lifeMap`: Full interaction with Memory Stars and Timeline Constellations.
- `focusing`: Camera moves toward a Memory Star and dims non-related stars.
- `focusedMemory`: Memory Bloom is readable and trust controls are available.
- `replayIntro`: Timeline Constellation prepares for playback.
- `replaying`: Camera travels through Replay Beats.
- `replayPaused`: Scrub controls are active.
- `replayExit`: Camera collapses back to the Life Map.
- `returningHome`: Stars condense back toward the home field.

Each phase defines scale, translation, blur, opacity, active layers, interaction lock, narrator eligibility, gesture support, duration, easing, and valid transitions in `cameraPhaseMap`.

## Scene Layer Stack

1. Void / deep sky background
2. Emotional Weather nebulae
3. Deep star dust
4. Symbolic overlays
5. Galaxy planes
6. Timeline Constellation SVG threads
7. Memory Star buttons
8. Companion
9. Lens and control surfaces
10. Memory Bloom / Replay sheets

## Firestore Data Contracts

### `users/{userId}/memoryStars/{starId}`

```ts
{
  id: string;
  title: string;
  timestamp: string;
  emotionalTone: string;
  auraColor: string;
  intensity: number;
  position: { x: number; y: number; z: number };
  constellationId: string;
  memoryType: string;
  replayEligible: boolean;
  narratorCueId?: string;
  sourceSignals: string[];
  symbolicTags: string[];
  bloomStyle: string;
  weatherContext: string;
}
```

### `users/{userId}/replayEras/{eraId}`

```ts
{
  id: string;
  title: string;
  subtitle: string;
  startedAt: string;
  endedAt: string;
  beatIds: string[];
  defaultDurationMs: number;
}
```

### `users/{userId}/replayBeats/{beatId}`

```ts
{
  id: string;
  eraId: string;
  timestamp: string;
  starId: string;
  beatType: 'stable' | 'strained' | 'recovery' | 'ritual' | 'threshold' | 'rebirth' | 'reflection';
  cameraTarget: { x: number; y: number; scale: number; depth: number };
  durationMs: number;
  narratorCueId?: string;
  emotionalWeatherState: string;
  auraState: string;
  transitionStyle: 'drift' | 'bloom' | 'threadTrace' | 'thresholdPulse' | 'softCut';
  importanceScore: number;
}
```

### `users/{userId}/emotionalWeather/{weatherId}`

```ts
{
  id: string;
  tone: string;
  intensity: number;
  startedAt: string;
  endedAt?: string;
  visualLayer: 'clear' | 'fog' | 'storm' | 'bloom' | 'threshold';
}
```

### `users/{userId}/narratorCues/{cueId}`

```ts
{
  id: string;
  line: string;
  phase: string;
  offsetMs: number;
  voice: 'calm' | 'grounded' | 'soft' | 'clear';
  allowTts: boolean;
}
```

### `users/{userId}/constellations/{constellationId}`

```ts
{
  id: string;
  title: string;
  starIds: string[];
  emotionalArc: string;
  visibility: 'private' | 'safeSummary' | 'shareable';
  createdAt: string;
  updatedAt: string;
}
```

## Animation Timing

- Ascent prep: 220ms, cubic-bezier(0.19, 1, 0.22, 1)
- Ascent sky expansion: 980ms, cubic-bezier(0.19, 1, 0.22, 1)
- Life Map stabilization: 420ms
- Focus movement: 520ms, cubic-bezier(0.16, 1, 0.3, 1)
- Memory Bloom reveal: 280ms after focus lock
- Replay intro: 460ms
- Replay beat duration: 2200ms + importance weighting
- Replay exit: 420ms
- Returning home: 760ms

## Narrator Sync

Narrator cues are eligible only when `cameraPhaseMap[phase].narratorEligible` is true. The UI must avoid speaking during locked transition beats except for intentional Ascent/Replay moments. TTS should be user-controlled and suppressed in reduced-motion or quiet contexts unless explicitly enabled.

## Rive / Lottie Integration

Rive and Lottie assets can bind to the following phase signals:

- `phase`
- `emotionalWeatherState`
- `auraState`
- `selectedStarId`
- `replayProgress`
- `reducedMotion`

Until final assets are available, CSS layers remain the production-safe fallback.

## Mobile Gesture Support

- Tap star: Focus
- Double tap selected star: Replay
- Horizontal scrub in Replay: update elapsed beat time
- Vertical drag down on Memory Bloom: return to Life Map
- Pinch/trackpad wheel: Life Map zoom only when not transition locked

## Accessibility

- All Memory Stars are buttons with semantic labels.
- Reduced motion disables nonessential animation and shortens transitions.
- Focus states remain visible on controls.
- Replay must support play/pause/scrub through buttons, not gesture-only controls.
- Color is never the only signal: copy, labels, and structure clarify meaning.

## QA Checklist

- Home -> Ascent -> Life Map does not hard cut.
- Camera locks during `preAscent`, `ascending`, `focusing`, `replayIntro`, `replayExit`, and `returningHome`.
- Selecting a star dims unrelated stars and preserves related thread context.
- Memory Bloom shows why/provenance/privacy controls.
- Replay Beat interpolation works with zero, one, and many beats.
- Replay pause/resume does not duplicate timers.
- Reduced motion removes star twinkle, drift, bloom pulse, and parallax.
- Mobile bottom controls do not overlap Memory Bloom.
- Firestore partial data does not crash the scene.
- No demo/stub/coming-soon copy appears in public UI.

## Firebase Studio Prompt

Implement the URAI cinematic Ascent, Focus, and Replay system using `src/components/lifemap/cinematicLifeMapSystem.ts` as the source of truth. Wire camera phases into Home Field and Symbolic Life Map, map Memory Star selection to `focusing -> focusedMemory`, map Replay controls to `replayIntro -> replaying/replayPaused -> replayExit`, and preserve reduced-motion behavior. Do not introduce heavy 3D dependencies. Keep UI copy production-safe and privacy-aware.
