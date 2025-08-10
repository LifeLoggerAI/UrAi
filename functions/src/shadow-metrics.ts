import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const updateShadowMetrics = onDocumentWritten('voiceEvents/{id}', async (event) => {
  const data = event.data?.after?.data();
  if (!data) return;

  const userId = data.userId;
  const userRef = db.collection('shadowMetrics').doc(userId);
  const metricsDoc = await userRef.get();

  let current = metricsDoc.exists ? metricsDoc.data() : {
    frictionTaps: 0,
    cancelBehaviorCount: 0,
    bedtimeScrollMinutes: 0,
    entropyLevel: 0,
    lastSeenGhostedEvent: '',
  };

  // Example signal updates
  if (data.cancelled === true) {
    current.cancelBehaviorCount += 1;
  }

  if (data.timestamp && isLateNight(data.timestamp)) {
    current.bedtimeScrollMinutes += 3;
  }

  // Entropy score formula (customize)
  const entropyScore = Math.min(
    (current.cancelBehaviorCount * 0.1) +
    (current.frictionTaps * 0.05) +
    (current.bedtimeScrollMinutes * 0.02),
    1
  );

  await userRef.set({
    ...current,
    entropyLevel: entropyScore,
    lastUpdated: new Date().toISOString(),
  }, { merge: true });
});

// Helper
function isLateNight(timestamp: string) {
  const hour = new Date(timestamp).getHours();
  return hour >= 22 || hour <= 4;
}
