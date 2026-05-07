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

export type AncientSignalDepthKey =
  | "words"
  | "voice"
  | "gesture"
  | "bodyRhythm"
  | "socialField"
  | "auraAtmosphere"
  | "towardAway";

export type AncientNarratorTone =
  | "silent"
  | "quiet"
  | "grounding"
  | "curious"
  | "protective"
  | "warm";

export type AncientNarratorMode =
  | "silent_witness"
  | "soft_notice"
  | "grounding_prompt"
  | "protective_pause"
  | "recovery_reflection"
  | "threshold_warning";

export interface AncientSignalWindow {
  wordDisclosure?: number;
  voiceTension?: number;
  pauseDensity?: number;
  speechCompression?: number;
  sighLikelihood?: number;
  silenceWeight?: number;
  frictionTapScore?: number;
  hesitationScore?: number;
  cancelLoopScore?: number;
  scrollVelocityScore?: number;
  notificationFriction?: number;
  motionJitter?: number;
  stagnationScore?: number;
  transitionScore?: number;
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
}

export interface AncientSignalResult {
  preverbalState: PreverbalState;
  activationScore: number;
  withdrawalScore: number;
  recoveryPulseScore: number;
  numbnessScore: number;
  seekingScore: number;
  signalDepth: Record<AncientSignalDepthKey, number>;
  rhythm: {
    tempoScore: number;
    irregularityScore: number;
    stillnessScore: number;
    recoveryPulseScore: number;
    nocturnalDriftScore: number;
  };
  touchBehavior: {
    frictionTapScore: number;
    hesitationScore: number;
    cancelLoopScore: number;
    scrollVelocityScore: number;
    microAvoidanceScore: number;
  };
  movement: {
    jitterScore: number;
    stagnationScore: number;
    transitionScore: number;
    placeAvoidanceScore: number;
  };
  voiceProxy: {
    pauseDensity: number;
    prosodyTension: number;
    sighLikelihood: number;
    speechCompression: number;
    silenceWeight: number;
  };
  socialField: {
    connectionPull: number;
    isolationDrift: number;
    conflictResidue: number;
    absenceWeight: number;
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
  confidence: number;
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
    mode: AncientNarratorMode;
    tone: AncientNarratorTone;
    shouldSpeak: boolean;
    messageSeed: string;
    reason: string;
  };
  safetyFlags: string[];
}

export interface AncientSignalConsentBasis {
  audioProcessing?: boolean;
  locationContext?: boolean;
  relationshipInsights?: boolean;
  healthWellnessInsights?: boolean;
}

export interface AncientSignalSnapshot extends AncientSignalResult {
  id: string;
  ownerUid: string;
  createdAt: string;
  updatedAt: string;
  sourceWindow: {
    startAt: string;
    endAt: string;
    durationMinutes: number;
  };
  consentBasis: AncientSignalConsentBasis;
}

export interface AncientRawUserData {
  moodScore?: number;
  stressScore?: number;
  sleepDebtHours?: number;
  notificationFrictionScore?: number;
  socialGapScore?: number;
  conflictScore?: number;
  recoveryActionCount?: number;
  motionJitterScore?: number;
  placeAvoidanceScore?: number;
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
}

const clamp01 = (value = 0) => Math.max(0, Math.min(1, value));
const avg = (...values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0);
const countProvided = (values: Array<number | undefined>) => values.filter((value) => typeof value === "number").length;

