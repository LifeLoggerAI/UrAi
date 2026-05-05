import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

function requireUid(ctx: functions.https.CallableContext) {
  const uid = ctx.auth?.uid;
  if (!uid) throw new functions.https.HttpsError("unauthenticated", "Sign in required.");
  return uid;
}

function frequency(values: string[]) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
}

function hourBand(value: unknown) {
  if (typeof value !== "string") return "unknown time";
  const hour = new Date(value).getHours();
  if (Number.isNaN(hour)) return "unknown time";
  if (hour < 6) return "late-night";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export const getPredictiveMirror = functions.https.onCall(async (_data, ctx) => {
  const uid = requireUid(ctx);
  const snapshot = await db
    .collection("events")
    .where("ownerUid", "==", uid)
    .orderBy("createdAt", "desc")
    .limit(40)
    .get();

  const rows = snapshot.docs.map((doc) => doc.data());
  const moods = rows.map((row) => row.mood).filter((value): value is string => typeof value === "string" && value.length > 0);
  const types = rows.map((row) => row.type).filter((value): value is string => typeof value === "string" && value.length > 0);
  const bands = rows.map((row) => hourBand(row.createdAt));
  const topMood = frequency(moods)[0];
  const topType = frequency(types)[0];
  const topBand = frequency(bands)[0];
  const count = rows.length;

  const latestType = typeof rows[0]?.type === "string" ? rows[0].type : null;
  const afterLatest = latestType
    ? rows.slice(1).filter((row, index, all) => all[index - 1]?.type === latestType).map((row) => row.type).filter((value): value is string => typeof value === "string")
    : [];
  const sequenceNext = frequency(afterLatest)[0]?.[0] ?? null;

  const likelyMood = topMood?.[0] ?? "unknown";
  const likelyType = sequenceNext ?? topType?.[0] ?? "signal";
  const rhythm = topBand?.[0] ?? "unknown time";
  const mismatch = topMood && topType && topMood[1] <= Math.ceil(count * 0.25) ? "Your signals are scattered right now; I would not trust a strong mood prediction yet." : null;
  const confidence = count === 0 ? 0 : Math.min(0.92, 0.34 + count * 0.025 + (sequenceNext ? 0.12 : 0));

  const message = count < 5
    ? "I need a few more signals before I can forecast with texture. Add five traces and I will start detecting sequence and timing rhythms."
    : `Eerie forecast: after patterns like your last one, you tend to move toward ${likelyType}. Your recent emotional weather leans ${likelyMood}, most often around ${rhythm}. Confidence is ${Math.round(confidence * 100)} percent.${mismatch ? " " + mismatch : ""}`;

  const forecastRef = await db.collection("forecasts").add({
    ownerUid: uid,
    likelyMood,
    likelyType,
    rhythm,
    sequenceNext,
    confidence,
    sampleSize: count,
    message,
    createdAt: new Date().toISOString(),
  });

  return {
    id: forecastRef.id,
    likelyMood,
    likelyType,
    rhythm,
    sequenceNext,
    confidence,
    sampleSize: count,
    message,
  };
});
