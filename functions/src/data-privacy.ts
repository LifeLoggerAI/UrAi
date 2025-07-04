import * as functions from "firebase-functions";
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
export const anonymizeUserData = functions.https.onCall(async (data, context) => {
    const uid = context.auth?.uid;
    if (!uid) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
    }
    functions.logger.info(`Starting data anonymization for user ${uid}.`);
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
export const generateAggregateInsights = functions.pubsub
  .schedule('every day 01:00')
  .timeZone('UTC')
  .onRun(async (context) => {
        functions.logger.info('Running nightly job to generate aggregate insights.');
        // In a real implementation:
        // 1. Pool all new data from /anonymizedData.
        // 2. Perform aggregation (e.g., mood heatmaps, correlation analysis).
        // 3. Save reports to /b2bExports or stream to BigQuery.
        return null;
    });

/**
 * Deletes all data associated with a user.
 * This is a placeholder for a user-initiated deletion.
 */
export const deleteUserData = functions.https.onCall(async (data, context) => {
     const uid = context.auth?.uid;
    if (!uid) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
    }
    functions.logger.info(`Initiating data deletion for user ${uid}.`);
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
export const exportUserData = functions.https.onCall(async (data, context) => {
    const uid = context.auth?.uid;
    if (!uid) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
    }
    functions.logger.info(`Initiating data export for user ${uid}.`);
    // In a real implementation:
    // 1. Gather all user data from Firestore collections.
    // 2. Compile into a machine-readable format (e.g., JSON files).
    // 3. Zip the files and upload to a private Cloud Storage bucket.
    // 4. Generate a signed URL for the user to download the file.
    // 5. Send the URL to the user's email.
    return { success: true, message: "Data export process initiated. You will receive an email with a download link shortly." };
});

/**
 * Creates an audit log whenever a user's permissions document is written.
 */
export const storeConsentAudit = functions.firestore
  .document('permissions/{uid}')
  .onWrite(async (change, context) => {
    const { uid } = context.params;
    const consentData = change.after.data();

    if (!consentData) {
      functions.logger.info(`Consent data for ${uid} deleted, skipping audit.`);
      return null;
    }

    const auditLog = {
      uid: uid,
      ...consentData,
      auditTimestamp: admin.firestore.FieldValue.serverTimestamp(),
      changeType: change.before.exists ? 'update' : 'create',
    };

    try {
      // Creates a new document in the consentAudit collection for each change
      await db.collection('consentAudit').add(auditLog);
      functions.logger.info(`Successfully logged consent audit for user ${uid}.`);
    } catch (error) {
      functions.logger.error(`Failed to log consent audit for user ${uid}:`, error);
    }
    return null;
  });

/**
 * Creates a Data Access Request from an external partner.
 * Placeholder callable function.
 */
export const createDarRequest = functions.https.onCall(async (data, context) => {
    // In a real app:
    // 1. Verify partner API key.
    // 2. Validate packageId exists.
    // 3. Write a new document to /darRequests with status 'pending'.
    functions.logger.info("Placeholder for createDarRequest", { data });
    return { success: true, requestId: "dummy-request-id" };
});

/**
 * Approves a Data Access Request. Admin-only.
 * Placeholder callable function.
 */
export const approveDarRequest = functions.https.onCall(async (data, context) => {
    if (!context.auth?.token.admin) {
        throw new functions.https.HttpsError('permission-denied', 'Must be an admin to approve requests.');
    }
    // In a real app:
    // 1. Update /darRequests status to 'approved'.
    // 2. Schedule BigQuery export job, filtering by consent.
    // 3. Write to /exportSummaries.
    // 4. Create /monetizationLog entries for affected users.
    functions.logger.info("Placeholder for approveDarRequest", { data });
    return { success: true };
});

/**
 * Rejects a Data Access Request. Admin-only.
 * Placeholder callable function.
 */
export const rejectDarRequest = functions.https.onCall(async (data, context) => {
    if (!context.auth?.token.admin) {
        throw new functions.https.HttpsError('permission-denied', 'Must be an admin to reject requests.');
    }
    // In a real app:
    // 1. Update /darRequests status to 'rejected' with a note.
    functions.logger.info("Placeholder for rejectDarRequest", { data });
    return { success: true };
});

/**
 * Handles user opt-out for data sharing.
 * Triggered when a user's dataConsent settings change.
 */
export const cleanupOptOut = functions.firestore
    .document('users/{uid}')
    .onUpdate(async (change, context) => {
        const beforeSettings = change.before.data().settings;
        const afterSettings = change.after.data().settings;

        const beforeConsent = beforeSettings.dataConsent?.shareAnonymousData;
        const afterConsent = afterSettings.dataConsent?.shareAnonymousData;
        
        if (beforeConsent === true && afterConsent === false) {
            functions.logger.info(`User ${context.params.uid} has opted out of data sharing.`);
            // The frontend action already sets the optedOutAt timestamp.
            // This function could be used for additional cleanup if needed,
            // such as removing them from active B2B cohorts.
        }
        return null;
    });

/**
 * Nightly job to check watermarks on new exports.
 * Placeholder scheduled function.
 */
export const dailyWatermarkChecker = functions.pubsub
  .schedule('every day 01:30')
  .timeZone('UTC')
  .onRun(async () => {
    functions.logger.info("Running daily watermark checker job.");
    // In a real app:
    // 1. Scan new /exportSummaries.
    // 2. Verify watermark IDs against valid salts in /dataMarketplace/packages.
    // 3. Flag any discrepancies for review.
    return null;
  });