import {
  IntelligenceConfidence,
  IntelligenceSignal,
  IntelligenceSignalType,
  IntelligenceSafetyBand,
  SymbolicInferenceConfig,
  SymbolicInferenceResult,
  SymbolicInputSummary,
} from "./intelligenceTypes";
import {
  getSafetyBandForInput,
  isLayerAllowedForSymbolicInference,
  makeUncertaintyPrefix,
  sanitizeSymbolicSummary,
  shouldBlockRawSensitiveInput,
} from "./intelligenceSafety";
import { scoreMoodAndRhythm } from "./moodRhythmScoring";

// ID HELPER
function createIntelligenceSignalId(prefix: string, seedParts: string[] = []): string {
  const seed = seedParts.join("|").toLowerCase().replace(/\s+/g, "-");
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const safeHash = Math.abs(hash).toString(36);
  const timePart = Date.now().toString(36);

  return `${prefix}_${timePart}_${safeHash}`;
}

// SAFE LANGUAGE HELPER
const FORBIDDEN_USER_FACING_TERMS = [
  "diagnosis", "disorder", "pathology", "you are depressed", "you have anxiety",
  "you definitely", "the truth is", "this proves", "this means you are",
  "hidden truth", "lie detected", "betrayal confirmed", "surveillance", "tracked you",
];

function makeSafeUserFacingSummary(summary: string): string {
  let safe = summary;

  safe = safe.replace(/detected/gi, "noticed as a possible pattern");
  safe = safe.replace(/proves/gi, "may suggest");
  safe = safe.replace(/definitely/gi, "may");
  safe = safe.replace(/the truth is/gi, "one possible reflection is");
  safe = safe.replace(/tracked you/gi, "appeared in approved summaries");

  FORBIDDEN_USER_FACING_TERMS.forEach((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\]/g, "\\$&");
    safe = safe.replace(new RegExp(escaped, "gi"), "a symbolic reflection");
  });

  return safe.trim();
}

// CONFIG
export const DEFAULT_SYMBOLIC_INFERENCE_CONFIG = {
  allowShadowCandidates: false,
  allowLegacyCandidates: true,
  allowRitualSuggestions: true,
  allowCompanionContext: true,
  maxSignalsPerRun: 24,
  minConfidenceForLifeMap: "medium",
  minConfidenceForGround: "low",
  minConfidenceForMirror: "medium",
} satisfies SymbolicInferenceConfig;

// HEURISTICS HELPERS
const LIFE_MAP_WORDS = ["milestone", "transition", "chapter", "first time", "last time", "meaningful", "completed", "breakthrough", "identity", "threshold", "season", "relationship moment"];
const GROUND_WORDS = ["recovery", "grounding", "calm", "rest", "nature", "complete", "stability", "center", "breath", "small win", "quiet"];
const MIRROR_WORDS = ["pattern", "recurring", "loop", "again", "theme", "rhythm", "correlation", "friction", "return to"];
const SHADOW_WORDS = ["difficult_pattern", "avoidance", "spiraling", "shame", "friction", "over-checking", "overload", "unresolved", "tension"];
const LEGACY_WORDS = ["legacy", "milestone", "family", "teaching", "creative breakthrough", "completed chapter", "values", "resilience", "identity evolution", "long-term memory"];

function normalizedText(input: SymbolicInputSummary): string {
  return [input.summary, input.title, ...(input.tags ?? []), input.kind, input.rhythmHint]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesAny(text: string, words: string[]): boolean {
  return words.some((word) => text.includes(word));
}

function sortAndCapSignals(signals: IntelligenceSignal[], maxSignals: number): IntelligenceSignal[] {
    return signals
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, maxSignals);
}


