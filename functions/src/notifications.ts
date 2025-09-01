import { onCall, onDocumentCreated } from "firebase-functions/v2";
import { logger } from "firebase-functions/v2";
import * as admin from "firebase-admin";
import { defineString } from "firebase-functions/params";

// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

// FCM server key for push notifications
const fcmServerKey = defineString("FCM_SERVER_KEY");

interface NotificationData {
  uid: string;
  title: string;
  body: string;
  type: 'companion' | 'insight' | 'milestone' | 'reminder' | 'social' | 'system';
  data?: Record<string, any>;
  scheduleFor?: number; // Unix timestamp
}

/**
 * V6 Foundation: Send notification to user
 */
export const sendNotification = onCall(async (request) => {
  const { auth, data } = request;
  
  if (!auth) {
    throw new Error("Authentication required");
  }

  const notificationData: NotificationData = {
    uid: data.uid || auth.uid,
    title: data.title,
    body: data.body,
    type: data.type || 'system',
    data: data.data || {},
    scheduleFor: data.scheduleFor,
  };

  if (!notificationData.title || !notificationData.body) {
    throw new Error("Title and body are required");
  }

  try {
    // Store notification in Firestore
    const notificationRef = db.collection(`notifications/${notificationData.uid}/items`);
    const notification = {
      ...notificationData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
      sent: false,
    };

    const docRef = await notificationRef.add(notification);

    // If not scheduled for later, send immediately
    if (!notificationData.scheduleFor || notificationData.scheduleFor <= Date.now()) {
      await sendPushNotification(notificationData);
      
      // Mark as sent
      await docRef.update({ sent: true });
    }

    return { success: true, notificationId: docRef.id };
  } catch (error) {
    logger.error("Error sending notification:", error);
    throw new Error("Failed to send notification");
  }
});

/**
 * V6 Foundation: Process notification queue (triggered by Firestore writes)
 */
export const processNotificationQueue = onDocumentCreated(
  "notifications/{uid}/items/{notificationId}",
  async (event) => {
    const notification = event.data?.data();
    
    if (!notification) {
      logger.error("No notification data found");
      return;
    }

    const { uid, title, body, type, scheduleFor } = notification;

    // Check if this is a scheduled notification
    if (scheduleFor && scheduleFor > Date.now()) {
      logger.info(`Notification ${event.params.notificationId} scheduled for later`);
      return;
    }

    try {
      await sendPushNotification({ uid, title, body, type });
      
      // Mark notification as sent
      await event.data?.ref.update({ sent: true });
      
      logger.info(`Notification sent to user ${uid}`);
    } catch (error) {
      logger.error(`Failed to send notification to user ${uid}:`, error);
      
      // Mark as failed
      await event.data?.ref.update({ 
        sent: false, 
        error: error instanceof Error ? error.message : String(error),
        failedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  }
);

/**
 * V6 Foundation: Send test push notification (for debugging)
 */
export const sendTestPush = onCall(async (request) => {
  const { auth } = request;
  
  if (!auth) {
    throw new Error("Authentication required");
  }

  try {
    await sendPushNotification({
      uid: auth.uid,
      title: "UrAi Test Notification",
      body: "This is a test notification from your UrAi companion.",
      type: "system",
    });

    return { success: true, message: "Test notification sent" };
  } catch (error) {
    logger.error("Error sending test notification:", error);
    throw new Error("Failed to send test notification");
  }
});

/**
 * Helper function to send push notification via FCM
 */
async function sendPushNotification(notification: NotificationData): Promise<void> {
  const { uid, title, body, type, data = {} } = notification;

  try {
    // Get user's FCM tokens
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();
    
    if (!userData?.fcmTokens || userData.fcmTokens.length === 0) {
      logger.warn(`No FCM tokens found for user ${uid}`);
      return;
    }

    // Check user's notification preferences
    const settings = userData.settings || {};
    if (settings.notificationsEnabled === false) {
      logger.info(`Notifications disabled for user ${uid}`);
      return;
    }

    // Type-specific preference checks
    if (type === 'social' && settings.socialNotifications === false) return;
    if (type === 'companion' && settings.companionNotifications === false) return;
    if (type === 'insight' && settings.insightNotifications === false) return;

    // Prepare FCM message
    const message = {
      notification: {
        title,
        body,
      },
      data: {
        type,
        ...data,
        uid,
        timestamp: Date.now().toString(),
      },
      tokens: userData.fcmTokens,
    };

    // Send via FCM
    const response = await admin.messaging().sendEachForMulticast(message);
    
    // Clean up invalid tokens
    const invalidTokens: string[] = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success && resp.error?.code === 'messaging/registration-token-not-registered') {
        invalidTokens.push(userData.fcmTokens[idx]);
      }
    });

    if (invalidTokens.length > 0) {
      const validTokens = userData.fcmTokens.filter((token: string) => !invalidTokens.includes(token));
      await db.collection("users").doc(uid).update({ fcmTokens: validTokens });
      logger.info(`Removed ${invalidTokens.length} invalid tokens for user ${uid}`);
    }

    logger.info(`Push notification sent to user ${uid}: ${response.successCount}/${response.responses.length} delivered`);
  } catch (error) {
    logger.error(`Error sending push notification to user ${uid}:`, error);
    throw error;
  }
}

/**
 * V6 Foundation: Register FCM token for user
 */
export const registerFCMToken = onCall(async (request) => {
  const { auth, data } = request;
  
  if (!auth) {
    throw new Error("Authentication required");
  }

  const { token } = data;
  
  if (!token) {
    throw new Error("FCM token is required");
  }

  try {
    const userRef = db.collection("users").doc(auth.uid);
    
    // Add token to user's FCM tokens array (avoiding duplicates)
    await userRef.update({
      fcmTokens: admin.firestore.FieldValue.arrayUnion(token),
      lastTokenUpdate: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, message: "FCM token registered" };
  } catch (error) {
    logger.error("Error registering FCM token:", error);
    throw new Error("Failed to register FCM token");
  }
});

/**
 * V6 Foundation: Remove FCM token for user (on logout)
 */
export const removeFCMToken = onCall(async (request) => {
  const { auth, data } = request;
  
  if (!auth) {
    throw new Error("Authentication required");
  }

  const { token } = data;
  
  if (!token) {
    throw new Error("FCM token is required");
  }

  try {
    const userRef = db.collection("users").doc(auth.uid);
    
    // Remove token from user's FCM tokens array
    await userRef.update({
      fcmTokens: admin.firestore.FieldValue.arrayRemove(token),
      lastTokenUpdate: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, message: "FCM token removed" };
  } catch (error) {
    logger.error("Error removing FCM token:", error);
    throw new Error("Failed to remove FCM token");
  }
});