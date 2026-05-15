import type { ChapterId, MemoryEmotion } from './lifeMapEvents';

export type LifeMapNodeType =
  | 'becoming'
  | 'threshold'
  | 'recovery'
  | 'dream'
  | 'mirror'
  | 'relationship'
  | 'habit'
  | 'voice'
  | 'location'
  | 'ritual'
  | 'warning'
  | 'breakthrough'
  | 'legacy';

export type ThreadType =
  | 'growth_arc'
  | 'recovery_arc'
  | 'relationship_arc'
  | 'seasonal_arc'
  | 'identity_arc'
  | 'shadow_arc'
  | 'dream_arc'
  | 'legacy_arc';

export type CompanionState =
  | 'idle'
  | 'guiding'
  | 'explaining'
  | 'warning'
  | 'reflecting'
  | 'ritual_prompt'
  | 'memory_replay';

export type LifeMapInteractionMode =
  | 'overview'
  | 'entering'
  | 'immersive'
  | 'thread_view'
  | 'cluster'
  | 'node_selected'
  | 'replay'
  | 'mirror_mode';

export type EraMode =
  | 'today'
  | 'this_week'
  | 'this_month'
  | 'season'
  | 'year'
  | 'relationship_era'
  | 'recovery_era'
  | 'custom';

export type LifeMapNode = {
  id: string;
  userId?: string;
  type: LifeMapNodeType;
  title: string;
  subtitle?: string;
  timestamp?: string;
  emotionalTone: MemoryEmotion | string;
  auraColor: string;
  intensity: number;
  confidence: number;
  x: number;
  y: number;
  z: number;
  size: number;
  glow: number;
  isBrightMemory: boolean;
  isClickable: boolean;
  linkedThreadIds: string[];
  sourceEventIds: string[];
};

export type LifeMapThread = {
  id: string;
  userId?: string;
  type: ThreadType;
  title: string;
  nodeIds: string[];
  startDate?: string;
  endDate?: string;
  dominantEmotion: MemoryEmotion | string;
  arcStrength: number;
  color: string;
  narratorSummary: string;
};

export type LifeMapCategory = {
  id: ChapterId;
  label: string;
  subtitle: string;
  icon: string;
  color: string;
  nodeTypes: LifeMapNodeType[];
  active?: boolean;
};

export type LifeMapInteraction = {
  mode: LifeMapInteractionMode;
  zoomLevel: number;
  selectedNodeId?: string | null;
  selectedThreadId?: string | null;
  activeCategoryId?: ChapterId | null;
  showThreads: boolean;
  cameraFocus?: {
    x: number;
    y: number;
    z: number;
  };
};

export type CompanionPrompt = {
  id: string;
  mode: CompanionState;
  title: string;
  body: string;
  voiceTone: 'soft' | 'wise' | 'playful' | 'grounding' | 'ceremonial';
  linkedNodeId?: string;
};

export type ReplayScene = {
  id: string;
  order: number;
  visualMode: 'aura' | 'sky' | 'constellation' | 'mirror' | 'threshold' | 'recovery';
  caption: string;
  ttsLine: string;
  durationMs: number;
  animationCue: string;
};

export type MemoryReplay = {
  id: string;
  nodeId: string;
  title: string;
  dateRange: {
    start: string;
    end?: string;
  };
  summary: string;
  narratorScript: string;
  emotionalArc: string[];
  sourceSignals: string[];
  people?: string[];
  locations?: string[];
  suggestedRitual?: string;
  replayScenes: ReplayScene[];
};

export type MirrorInsight = {
  id: string;
  title: string;
  identityTheme: string;
  recurringPattern: string;
  oldSelfSignal: string;
  newSelfSignal: string;
  confidence: number;
  narratorReflection: string;
};

export type ThresholdNode = {
  severity: 'low' | 'medium' | 'high';
  triggerSignals: string[];
  recommendedResponse: 'grounding' | 'rest' | 'contact_support' | 'ritual' | 'journal';
  safetySensitive: boolean;
};
