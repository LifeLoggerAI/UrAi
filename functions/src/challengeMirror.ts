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

function hasAvoidanceLanguage(text: string) {
  return /later|avoid|can't|cannot|stuck|tired|overwhelmed|tomorrow|not now|doom|scroll/i.test(text);
}

export const getChallengeMirror = functions.https.onCall(async (_data, ctx) => {
  const uid = requireUid(ctx);
  const snapshot = await db
    .collection("events")
    .where("ownerUid", "==", uid)
    .orderBy("createdAt", "desc")
    .limit(40)
    .get();

  const rows = snapshot.docs.map((doc) => doc.data());
  const count = rows.length;
  const moods = rows.map((row) => row.mood).filter((value): value is string => typeof value === "string" && value.length > 0);
  const types = rows.map((row) => row.type).filter((value): value is string => typeof value === "string" && value.length > 0);
  const texts = rows.map((row) => row.text).filter((value): value is string => typeof value === "string");
  const topMood = frequency(moods)[0];
  const topType = frequency(types)[0];
  const avoidanceCount = texts.filter(hasAvoidanceLanguage).length;
  const repeatedMood = topMood && topMood[1] >= Math.max(3, Math.ceil(count * 0.35));
  const repeatedType = topType && topType[1] >= Math.max(3, Math.ceil(count * 0.35));

  let callout = "I do not have enough signal to call you out yet. Give me more traces and I will reflect the pattern clearly.";
  let severity: "soft" | "medium" | "strong" = "soft";

  if (count >= 6 && repeatedMood && repeatedType) {
    severity = avoidanceCount >= 3 ? "strong" : "medium";
    callout = `Callout: you keep returning to a ${topMood[0]} state through ${topType[0]} signals. This may be a loop, not a moment. Do one small opposite action before the next trace.`;
  } else if (count >= 6 && avoidanceCount >= 3) {
    severity = "medium";
    callout = "Callout: your language keeps circling delay or avoidance. The pattern is not lack of ability; it looks like friction before action. Take the smallest visible step now.";
  } else if (count >= 6 && repeatedMood) {
    severity = "soft";
    callout = `Callout: your emotional weather keeps returning to ${topMood[0]}. Do not treat it as random. Ask what keeps feeding it.`;
  }

  const ref = await db.collection("insights").add({
    ownerUid: uid,
    type: "challenge_mirror",
    title: "Challenge Mirror",
    summary: callout,
    severity,
    sampleSize: count,
    createdAt: new Date().toISOString(),
  });

  return {id: ref.id, callout, severity, sampleSize: count};
});
