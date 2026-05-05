import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

type FeedbackValue = "accepted" | "skipped" | "too_intense" | "helpful";

function requireUid(ctx: functions.https.CallableContext) {
  const uid = ctx.auth?.uid;
  if (!uid) throw new functions.https.HttpsError("unauthenticated", "Sign in required.");
  return uid;
}

export const recordCoachFeedback = functions.https.onCall(async (data, ctx) => {
  const uid = requireUid(ctx);
  const value = data?.value as FeedbackValue | undefined;
  if (!value || !["accepted", "skipped", "too_intense", "helpful"].includes(value)) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid feedback value.");
  }

  const createdAt = new Date().toISOString();
  await db.collection("coachFeedback").add({
    ownerUid: uid,
    value,
    coachingId: typeof data?.coachingId === "string" ? data.coachingId : null,
    createdAt,
  });

  const recent = await db
    .collection("coachFeedback")
    .where("ownerUid", "==", uid)
    .orderBy("createdAt", "desc")
    .limit(25)
    .get();

  let helpful = 0;
  let skipped = 0;
  let tooIntense = 0;
  recent.docs.forEach((doc) => {
    const v = doc.data().value;
    if (v === "accepted" || v === "helpful") helpful += 1;
    if (v === "skipped") skipped += 1;
    if (v === "too_intense") tooIntense += 1;
  });

  const coachingStyle = tooIntense >= 2 ? "gentler" : helpful >= skipped ? "direct" : "smaller_steps";
  const intensity = tooIntense >= 2 ? "low" : helpful >= 4 ? "medium" : "soft";

  await db.collection("users").doc(uid).set({
    adaptiveMirror: {
      coachingStyle,
      intensity,
      helpful,
      skipped,
      tooIntense,
      updatedAt: createdAt,
    },
  }, {merge: true});

  return {coachingStyle, intensity, helpful, skipped, tooIntense};
});

export const getAdaptiveMirror = functions.https.onCall(async (_data, ctx) => {
  const uid = requireUid(ctx);
  const doc = await db.collection("users").doc(uid).get();
  const adaptive = doc.data()?.adaptiveMirror ?? {
    coachingStyle: "direct",
    intensity: "soft",
    helpful: 0,
    skipped: 0,
    tooIntense: 0,
  };

  return {adaptive};
});
