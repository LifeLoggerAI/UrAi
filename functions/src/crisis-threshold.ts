import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

// Declare global type for admin app flag
declare global {
  var ADMIN_APP_INITIALIZED: boolean | undefined;
}

// Initialize admin SDK if not already initialized
if (!global.ADMIN_APP_INITIALIZED) {
  initializeApp();
  global.ADMIN_APP_INITIALIZED = true;
}
const db = getFirestore();

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