export function computeAncientSignals(input: AncientSignalWindow): AncientSignalResult {
  const wordDisclosure = clamp01(input.wordDisclosure);
  const voiceTension = clamp01(input.voiceTension);
  const pauseDensity = clamp01(input.pauseDensity);
  const speechCompression = clamp01(input.speechCompression);
  const sighLikelihood = clamp01(input.sighLikelihood);
  const silenceWeight = clamp01(input.silenceWeight);
  const frictionTapScore = clamp01(input.frictionTapScore);
  const hesitationScore = clamp01(input.hesitationScore);
  const cancelLoopScore = clamp01(input.cancelLoopScore);
  const scrollVelocityScore = clamp01(input.scrollVelocityScore);
  const notificationFriction = clamp01(input.notificationFriction);
  const motionJitter = clamp01(input.motionJitter);
  const stagnationScore = clamp01(input.stagnationScore);
  const transitionScore = clamp01(input.transitionScore);
  const placeAvoidanceScore = clamp01(input.placeAvoidanceScore);
  const sleepDebt = clamp01(input.sleepDebt);
  const nocturnalDrift = clamp01(input.nocturnalDrift);
  const recoverySignal = clamp01(input.recoverySignal);
  const socialAbsence = clamp01(input.socialAbsence);
  const conflictResidue = clamp01(input.conflictResidue);
  const connectionPull = clamp01(input.connectionPull);
  const chronoCompression = clamp01(input.chronoCompression);
  const chronoDilation = clamp01(input.chronoDilation);
  const mentalLoadScore = clamp01(input.mentalLoadScore);
  const shadowScore = clamp01(input.shadowScore);
  const obscuraScore = clamp01(input.obscuraScore);
  const moodIntensity = clamp01(input.moodIntensity);
  const positiveValence = clamp01(input.positiveValence);

  const gestureLoad = avg(frictionTapScore, hesitationScore, cancelLoopScore, scrollVelocityScore, notificationFriction);
  const voiceLoad = avg(voiceTension, pauseDensity, speechCompression, sighLikelihood, silenceWeight);
  const bodyRhythmLoad = avg(motionJitter, stagnationScore, sleepDebt, nocturnalDrift, chronoDilation);
  const socialLoad = avg(socialAbsence, conflictResidue, 1 - connectionPull);
  const ancientLoad = avg(gestureLoad, voiceLoad, bodyRhythmLoad, socialLoad, shadowScore, obscuraScore, mentalLoadScore);

  const activationScore = clamp01(
    0.17 * voiceLoad +
      0.17 * gestureLoad +
      0.14 * motionJitter +
      0.13 * mentalLoadScore +
      0.12 * shadowScore +
      0.1 * obscuraScore +
      0.09 * nocturnalDrift +
      0.08 * conflictResidue,
  );

  const withdrawalScore = clamp01(
    0.26 * socialAbsence +
      0.18 * stagnationScore +
      0.16 * silenceWeight +
      0.14 * placeAvoidanceScore +
      0.12 * nocturnalDrift +
      0.08 * chronoDilation +
      0.06 * (1 - connectionPull),
  );

  const recoveryPulseScore = clamp01(
    0.38 * recoverySignal +
      0.2 * positiveValence +
      0.18 * (1 - mentalLoadScore) +
      0.12 * (1 - shadowScore) +
      0.12 * (1 - nocturnalDrift),
  );

  const numbnessScore = clamp01(
    0.24 * silenceWeight +
      0.22 * stagnationScore +
      0.16 * (1 - moodIntensity) +
      0.14 * chronoCompression +
      0.12 * (1 - wordDisclosure) +
      0.12 * socialAbsence,
  );

  const seekingScore = clamp01(
    0.28 * connectionPull +
      0.2 * transitionScore +
      0.18 * wordDisclosure +
      0.16 * moodIntensity +
      0.1 * recoverySignal +
      0.08 * positiveValence,
  );

  const preverbalState = computePreverbalState({
    activationScore,
    withdrawalScore,
    recoveryPulseScore,
    numbnessScore,
    seekingScore,
  });

  const signalDepth = {
    words: wordDisclosure,
    voice: voiceLoad,
    gesture: gestureLoad,
    bodyRhythm: bodyRhythmLoad,
    socialField: socialLoad,
    auraAtmosphere: ancientLoad,
    towardAway: avg(seekingScore, withdrawalScore, recoveryPulseScore),
  };

  const auraAtmosphere = computeAuraAtmosphere({
    activationScore,
    withdrawalScore,
    recoveryPulseScore,
    numbnessScore,
    mentalLoadScore,
    nocturnalDrift,
  });

  const towardAwayVector = computeTowardAwayVector({
    connectionPull,
    socialAbsence,
    recoverySignal,
    sleepDebt,
    wordDisclosure,
    chronoCompression,
    placeAvoidanceScore,
  });

  const visualState = mapAncientSignalsToVisualState({
    activationScore,
    withdrawalScore,
    recoveryPulseScore,
    numbnessScore,
    mentalLoadScore,
    socialAbsence,
  });

  const narratorHint = mapAncientSignalsToNarratorPrompt({
    preverbalState,
    activationScore,
    withdrawalScore,
    recoveryPulseScore,
    numbnessScore,
    confidence: computeAncientSignalConfidence(input),
  });

  return {
    preverbalState,
    activationScore,
    withdrawalScore,
    recoveryPulseScore,
    numbnessScore,
    seekingScore,
    signalDepth,
    rhythm: {
      tempoScore: avg(motionJitter, speechCompression, scrollVelocityScore),
      irregularityScore: avg(voiceTension, motionJitter, hesitationScore, notificationFriction),
      stillnessScore: stagnationScore,
      recoveryPulseScore,
      nocturnalDriftScore: nocturnalDrift,
    },
    touchBehavior: {
      frictionTapScore,
      hesitationScore,
      cancelLoopScore,
      scrollVelocityScore,
      microAvoidanceScore: avg(cancelLoopScore, hesitationScore, placeAvoidanceScore),
    },
    movement: {
      jitterScore: motionJitter,
      stagnationScore,
      transitionScore,
      placeAvoidanceScore,
    },
    voiceProxy: {
      pauseDensity,
      prosodyTension: voiceTension,
      sighLikelihood,
      speechCompression,
      silenceWeight,
    },
    socialField: {
      connectionPull,
      isolationDrift: socialAbsence,
      conflictResidue,
      absenceWeight: avg(socialAbsence, silenceWeight),
    },
    auraAtmosphere,
    towardAwayVector,
    confidence: computeAncientSignalConfidence(input),
    visualState,
    narratorHint,
    safetyFlags: buildSafetyFlags(input),
  };
}

