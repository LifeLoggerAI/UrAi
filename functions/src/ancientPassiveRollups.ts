export interface PassiveRollupOptions {
  ownerUid: string;
  startAt: string;
  endAt: string;
  limitPerCollection?: number;
}

export interface PassiveRollupResult {
  input: Record<string, number>;
  rawData: Record<string, unknown>;
  sourceCollections: string[];
  sourceWindow: {
    startAt: string;
    endAt: string;
    durationMinutes: number;
  };
}

type FieldMapping = {
  output: string;
  fields: string[];
};

type CollectionMapping = {
  collection: string;
  timestampFields: string[];
  fields: FieldMapping[];
};

const COLLECTION_MAPPINGS: CollectionMapping[] = [
  {
    collection: "moods",
    timestampFields: ["createdAt", "timestamp", "date"],
    fields: [
      {output: "positiveValence", fields: ["moodScore", "positiveValence", "valence", "score"]},
      {output: "moodIntensity", fields: ["moodIntensity", "emotionIntensity", "intensity"]},
      {output: "mentalLoadScore", fields: ["stressScore", "stressLoad", "mentalLoadScore"]},
    ],
  },
  {
    collection: "moodForecasts",
    timestampFields: ["generatedAt", "createdAt", "timestamp", "date"],
    fields: [
      {output: "positiveValence", fields: ["moodScore", "positiveValence", "valence"]},
      {output: "mentalLoadScore", fields: ["stressScore", "stressLoad", "pressure", "mentalLoadScore"]},
      {output: "recoverySignal", fields: ["recoverySignal", "recoveryScore", "recoveryPulseScore"]},
    ],
  },
  {
    collection: "shadowMetrics",
    timestampFields: ["createdAt", "timestamp", "date"],
    fields: [
      {output: "shadowScore", fields: ["shadowScore", "shadowStress", "stressScore", "load"]},
      {output: "mentalLoadScore", fields: ["mentalLoadScore", "stressLoad", "pressure"]},
      {output: "nocturnalDrift", fields: ["lateNightUseScore", "bedtimeScrolling", "nocturnalDrift"]},
    ],
  },
  {
    collection: "obscuraPatterns",
    timestampFields: ["createdAt", "timestamp", "date"],
    fields: [
      {output: "obscuraScore", fields: ["obscuraScore", "fatigueScore", "patternFatigue"]},
      {output: "frictionTapScore", fields: ["frictionTapScore", "frictionTaps", "tapFriction"]},
      {output: "hesitationScore", fields: ["hesitationScore", "hesitation", "microHesitation"]},
      {output: "cancelLoopScore", fields: ["cancelLoopScore", "cancelLoops", "microCancel"]},
      {output: "scrollVelocityScore", fields: ["scrollVelocityScore", "scrollVelocity", "doomscrollScore"]},
      {output: "motionJitter", fields: ["motionJitter", "motionJitterScore", "deviceMotionAnxiety"]},
      {output: "stagnationScore", fields: ["stagnationScore", "stillnessScore", "idleStillness"]},
    ],
  },
  {
    collection: "passiveSignals",
    timestampFields: ["observedAt", "createdAt", "timestamp", "date"],
    fields: [
      {output: "mentalLoadScore", fields: ["mentalLoadScore", "score", "load", "stressLoad"]},
      {output: "notificationFriction", fields: ["notificationFriction", "notificationFrictionScore"]},
      {output: "chronoCompression", fields: ["timeCompressionScore", "chronoCompression"]},
      {output: "motionJitter", fields: ["motionJitter", "motionJitterScore"]},
      {output: "stagnationScore", fields: ["stagnationScore", "stillnessScore"]},
    ],
  },
  {
    collection: "chronoMirrorSnapshots",
    timestampFields: ["createdAt", "timestamp", "date"],
    fields: [
      {output: "chronoCompression", fields: ["timeCompressionScore", "chronoCompression"]},
      {output: "chronoDilation", fields: ["timeDilationScore", "chronoDilation"]},
      {output: "wordDisclosure", fields: ["timeToMeaning", "realityDensity", "memoryDensity"]},
    ],
  },
  {
    collection: "relationshipSignals",
    timestampFields: ["observedAt", "createdAt", "timestamp", "date"],
    fields: [
      {output: "socialAbsence", fields: ["socialAbsence", "socialGapScore", "absenceWeight", "isolationDrift"]},
      {output: "connectionPull", fields: ["connectionPull", "connectionScore", "socialConnection"]},
      {output: "conflictResidue", fields: ["conflictResidue", "conflictScore", "relationalTension"]},
    ],
  },
  {
    collection: "events",
    timestampFields: ["createdAt", "timestamp", "date"],
    fields: [
      {output: "voiceTension", fields: ["voiceTension", "prosodyTension", "toneTension"]},
      {output: "pauseDensity", fields: ["pauseDensity", "pauseScore"]},
      {output: "speechCompression", fields: ["speechCompression", "speechRateScore"]},
      {output: "silenceWeight", fields: ["silenceWeight", "silenceScore"]},
      {output: "recoverySignal", fields: ["recoverySignal", "recoveryScore"]},
    ],
  },
  {
    collection: "recoveryBlooms",
    timestampFields: ["createdAt", "timestamp", "date"],
    fields: [
      {output: "recoverySignal", fields: ["recoverySignal", "recoveryScore", "bloomScore", "score"]},
      {output: "positiveValence", fields: ["positiveValence", "moodScore", "warmth"]},
    ],
  },
];

