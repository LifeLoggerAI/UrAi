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

export const getPredictiveMirror = functions.https.onCall(async (_data, ctx) => {
  const uid = requireUid(ctx);
  const snapshot = await db
    .collection("events")
    .where("ownerUid", "==", uid)
    .orderBy("createdAt", "desc")
    .limit(20)
    .get();

  const rows = snapshot.docs.map((doc) => doc.data());
  const moods = rows.map((row) => row.mood).filter((value): value is string => typeof value === "string" && value.length > 0);
  const types = rows.map((row) => row.type).filter((value): value is string => typeof value === "string" && value.length > 0);
  const topMood = frequency(moods)[0];
  const topType = frequency(types)[0];
  const count = rows.length;
  const confidence = count === 0 ? 0 : Math.min(0.88, 0.32 + count * 0.03);
  const likelyMood = topMood?.[0] ?? "unknown";
  const likelyType = topType?.[0] ?? "signal";

  const message = count < 3
    ? "I need a few more signals before I can predict your rhythm. Send two or three more traces and I will begin forecasting."
    : `Prediction: your next signal is most likely to feel ${likelyMood}, and it will probably arrive as a ${likelyType} pattern. Confidence is ${Math.round(confidence * 100)} percent.`;

  const forecastRef = await db.collection("forecasts").add({
    ownerUid: uid,
    likelyMood,
    likelyType,
    confidence,
    sampleSize: count,
    message,
    createdAt: new Date().toISOString(),
  });

  return {
    id: forecastRef.id,
    likelyMood,
    likelyType,
    confidence,
    sampleSize: count,
    message,
  };
});