export function computePreverbalState(scores: {
  activationScore: number;
  withdrawalScore: number;
  recoveryPulseScore: number;
  numbnessScore: number;
  seekingScore: number;
}): PreverbalState {
  const activationScore = clamp01(scores.activationScore);
  const withdrawalScore = clamp01(scores.withdrawalScore);
  const recoveryPulseScore = clamp01(scores.recoveryPulseScore);
  const numbnessScore = clamp01(scores.numbnessScore);
  const seekingScore = clamp01(scores.seekingScore);

  if (recoveryPulseScore > 0.72 && activationScore < 0.68) return "recovering";
  if (activationScore > 0.74 && withdrawalScore > 0.48) return "overloaded";
  if (activationScore > 0.58 && withdrawalScore > 0.46) return "guarded";
  if (withdrawalScore > 0.64 && numbnessScore > 0.42) return "withdrawing";
  if (numbnessScore > 0.68 && activationScore < 0.46) return "numb";
  if (seekingScore > 0.62 && withdrawalScore < 0.58) return "seeking";
  if (activationScore > 0.45) return "activated";
  if (activationScore < 0.28 && withdrawalScore < 0.28 && numbnessScore < 0.45) return "settled";
  return "unknown";
}

export function computeAuraAtmosphere(scores: {
  activationScore: number;
  withdrawalScore: number;
  recoveryPulseScore: number;
  numbnessScore?: number;
  mentalLoadScore?: number;
  nocturnalDrift?: number;
}) {
  const activationScore = clamp01(scores.activationScore);
  const withdrawalScore = clamp01(scores.withdrawalScore);
  const recoveryPulseScore = clamp01(scores.recoveryPulseScore);
  const numbnessScore = clamp01(scores.numbnessScore);
  const mentalLoadScore = clamp01(scores.mentalLoadScore);
  const nocturnalDrift = clamp01(scores.nocturnalDrift);

  return {
    warmth: clamp01(recoveryPulseScore + (1 - withdrawalScore) * 0.2),
    heaviness: clamp01(avg(withdrawalScore, numbnessScore, mentalLoadScore)),
    staticCharge: activationScore,
    haze: clamp01(avg(withdrawalScore, nocturnalDrift, numbnessScore)),
    pressure: clamp01(avg(activationScore, mentalLoadScore)),
    bloomPotential: recoveryPulseScore,
  };
}

export function computeTowardAwayVector(input: {
  connectionPull?: number;
  socialAbsence?: number;
  recoverySignal?: number;
  sleepDebt?: number;
  wordDisclosure?: number;
  chronoCompression?: number;
  placeAvoidanceScore?: number;
}) {
  const connectionPull = clamp01(input.connectionPull);
  const socialAbsence = clamp01(input.socialAbsence);
  const recoverySignal = clamp01(input.recoverySignal);
  const sleepDebt = clamp01(input.sleepDebt);
  const wordDisclosure = clamp01(input.wordDisclosure);
  const chronoCompression = clamp01(input.chronoCompression);
  const placeAvoidanceScore = clamp01(input.placeAvoidanceScore);

  return {
    towardPeople: connectionPull,
    awayFromPeople: socialAbsence,
    towardRest: clamp01(avg(recoverySignal, sleepDebt)),
    awayFromRest: clamp01(avg(chronoCompression, 1 - recoverySignal)),
    towardMeaning: clamp01(avg(wordDisclosure, recoverySignal, 1 - chronoCompression)),
    awayFromMeaning: clamp01(avg(placeAvoidanceScore, socialAbsence, chronoCompression)),
  };
}

