import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const onCrisisThresholdCrossed = onDocumentWritten('shadowMetrics/{userId}', async (event) => {
  const newData = event.data?.after?.data();
  const userId = event.params.userId;
  if (!newData || !userId) return;

  const { entropyLevel, cancelBehaviorCount } = newData;

  // Threshold logic (adjust as needed)
  const score = (entropyLevel * 0.6) + (cancelBehaviorCount * 0.05);
  const crossed = score > 0.75;

  const crisisRef = db.collection('crisisState').doc(userId);

  if (crossed) {
    await crisisRef.set({
      userId,
      isInCrisis: true,
      triggeredAt: new Date().toISOString(),
      triggerReason: 'High entropy + cancel behavior',
      score,
      suggestedRitual: 'Rebirth',
    });
    console.log(`⚠️ Crisis triggered for ${userId}`);
  } else {
    await crisisRef.set({
      userId,
      isInCrisis: false,
      triggeredAt: new Date().toISOString(),
      triggerReason: 'Stable',
      score,
    });
  }
});