const clamp01 = (value = 0) => Math.max(0, Math.min(1, value));
const avg = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

function normalizeScore(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (value > 1) return clamp01(value / 100);
  return clamp01(value);
}

function getMappedValue(data: FirebaseFirestore.DocumentData, mapping: FieldMapping): number | null {
  const values = mapping.fields
    .map((field) => normalizeScore(data[field]))
    .filter((value): value is number => typeof value === "number");
  return values.length ? avg(values) : null;
}

async function queryCollectionWindow(
  firestore: FirebaseFirestore.Firestore,
  ownerUid: string,
  mapping: CollectionMapping,
  startAt: string,
  endAt: string,
  limitPerCollection: number,
) {
  for (const timestampField of mapping.timestampFields) {
    try {
      const snapshot = await firestore.collection(mapping.collection)
        .where("ownerUid", "==", ownerUid)
        .where(timestampField, ">=", startAt)
        .where(timestampField, "<=", endAt)
        .limit(limitPerCollection)
        .get();

      if (!snapshot.empty) return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
      console.warn(`Ancient Signals passive rollup skipped ${mapping.collection}.${timestampField}`, error);
    }
  }

  try {
    const snapshot = await firestore.collection(mapping.collection)
      .where("ownerUid", "==", ownerUid)
      .limit(limitPerCollection)
      .get();
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.warn(`Ancient Signals passive rollup skipped ${mapping.collection}`, error);
    return [];
  }
}

export async function buildAncientSignalsFromPassiveRollups(
  firestore: FirebaseFirestore.Firestore,
  options: PassiveRollupOptions,
): Promise<PassiveRollupResult> {
  const limitPerCollection = options.limitPerCollection ?? 25;
  const buckets: Record<string, number[]> = {};
  const sourceCollections: string[] = [];
  const sourceCounts: Record<string, number> = {};

  for (const mapping of COLLECTION_MAPPINGS) {
    const docs = await queryCollectionWindow(firestore, options.ownerUid, mapping, options.startAt, options.endAt, limitPerCollection);
    if (!docs.length) continue;
    sourceCollections.push(mapping.collection);
    sourceCounts[mapping.collection] = docs.length;

    for (const doc of docs) {
      for (const fieldMapping of mapping.fields) {
        const value = getMappedValue(doc, fieldMapping);
        if (value == null) continue;
        buckets[fieldMapping.output] = buckets[fieldMapping.output] ?? [];
        buckets[fieldMapping.output].push(value);
      }
    }
  }

  const input = Object.fromEntries(Object.entries(buckets).map(([key, values]) => [key, avg(values)]));
  const durationMinutes = Math.max(1, Math.round((new Date(options.endAt).getTime() - new Date(options.startAt).getTime()) / 60000));

  return {
    input,
    rawData: {passiveRollup: true, sourceCounts, sourceCollections},
    sourceCollections,
    sourceWindow: {startAt: options.startAt, endAt: options.endAt, durationMinutes},
  };
}
