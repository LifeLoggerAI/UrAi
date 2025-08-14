import { onRequest } from 'firebase-functions/v2/https';
import admin from 'firebase-admin';
if (!admin.apps.length) admin.initializeApp();

export const runSeed = onRequest(async (_req, res) => {
  const db = admin.firestore();
  const uid = 'demo_user_001';
  await db.collection('users').doc(uid).set({
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    displayName: 'Demo User',
  });
  await db.collection('moods').doc().set({
    userId: uid,
    mood: 'calm',
    at: admin.firestore.FieldValue.serverTimestamp(),
  });
  res.status(200).send('Seed complete');
});