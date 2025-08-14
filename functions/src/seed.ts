import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();
const uid = 'demo_user_001';

export const runSeed = onRequest({ cors: true }, async (_req, res) => {
  try {
    const batch = db.batch();

    // 1. Create User
    const userRef = db.collection('users').doc(uid);
    batch.set(userRef, { uid: uid, displayName: "Demo User", createdAt: admin.firestore.FieldValue.serverTimestamp() });

    // 2. Add Moods
    for (const mood of [{ mood: "hopeful", score: 7 }, { mood: "stressed", score: 4 }, { mood: "clear", score: 8 }]) {
      const moodRef = db.collection('moods').doc();
      batch.set(moodRef, { ...mood, uid, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    }

    // 3. Add Stars
    for (const star of [{ type: "memoryBloom", title: "First Light" }, { type: "ritual", title: "Tiny Win" }, { type: "insight", title: "Pattern Noticed" }]) {
      const starRef = db.collection('stars').doc();
      batch.set(starRef, { ...star, uid, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    }

    // 4. Add Insight
    const insightRef = db.collection('insights').doc();
    batch.set(insightRef, { uid, kind: "narrator", text: "Welcome back. Your sky is clearing.", createdAt: admin.firestore.FieldValue.serverTimestamp() });

    await batch.commit();
    
    res.status(200).send({ success: true, message: `Seed complete for user ${uid}. 7 docs created.` });

  } catch (error) {
    console.error("Error seeding database:", error);
    res.status(500).send({ success: false, error: (error as Error).message });
  }
});
