
import { onUserCreated, onUserDeleted } from 'firebase-functions/v2/auth';
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions/v2';

// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * Triggered on new user creation to create a default profile in Firestore.
 */
export const handleUserCreate = onUserCreated(async event => {
  const { uid, email, displayName, photoURL } = event.data;

  try {
    const newUserDoc = {
      displayName: displayName || email?.split('@')[0] || 'Anonymous',
      email: email || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      avatarUrl:
        photoURL ||
        `https://placehold.co/128x128.png?text=${(
          displayName ||
          email ||
          'A'
        )
          .charAt(0)
          .toUpperCase()}`,
      settings: {
        moodTrackingEnabled: true,
        passiveAudioEnabled: true,
        faceEmotionEnabled: false,
        dataExportEnabled: true,
        narratorVolume: 0.8,
        ttsVoice: 'warmCalm',
        receiveWeeklyEmail: true,
        receiveMilestones: true,
        emailTone: 'poetic',
      },
      personaProfile: {},
      symbolLexicon: {},
      subscriptionTier: 'free',
      isProUser: false,
      onboardingComplete: false,
    };

    await db.collection('users').doc(uid).set(newUserDoc);
    logger.info(`Successfully created profile for user: ${uid}`);
  } catch (error) {
    logger.error(`Error creating profile for user ${uid}:`, error);
  }
});

/**
 * Triggered on user deletion to clean up their data.
 */
export const handleUserDelete = onUserDeleted(async event => {
  const { uid } = event.data;
  logger.info(`Starting data cleanup for deleted user: ${uid}`);

  const userDocRef = db.collection('users').doc(uid);

  try {
    // This is a simplified version. A real app would also delete associated
    // data in other collections (voiceEvents, etc.) and in Storage.
    await userDocRef.delete();
    logger.info(
      `Successfully deleted user profile for ${uid}. Further cleanup is required for a production app.`
    );
  } catch (error) {
    logger.error(`Error deleting user profile for ${uid}:`, error);
  }
});
