import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const onRecoveryDetected = onDocumentWritten('moodForecasts/{id}', async (event) => {
  const data = event.data?.after?.data();
  if (!data || !data.userId) return;

  const userId = data.userId;

  // Simple recovery logic: trend turns positive after previous crisis
  const crisisDoc = await db.collection('crisisState').doc(userId).get();
  const inCrisis = crisisDoc.exists && crisisDoc.data()?.isInCrisis === true;

  if (inCrisis && data.trend === 'improving') {
    const bloom = {
      userId,
      triggerEventId: event.params.id,
      bloomColor: 'lavender-glow',
      auraVisual: 'rising-petals',
      recoveryDuration: 7, // placeholder
      moodBefore: 'grief',
      moodAfter: data.dailyMood,
      createdAt: new Date().toISOString(),
    };

    await db.collection('recoveryBlooms').add(bloom);
    await db.collection('crisisState').doc(userId).set({ isInCrisis: false }, { merge: true });

    console.log(`🌸 Recovery bloom detected for ${userId}`);
  }
});
