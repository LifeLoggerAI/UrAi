import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentUpdated, onDocumentDeleted, onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { QueryDocumentSnapshot, DocumentSnapshot, Change, FirestoreEvent } from 'firebase-functions/v2/firestore';

// Initialize Admin SDK
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Deletes a user's data from Firestore upon account deletion.
 * Triggered by the deletion of a user document in 'users' collection.
 */
export const onDeleteUserData = onDocumentDeleted('users/{uid}', async (event) => {
  const uid = event.params.uid;
  logger.info(`User ${uid} deleted. Cleaning up associated data.`);

  const collectionsToDelete = [
    'moods',
    'insights',
    'rituals',
    'starMapEvents',
    'dreams',
    'shadowPatterns',
    'companionState',
    'relationships',
    'ritualSuggestions',
    'voiceEvents',
    'audioEvents',
    'memoryBlooms',
    'innerVoiceReflections',
    'weeklyScrolls',
    'onboardIntakes',
    'personaProfiles',
    'auraStates',
    'narrativeLoops',
    'rebirthMoments',
    'thresholdMoments',
  ];

  for (const collectionName of collectionsToDelete) {
    const querySnapshot = await db.collection(collectionName).where('uid', '==', uid).get();
    const batch = db.batch();
    querySnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    logger.info(`Deleted ${querySnapshot.size} documents from ${collectionName} for user ${uid}.`);
  }

  // Specifically delete the user's subcollection 'users/{uid}/settings'
  const userSettingsRef = db.collection('users').doc(uid).collection('settings');
  const userSettingsSnapshot = await userSettingsRef.get();
  if (!userSettingsSnapshot.empty) {
    const batch = db.batch();
    userSettingsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    logger.info(`Deleted user settings for user ${uid}.`);
  }

  logger.info(`Data cleanup complete for user ${uid}.`);
});

/**
 * Callable function for users to request data deletion. This function
 * initiates the data deletion process by setting a flag on the user document.
 * Actual data deletion is handled by the `onDeleteUserData` trigger.
 */
export const requestDataDeletion = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required.');
  }
  const uid = request.auth.uid;
  logger.info(`User ${uid} requested data deletion.`);

  // Set a flag on the user document. The actual deletion is handled by a separate trigger.
  await db.collection('users').doc(uid).update({
    dataDeletionRequested: true,
    dataDeletionTimestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { status: 'pending', message: 'Data deletion request received. Processing will begin shortly.' };
});

/**
 * Triggered when a user's dataConsent settings change.
 */
export const cleanupOptOut = onDocumentUpdated(
  'users/{uid}',
  async (event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined, {uid: string}>) => {
    const data = event.data;
    const uid = event.params.uid; // Get uid from event.params

    if (!data) {
      logger.log(`No data for user ${uid}`);
      return;
    }

    const before = data.before.data();
    const after = data.after.data();

    const hasOptedOutBefore = before?.settings?.dataExportEnabled === false;
    const hasOptedOutAfter = after?.settings?.dataExportEnabled === false;

    if (!hasOptedOutBefore && hasOptedOutAfter) {
      logger.info(`User ${uid} has opted out of data export. Initiating data cleanup.`);

      const collectionsToClean = [
        'voiceEvents',
        'cameraCaptures',
        // Add other collections that contain user data for export
      ];

      for (const collectionName of collectionsToClean) {
        const querySnapshot = await db.collection(collectionName).where('uid', '==', uid).get();
        const batch = db.batch();
        querySnapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        logger.info(`Deleted ${querySnapshot.size} documents from ${collectionName} for user ${uid} due to opt-out.`);
      }
      logger.info(`Data cleanup due to opt-out complete for user ${uid}.`);
    } else if (hasOptedOutBefore && !hasOptedOutAfter) {
      logger.info(`User ${uid} has opted back in to data export. No action required.`);
    }
    return;
  }
);
