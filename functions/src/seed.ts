
import * as admin from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

async function seed() {
  const uid = "demo_user_001";
  const batch = db.batch();
  
  const appConfigRef = db.collection("appConfig").doc("public");
  batch.set(appConfigRef, {
    appName: "UrAi",
    version: "neural-map-v1",
    safePublicFlags: { allowDemo: true }
  }, { merge: true });

  const now = admin.firestore.Timestamp.now();
  
  const moodsRef = db.collection("moods").doc();
  batch.set(moodsRef, { uid, ts: now, val: 12, sources: ["seed"] });
  
  const insightsRef = db.collection("insights").doc();
  batch.set(insightsRef, {
    uid,
    ts: now,
    type: "mood_shift",
    text: "Energy ticked up after social call.",
    confidence: 0.62
  });
  
  const voiceEventsRef = db.collection("voiceEvents").doc();
  batch.set(voiceEventsRef, { uid, startedAt: now, durationMs: 42000, tags: ["friend", "evening"] });
  
  const ritualsRef = db.collection("rituals").doc();
  batch.set(ritualsRef, { uid, title: "Evening reset walk", scheduledAt: now, status: "planned" });
  
  const dreamsRef = db.collection("dreams").doc();
  batch.set(dreamsRef, { uid, ts: now, content: "Walking through a bright forest with soft wind." });
  
  const companionStateRef = db.collection("companionState").doc(uid);
  batch.set(companionStateRef, { uid, mood: "calm", archetype: "Guide", lastUpdated: now });

  await batch.commit();
  console.log("Seed complete for user: " + uid);
}

seed().then(() => {
    console.log("Seed script finished successfully.");
    process.exit(0);
}).catch(err => {
    console.error("Error running seed script:", err);
    process.exit(1);
});
