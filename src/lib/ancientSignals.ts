export type PreverbalState =
  | "settled"
  | "activated"
  | "guarded"
  | "seeking"
  | "withdrawing"
  | "overloaded"
  | "recovering"
  | "numb"
  | "unknown";

export type AncientSignalWindow = {
  wordDisclosure?: number;
  voiceTension?: number;
  pauseDensity?: number;
  speechCompression?: number;
  silenceWeight?: number;
  frictionTapScore?: number;
  hesitationScore?: number;
  cancelLoopScore?: number;
  scrollVelocityScore?: number;
  notificationFriction?: number;
  motionJitter?: number;
  stagnationScore?: number;
  placeAvoidanceScore?: number;
  sleepDebt?: number;
  nocturnalDrift?: number;
  recoverySignal?: number;
  socialAbsence?: number;
  conflictResidue?: number;
  connectionPull?: number;
  chronoCompression?: number;
  chronoDilation?: number;
  mentalLoadScore?: number;
  shadowScore?: number;
  obscuraScore?: number;
  moodIntensity?: number;
  positiveValence?: number;
};

export type AncientRawUserData = {
  moodScore?: number;
  stressScore?: number;
  sleepDebtHours?: number;
  notificationFrictionScore?: number;
  socialGapScore?: number;
  recoveryActionCount?: number;
  lateNightUseScore?: number;
  frictionTapScore?: number;
  hesitationScore?: number;
  cancelLoopScore?: number;
  scrollVelocityScore?: number;
  pauseDensity?: number;
  voiceTension?: number;
  speechCompression?: number;
  chronoCompression?: number;
  chronoDilation?: number;
  wordDisclosure?: number;
};

export type AncientSignalResult = {
  preverbalState: PreverbalState;
  activationScore: number;
  withdrawalScore: number;
  recoveryPulseScore: number;
  numbnessScore: number;
  seekingScore: number;
  confidence: number;
  signalDepth: {
    words: number;
    voice: number;
    gesture: number;
    bodyRhythm: number;
    socialField: number;
    auraAtmosphere: number;
    towardAway: number;
  };
  auraAtmosphere: {
    warmth: number;
    heaviness: number;
    staticCharge: number;
    haze: number;
    pressure: number;
    bloomPotential: number;
  };
  towardAwayVector: {
    towardPeople: number;
    awayFromPeople: number;
    towardRest: number;
    awayFromRest: number;
    towardMeaning: number;
    awayFromMeaning: number;
  };
  visualState: {
    orbPulseRate: number;
    auraDensity: number;
    skyHaze: number;
    groundTension: number;
    constellationDrift: number;
    shadowStatic: number;
    bloomReadiness: number;
  };
  narratorHint: {
    mode: "silent_witness" | "soft_notice" | "grounding_prompt" | "protective_pause" | "recovery_reflection";
    tone: "silent" | "quiet" | "grounding" | "protective" | "warm";
    shouldSpeak: boolean;
    messageSeed: string;
    reason: string;
  };
  safetyFlags: string[];
};

