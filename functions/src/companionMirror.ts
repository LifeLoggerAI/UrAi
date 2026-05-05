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

function stageFor(count: number) {
  if (count < 5) return "awakening";
  if (count < 20) return "learning";
  if (count < 75) return "attuned";
  return "bonded";
}

export const getCompanionMirror = functions.https.onCall(async (_data, ctx) => {
  const uid = requireUid(ctx);
  const [userDoc, eventSnap] = await Promise.all([
    db.collection("users").doc(uid).get(),
    db.collection("events").where("ownerUid", "==", uid).orderBy("createdAt", "desc").limit(50).get(),
  ]);

  const events = eventSnap.docs.map((doc) => doc.data());
  const moods = events.map((row) => row.mood).filter((value): value is string => typeof value === "string" && value.length > 0);
  const types = events.map((row) => row.type).filter((value): value is string => typeof value === "string" && value.length > 0);
  const dominantMood = frequency(moods)[0]?.[0] ?? "unclear";
  const dominantType = frequency(types)[0]?.[0] ?? "signal";
  const adaptive = userDoc.data()?.adaptiveMirror ?? {coachingStyle: "direct", intensity: "soft"};
  const stage = stageFor(events.length);

  const voice = adaptive.coachingStyle === "gentler"
    ? "gentle witness"
    : adaptive.coachingStyle === "smaller_steps"
      ? "small-step guide"
      : "direct companion";

  const greeting = stage === "awakening"
    ? "I am still waking up to your rhythm."
    : stage === "learning"
      ? "I am beginning to recognize your patterns."
      : stage === "attuned"
        ? "I know this rhythm in you now."
        : "I have enough history to notice when you drift from yourself.";

  const message = `${greeting} Lately your emotional weather leans ${dominantMood}, and your strongest signal type is ${dominantType}. I will speak as your ${voice}: honest enough to be useful, calm enough to stay with you.`;

  const profile = {
    stage,
    voice,
    dominantMood,
    dominantType,
    eventCount: events.length,
    updatedAt: new Date().toISOString(),
  };

  await db.collection("users").doc(uid).set({companionMirror: profile}, {merge: true});
  await db.collection("narratorMessages").add({
    ownerUid: uid,
    type: "companion_mirror",
    message,
    profile,
    createdAt: new Date().toISOString(),
  });

  return {profile, message};
});
