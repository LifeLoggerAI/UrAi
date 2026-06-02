export type CameraPhase =
  | "idle"
  | "preAscent"
  | "ascending"
  | "lifeMap"
  | "focusing"
  | "focusedMemory"
  | "replayIntro"
  | "replaying"
  | "replayPaused"
  | "replayExit"
  | "returningHome";

export type EmotionalTone =
  | "stable"
  | "strained"
  | "recovery"
  | "ritual"
  | "threshold"
  | "rebirth"
  | "joy"
  | "grief"
  | "focus"
  | "awe";

export type MemoryType =
  | "insight"
  | "ritual"
  | "relationship"
  | "threshold"
  | "recovery"
  | "milestone"
  | "reflection";

export type BloomStyle =
  | "softGlow"
  | "auraFlare"
  | "constellationBloom"
  | "weatherBloom"
  | "thresholdGate"
  | "rebirthPulse";

export type ReplayBeatType =
  | "establishing"
  | "travel"
  | "pause"
  | "focus"
  | "weatherShift"
  | "ritual"
  | "threshold"
  | "rebirth"
  | "resolution";

export interface CameraTransform {
  scale: number;
  x: number;
  y: number;
  blur: number;
  opacity: number;
  depth: number;
}

export interface CameraPhaseDefinition {
  phase: CameraPhase;
  transform: CameraTransform;
  durationMs: number;
  easing: [number, number, number, number];
  interactionLocked: boolean;
  narratorEligible: boolean;
  gestureEnabled: boolean;
  next: CameraPhase[];
}

export interface EmotionalWeatherState {
  id: string;
  tone: EmotionalTone;
  intensity: number;
  auraColor: string;
  skyGradient: string;
  cloudDensity: number;
  particleDensity: number;
}

export interface MemoryStar {
  id: string;
  title: string;
  timestamp: string;
  emotionalTone: EmotionalTone;
  auraColor: string;
  intensity: number;
  x: number;
  y: number;
  constellationId?: string;
  memoryType: MemoryType;
  replayEligible: boolean;
  narratorCueId?: string;
  sourceSignals: string[];
  symbolicTags: string[];
  bloomStyle: BloomStyle;
  weatherContext?: EmotionalWeatherState;
}

export interface ReplayEra {
  id: string;
  title: string;
  subtitle?: string;
  startTimestamp: string;
  endTimestamp: string;
  dominantTone: EmotionalTone;
  beatIds: string[];
  progressMs?: number;
}

export interface ReplayBeat {
  id: string;
  eraId: string;
  timestamp: string;
  starId?: string;
  beatType: ReplayBeatType;
  cameraTarget: {
    x: number;
    y: number;
    scale: number;
    depth: number;
  };
  durationMs: number;
  narratorCueId?: string;
  emotionalWeatherState: EmotionalWeatherState;
  auraState: {
    color: string;
    intensity: number;
    pulseRate: number;
  };
  transitionStyle:
    | "drift"
    | "bloom"
    | "flare"
    | "softCut"
    | "constellationTrace"
    | "weatherWash";
  importanceScore: number;
}

export interface NarratorCue {
  id: string;
  text: string;
  voiceTone: "calm" | "warm" | "somber" | "bright" | "grounded";
  delayMs: number;
  durationMs: number;
  ttsEnabled: boolean;
  interruptible: boolean;
}

export interface UraiCinematicData {
  stars: MemoryStar[];
  replayEra: ReplayEra;
  replayBeats: ReplayBeat[];
  narratorCues: NarratorCue[];
}
