
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const db = admin.firestore();

/**
 * Ingests a batch of passive sensor data.
 * This is a placeholder for a complex data ingestion pipeline.
 */
export const ingestPassiveSensors = functions.https.onCall(async (data, context) => {
    // In a real app, data would be a batch of sensor readings.
    // {motion[], micSentiment[], appUse[], ambientAudio[]}
    const uid = context.auth?.uid;
    if (!uid) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
    }
    
    functions.logger.info(`Ingesting passive sensor data for user ${uid}.`);
    // Logic to write to /torsoMetrics and /habitEvents
    // ...
    
    return { success: true };
});


/**
 * Calculates value alignment score.
 * Triggered when torsoMetrics are updated. Placeholder.
 */
export const calcValueAlignment = functions.firestore
  .document('torsoMetrics/{uid}/{dateKey}')
  .onWrite(async (change, context) => {
    functions.logger.info(`Calculating value alignment for user ${context.params.uid}.`);
    // Logic to call OpenAI 'valueAlignment' function and update score.
    return null;
  });


/**
 * Detects self-conflict or fragmentation.
 * Triggered when torsoMetrics are updated. Placeholder.
 */
export const detectSelfConflict = functions.firestore
  .document('torsoMetrics/{uid}/{dateKey}')
  .onWrite(async (change, context) => {
    const data = change.after.data();
    if (data?.selfConsistencyScore < 40) {
        functions.logger.info(`Self-conflict detected for user ${context.params.uid}.`);
        // Logic to create narratorInsights and push a notification.
    }
    return null;
  });


/**
 * Checks Pro tier limits.
 * Triggered on new torsoMetrics. Placeholder.
 */
export const checkProLimits = functions.firestore
  .document('torsoMetrics/{uid}/{dateKey}')
  .onCreate(async (snap, context) => {
      const userRef = db.doc(`users/${context.params.uid}`);
      const userSnap = await userRef.get();
      const userData = userSnap.data();

      if (userData && !userData.isProUser) {
          functions.logger.info(`Checking pro limits for free user ${context.params.uid}.`);
          // Logic to check if metrics > 7 days old and delete oldest.
          // Logic to enqueue an upsell notification.
      }
      return null;
  });

    