export function mapAncientSignalsToVisualState(scores: {
  activationScore: number;
  withdrawalScore: number;
  recoveryPulseScore: number;
  numbnessScore?: number;
  mentalLoadScore?: number;
  socialAbsence?: number;
}) {
  const activationScore = clamp01(scores.activationScore);
  const withdrawalScore = clamp01(scores.withdrawalScore);
  const recoveryPulseScore = clamp01(scores.recoveryPulseScore);
  const numbnessScore = clamp01(scores.numbnessScore);
  const mentalLoadScore = clamp01(scores.mentalLoadScore);
  const socialAbsence = clamp01(scores.socialAbsence);

  return {
    orbPulseRate: clamp01(0.35 + activationScore * 0.55 + recoveryPulseScore * 0.1),
    auraDensity: clamp01(0.22 + activationScore * 0.45 + recoveryPulseScore * 0.22),
    skyHaze: clamp01(withdrawalScore * 0.72 + numbnessScore * 0.28),
    groundTension: clamp01(mentalLoadScore * 0.7 + activationScore * 0.3),
    constellationDrift: clamp01(socialAbsence * 0.75 + withdrawalScore * 0.25),
    shadowStatic: clamp01(activationScore * 0.68 + mentalLoadScore * 0.32),
    bloomReadiness: recoveryPulseScore,
  };
}

export function mapAncientSignalsToNarratorPrompt(input: {
  preverbalState: PreverbalState;
  activationScore: number;
  withdrawalScore: number;
  recoveryPulseScore: number;
  numbnessScore?: number;
  confidence?: number;
}) {
  const confidence = clamp01(input.confidence);
  const activationScore = clamp01(input.activationScore);
  const withdrawalScore = clamp01(input.withdrawalScore);
  const recoveryPulseScore = clamp01(input.recoveryPulseScore);
  const numbnessScore = clamp01(input.numbnessScore);

  if (confidence < 0.3) {
    return {
      mode: "silent_witness" as const,
      tone: "silent" as const,
      shouldSpeak: false,
      messageSeed: "The signal is still forming. URAI should observe quietly.",
      reason: "low-confidence-ancient-signal-window",
    };
  }

  if (recoveryPulseScore > 0.7) {
    return {
      mode: "recovery_reflection" as const,
      tone: "warm" as const,
      shouldSpeak: true,
      messageSeed: "Something in you is coming back online. Keep the day simple enough for it to stay.",
      reason: "recovery-pulse-detected",
    };
  }

  if (activationScore > 0.72) {
    return {
      mode: "grounding_prompt" as const,
      tone: "grounding" as const,
      shouldSpeak: true,
      messageSeed: "Your rhythm looks sharper than usual. You do not need to name it yet. Soften the next minute.",
      reason: "high-preverbal-activation",
    };
  }

  if (withdrawalScore > 0.64) {
    return {
      mode: "protective_pause" as const,
      tone: "protective" as const,
      shouldSpeak: true,
      messageSeed: "You seem farther from people today. That may be protection, not failure.",
      reason: "withdrawal-or-social-distance-pattern",
    };
  }

  if (numbnessScore > 0.64) {
    return {
      mode: "soft_notice" as const,
      tone: "quiet" as const,
      shouldSpeak: true,
      messageSeed: "The signal is quiet, but not empty. URAI will stay gentle here.",
      reason: "low-expression-high-stillness-pattern",
    };
  }

  return {
    mode: input.preverbalState === "settled" ? "silent_witness" as const : "soft_notice" as const,
    tone: input.preverbalState === "settled" ? "silent" as const : "quiet" as const,
    shouldSpeak: input.preverbalState !== "settled",
    messageSeed: "Before words, your body may already be shifting. URAI will keep the signal gentle.",
    reason: `preverbal-state-${input.preverbalState}`,
  };
}

export function buildAncientSignalSnapshot(params: {
  id: string;
  ownerUid: string;
  createdAt: string;
  updatedAt?: string;
  sourceWindow: AncientSignalSnapshot["sourceWindow"];
  consentBasis: AncientSignalConsentBasis;
  input: AncientSignalWindow;
}): AncientSignalSnapshot {
  return {
    ...computeAncientSignals(params.input),
    id: params.id,
    ownerUid: params.ownerUid,
    createdAt: params.createdAt,
    updatedAt: params.updatedAt ?? params.createdAt,
    sourceWindow: params.sourceWindow,
    consentBasis: params.consentBasis,
  };
}

