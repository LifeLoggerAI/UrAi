import { onCall, HttpsError } from "firebase-functions/v2/https";
import {
  onDocumentWritten,
  onDocumentUpdated,
  Change,
} from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions/v2";
import type { CallableRequest } from "firebase-functions/v2/https";
import type {
  FirestoreEvent,
  DocumentSnapshot,
} from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * Anonymizes user data upon request or based on settings.
 * This is a placeholder for a complex data anonymization pipeline.
 */
export const anonymizeUserData = onCall(async (request: CallableRequest) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }
  logger.info(`Starting data anonymization for user ${uid}.`);
  // In a real implementation:
  // 1. Hash user UID with a salt.
  // 2. Query user's data from various collections.
  // 3. Fuzz timestamps, round GPS, remove PII.
  // 4. Write to /anonymizedData collection.
  return { success: true, message: "Anonymization process initiated." };
});

/**
 * Generates aggregated B2B insights from anonymized data.
 * Runs nightly. This is a placeholder.
 */
export const generateAggregateInsights = onSchedule("00 01 * * *", async () => {
  logger.info("Running nightly job to generate aggregate insights.");
  // In a real implementation:
  // 1. Pool all new data from /anonymizedData.
  // 2. Perform aggregation (e.g., mood heatmaps, correlation analysis).
  // 3. Save reports to /b2bExports or stream to BigQuery.
  return;
});

/**
 * Deletes all data associated with a user.
 * This is a placeholder for a user-initiated deletion.
 */
export const deleteUserData = onCall(async (request: CallableRequest) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }
  logger.info(`Initiating data deletion for user ${uid}.`);
  // In a real implementation, you would need a robust, multi-step process
  // to delete all user data across all collections and Storage.
  // This is a complex and destructive operation.
  // Example: await admin.firestore().collection('users').doc(uid).delete();
  //          await admin.firestore().collection('voiceEvents').where('uid', '==', uid).get().then(...)
  return { success: true, message: "Data deletion process initiated." };
});

/**
 * Exports all data associated with a user.
 * This is a placeholder for a user-initiated export.
 */
export const exportUserData = onCall(async (request: CallableRequest) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }
  logger.info(`Initiating data export for user ${uid}.`);
  // In a real implementation:
  // 1. Gather all user data from Firestore collections.
  // 2. Compile into a machine-readable format (e.g., JSON files).
  // 3. Zip the files and upload to a private Cloud Storage bucket.
  // 4. Generate a signed URL for the user to download the file.
  // 5. Send the URL to the user's email.
  return {
    success: true,
    message:
      "Data export process initiated. You will receive an email with a download link shortly.",
  };
});

/**
 * Creates an audit log whenever a user's permissions document is written.
 */
export const storeConsentAudit = onDocumentWritten(
  "permissions/{uid}",
  async (
    event: FirestoreEvent<
      Change<DocumentSnapshot> | undefined,
      { uid: string }
    >
  ) => {
    const { uid } = event.params;
    const consentData = event.data?.after.data();

    if (!consentData) {
      logger.info(`Consent data for ${uid} deleted, skipping audit.`);
      return;
    }

    const auditLog = {
      uid: uid,
      ...consentData,
      auditTimestamp: admin.firestore.FieldValue.serverTimestamp(),
      changeType: event.data?.before?.exists ? "update" : "create",
    };

    try {
      // Creates a new document in the consentAudit collection for each change
      await db.collection("consentAudit").add(auditLog);
      logger.info(`Successfully logged consent audit for user ${uid}.`);
    } catch (error) {
      logger.error(`Failed to log consent audit for user ${uid}:`, error);
    }
    return;
  }
);
