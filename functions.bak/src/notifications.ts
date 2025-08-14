
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions/v2';
import type { FirestoreEvent, DocumentSnapshot } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}

/**
 * Processes messages added to the notification queue.
 * This is a placeholder; a real implementation would connect to a push notification service.
 */
export const processNotificationQueue = onDocumentCreated(
  'messages/queue/{messageId}',
  async (event: FirestoreEvent<DocumentSnapshot | undefined, {messageId: string}>) => {
    const message = event.data?.data();
    if (!message) {
        logger.error(`Notification queue message ${event.params.messageId} has no data.`);
        return;
    }
    const { uid, type, body } = message;

    if (!uid || !body) {
      logger.error(
        `Notification queue message ${event.params.messageId} is missing uid or body.`
      );
      return;
    }

    logger.info(
      `Processing notification for user ${uid} of type ${type}: "${body}"`
    );

    // In a real application, you would add logic here to:
    // 1. Get the user's push notification token from Firestore (`users/{uid}/fcmTokens/`).
    // 2. Use the Firebase Admin SDK to send a push notification.
    // e.g., await admin.messaging().sendToDevice(token, payload);
    // 3. Potentially trigger a TTS narration via the Companion Orb in-app.

    // For now, we just log that it would be sent.
    logger.info(
      `Notification for ${uid} processed. In a real app, this would be sent to their device.`
    );

    // Clean up the processed message from the queue.
    return event.data?.ref.delete();
  }
);
