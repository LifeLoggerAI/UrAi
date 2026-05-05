export type ChronoSpeed = "compressed" | "normal" | "dilated";
export type TemporalOrientation = "past" | "present" | "future" | "flat" | "mythic";
export type ChronoTherapyMode =
  | "grief_time"
  | "survival_time"
  | "flow_time"
  | "waiting_time"
  | "boredom_time"
  | "rebirth_time"
  | "shame_loop_time"
  | "nostalgia_time"
  | "future_dread_time"
  | "dissociation_blank_time"
  | "threshold_time";

export interface ChronoSignalWindow {
  emotionalIntensity?: number;
  positiveValence?: number;
  stressLoad?: number;
  noveltyDensity?: number;
  routineDensity?: number;
  uncertaintyLoad?: number;
  memoryAnchorCount?: number;
  socialSilenceLoad?: number;
  sleepDebt?: number;
  deviceFriction?: number;
  flowContinuity?: number;
  replayLoopLoad?: number;
  anticipationLoad?: number;
  recoverySignal?: number;
}

export interface ChronoMirrorResult {
  perceivedSpeed: ChronoSpeed;
  timeDilationScore: number;
  timeCompressionScore: number;
  realityDensity: number;
  emotionalFrameRate: number;
  memoryDensity: number;
  futureHorizon: number;
  lifeDragIndex: number;
  autopilotCollapse: number;
  anticipationStretch: number;
  aftermathDuration: number;
  emotionalHalfLife: number;
  timeToMeaning: number;
  identityDistance: number;
  narrativeVelocity: number;
  temporalProfile: {
    dominantOrientation: TemporalOrientation;
    recurrenceLoops: string[];
  };
  chronoTherapyMode: ChronoTherapyMode;
  narratorPrompt: string;
  trustLanguage: string;
  visualState: {
    skyTempo: "blurred" | "steady" | "suspended" | "fractured" | "aurora" | "dawn";
    particleDensity: number;
    shadowLength: number;
  };
}

const clamp01 = (value = 0) => Math.max(0, Math.min(1, value));
const avg = (...values: number[]) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

