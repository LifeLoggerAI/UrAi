import {spawn} from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import * as admin from "firebase-admin";
import {setGlobalOptions} from "firebase-functions";
import {HttpsError, onCall} from "firebase-functions/v2/https";

setGlobalOptions({maxInstances: 10});

if (!admin.apps.length) {
  admin.initializeApp();
}

const bucket = admin.storage().bucket();
const firestore = admin.firestore();

export interface MovieDoc {
  durationSec?: number | null;
  renderProfile?: string | null;
  titlePngPath?: string | null;
  audioPath?: string | null;
}

export async function renderStoryMovieMP4(
  movieId: string,
  movie: MovieDoc
): Promise<{localOut: string}> {
  const total = Math.max(6, Math.min(movie.durationSec ?? 10, 120));
  const introDur = Math.max(1.5, Math.round(total * 0.2 * 10) / 10);
  const midDur = Math.max(3.0, Math.round(total * 0.6 * 10) / 10);
  const outroDur = Math.max(1.5, Math.round(total * 0.2 * 10) / 10);
  const xfDur = 0.6;

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `urai-${movieId}-`));
  const outPath = path.join(tmpDir, "out.mp4");

  let titlePngLocal: string | null = null;
  if (movie.titlePngPath) {
    const pngFile = bucket.file(movie.titlePngPath);
    const [exists] = await pngFile.exists();
    if (exists) {
      titlePngLocal = path.join(tmpDir, "title.png");
      await pngFile.download({destination: titlePngLocal});
    }
  }

  let audioLocal: string | null = null;
  if (movie.audioPath) {
    const audioFile = bucket.file(movie.audioPath);
    const [exists] = await audioFile.exists();
    if (exists) {
      audioLocal = path.join(tmpDir, "track.mp3");
      await audioFile.download({destination: audioLocal});
    }
  }

  const isV15 = (movie.renderProfile ?? "").toLowerCase() === "storymode_v1_5";

  const args: string[] = ["-y"];

  args.push(
    "-f",
    "lavfi",
    "-t",
    introDur.toFixed(3),
    "-i",
    "color=c=black:s=1920x1080:r=30"
  );

  if (titlePngLocal) {
    args.push("-loop", "1", "-t", midDur.toFixed(3), "-i", titlePngLocal);
  } else {
    args.push(
      "-f",
      "lavfi",
      "-t",
      midDur.toFixed(3),
      "-i",
      "color=c=black:s=1920x1080:r=30"
    );
  }

  args.push(
    "-f",
    "lavfi",
    "-t",
    outroDur.toFixed(3),
    "-i",
    "color=c=black:s=1920x1080:r=30"
  );

  if (audioLocal) {
    args.push("-i", audioLocal);
  } else {
    args.push(
      "-f",
      "lavfi",
      "-t",
      total.toFixed(3),
      "-i",
      "anullsrc=r=44100:cl=stereo"
    );
  }

  const filterParts: string[] = [];

  if (titlePngLocal) {
    const midFrames = Math.round(midDur * 30);
    filterParts.push(
      "[1:v]scale=1920:1080:force_original_aspect_ratio=decrease [mid_scaled]",
      "[mid_scaled]pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black [mid_padded]",
      `[mid_padded]zoompan=z='min(1.08,1+0.0005*n)':d=${midFrames}:fps=30 [mid_zoom]`,
      "[mid_zoom]format=yuv420p[v1]"
    );
  } else {
    filterParts.push("[1:v]format=yuv420p[v1]");
  }

  let videoLabel = "vout";

  if (isV15) {
    const off1 = Math.max(0, introDur - xfDur);
    const off2 = Math.max(0, introDur + midDur - xfDur);
    filterParts.unshift("[0:v]format=yuv420p[v0]", "[2:v]format=yuv420p[v2]");
    filterParts.push(
      `[v0][v1]xfade=transition=fade:duration=${xfDur}:offset=${off1}[xf1]`,
      `[xf1][v2]xfade=transition=fade:duration=${xfDur}:offset=${off2}[${videoLabel}]`
    );
  } else {
    const fadeOutStart = Math.max(0, midDur - 0.8);
    filterParts.push(
      "[v1]fade=t=in:st=0:d=0.8[v1f]",
      `[v1f]fade=t=out:st=${fadeOutStart}:d=0.8[${videoLabel}]`
    );
  }

  filterParts.push(`[3:a]atrim=0:${total},asetpts=N/SR/T[aout]`);

  const filterComplex = filterParts.join(";");

  args.push("-filter_complex", filterComplex);
  args.push("-map", `[${videoLabel}]`, "-map", "[aout]");
  args.push(
    "-c:v",
    "libx264",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-movflags",
    "+faststart",
    "-pix_fmt",
    "yuv420p",
    "-profile:v",
    "main",
    "-level",
    "4.0",
    outPath
  );

  await new Promise<void>((resolve, reject) => {
    const proc = spawn("ffmpeg", args, {stdio: ["ignore", "inherit", "inherit"]});

    proc.on("error", (error) => {
      reject(error);
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });
  });

  return {localOut: outPath};
}

interface AncientSignalCallableInput {
  rawData?: Record<string, unknown>;
  signals?: Record<string, unknown>;
  source?: "live" | "demo" | "imported" | "rollup";
  sourceWindow?: {
    startAt: string;
    endAt: string;
    durationMinutes: number;
  };
  consentBasis?: {
    audioProcessing?: boolean;
    locationContext?: boolean;
    relationshipInsights?: boolean;
    healthWellnessInsights?: boolean;
  };
}

