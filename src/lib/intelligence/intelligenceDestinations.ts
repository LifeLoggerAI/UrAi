import { IntelligenceSignal } from "./intelligenceTypes";

export type LifeMapStarDraft = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  moodState?: string;
  confidence: string;
  sourceSignalId: string;
  userApproved: boolean;
};

export type GroundBloomDraft = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  bloomType: "recovery" | "grounding" | "completion" | "quiet" | "unknown";
  confidence: string;
  sourceSignalId: string;
  userApproved: boolean;
};

export type MirrorReflectionDraft = {
  id: string;
  title: string;
  reflection: string;
  createdAt: string;
  confidence: string;
  sourceSignalId: string;
  userApproved: boolean;
};

export type RitualSuggestionDraft = {
  id: string;
  title: string;
  prompt: string;
  createdAt: string;
  ritualType:
    | "grounding"
    | "reset"
    | "reflection"
    | "milestone"
    | "transition"
    | "closure"
    | "unknown";
  confidence: string;
  sourceSignalId: string;
  userApproved: boolean;
};

export function toLifeMapStarDraft(signal: IntelligenceSignal): LifeMapStarDraft | null {
  if (signal.suggestedDestination !== "lifemap") {
    return null;
  }

  return {
    id: `${signal.id}-lifemap-draft`,
    title: signal.title,
    description: signal.summary,
    createdAt: signal.createdAt,
    moodState: signal.moodState,
    confidence: signal.confidence,
    sourceSignalId: signal.id,
    userApproved: false,
  };
}

export function toGroundBloomDraft(signal: IntelligenceSignal): GroundBloomDraft | null {
  if (signal.suggestedDestination !== "ground") {
    return null;
  }

  return {
    id: `${signal.id}-ground-draft`,
    title: signal.title,
    description: signal.summary,
    createdAt: signal.createdAt,
    bloomType: "unknown",
    confidence: signal.confidence,
    sourceSignalId: signal.id,
    userApproved: false,
  };
}

export function toMirrorReflectionDraft(signal: IntelligenceSignal): MirrorReflectionDraft | null {
  if (signal.suggestedDestination !== "mirror") {
    return null;
  }

  return {
    id: `${signal.id}-mirror-draft`,
    title: signal.title,
    reflection: signal.summary,
    createdAt: signal.createdAt,
    confidence: signal.confidence,
    sourceSignalId: signal.id,
    userApproved: false,
  };
}

export function toRitualSuggestionDraft(signal: IntelligenceSignal): RitualSuggestionDraft | null {
    if (signal.suggestedDestination !== 'ritual') {
        return null;
    }

    let ritualType: RitualSuggestionDraft['ritualType'] = 'unknown';
    if (signal.summary.includes('grounding')) ritualType = 'grounding';
    if (signal.summary.includes('reset')) ritualType = 'reset';
    
    return {
        id: `${signal.id}-ritual-draft`,
        title: signal.title,
        prompt: signal.summary,
        createdAt: signal.createdAt,
        ritualType: ritualType,
        confidence: signal.confidence,
        sourceSignalId: signal.id,
        userApproved: false,
    };
}
