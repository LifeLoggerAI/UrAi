import {
  MoodRhythmScore,
  RhythmState,
  SymbolicInputSummary,
  GenesisMoodState,
  IntelligenceConfidence,
} from "./intelligenceTypes";
import { clampScore, confidenceFromScore, shouldBlockRawSensitiveInput } from "./intelligenceSafety";

const POSITIVE_KEYWORDS = ["fantastic", "joy", "excited", "excitement", "beautiful", "good", "great", "hopeful", "bright", "happy"];
const NEGATIVE_KEYWORDS = ["sad", "difficult", "sorrow", "heavy", "hard", "low", "grief", "upset", "angry"];
const RECOVERY_KEYWORDS = ["grounding", "quiet", "rest", "reconnect", "complete", "done", "slower", "breath", "sleep", "nature", "steady", "restore"];
const OVERLOAD_KEYWORDS = ["overwhelm", "overwhelmed", "friction", "rushed", "overstimulated", "too much", "spiraling", "scattered", "pressure", "late", "noise", "everything is happening at once"];
const STUCK_KEYWORDS = ["stuck", "rut", "same", "loop", "stalled", "blocked"];

function getKeywordsScore(summary: string, keywords: string[]): number {
  const text = summary.toLowerCase();
  return keywords.reduce((score, keyword) => score + (text.includes(keyword) ? 1 : 0), 0);
}

function mapScoreToMoodState(score: number): GenesisMoodState {
  if (score > 0.35) return "positive";
  if (score < -0.35) return "negative";
  return "balanced";
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
  let stuckHints = 0;

  validInputs.forEach(input => {
    const summary = input.summary.toLowerCase();

    if (input.moodHint) {
      switch (input.moodHint) {
        case "positive":
        case "elated":
        case "happy": totalMoodScore += 1; break;
        case "negative":
        case "sad": totalMoodScore -= 1; break;
        case "depressed": totalMoodScore -= 1.5; break;
        case "anxious": totalMoodScore -= 0.75; totalOverloadScore += 1; break;
        default: break;
      }
    }

    totalMoodScore += getKeywordsScore(summary, POSITIVE_KEYWORDS) * 0.8;
    totalMoodScore -= getKeywordsScore(summary, NEGATIVE_KEYWORDS) * 0.8;

    if (input.rhythmHint) {
      switch (input.rhythmHint) {
        case "even":
        case "stable": totalRhythmScore += 2; break;
        case "recovering": totalRhythmScore += 1; totalRecoveryScore += 2; break;
        case "quiet": quietHints++; break;
        case "chaotic":
        case "overstimulated": totalRhythmScore -= 2; totalOverloadScore += 2; break;
        case "stuck": stuckHints++; totalRhythmScore -= 1; break;
        case "off_rhythm": offRhythmHints++; totalRhythmScore -= 1; break;
        default: break;
      }
    }

    totalRecoveryScore += getKeywordsScore(summary, RECOVERY_KEYWORDS);
    totalOverloadScore += getKeywordsScore(summary, OVERLOAD_KEYWORDS);
    stuckHints += getKeywordsScore(summary, STUCK_KEYWORDS);
  });

  const moodScore = clampScore((totalMoodScore / validInputs.length) * 50 + 50);
  const rhythmScore = clampScore((totalRhythmScore / validInputs.length) * 50 + 50);
  const recoveryScore = clampScore((totalRecoveryScore / validInputs.length) * 25);
  const overloadScore = clampScore((totalOverloadScore / validInputs.length) * 25);

  let rhythmState: RhythmState = "even";
  if (overloadScore >= 25 || totalOverloadScore > 0) {
    rhythmState = "chaotic";
  } else if (stuckHints > 0) {
    rhythmState = "stuck";
  } else if (recoveryScore > 60) {
    rhythmState = "recovering";
  } else if (offRhythmHints > validInputs.length / 2) {
    rhythmState = "off_rhythm";
  } else if (quietHints > validInputs.length / 2) {
    rhythmState = "quiet";
  } else if (rhythmScore > 55) {
    rhythmState = "stable";
  }

  const moodState = mapScoreToMoodState(totalMoodScore);
  const confidence: IntelligenceConfidence = confidenceFromScore((validInputs.length / (inputs.length || 1)) * 100);

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
