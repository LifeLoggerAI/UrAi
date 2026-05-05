import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

function requireUid(ctx: functions.https.CallableContext) {
  const uid = ctx.auth?.uid;
  if (!uid) throw new functions.https.HttpsError("unauthenticated", "Sign in required.");
  return uid;
}

function mostCommon(values: string[]) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

export const getPersonalMirror = functions.https.onCall(async (_data, ctx) => {
  const uid = requireUid(ctx);
  const events = await db
    .collection("events")
    .where("ownerUid", "==", uid)
    .orderBy("createdAt", "desc")
    .limit(12)
    .get();

  const rows = events.docs.map((doc) => doc.data());
  const moods = rows.map((row) => row.mood).filter((mood): mood is string => typeof mood === "string" && mood.length > 0);
  const types = rows.map((row) => row.type).filter((type): type is string => typeof type === "string" && type.length > 0);
  const dominantMood = mostCommon(moods) ?? "unknown";
  const dominantType = mostCommon(types) ?? "signal";
  const count = rows.length;

  const message = count === 0
    ? "I do not know your pattern yet. Send one signal, and I will start building your mirror."
    : `I am starting to recognize you: your recent pattern leans ${dominantMood}, and most signals are ${dominantType}. I have ${count} recent trace${count === 1 ? "" : "s"} to compare against.`;

  return {
    count,
    dominantMood,
    dominantType,
    message,
  };
});