export function mapUserDataToAncientSignals(data: AncientRawUserData): AncientSignalWindow {
  return {
    wordDisclosure: clamp01(data.wordDisclosure),
    voiceTension: clamp01(data.voiceTension),
    pauseDensity: clamp01(data.pauseDensity),
    speechCompression: clamp01(data.speechCompression),
    frictionTapScore: clamp01(data.frictionTapScore),
    hesitationScore: clamp01(data.hesitationScore),
    cancelLoopScore: clamp01(data.cancelLoopScore),
    scrollVelocityScore: clamp01(data.scrollVelocityScore),
    notificationFriction: clamp01(data.notificationFrictionScore),
    motionJitter: clamp01(data.motionJitterScore),
    placeAvoidanceScore: clamp01(data.placeAvoidanceScore),
    sleepDebt: clamp01((data.sleepDebtHours ?? 0) / 8),
    nocturnalDrift: clamp01(data.lateNightUseScore),
    recoverySignal: clamp01((data.recoveryActionCount ?? 0) / 4),
    socialAbsence: clamp01(data.socialGapScore),
    conflictResidue: clamp01(data.conflictScore),
    chronoCompression: clamp01(data.chronoCompression),
    chronoDilation: clamp01(data.chronoDilation),
    mentalLoadScore: clamp01(data.stressScore),
    shadowScore: clamp01(avg(data.stressScore ?? 0, data.sleepDebtHours ? data.sleepDebtHours / 8 : 0)),
    obscuraScore: clamp01(avg(data.frictionTapScore ?? 0, data.hesitationScore ?? 0, data.cancelLoopScore ?? 0)),
    moodIntensity: clamp01(Math.max(data.moodScore ?? 0, data.stressScore ?? 0)),
    positiveValence: clamp01(data.moodScore),
  };
}

export function buildAncientSkyParams(result: AncientSignalResult) {
  return {
    orbPulseRate: result.visualState.orbPulseRate,
    auraDensity: result.visualState.auraDensity,
    skyHaze: result.visualState.skyHaze,
    groundTension: result.visualState.groundTension,
    constellationDrift: result.visualState.constellationDrift,
    shadowStatic: result.visualState.shadowStatic,
    bloomReadiness: result.visualState.bloomReadiness,
    narratorSilence: result.narratorHint.shouldSpeak ? 0 : 1,
  };
}

export function buildAncientNarratorProfile(result: AncientSignalResult) {
  return {
    mode: result.narratorHint.mode,
    tone: result.narratorHint.tone,
    shouldSpeak: result.narratorHint.shouldSpeak,
    silenceMs: Math.round(600 + result.withdrawalScore * 1400 + result.numbnessScore * 1600),
    intensity: result.activationScore,
    prompt: result.narratorHint.messageSeed,
  };
}

function computeAncientSignalConfidence(input: AncientSignalWindow): number {
  const observed = countProvided([
    input.wordDisclosure,
    input.voiceTension,
    input.pauseDensity,
    input.speechCompression,
    input.sighLikelihood,
    input.silenceWeight,
    input.frictionTapScore,
    input.hesitationScore,
    input.cancelLoopScore,
    input.scrollVelocityScore,
    input.notificationFriction,
    input.motionJitter,
    input.stagnationScore,
    input.transitionScore,
    input.placeAvoidanceScore,
    input.sleepDebt,
    input.nocturnalDrift,
    input.recoverySignal,
    input.socialAbsence,
    input.conflictResidue,
    input.connectionPull,
    input.chronoCompression,
    input.chronoDilation,
    input.mentalLoadScore,
    input.shadowScore,
    input.obscuraScore,
    input.moodIntensity,
    input.positiveValence,
  ]);
  return clamp01(observed / 12);
}

function buildSafetyFlags(input: AncientSignalWindow): string[] {
  const flags: string[] = ["no-diagnosis", "no-lie-detection", "user-baseline-required-for-production"];
  if (countProvided([input.voiceTension, input.pauseDensity, input.speechCompression, input.sighLikelihood]) > 0) {
    flags.push("audio-consent-required");
  }
  if (typeof input.placeAvoidanceScore === "number") {
    flags.push("location-consent-required");
  }
  if (typeof input.socialAbsence === "number" || typeof input.conflictResidue === "number" || typeof input.connectionPull === "number") {
    flags.push("relationship-insights-consent-required");
  }
  return flags;
}
