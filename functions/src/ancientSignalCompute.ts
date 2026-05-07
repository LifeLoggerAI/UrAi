export interface AncientSignalCallableInput {
  rawData?: Record<string, unknown>;
  signals?: Record<string, unknown>;
  usePassiveRollups?: boolean;
  date?: string;
  daysBack?: number;
  limitPerCollection?: number;
  source?: "live" | "demo" | "imported" | "rollup";
  sourceWindow?: {
    startAt: string;
    endAt: string;
    durationMinutes: number;
  };
  consentBasis?: Record<string, boolean>;
}

export const clamp01 = (value = 0) => Math.max(0, Math.min(1, value));
export const avg = (...values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

export function num(input: Record<string, unknown>, key: string): number {
  const value = input[key];
  return typeof value === "number" && Number.isFinite(value) ? clamp01(value) : 0;
}

export function mapRawAncientSignals(rawData: Record<string, unknown>) {
  const sleepDebtHours = typeof rawData.sleepDebtHours === "number" ? rawData.sleepDebtHours : 0;
  const stressScore = num(rawData, "stressScore");
  const frictionTapScore = num(rawData, "frictionTapScore");
  const hesitationScore = num(rawData, "hesitationScore");
  const cancelLoopScore = num(rawData, "cancelLoopScore");

  return {
    wordDisclosure: num(rawData, "wordDisclosure"),
    voiceTension: num(rawData, "voiceTension"),
    pauseDensity: num(rawData, "pauseDensity"),
    speechCompression: num(rawData, "speechCompression"),
    frictionTapScore,
    hesitationScore,
    cancelLoopScore,
    scrollVelocityScore: num(rawData, "scrollVelocityScore"),
    notificationFriction: num(rawData, "notificationFrictionScore"),
    motionJitter: num(rawData, "motionJitterScore"),
    placeAvoidanceScore: num(rawData, "placeAvoidanceScore"),
    sleepDebt: clamp01(sleepDebtHours / 8),
    nocturnalDrift: num(rawData, "lateNightUseScore"),
    recoverySignal: clamp01((typeof rawData.recoveryActionCount === "number" ? rawData.recoveryActionCount : 0) / 4),
    socialAbsence: num(rawData, "socialGapScore"),
    conflictResidue: num(rawData, "conflictScore"),
    chronoCompression: num(rawData, "chronoCompression"),
    chronoDilation: num(rawData, "chronoDilation"),
    mentalLoadScore: stressScore,
    shadowScore: avg(stressScore, clamp01(sleepDebtHours / 8)),
    obscuraScore: avg(frictionTapScore, hesitationScore, cancelLoopScore),
    moodIntensity: Math.max(num(rawData, "moodScore"), stressScore),
    positiveValence: num(rawData, "moodScore"),
  };
}

export function resolveRollupWindow(payload: AncientSignalCallableInput) {
  if (payload.sourceWindow) return payload.sourceWindow;

  const daysBack = Math.max(1, Math.min(payload.daysBack ?? 1, 30));
  if (payload.date) {
    return {
      startAt: `${payload.date}T00:00:00.000Z`,
      endAt: `${payload.date}T23:59:59.999Z`,
      durationMinutes: 1440,
    };
  }

  const end = new Date();
  const start = new Date(end.getTime() - daysBack * 24 * 60 * 60 * 1000);
  return {
    startAt: start.toISOString(),
    endAt: end.toISOString(),
    durationMinutes: daysBack * 1440,
  };
}

export function computeAncientSignalPayload(input: Record<string, unknown>) {
  const voiceLoad = avg(num(input, "voiceTension"), num(input, "pauseDensity"), num(input, "speechCompression"), num(input, "silenceWeight"));
  const gestureLoad = avg(num(input, "frictionTapScore"), num(input, "hesitationScore"), num(input, "cancelLoopScore"), num(input, "scrollVelocityScore"), num(input, "notificationFriction"));
  const bodyRhythmLoad = avg(num(input, "motionJitter"), num(input, "stagnationScore"), num(input, "sleepDebt"), num(input, "nocturnalDrift"), num(input, "chronoDilation"));
  const socialLoad = avg(num(input, "socialAbsence"), num(input, "conflictResidue"), 1 - num(input, "connectionPull"));

  const activationScore = clamp01(0.18 * voiceLoad + 0.18 * gestureLoad + 0.16 * num(input, "mentalLoadScore") + 0.14 * num(input, "shadowScore") + 0.12 * num(input, "obscuraScore") + 0.1 * num(input, "nocturnalDrift") + 0.12 * num(input, "motionJitter"));
  const withdrawalScore = clamp01(0.28 * num(input, "socialAbsence") + 0.18 * num(input, "stagnationScore") + 0.16 * num(input, "silenceWeight") + 0.14 * num(input, "placeAvoidanceScore") + 0.12 * num(input, "nocturnalDrift") + 0.12 * num(input, "chronoDilation"));
  const recoveryPulseScore = clamp01(0.38 * num(input, "recoverySignal") + 0.2 * num(input, "positiveValence") + 0.18 * (1 - num(input, "mentalLoadScore")) + 0.12 * (1 - num(input, "shadowScore")) + 0.12 * (1 - num(input, "nocturnalDrift")));
  const numbnessScore = clamp01(0.24 * num(input, "silenceWeight") + 0.22 * num(input, "stagnationScore") + 0.18 * (1 - num(input, "moodIntensity")) + 0.16 * num(input, "chronoCompression") + 0.1 * (1 - num(input, "wordDisclosure")) + 0.1 * num(input, "socialAbsence"));
  const seekingScore = clamp01(0.3 * num(input, "connectionPull") + 0.2 * num(input, "wordDisclosure") + 0.18 * num(input, "moodIntensity") + 0.16 * num(input, "recoverySignal") + 0.16 * num(input, "positiveValence"));

  const preverbalState = recoveryPulseScore > 0.72 && activationScore < 0.68 ? "recovering" :
    activationScore > 0.74 && withdrawalScore > 0.48 ? "overloaded" :
    activationScore > 0.58 && withdrawalScore > 0.46 ? "guarded" :
    withdrawalScore > 0.64 && numbnessScore > 0.42 ? "withdrawing" :
    numbnessScore > 0.68 && activationScore < 0.46 ? "numb" :
    seekingScore > 0.62 && withdrawalScore < 0.58 ? "seeking" :
    activationScore > 0.45 ? "activated" :
    activationScore < 0.28 && withdrawalScore < 0.28 && numbnessScore < 0.45 ? "settled" : "unknown";

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
      words: num(input, "wordDisclosure"),
      voice: voiceLoad,
      gesture: gestureLoad,
      bodyRhythm: bodyRhythmLoad,
      socialField: socialLoad,
      auraAtmosphere: avg(voiceLoad, gestureLoad, bodyRhythmLoad, socialLoad, num(input, "shadowScore"), num(input, "obscuraScore"), num(input, "mentalLoadScore")),
      towardAway: avg(seekingScore, withdrawalScore, recoveryPulseScore),
    },
    auraAtmosphere: {
      warmth: clamp01(recoveryPulseScore + (1 - withdrawalScore) * 0.2),
      heaviness: avg(withdrawalScore, numbnessScore, num(input, "mentalLoadScore")),
      staticCharge: activationScore,
      haze: avg(withdrawalScore, num(input, "nocturnalDrift"), numbnessScore),
      pressure: avg(activationScore, num(input, "mentalLoadScore")),
      bloomPotential: recoveryPulseScore,
    },
    towardAwayVector: {
      towardPeople: num(input, "connectionPull"),
      awayFromPeople: num(input, "socialAbsence"),
      towardRest: avg(num(input, "recoverySignal"), num(input, "sleepDebt")),
      awayFromRest: avg(num(input, "chronoCompression"), 1 - num(input, "recoverySignal")),
      towardMeaning: avg(num(input, "wordDisclosure"), num(input, "recoverySignal"), 1 - num(input, "chronoCompression")),
      awayFromMeaning: avg(num(input, "placeAvoidanceScore"), num(input, "socialAbsence"), num(input, "chronoCompression")),
    },
    visualState: {
      orbPulseRate: clamp01(0.35 + activationScore * 0.55 + recoveryPulseScore * 0.1),
      auraDensity: clamp01(0.22 + activationScore * 0.45 + recoveryPulseScore * 0.22),
      skyHaze: clamp01(withdrawalScore * 0.72 + numbnessScore * 0.28),
      groundTension: clamp01(num(input, "mentalLoadScore") * 0.7 + activationScore * 0.3),
      constellationDrift: clamp01(num(input, "socialAbsence") * 0.75 + withdrawalScore * 0.25),
      shadowStatic: clamp01(activationScore * 0.68 + num(input, "mentalLoadScore") * 0.32),
      bloomReadiness: recoveryPulseScore,
    },
    narratorHint: {
      mode: recoveryPulseScore > 0.7 ? "recovery_reflection" : activationScore > 0.72 ? "grounding_prompt" : withdrawalScore > 0.64 ? "protective_pause" : numbnessScore > 0.64 ? "soft_notice" : "silent_witness",
      tone: recoveryPulseScore > 0.7 ? "warm" : activationScore > 0.72 ? "grounding" : withdrawalScore > 0.64 ? "protective" : numbnessScore > 0.64 ? "quiet" : "silent",
      shouldSpeak: confidence >= 0.3 && (recoveryPulseScore > 0.7 || activationScore > 0.72 || withdrawalScore > 0.64 || numbnessScore > 0.64),
      messageSeed: recoveryPulseScore > 0.7 ? "Something in you is coming back online. Keep the day simple enough for it to stay." : "Before words, your body may already be shifting. URAI will keep the signal gentle.",
      reason: `preverbal-state-${preverbalState}`,
    },
    safetyFlags: ["no-diagnosis", "no-lie-detection", "user-baseline-required-for-production"],
  };
}
