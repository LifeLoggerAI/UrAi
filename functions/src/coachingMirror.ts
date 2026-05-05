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

export const getCoachingMirror = functions.https.onCall(async (_data, ctx) => {
  const uid = requireUid(ctx);
  const snapshot = await db
    .collection("events")
    .where("ownerUid", "==", uid)
    .orderBy("createdAt", "desc")
    .limit(30)
    .get();

  const rows = snapshot.docs.map((doc) => doc.data());
  const moods = rows.map((row) => row.mood).filter((value): value is string => typeof value === "string" && value.length > 0);
  const types = rows.map((row) => row.type).filter((value): value is string => typeof value === "string" && value.length > 0);
  const topMood = frequency(moods)[0]?.[0] ?? "unclear";
  const topType = frequency(types)[0]?.[0] ?? "signal";
  const count = rows.length;

  let title = "First step";
  let action = "Send one honest signal. URAI needs a starting trace before it can coach your rhythm.";
  let reason = "There is not enough history yet to recommend a pattern-specific action.";
  let minutes = 2;

  if (count >= 5) {
    title = "Small opposite action";
    action = `For the next ${topType} loop, take one action that interrupts the ${topMood} pattern before logging anything else.`;
    reason = `Your recent traces lean ${topMood} and repeatedly appear through ${topType}. Coaching works best by changing the next tiny behavior, not the entire life pattern.`;
    minutes = 5;
  }

  const ref = await db.collection("insights").add({
    ownerUid: uid,
    type: "coaching_mirror",
    title,
    summary: action,
    reason,
    minutes,
    sampleSize: count,
    createdAt: new Date().toISOString(),
  });

  return {id: ref.id, title, action, reason, minutes, sampleSize: count};
});