const clamp01 = (value = 0) => Math.max(0, Math.min(1, value));
const avg = (...values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
const num = (value?: number) => clamp01(value ?? 0);

export function mapUserDataToAncientSignals(data: AncientRawUserData): AncientSignalWindow {
  const sleepDebt = clamp01((data.sleepDebtHours ?? 0) / 8);
  return {
    wordDisclosure: num(data.wordDisclosure),
    voiceTension: num(data.voiceTension),
    pauseDensity: num(data.pauseDensity),
    speechCompression: num(data.speechCompression),
    frictionTapScore: num(data.frictionTapScore),
    hesitationScore: num(data.hesitationScore),
    cancelLoopScore: num(data.cancelLoopScore),
    scrollVelocityScore: num(data.scrollVelocityScore),
    notificationFriction: num(data.notificationFrictionScore),
    sleepDebt,
    nocturnalDrift: num(data.lateNightUseScore),
    recoverySignal: clamp01((data.recoveryActionCount ?? 0) / 4),
    socialAbsence: num(data.socialGapScore),
    chronoCompression: num(data.chronoCompression),
    chronoDilation: num(data.chronoDilation),
    mentalLoadScore: num(data.stressScore),
    shadowScore: avg(num(data.stressScore), sleepDebt),
    obscuraScore: avg(num(data.frictionTapScore), num(data.hesitationScore), num(data.cancelLoopScore)),
    moodIntensity: Math.max(num(data.moodScore), num(data.stressScore)),
    positiveValence: num(data.moodScore),
  };
}

export function computeAncientSignals(input: AncientSignalWindow): AncientSignalResult {
  const voice = avg(num(input.voiceTension), num(input.pauseDensity), num(input.speechCompression), num(input.silenceWeight));
  const gesture = avg(num(input.frictionTapScore), num(input.hesitationScore), num(input.cancelLoopScore), num(input.scrollVelocityScore), num(input.notificationFriction));
  const bodyRhythm = avg(num(input.motionJitter), num(input.stagnationScore), num(input.sleepDebt), num(input.nocturnalDrift), num(input.chronoDilation));
  const socialField = avg(num(input.socialAbsence), num(input.conflictResidue), 1 - num(input.connectionPull));

  const activationScore = clamp01(0.18 * voice + 0.18 * gesture + 0.16 * num(input.mentalLoadScore) + 0.14 * num(input.shadowScore) + 0.12 * num(input.obscuraScore) + 0.1 * num(input.nocturnalDrift) + 0.12 * num(input.motionJitter));
  const withdrawalScore = clamp01(0.28 * num(input.socialAbsence) + 0.18 * num(input.stagnationScore) + 0.16 * num(input.silenceWeight) + 0.14 * num(input.placeAvoidanceScore) + 0.12 * num(input.nocturnalDrift) + 0.12 * num(input.chronoDilation));
  const recoveryPulseScore = clamp01(0.38 * num(input.recoverySignal) + 0.2 * num(input.positiveValence) + 0.18 * (1 - num(input.mentalLoadScore)) + 0.12 * (1 - num(input.shadowScore)) + 0.12 * (1 - num(input.nocturnalDrift)));
  const numbnessScore = clamp01(0.24 * num(input.silenceWeight) + 0.22 * num(input.stagnationScore) + 0.18 * (1 - num(input.moodIntensity)) + 0.16 * num(input.chronoCompression) + 0.1 * (1 - num(input.wordDisclosure)) + 0.1 * num(input.socialAbsence));
  const seekingScore = clamp01(0.3 * num(input.connectionPull) + 0.2 * num(input.wordDisclosure) + 0.18 * num(input.moodIntensity) + 0.16 * num(input.recoverySignal) + 0.16 * num(input.positiveValence));

  const preverbalState = classifyPreverbalState({activationScore, withdrawalScore, recoveryPulseScore, numbnessScore, seekingScore});
  const confidence = clamp01(Object.values(input).filter((value) => typeof value === "number").length / 12);

  return {
    preverbalState,
    activationScore,
    withdrawalScore,
    recoveryPulseScore,
    numbnessScore,
    seekingScore,
    confidence,
    signalDepth: {
      words: num(input.wordDisclosure),
      voice,
      gesture,
      bodyRhythm,
      socialField,
      auraAtmosphere: avg(voice, gesture, bodyRhythm, socialField, num(input.shadowScore), num(input.obscuraScore), num(input.mentalLoadScore)),
      towardAway: avg(seekingScore, withdrawalScore, recoveryPulseScore),
    },
    auraAtmosphere: {
      warmth: clamp01(recoveryPulseScore + (1 - withdrawalScore) * 0.2),
      heaviness: avg(withdrawalScore, numbnessScore, num(input.mentalLoadScore)),
      staticCharge: activationScore,
      haze: avg(withdrawalScore, num(input.nocturnalDrift), numbnessScore),
      pressure: avg(activationScore, num(input.mentalLoadScore)),
      bloomPotential: recoveryPulseScore,
    },
    towardAwayVector: {
      towardPeople: num(input.connectionPull),
      awayFromPeople: num(input.socialAbsence),
      towardRest: avg(num(input.recoverySignal), num(input.sleepDebt)),
      awayFromRest: avg(num(input.chronoCompression), 1 - num(input.recoverySignal)),
      towardMeaning: avg(num(input.wordDisclosure), num(input.recoverySignal), 1 - num(input.chronoCompression)),
      awayFromMeaning: avg(num(input.placeAvoidanceScore), num(input.socialAbsence), num(input.chronoCompression)),
    },
    visualState: {
      orbPulseRate: clamp01(0.35 + activationScore * 0.55 + recoveryPulseScore * 0.1),
      auraDensity: clamp01(0.22 + activationScore * 0.45 + recoveryPulseScore * 0.22),
      skyHaze: clamp01(withdrawalScore * 0.72 + numbnessScore * 0.28),
      groundTension: clamp01(num(input.mentalLoadScore) * 0.7 + activationScore * 0.3),
      constellationDrift: clamp01(num(input.socialAbsence) * 0.75 + withdrawalScore * 0.25),
      shadowStatic: clamp01(activationScore * 0.68 + num(input.mentalLoadScore) * 0.32),
      bloomReadiness: recoveryPulseScore,
    },
    narratorHint: buildNarratorHint(preverbalState, activationScore, withdrawalScore, recoveryPulseScore, numbnessScore, confidence),
    safetyFlags: ["no-diagnosis", "no-lie-detection", "user-baseline-required-for-production"],
  };
}

function classifyPreverbalState(scores: Pick<AncientSignalResult, "activationScore" | "withdrawalScore" | "recoveryPulseScore" | "numbnessScore" | "seekingScore">): PreverbalState {
  if (scores.recoveryPulseScore > 0.72 && scores.activationScore < 0.68) return "recovering";
  if (scores.activationScore > 0.74 && scores.withdrawalScore > 0.48) return "overloaded";
  if (scores.activationScore > 0.58 && scores.withdrawalScore > 0.46) return "guarded";
  if (scores.withdrawalScore > 0.64 && scores.numbnessScore > 0.42) return "withdrawing";
  if (scores.numbnessScore > 0.68 && scores.activationScore < 0.46) return "numb";
  if (scores.seekingScore > 0.62 && scores.withdrawalScore < 0.58) return "seeking";
  if (scores.activationScore > 0.45) return "activated";
  if (scores.activationScore < 0.28 && scores.withdrawalScore < 0.28 && scores.numbnessScore < 0.45) return "settled";
  return "unknown";
}

function buildNarratorHint(preverbalState: PreverbalState, activation: number, withdrawal: number, recovery: number, numbness: number, confidence: number): AncientSignalResult["narratorHint"] {
  if (confidence < 0.3) return {mode: "silent_witness", tone: "silent", shouldSpeak: false, messageSeed: "The signal is still forming. URAI should observe quietly.", reason: "low-confidence"};
  if (recovery > 0.7) return {mode: "recovery_reflection", tone: "warm", shouldSpeak: true, messageSeed: "Something in you is coming back online. Keep the day simple enough for it to stay.", reason: "recovery-pulse"};
  if (activation > 0.72) return {mode: "grounding_prompt", tone: "grounding", shouldSpeak: true, messageSeed: "Your rhythm looks sharper than usual. You do not need to name it yet. Soften the next minute.", reason: "activation"};
  if (withdrawal > 0.64) return {mode: "protective_pause", tone: "protective", shouldSpeak: true, messageSeed: "You seem farther from people today. That may be protection, not failure.", reason: "withdrawal"};
  if (numbness > 0.64) return {mode: "soft_notice", tone: "quiet", shouldSpeak: true, messageSeed: "The signal is quiet, but not empty. URAI will stay gentle here.", reason: "numbness"};
  return {mode: "silent_witness", tone: "silent", shouldSpeak: false, messageSeed: `Body-weather is ${preverbalState}.`, reason: `preverbal-state-${preverbalState}`};
}
