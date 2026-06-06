import {
  MoodRhythmScore,
  RhythmState,
  SymbolicInputSummary,
  GenesisMoodState,
  IntelligenceConfidence,
} from "./intelligenceTypes";
import { clampScore, confidenceFromScore, shouldBlockRawSensitiveInput } from "./intelligenceSafety";

const RECOVERY_KEYWORDS = ["grounding", "quiet", "rest", "reconnect", "complete", "done", "slower", "breath", "sleep", "nature", "steady", "restore"];
const OVERLOAD_KEYWORDS = ["overwhelm", "friction", "rushed", "overstimulated", "too much", "spiraling", "scattered", "anxious", "pressure", "late", "noise"];

function getKeywordsScore(summary: string, keywords: string[]): number {
    return keywords.reduce((score, keyword) => {
        return score + (summary.toLowerCase().includes(keyword) ? 1 : 0);
    }, 0);
}

function mapScoreToMoodState(score: number): GenesisMoodState {
    if (score > 60) return "elated";
    if (score > 40) return "happy";
    if (score < -60) return "depressed";
    if (score < -40) return "sad";
    if (score < -20) return "anxious";
    return "neutral";
}

export function scoreMoodAndRhythm(
  inputs: SymbolicInputSummary[]
): MoodRhythmScore {
  const validInputs = inputs.filter(input => !shouldBlockRawSensitiveInput(input));

  if (validInputs.length === 0) {
    return {
      moodState: "unknown",
      rhythmState: "unknown",
      moodScore: 0,
      rhythmScore: 0,
      recoveryScore: 0,
      overloadScore: 0,
      confidence: "low",
      generatedAt: new Date().toISOString(),
    };
  }

  let totalMoodScore = 0;
  let totalRhythmScore = 0;
  let totalRecoveryScore = 0;
  let totalOverloadScore = 0;
  let offRhythmHints = 0;
  let quietHints = 0;

  validInputs.forEach(input => {
    if (input.moodHint) {
        // These are just example scores, would need to be refined
        switch (input.moodHint) {
            case "elated": totalMoodScore += 2; break;
            case "happy": totalMoodScore += 1; break;
            case "sad": totalMoodScore -= 1; break;
            case "depressed": totalMoodScore -= 2; break;
            case "anxious": totalMoodScore -= 1; totalOverloadScore += 1; break;
            default: break;
        }
    }

    if (input.rhythmHint) {
        switch (input.rhythmHint) {
            case "stable": totalRhythmScore += 2; break;
            case "recovering": totalRhythmScore += 1; totalRecoveryScore += 2; break;
            case "quiet": quietHints++; break;
            case "off_rhythm": offRhythmHints++; totalRhythmScore -= 1; break;
            case "overstimulated": totalRhythmScore -= 2; totalOverloadScore += 2; break;
            default: break;
        }
    }

    totalRecoveryScore += getKeywordsScore(input.summary, RECOVERY_KEYWORDS);
    totalOverloadScore += getKeywordsScore(input.summary, OVERLOAD_KEYWORDS);
  });

  const moodScore = clampScore((totalMoodScore / validInputs.length) * 50 + 50);
  const rhythmScore = clampScore((totalRhythmScore / validInputs.length) * 50 + 50);
  const recoveryScore = clampScore((totalRecoveryScore / validInputs.length) * 25);
  const overloadScore = clampScore((totalOverloadScore / validInputs.length) * 25);

  let rhythmState: RhythmState = "unknown";
  if (overloadScore > 70) {
      rhythmState = "overstimulated";
  } else if (recoveryScore > 60) {
      rhythmState = "recovering";
  } else if (offRhythmHints > validInputs.length / 2) {
      rhythmState = "off_rhythm";
  } else if (quietHints > validInputs.length / 2) {
      rhythmState = "quiet";
  } else if (rhythmScore > 50) {
      rhythmState = "stable";
  }

  const moodState = mapScoreToMoodState((moodScore - 50) * 2);

  const confidence = confidenceFromScore((validInputs.length / (inputs.length || 1)) * 100);

  return {
    moodState,
    rhythmState,
    moodScore,
    rhythmScore,
    recoveryScore,
    overloadScore,
    confidence,
    generatedAt: new Date().toISOString(),
  };
}
