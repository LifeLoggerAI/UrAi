import * as admin from "firebase-admin";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {buildAncientSignalsFromPassiveRollups} from "./ancientPassiveRollups";

if (!admin.apps.length) {
  admin.initializeApp();
}

const firestore = admin.firestore();

const clamp01 = (value = 0) => Math.max(0, Math.min(1, value));
const avg = (...values: number[]) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

function num(input: Record<string, unknown>, key: string): number {
  const value = input[key];
  return typeof value === "number" && Number.isFinite(value) ? clamp01(value) : 0;
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

function previousUtcDate() {
  const date = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return date.toISOString().slice(0, 10);
}

function dayWindow(date: string) {
  return {
    startAt: `${date}T00:00:00.000Z`,
    endAt: `${date}T23:59:59.999Z`,
  };
}

function userAllowsAncientSignals(userData: FirebaseFirestore.DocumentData) {
  if (userData?.featureFlags?.ancientSignals?.enabled === false) return false;
  if (userData?.featureFlags?.["ancientSignals.enabled"] === false) return false;
  if (userData?.consents?.healthWellnessInsights === false) return false;
  return true;
}

async function hasExistingDailyRollup(ownerUid: string, date: string) {
  const existing = await firestore.collection("ancientSignals")
    .where("ownerUid", "==", ownerUid)
    .where("source", "==", "scheduled_rollup")
    .where("rollupDate", "==", date)
    .limit(1)
    .get();
  return !existing.empty;
}

async function writeScheduledAncientSignalRollup(ownerUid: string, date: string) {
  const window = dayWindow(date);
  const rollup = await buildAncientSignalsFromPassiveRollups(firestore, {
    ownerUid,
    startAt: window.startAt,
    endAt: window.endAt,
    limitPerCollection: 25,
  });

  if (!Object.keys(rollup.input).length) {
    return {ownerUid, status: "skipped_empty" as const};
  }

  const computed = computeAncientSignalPayload(rollup.input);
  const now = admin.firestore.FieldValue.serverTimestamp();
  const doc = await firestore.collection("ancientSignals").add({
    ownerUid,
    userId: ownerUid,
    source: "scheduled_rollup",
    rollupDate: date,
    rawData: rollup.rawData,
    input: rollup.input,
    consentBasis: {
      healthWellnessInsights: true,
    },
    sourceWindow: rollup.sourceWindow,
    ...computed,
    createdAt: now,
    updatedAt: now,
  });

  return {
    ownerUid,
    status: "created" as const,
    id: doc.id,
    sourceCollections: rollup.sourceCollections,
  };
}

export const scheduledAncientSignalsDailyRollup = onSchedule(
  {
    schedule: "every day 03:30",
    timeZone: "Etc/UTC",
    maxInstances: 1,
  },
  async () => {
    const date = previousUtcDate();
    const users = await firestore.collection("users").limit(500).get();
    const results: Array<Record<string, unknown>> = [];

    for (const user of users.docs) {
      if (!userAllowsAncientSignals(user.data())) {
        results.push({ownerUid: user.id, status: "skipped_consent_or_feature_flag"});
        continue;
      }

      if (await hasExistingDailyRollup(user.id, date)) {
        results.push({ownerUid: user.id, status: "skipped_existing"});
        continue;
      }

      try {
        results.push(await writeScheduledAncientSignalRollup(user.id, date));
      } catch (error) {
        console.error("Scheduled Ancient Signals rollup failed", user.id, error);
        results.push({ownerUid: user.id, status: "failed"});
      }
    }

    console.log("scheduledAncientSignalsDailyRollup", {
      date,
      totalUsers: users.size,
      created: results.filter((result) => result.status === "created").length,
      skipped: results.filter((result) => String(result.status).startsWith("skipped")).length,
      failed: results.filter((result) => result.status === "failed").length,
    });
  }
);
