
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";

// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const db = admin.firestore();

/**
 * Maps an emotion and intensity to a visual overlay style.
 * This is a placeholder; a real implementation would have more complex logic.
 * @param {string} emotion The detected emotion.
 * @param {number} intensity The intensity of the emotion (0-100).
 * @return {{color: string, style: string}} The visual properties for the overlay.
 */
function mapEmotionToOverlay(emotion: string, intensity: number): { color: string, style: string } {
    const intensityAlpha = 0.5 + (intensity / 100) * 0.5;
    switch (emotion.toLowerCase()) {
        case "joy":
            return { color: `hsla(120, 80%, 60%, ${intensityAlpha})`, style: "glow" };
        case "sadness":
            return { color: `hsla(240, 70%, 50%, ${intensityAlpha})`, style: "fog" };
        case "anger":
            return { color: `hsla(0, 90%, 60%, ${intensityAlpha})`, style: "flicker" };
        case "calm":
            return { color: `hsla(200, 80%, 70%, ${intensityAlpha})`, style: "glow" };
        case "anxiety":
             return { color: `hsla(60, 80%, 50%, ${intensityAlpha})`, style: "flicker" };
        default:
            return { color: `hsla(0, 0%, 80%, ${intensityAlpha})`, style: "glow" };
    }
}


/**
 * Maps an emotion to a representative color.
 * Placeholder function.
 * @param {string} emotion The detected emotion.
 * @return {string} A hex color code.
 */
function mapEmotionToColor(emotion: string): string {
     switch (emotion.toLowerCase()) {
        case "joy": return "#7CFC00";
        case "recovery": return "#32CD32";
        case "sadness": return "#1E90FF";
        case "anger": return "#DC143C";
        default: return "#A9A9A9";
    }
}


// 1. updateAuraState – triggered on new moodLog
export const updateAuraState = functions.firestore
  .document('users/{uid}/moodLogs/{logId}')
  .onCreate(async (snap, ctx) => {
    const { emotion, intensity } = snap.data();
    const { uid } = ctx.params;

    if (!emotion || typeof intensity !== 'number') {
        functions.logger.warn(`Missing emotion or intensity for moodLog ${ctx.params.logId}`);
        return;
    }

    const overlay = mapEmotionToOverlay(emotion, intensity);
    functions.logger.info(`Updating aura for user ${uid} to emotion: ${emotion}`);

    try {
        await db.doc(`users/${uid}/auraStates/current`).set({
            currentEmotion: emotion,
            overlayColor: overlay.color,
            overlayStyle: overlay.style,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
    } catch(error) {
        functions.logger.error(`Failed to update auraState for user ${uid}:`, error);
    }
  });


// 2. emotionOverTimeWatcher – trend detector (hourly)
export const emotionOverTimeWatcher = functions.pubsub
  .schedule('every 60 minutes')
  .onRun(async () => {
    functions.logger.info("Running hourly emotionOverTimeWatcher job.");
    // In a real application, this function would:
    // 1. Query for all users.
    // 2. For each user, query the last hour of `moodLogs`.
    // 3. Aggregate the data to find the dominant emotion and average intensity.
    // 4. Determine the `cycleType` (e.g., 'recovery', 'strain').
    // 5. Write a new document to the `users/{uid}/emotionCycles` subcollection.
    return null;
  });


// 3. triggerBloom – milestone bloom when recovery detected
export const triggerBloom = functions.firestore
  .document('users/{uid}/emotionCycles/{cycleId}')
  .onUpdate(async (change, ctx) => {
    const before = change.before.data();
    const after = change.after.data();
    const { uid } = ctx.params;

    // Check if the cycleType has changed to 'recovery'
    if (before.cycleType !== 'recovery' && after.cycleType === 'recovery') {
        functions.logger.info(`Recovery detected for user ${uid}. Triggering bloom.`);
        try {
            await db.collection(`users/${uid}/memoryBlooms`).add({
                bloomId: uuidv4(),
                emotion: after.dominantEmotion || 'recovery',
                bloomColor: mapEmotionToColor(after.dominantEmotion || 'recovery'),
                triggeredAt: admin.firestore.FieldValue.serverTimestamp(),
                description: 'A moment of positive recovery was detected.'
            });
        } catch (error) {
            functions.logger.error(`Failed to create memoryBloom for user ${uid}:`, error);
        }
    }
  });