export function computeChronoMirror(input: ChronoSignalWindow): ChronoMirrorResult {
  const emotionalIntensity = clamp01(input.emotionalIntensity);
  const positiveValence = clamp01(input.positiveValence);
  const stressLoad = clamp01(input.stressLoad);
  const noveltyDensity = clamp01(input.noveltyDensity);
  const routineDensity = clamp01(input.routineDensity);
  const uncertaintyLoad = clamp01(input.uncertaintyLoad);
  const memoryDensity = clamp01((input.memoryAnchorCount ?? 0) / 12);
  const socialSilenceLoad = clamp01(input.socialSilenceLoad);
  const sleepDebt = clamp01(input.sleepDebt);
  const deviceFriction = clamp01(input.deviceFriction);
  const flowContinuity = clamp01(input.flowContinuity);
  const replayLoopLoad = clamp01(input.replayLoopLoad);
  const anticipationLoad = clamp01(input.anticipationLoad);
  const recoverySignal = clamp01(input.recoverySignal);

  const emotionalFrameRate = clamp01(avg(emotionalIntensity, stressLoad, uncertaintyLoad, deviceFriction));
  const realityDensity = clamp01(avg(emotionalIntensity, noveltyDensity, memoryDensity, uncertaintyLoad));
  const lifeDragIndex = clamp01(avg(stressLoad, sleepDebt, routineDensity, deviceFriction, 1 - recoverySignal));
  const autopilotCollapse = clamp01(avg(routineDensity, 1 - noveltyDensity, 1 - memoryDensity, 1 - emotionalIntensity));
  const anticipationStretch = clamp01(avg(anticipationLoad, uncertaintyLoad, stressLoad));
  const aftermathDuration = clamp01(avg(replayLoopLoad, emotionalIntensity, socialSilenceLoad, 1 - recoverySignal));
  const emotionalHalfLife = clamp01(avg(aftermathDuration, replayLoopLoad, stressLoad));
  const timeToMeaning = clamp01(avg(memoryDensity, realityDensity, emotionalIntensity));
  const identityDistance = clamp01(avg(noveltyDensity, aftermathDuration, replayLoopLoad, 1 - recoverySignal));
  const narrativeVelocity = clamp01(avg(noveltyDensity, memoryDensity, recoverySignal, emotionalIntensity));

  const timeDilationScore = clamp01(avg(emotionalFrameRate, realityDensity, lifeDragIndex, anticipationStretch));
  const timeCompressionScore = clamp01(avg(flowContinuity, positiveValence, routineDensity, autopilotCollapse));
  const perceivedSpeed: ChronoSpeed =
    timeDilationScore - timeCompressionScore > 0.18 ? "dilated" :
    timeCompressionScore - timeDilationScore > 0.18 ? "compressed" : "normal";

  const recurrenceLoops: string[] = [];
  if (replayLoopLoad > 0.62) recurrenceLoops.push("replay-loop");
  if (socialSilenceLoad > 0.62) recurrenceLoops.push("silence-echo");
  if (anticipationStretch > 0.62) recurrenceLoops.push("future-stretch");
  if (autopilotCollapse > 0.62) recurrenceLoops.push("memory-desert");

  const dominantOrientation: TemporalOrientation =
    replayLoopLoad > 0.65 ? "past" :
    anticipationStretch > 0.65 ? "future" :
    autopilotCollapse > 0.7 ? "flat" :
    realityDensity > 0.72 && narrativeVelocity > 0.58 ? "mythic" : "present";

  const chronoTherapyMode: ChronoTherapyMode =
    socialSilenceLoad > 0.72 && emotionalIntensity > 0.55 ? "grief_time" :
    stressLoad > 0.78 ? "survival_time" :
    flowContinuity > 0.72 && positiveValence > 0.5 ? "flow_time" :
    anticipationStretch > 0.72 ? "future_dread_time" :
    autopilotCollapse > 0.72 ? "dissociation_blank_time" :
    replayLoopLoad > 0.72 ? "shame_loop_time" :
    narrativeVelocity > 0.72 && recoverySignal > 0.5 ? "rebirth_time" :
    noveltyDensity > 0.72 && emotionalIntensity > 0.6 ? "threshold_time" :
    routineDensity > 0.72 ? "boredom_time" :
    replayLoopLoad > 0.5 ? "nostalgia_time" : "waiting_time";

  const skyTempo =
    chronoTherapyMode === "flow_time" ? "aurora" :
    chronoTherapyMode === "rebirth_time" ? "dawn" :
    chronoTherapyMode === "survival_time" || chronoTherapyMode === "shame_loop_time" ? "fractured" :
    perceivedSpeed === "dilated" ? "suspended" :
    perceivedSpeed === "compressed" ? "blurred" : "steady";

  return {
    perceivedSpeed,
    timeDilationScore,
    timeCompressionScore,
    realityDensity,
    emotionalFrameRate,
    memoryDensity,
    futureHorizon: clamp01(1 - avg(stressLoad, anticipationLoad, sleepDebt) + recoverySignal * 0.35),
    lifeDragIndex,
    autopilotCollapse,
    anticipationStretch,
    aftermathDuration,
    emotionalHalfLife,
    timeToMeaning,
    identityDistance,
    narrativeVelocity,
    temporalProfile: { dominantOrientation, recurrenceLoops },
    chronoTherapyMode,
    narratorPrompt: buildChronoNarration(perceivedSpeed, chronoTherapyMode, realityDensity),
    trustLanguage: "Your pattern suggests this may have felt this way. Does that feel accurate?",
    visualState: {
      skyTempo,
      particleDensity: clamp01(realityDensity + emotionalFrameRate * 0.35),
      shadowLength: clamp01(lifeDragIndex + aftermathDuration * 0.25),
    },
  };
}

function buildChronoNarration(speed: ChronoSpeed, mode: ChronoTherapyMode, density: number): string {
  const densityPhrase = density > 0.66 ? "high meaning-density" : density < 0.33 ? "low memory-density" : "moderate emotional texture";
  if (speed === "dilated") return `This period may have felt slower because it carried ${densityPhrase} and more survival-level attention.`;
  if (speed === "compressed") return `This period may have moved quickly because flow, routine, or low-friction momentum compressed conscious time.`;
  return `This period appears temporally balanced, with ${densityPhrase} and a ${mode.replace(/_/g, " ")} signature.`;
}

export interface ChronoValidationEvent {
  insightResonanceScore?: 1 | 2 | 3 | 4 | 5;
  replayCount?: number;
  pauseDurationMs?: number;
  returnedWithin24h?: boolean;
  returnedWithin72h?: boolean;
  sharedInsight?: boolean;
  savedInsight?: boolean;
  replayResolved?: boolean;
}

export function computeChronoValidation(event: ChronoValidationEvent) {
  const behavioral = avg(
    clamp01((event.replayCount ?? 0) / 4),
    clamp01((event.pauseDurationMs ?? 0) / 45000),
    event.returnedWithin24h ? 1 : 0,
    event.returnedWithin72h ? 0.7 : 0,
    event.sharedInsight ? 1 : 0,
    event.savedInsight ? 0.8 : 0,
  );
  const stated = event.insightResonanceScore ? event.insightResonanceScore / 5 : behavioral;
  return {
    insightResonanceScore: clamp01(avg(stated, behavioral)),
    replayResolutionScore: clamp01(avg(event.replayResolved ? 1 : 0, 1 - behavioral * 0.25)),
    proof: {
      replayCount: event.replayCount ?? 0,
      pauseDurationMs: event.pauseDurationMs ?? 0,
      returnedWithin24h: !!event.returnedWithin24h,
      returnedWithin72h: !!event.returnedWithin72h,
      sharedInsight: !!event.sharedInsight,
      savedInsight: !!event.savedInsight,
    },
  };
}