// MAIN FUNCTION
export function runSymbolicInference(params: {
  inputs: SymbolicInputSummary[];
  openPassportLayerIds: string[];
  config?: Partial<SymbolicInferenceConfig>;
}): SymbolicInferenceResult {
  const finalConfig = { ...DEFAULT_SYMBOLIC_INFERENCE_CONFIG, ...params.config };
  const generatedAt = new Date().toISOString();

  const validInputs = params.inputs
    .filter(input => isLayerAllowedForSymbolicInference(input.layerId, params.openPassportLayerIds))
    .filter(input => !shouldBlockRawSensitiveInput(input))
    .map(input => ({ ...input, summary: sanitizeSymbolicSummary(input.summary) }));

  if (validInputs.length === 0) {
      return {
          generatedAt,
          signals: [],
          lifeMapCandidates: [],
          groundCandidates: [],
          mirrorCandidates: [],
          shadowCandidates: [],
          legacyCandidates: [],
          ritualCandidates: [],
      };
  }

  let signals: IntelligenceSignal[] = [];
  const moodRhythmScore = scoreMoodAndRhythm(validInputs);

  // Mood/Rhythm Signal
  signals.push({
      id: createIntelligenceSignalId('mood-rhythm', [moodRhythmScore.moodState, moodRhythmScore.rhythmState]),
      type: 'mood',
      title: 'Mood and Rhythm Analysis',
      summary: makeSafeUserFacingSummary(`${makeUncertaintyPrefix(moodRhythmScore.confidence)} Current mood state appears to be ${moodRhythmScore.moodState} and rhythm is ${moodRhythmScore.rhythmState}`.trim()),
      createdAt: generatedAt,
      sourceRecordIds: validInputs.map(i => i.id),
      sourceLayerIds: validInputs.map(i => i.layerId),
      confidence: moodRhythmScore.confidence,
      safetyBand: 'safe',
      moodState: moodRhythmScore.moodState,
      score: (moodRhythmScore.moodScore + moodRhythmScore.rhythmScore) / 2,
      suggestedDestination: 'mirror',
      userApproved: false,
  });

  // Input-based signals
  validInputs.forEach(input => {
    const text = normalizedText(input);
    const safetyBand = getSafetyBandForInput(input);

    // Life Map
    if (matchesAny(text, LIFE_MAP_WORDS) || (input.intensity && input.intensity > 80 && moodRhythmScore.moodScore > 70)) {
        signals.push({
            id: createIntelligenceSignalId('lifemap-candidate', [input.id]),
            type: 'life_event',
            title: 'Significant Life Event Candidate',
            summary: makeSafeUserFacingSummary(`${makeUncertaintyPrefix('medium')} A significant life event may have occurred based on input: "${input.summary}"`),
            createdAt: input.createdAt,
            sourceRecordIds: [input.id],
            sourceLayerIds: [input.layerId],
            confidence: 'medium',
            safetyBand,
            suggestedDestination: 'lifemap',
            userApproved: false,
        });
    }

    // Ground
    if (matchesAny(text, GROUND_WORDS) || (moodRhythmScore.recoveryScore < 40 && moodRhythmScore.overloadScore > 60)) {
        signals.push({
            id: createIntelligenceSignalId('ground-candidate', [input.id]),
            type: 'grounding',
            title: 'Grounding Activity Candidate',
            summary: makeSafeUserFacingSummary(`${makeUncertaintyPrefix('low')} A grounding activity could be beneficial.`),
            createdAt: input.createdAt,
            sourceRecordIds: [input.id],
            sourceLayerIds: [input.layerId],
            confidence: 'low',
            safetyBand,
            suggestedDestination: 'ground',
            userApproved: false,
        });
    }

    // Mirror
    if (matchesAny(text, MIRROR_WORDS)) {
        signals.push({
            id: createIntelligenceSignalId('mirror-candidate', [input.id]),
            type: 'reflection',
            title: 'Reflection Candidate',
            summary: makeSafeUserFacingSummary(`${makeUncertaintyPrefix('medium')} A recurring pattern may be worth reflecting on: "${input.summary}"`),
            createdAt: input.createdAt,
            sourceRecordIds: [input.id],
            sourceLayerIds: [input.layerId],
            confidence: 'medium',
            safetyBand,
            suggestedDestination: 'mirror',
            userApproved: false,
        });
    }
    
    // Shadow
    if (finalConfig.allowShadowCandidates && matchesAny(text, SHADOW_WORDS)) {
        signals.push({
            id: createIntelligenceSignalId('shadow-candidate', [input.id]),
            type: 'shadow_candidate',
            title: 'Shadow Work Candidate',
            summary: makeSafeUserFacingSummary(`${makeUncertaintyPrefix('medium')} A difficult pattern or unresolved tension might be present.`),
            createdAt: input.createdAt,
            sourceRecordIds: [input.id],
            sourceLayerIds: [input.layerId],
            confidence: 'medium',
            safetyBand: 'shadow_required',
            suggestedDestination: 'shadow',
            userApproved: false,
        });
    }

    // Legacy
    if (finalConfig.allowLegacyCandidates && matchesAny(text, LEGACY_WORDS)) {
        signals.push({
            id: createIntelligenceSignalId('legacy-candidate', [input.id]),
            type: 'legacy_candidate',
            title: 'Legacy Candidate',
            summary: makeSafeUserFacingSummary(`${makeUncertaintyPrefix('low')} A theme of legacy or long-term significance was noticed.`),
            createdAt: input.createdAt,
            sourceRecordIds: [input.id],
            sourceLayerIds: [input.layerId],
            confidence: 'low',
            safetyBand: 'legacy_required',
            suggestedDestination: 'legacy',
            userApproved: false,
        });
    }
  });

  // Ritual suggestions
  if (finalConfig.allowRitualSuggestions) {
    if (moodRhythmScore.recoveryScore > 70) {
        signals.push({
            id: createIntelligenceSignalId('ritual-recovery'),
            type: 'ritual',
            title: 'Recovery Ritual Suggestion',
            summary: makeSafeUserFacingSummary('Strong recovery noticed. A ritual to honor rest could be beneficial.'),
            createdAt: generatedAt,
            sourceRecordIds: [], sourceLayerIds: [],
            confidence: 'medium', safetyBand: 'safe',
            suggestedDestination: 'ritual', userApproved: false,
        });
    }
    if (moodRhythmScore.overloadScore > 70) {
        signals.push({
            id: createIntelligenceSignalId('ritual-overload'),
            type: 'ritual',
            title: 'Overload Reset Ritual Suggestion',
            summary: makeSafeUserFacingSummary('High overload noticed. A quiet or reset ritual may help restore balance.'),
            createdAt: generatedAt,
            sourceRecordIds: [], sourceLayerIds: [],
            confidence: 'medium', safetyBand: 'safe',
            suggestedDestination: 'ritual', userApproved: false,
        });
    }
  }

  // Companion context
  if (finalConfig.allowCompanionContext) {
      signals.push({
        id: createIntelligenceSignalId('companion-context'),
        type: 'system',
        title: 'Companion Context',
        summary: `Symbolic context: mood is ${moodRhythmScore.moodState}, rhythm is ${moodRhythmScore.rhythmState}`, // System-facing, no need for makeSafe
        createdAt: generatedAt,
        sourceRecordIds: [], sourceLayerIds: [],
        confidence: 'high', safetyBand: 'safe',
        suggestedDestination: 'companion', userApproved: false,
      });
  }

  const cappedSignals = sortAndCapSignals(signals, finalConfig.maxSignalsPerRun);

  return {
    generatedAt,
    signals: cappedSignals,
    lifeMapCandidates: cappedSignals.filter((signal) => signal.suggestedDestination === "lifemap"),
    groundCandidates: cappedSignals.filter((signal) => signal.suggestedDestination === "ground"),
    mirrorCandidates: cappedSignals.filter((signal) => signal.suggestedDestination === "mirror"),
    shadowCandidates: cappedSignals.filter((signal) => signal.suggestedDestination === "shadow"),
    legacyCandidates: cappedSignals.filter((signal) => signal.suggestedDestination === "legacy"),
    ritualCandidates: cappedSignals.filter((signal) => signal.suggestedDestination === "ritual"),
  };
}
