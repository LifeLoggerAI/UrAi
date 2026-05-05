import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

export const ingestEvent = functions.https.onCall(async (data, ctx) => {
  const uid = ctx.auth?.uid;
  if (!uid) throw new Error("Unauthorized");

  const doc = await db.collection("events").add({
    ...data,
    ownerUid: uid,
    createdAt: new Date().toISOString(),
  });

  return { id: doc.id };
});

export const enrichEvent = functions.firestore
  .document("events/{id}")
  .onCreate(async (snap) => {
    const data = snap.data();

    await db.collection("eventEnrichments").add({
      eventId: snap.id,
      tags: ["auto"],
      createdAt: new Date().toISOString(),
    });
  });

export const generateDailyInsights = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async () => {
    const snapshot = await db.collection("events").limit(100).get();

    await db.collection("insights").add({
      type: "daily_summary",
      count: snapshot.size,
      createdAt: new Date().toISOString(),
    });
  });
