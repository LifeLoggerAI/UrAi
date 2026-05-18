# HOME COMPANION CONTRACT

Status: PARTIALLY VERIFIED
Route: `/home`
Canonical companion surface: `/home` orb / field pulse, with `/narrator` as a connected route when present.
Canonical client context source: `src/lib/use-urai-home-state.ts`

## Purpose

The `/home` orb is the living companion entrypoint. It must be grounded in current home state, memory stars, emotional weather, narrator insight, and user trust settings where available. It must not behave like a static button.

## Current implementation baseline

The resolved `/home` scene provides:

- physical aura orb state through `aura-orb-button`, `data-orb-charge`, and orb charge UI
- companion focus surface through `focusSurface === "companion"`
- narrator/companion state through `home.companionMode` and `home.narratorWhisper`
- life-map/open action from the field pulse
- safe symbolic copy generated from normalized home state

The older shrine `HomeScene` has a local static orb chat layer. The canonical `/home` route now mounts the resolved home scene, which is the safer live-data path.

## Required companion states

The orb companion must support these states in UI or fallback status:

- `idle`
- `hover`
- `pressed`
- `listening`
- `thinking`
- `speaking`
- `insight-ready`
- `memory-retrieving`
- `error`
- `fallback`
- `offline`
- `cooldown`
- `disabled`

## Request shape

If a companion endpoint is connected, the client request should use this shape:

```ts
type HomeCompanionRequest = {
  userId: string;
  message?: string;
  action:
    | "open"
    | "ask"
    | "explain_weather"
    | "explain_insight"
    | "explain_memory_star"
    | "reflect"
    | "start_voice"
    | "stop_voice";
  context: {
    moodWeather?: string;
    rhythmState?: string;
    visualState?: string;
    auraColor?: string;
    recoveryScore?: number;
    recoveryDirection?: string;
    forecastSummary?: string;
    forecastMessage?: string;
    narratorWhisper?: string;
    companionMode?: string;
    socialEnergy?: string;
    shadowLoad?: number;
    cognitiveLoad?: number;
    thresholdRisk?: number;
    moodConfidence?: number;
    activeMemoryStar?: {
      id: string;
      type: string;
      title: string;
      subtitle?: string;
      emotionalWeight?: number;
    };
    source: "firestore" | "demo" | "unconfigured";
  };
  preferences?: {
    quietMode?: boolean;
    voiceEnabled?: boolean;
    ttsEnabled?: boolean;
    passiveCuesEnabled?: boolean;
    telemetryEnabled?: boolean;
  };
};
```

## Response shape

```ts
type HomeCompanionResponse = {
  id: string;
  text: string;
  state?: "thinking" | "speaking" | "insight-ready" | "cooldown" | "error";
  groundedSignals?: Array<{
    label: string;
    confidence?: number;
    source: "mood" | "rhythm" | "forecast" | "memory" | "recovery" | "social" | "passive" | "companion";
  }>;
  suggestedAction?: {
    label: string;
    route?: string;
    action?: string;
  };
  cooldownUntil?: string;
  errorCode?: string;
};
```

## Streaming behavior

If a streaming endpoint exists:

- set orb state to `thinking` before stream begins
- progressively render assistant text
- set orb state to `speaking` when text or TTS is active
- set orb state to `idle` or `insight-ready` after completion
- handle stream abort/cancel
- handle network failure with `error` or `fallback` state

If streaming is unavailable:

- use non-streaming response
- keep same request/response contract
- document fallback status in `HOME_LOCK_REPORT.md`

## Voice input behavior

Voice input may be connected through browser speech recognition or another approved stack.

Rules:

- voice starts only after explicit user action
- microphone permission denial is handled safely
- unsupported browser gets a text fallback
- listening state is visible
- stop/cancel is available
- no silent background recording
- no raw audio logging unless explicitly consented and implemented

## TTS behavior

TTS may be connected through browser speech synthesis or another approved stack.

Rules:

- speaking state is visible
- mute/stop is available where supported
- no surprise autoplay
- text equivalent is always present
- quiet mode disables unsolicited speech
- unsupported browser gets text-only fallback

## Explainability behavior

`Why am I seeing this?` must be available or planned for:

- emotional weather
- narrator insight
- memory star
- passive cue
- companion suggestion
- aura state when surfaced as insight

Explanation copy must describe signal categories without exposing raw private logs. Use uncertainty language such as `signals suggest`, `recent rhythm may indicate`, and `this looks like`.

## Cooldown and quiet mode

The companion must respect:

- dismissed insights
- cooldown windows
- repeated passive cue limits
- quiet mode
- voice/TTS preferences
- trust/privacy settings

If cooldown persistence is unavailable, it must fail closed: reduce nudges rather than increasing them.

## Error states

If a companion endpoint fails:

- show safe fallback state
- do not crash `/home`
- allow retry
- do not log private content
- emit sanitized telemetry if telemetry is enabled

## Privacy restrictions

- Do not hallucinate private data.
- Do not expose raw private logs.
- Do not include raw messages/audio in telemetry.
- Do not read another user's data.
- Do not record audio without explicit permission.
- Do not use clinical or diagnostic language.

## Current verification status

- `/home` is routed to the resolved home field.
- The resolved home field exposes physical orb charge, companion focus, and home-state-grounded copy.
- A production companion endpoint is not verified in this pass.
- Voice input and TTS are not verified in this pass.
- The final lock status remains PARTIALLY VERIFIED until endpoint, voice/TTS, emulator, runtime, and smoke evidence pass.