const clamp01 = (value = 0) => Math.max(0, Math.min(1, value));
const avg = (...values: number[]) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

function num(input: Record<string, unknown>, key: string): number {
  const value = input[key];
  return typeof value === "number" && Number.isFinite(value) ? clamp01(value) : 0;
}

function mapRawAncientSignals(rawData: Record<string, unknown>) {
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

function computeAncientSignalPayload(input: Record<string, unknown>) {
  const voiceLoad = avg(num(input, "voiceTension"), num(input, "pauseDensity"), num(input, "speechCompression"), num(input, "sighLikelihood"), num(input, "silenceWeight"));
  const gestureLoad = avg(num(input, "frictionTapScore"), num(input, "hesitationScore"), num(input, "cancelLoopScore"), num(input, "scrollVelocityScore"), num(input, "notificationFriction"));
  const bodyRhythmLoad = avg(num(input, "motionJitter"), num(input, "stagnationScore"), num(input, "sleepDebt"), num(input, "nocturnalDrift"), num(input, "chronoDilation"));
  const socialLoad = avg(num(input, "socialAbsence"), num(input, "conflictResidue"), 1 - num(input, "connectionPull"));

  const activationScore = clamp01(0.17 * voiceLoad + 0.17 * gestureLoad + 0.14 * num(input, "motionJitter") + 0.13 * num(input, "mentalLoadScore") + 0.12 * num(input, "shadowScore") + 0.1 * num(input, "obscuraScore") + 0.09 * num(input, "nocturnalDrift") + 0.08 * num(input, "conflictResidue"));
  const withdrawalScore = clamp01(0.26 * num(input, "socialAbsence") + 0.18 * num(input, "stagnationScore") + 0.16 * num(input, "silenceWeight") + 0.14 * num(input, "placeAvoidanceScore") + 0.12 * num(input, "nocturnalDrift") + 0.08 * num(input, "chronoDilation") + 0.06 * (1 - num(input, "connectionPull")));
  const recoveryPulseScore = clamp01(0.38 * num(input, "recoverySignal") + 0.2 * num(input, "positiveValence") + 0.18 * (1 - num(input, "mentalLoadScore")) + 0.12 * (1 - num(input, "shadowScore")) + 0.12 * (1 - num(input, "nocturnalDrift")));
  const numbnessScore = clamp01(0.24 * num(input, "silenceWeight") + 0.22 * num(input, "stagnationScore") + 0.16 * (1 - num(input, "moodIntensity")) + 0.14 * num(input, "chronoCompression") + 0.12 * (1 - num(input, "wordDisclosure")) + 0.12 * num(input, "socialAbsence"));
  const seekingScore = clamp01(0.28 * num(input, "connectionPull") + 0.2 * num(input, "transitionScore") + 0.18 * num(input, "wordDisclosure") + 0.16 * num(input, "moodIntensity") + 0.1 * num(input, "recoverySignal") + 0.08 * num(input, "positiveValence"));

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
    confidence,
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

function requireAuthUid(auth: {uid?: string} | undefined): string {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Sign in before generating Ancient Signals snapshots.");
  }
  return auth.uid;
}

export const generateAncientSignalsSnapshot = onCall<AncientSignalCallableInput>(async (request) => {
  const ownerUid = requireAuthUid(request.auth);
  const payload = request.data ?? {};
  const input = payload.signals ?? mapRawAncientSignals(payload.rawData ?? {});
  const computed = computeAncientSignalPayload(input);
  const now = admin.firestore.FieldValue.serverTimestamp();

  const doc = await firestore.collection("ancientSignals").add({
    ownerUid,
    userId: ownerUid,
    source: payload.source ?? "live",
    rawData: payload.rawData ?? null,
    input,
    consentBasis: payload.consentBasis ?? {},
    sourceWindow: payload.sourceWindow ?? null,
    ...computed,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id: doc.id,
    ...computed,
  };
});

export const generateAuraAtmosphere = onCall<AncientSignalCallableInput>(async (request) => {
  requireAuthUid(request.auth);
  const payload = request.data ?? {};
  const input = payload.signals ?? mapRawAncientSignals(payload.rawData ?? {});
  const computed = computeAncientSignalPayload(input);

  return {
    preverbalState: computed.preverbalState,
    auraAtmosphere: computed.auraAtmosphere,
    visualState: computed.visualState,
  };
});

export const generatePreverbalInsight = onCall<AncientSignalCallableInput>(async (request) => {
  requireAuthUid(request.auth);
  const payload = request.data ?? {};
  const input = payload.signals ?? mapRawAncientSignals(payload.rawData ?? {});
  const computed = computeAncientSignalPayload(input);

  return {
    preverbalState: computed.preverbalState,
    confidence: computed.confidence,
    narratorHint: computed.narratorHint,
    safetyFlags: computed.safetyFlags,
  };
});

export const rollupAncientSignalsDaily = onCall<{date?: string}>(async (request) => {
  const ownerUid = requireAuthUid(request.auth);
  const date = request.data?.date ?? new Date().toISOString().slice(0, 10);
  const startAt = `${date}T00:00:00.000Z`;
  const endAt = `${date}T23:59:59.999Z`;
  const computed = computeAncientSignalPayload({});

  const doc = await firestore.collection("ancientSignals").add({
    ownerUid,
    userId: ownerUid,
    source: "rollup",
    rawData: null,
    input: {},
    consentBasis: {},
    sourceWindow: {
      startAt,
      endAt,
      durationMinutes: 1440,
    },
    ...computed,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    id: doc.id,
    date,
    ...computed,
  };
});
