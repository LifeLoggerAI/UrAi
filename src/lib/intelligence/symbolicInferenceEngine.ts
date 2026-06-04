import {
  IntelligenceSignal,
  SymbolicInferenceConfig,
  SymbolicInferenceResult,
  SymbolicInputSummary,
} from "./intelligenceTypes";
import {
  isLayerAllowedForSymbolicInference,
  shouldBlockRawSensitiveInput,
  sanitizeSymbolicSummary,
  getSafetyBandForInput,
  makeUncertaintyPrefix,
} from "./intelligenceSafety";
import { scoreMoodAndRhythm } from "./moodRhythmScoring";

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

export const DEFAULT_SYMBOLIC_INFERENCE_CONFIG: SymbolicInferenceConfig = {
  allowShadowCandidates: false,
  allowLegacyCandidates: true,
  allowRitualSuggestions: true,
  allowCompanionContext: true,
  maxSignalsPerRun: 24,
  minConfidenceForLifeMap: "medium",
  minConfidenceForGround: "low",
  minConfidenceForMirror: "medium",
};

export function runSymbolicInference(params: {
  inputs: SymbolicInputSummary[];
  openPassportLayerIds: string[];
  config?: Partial<SymbolicInferenceConfig>;
}): SymbolicInferenceResult {
  const config = { ...DEFAULT_SYMBOLIC_INFERENCE_CONFIG, ...params.config };

  const validInputs = params.inputs
    .filter(input => isLayerAllowedForSymbolicInference(input.layerId, params.openPassportLayerIds))
    .filter(input => !shouldBlockRawSensitiveInput(input))
    .map(input => ({ ...input, summary: sanitizeSymbolicSummary(input.summary) }));

  let signals: IntelligenceSignal[] = [];

  const moodRhythmScore = scoreMoodAndRhythm(validInputs);
  signals.push({
      id: createIntelligenceSignalId('mood-rhythm', [moodRhythmScore.moodState, moodRhythmScore.rhythmState]),
      type: 'mood',
      title: 'Mood and Rhythm Analysis',
      summary: `${makeUncertaintyPrefix(moodRhythmScore.confidence)} Current mood state appears to be ${moodRhythmScore.moodState} and rhythm is ${moodRhythmScore.rhythmState}`.trim(),
      createdAt: new Date().toISOString(),
      sourceRecordIds: validInputs.map(i => i.id),
      sourceLayerIds: validInputs.map(i => i.layerId),
      confidence: moodRhythmScore.confidence,
      safetyBand: 'safe',
      moodState: moodRhythmScore.moodState,
      score: (moodRhythmScore.moodScore + moodRhythmScore.rhythmScore) / 2,
      suggestedDestination: 'mirror',
  });

  // Generate signals based on heuristics, not just keywords
  validInputs.forEach(input => {
    const safetyBand = getSafetyBandForInput(input);

    // Life Map Candidates
    if (input.intensity > 70 && moodRhythmScore.energyScore > 60 && config.minConfidenceForLifeMap !== 'high') {
        signals.push({
            id: createIntelligenceSignalId('lifemap-event', [input.id]),
            type: 'life_event',
            title: 'Significant Life Event Candidate',
            summary: `${makeUncertaintyPrefix('medium')} A significant life event may have occurred.`,
            createdAt: input.createdAt,
            sourceRecordIds: [input.id],
            sourceLayerIds: [input.layerId],
            confidence: 'medium',
            safetyBand: safetyBand,
            suggestedDestination: 'lifemap',
        });
    }

    // Grounding Candidates
    if (moodRhythmScore.recoveryScore < 40 && moodRhythmScore.stressScore > 60) {
        signals.push({
            id: createIntelligenceSignalId('grounding-needed', [input.id]),
            type: 'grounding',
            title: 'Grounding Candidate',
            summary: `${makeUncertaintyPrefix('low')} A grounding activity could be beneficial.`,
            createdAt: input.createdAt,
            sourceRecordIds: [input.id],
            sourceLayerIds: [input.layerId],
            confidence: 'low',
            safetyBand: safetyBand,
            suggestedDestination: 'ground',
        });
    }

    // Mirror Candidates
    if (input.summary.includes('pattern') || input.summary.includes('recurring')) {
        signals.push({
            id: createIntelligenceSignalId('mirror-pattern', [input.id]),
            type: 'reflection',
            title: 'Reflection Candidate',
            summary: `${makeUncertaintyPrefix('medium')} A recurring pattern may be worth reflecting on.`,
            createdAt: input.createdAt,
            sourceRecordIds: [input.id],
            sourceLayerIds: [input.layerId],
            confidence: 'medium',
            safetyBand: safetyBand,
            suggestedDestination: 'mirror',
        });
    }

    if (config.allowShadowCandidates && moodRhythmScore.moodScore < 40 && input.intensity > 60) {
        signals.push({
            id: createIntelligenceSignalId('shadow-candidate', [input.id]),
            type: 'shadow',
            title: 'Shadow Candidate',
            summary: `${makeUncertaintyPrefix('medium')} A potential shadow aspect may be surfacing.`,
            createdAt: input.createdAt,
            sourceRecordIds: [input.id],
            sourceLayerIds: [input.layerId],
            confidence: 'medium',
            safetyBand: safetyBand,
            suggestedDestination: 'shadow',
        });
    }

    if (config.allowLegacyCandidates && input.summary.includes('remember')) {
        signals.push({
            id: createIntelligenceSignalId('legacy-candidate', [input.id]),
            type: 'legacy',
            title: 'Legacy Candidate',
            summary: `${makeUncertaintyPrefix('low')} This memory could be a legacy candidate.`,
            createdAt: input.createdAt,
            sourceRecordIds: [input.id],
            sourceLayerIds: [input.layerId],
            confidence: 'low',
            safetyBand: safetyBand,
            suggestedDestination: 'legacy',
        });
    }
  });


  if(config.allowRitualSuggestions) {
    if (moodRhythmScore.recoveryScore > 60) signals.push({id: createIntelligenceSignalId('ritual-grounding'), type: 'ritual', title: 'Grounding Ritual Suggestion', summary: 'Consider a grounding ritual to aid recovery.', createdAt: new Date().toISOString(), sourceRecordIds: [], sourceLayerIds: [], confidence: 'medium', safetyBand: 'safe', suggestedDestination: 'ritual' });
    if (moodRhythmScore.overloadScore > 70) signals.push({id: createIntelligenceSignalId('ritual-reset'), type: 'ritual', title: 'Quiet/Reset Ritual Suggestion', summary: 'A quiet/reset ritual might help with the feeling of being overloaded.', createdAt: new Date().toISOString(), sourceRecordIds: [], sourceLayerIds: [], confidence: 'medium', safetyBand: 'safe', suggestedDestination: 'ritual' });
  }

  if(config.allowCompanionContext) {
      signals.push({
        id: createIntelligenceSignalId('companion-context'),
        type: 'system',
        title: 'Companion Context',
        summary: `Symbolic context: mood is ${moodRhythmScore.moodState}, rhythm is ${moodRhythmScore.rhythmState}`,
        createdAt: new Date().toISOString(),
        sourceRecordIds: [],
        sourceLayerIds: [],
        confidence: 'low',
        safetyBand: 'safe',
        suggestedDestination: 'companion'
      });
  }

  // Cap signals, ensuring forbidden terms are not in the summary.
  signals = signals.sort((a,b) => (b.score || 0) - (a.score || 0)).slice(0, config.maxSignalsPerRun);

  const forbiddenTerms = ["diagnosis", "disorder", "pathology", "you are depressed", "you have anxiety", "you definitely", "the truth is", "this proves", "this means you are", "hidden truth", "lie detected", "betrayal confirmed", "surveillance", "tracked you"];
  signals.forEach(signal => {
      forbiddenTerms.forEach(term => {
          if (signal.summary.includes(term)) {
              signal.summary = 'A symbolic pattern was detected, which may be worth reflecting on.';
          }
      });
  });

  return {
    generatedAt: new Date().toISOString(),
    signals: signals,
    lifeMapCandidates: signals.filter(s => s.suggestedDestination === 'lifemap'),
    groundCandidates: signals.filter(s => s.suggestedDestination === 'ground'),
    mirrorCandidates: signals.filter(s => s.suggestedDestination === 'mirror'),
    shadowCandidates: signals.filter(s => s.suggestedDestination === 'shadow'),
    legacyCandidates: signals.filter(s => s.suggestedDestination === 'legacy'),
    ritualCandidates: signals.filter(s => s.suggestedDestination === 'ritual'),
  };
}
