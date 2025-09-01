import { onCall } from "firebase-functions/v2";
import { logger } from "firebase-functions/v2";
import * as admin from "firebase-admin";

// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

interface PrivacyZone {
  name: string;
  description?: string;
  dataTypes: string[]; // e.g., ['voice', 'camera', 'location', 'biometric']
  retentionPeriod: number; // days
  sharingLevel: 'private' | 'anonymous' | 'aggregated' | 'public';
  encryptionLevel: 'standard' | 'enhanced' | 'maximum';
  isActive: boolean;
}

interface ConsentRecord {
  type: string; // e.g., 'voice_recording', 'camera_analysis', 'data_sharing'
  granted: boolean;
  timestamp: number;
  expiresAt?: number;
  purpose: string;
  dataTypes: string[];
  thirdParties?: string[];
}

/**
 * V6 Foundation: Update or create privacy zone
 */
export const updatePrivacyZone = onCall(async (request) => {
  const { auth, data } = request;
  
  if (!auth) {
    throw new Error("Authentication required");
  }

  const { zoneId, zone }: { zoneId: string; zone: PrivacyZone } = data;

  if (!zoneId || !zone) {
    throw new Error("Zone ID and zone data are required");
  }

  try {
    const zoneData = {
      ...zone,
      uid: auth.uid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("privacyZones").doc(`${auth.uid}_${zoneId}`).set(zoneData, { merge: true });

    // Log privacy zone change for audit
    await db.collection("privacyAudit").add({
      uid: auth.uid,
      action: 'zone_updated',
      zoneId,
      changes: zone,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, message: "Privacy zone updated" };
  } catch (error) {
    logger.error("Error updating privacy zone:", error);
    throw new Error("Failed to update privacy zone");
  }
});

/**
 * V6 Foundation: Get user's consent status
 */
export const getConsentStatus = onCall(async (request) => {
  const { auth, data } = request;
  
  if (!auth) {
    throw new Error("Authentication required");
  }

  const { consentType } = data;

  try {
    let query = db.collection("consentManagement").where("uid", "==", auth.uid);
    
    if (consentType) {
      query = query.where("type", "==", consentType);
    }

    const snapshot = await query.orderBy("timestamp", "desc").get();
    
    const consents: ConsentRecord[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      consents.push({
        type: data.type,
        granted: data.granted,
        timestamp: data.timestamp,
        expiresAt: data.expiresAt,
        purpose: data.purpose,
        dataTypes: data.dataTypes,
        thirdParties: data.thirdParties,
      });
    });

    return { consents };
  } catch (error) {
    logger.error("Error getting consent status:", error);
    throw new Error("Failed to get consent status");
  }
});

/**
 * V6 Foundation: Update user consent
 */
export const updateConsent = onCall(async (request) => {
  const { auth, data } = request;
  
  if (!auth) {
    throw new Error("Authentication required");
  }

  const { 
    type, 
    granted, 
    purpose, 
    dataTypes, 
    thirdParties, 
    expirationDays 
  }: {
    type: string;
    granted: boolean;
    purpose: string;
    dataTypes: string[];
    thirdParties?: string[];
    expirationDays?: number;
  } = data;

  if (!type || granted === undefined || !purpose || !dataTypes) {
    throw new Error("Type, granted status, purpose, and data types are required");
  }

  try {
    const consentRecord: ConsentRecord = {
      type,
      granted,
      timestamp: Date.now(),
      purpose,
      dataTypes,
      thirdParties,
    };

    // Set expiration if specified
    if (expirationDays && expirationDays > 0) {
      consentRecord.expiresAt = Date.now() + (expirationDays * 24 * 60 * 60 * 1000);
    }

    // Store consent record
    await db.collection("consentManagement").add({
      ...consentRecord,
      uid: auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update user's current consent status
    await db.collection("users").doc(auth.uid).update({
      [`consents.${type}`]: {
        granted,
        timestamp: consentRecord.timestamp,
        expiresAt: consentRecord.expiresAt,
      },
      lastConsentUpdate: admin.firestore.FieldValue.serverTimestamp(),
    });

    // If consent is revoked, trigger data cleanup for that type
    if (!granted) {
      await scheduleDataCleanup(auth.uid, type, dataTypes);
    }

    // Log consent change for audit
    await db.collection("privacyAudit").add({
      uid: auth.uid,
      action: 'consent_updated',
      consentType: type,
      granted,
      purpose,
      dataTypes,
      thirdParties,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, message: "Consent updated successfully" };
  } catch (error) {
    logger.error("Error updating consent:", error);
    throw new Error("Failed to update consent");
  }
});

/**
 * V6 Foundation: Get user's privacy zones
 */
export const getPrivacyZones = onCall(async (request) => {
  const { auth } = request;
  
  if (!auth) {
    throw new Error("Authentication required");
  }

  try {
    const snapshot = await db.collection("privacyZones")
      .where("uid", "==", auth.uid)
      .orderBy("updatedAt", "desc")
      .get();
    
    const zones: (PrivacyZone & { id: string })[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      zones.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        dataTypes: data.dataTypes,
        retentionPeriod: data.retentionPeriod,
        sharingLevel: data.sharingLevel,
        encryptionLevel: data.encryptionLevel,
        isActive: data.isActive,
      });
    });

    return { zones };
  } catch (error) {
    logger.error("Error getting privacy zones:", error);
    throw new Error("Failed to get privacy zones");
  }
});

/**
 * V6 Foundation: Delete user's privacy zone
 */
export const deletePrivacyZone = onCall(async (request) => {
  const { auth, data } = request;
  
  if (!auth) {
    throw new Error("Authentication required");
  }

  const { zoneId } = data;

  if (!zoneId) {
    throw new Error("Zone ID is required");
  }

  try {
    const zoneRef = db.collection("privacyZones").doc(`${auth.uid}_${zoneId}`);
    const zoneDoc = await zoneRef.get();

    if (!zoneDoc.exists || zoneDoc.data()?.uid !== auth.uid) {
      throw new Error("Privacy zone not found or access denied");
    }

    await zoneRef.delete();

    // Log privacy zone deletion for audit
    await db.collection("privacyAudit").add({
      uid: auth.uid,
      action: 'zone_deleted',
      zoneId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, message: "Privacy zone deleted" };
  } catch (error) {
    logger.error("Error deleting privacy zone:", error);
    throw new Error("Failed to delete privacy zone");
  }
});

/**
 * V6 Foundation: Request data export (GDPR compliance)
 */
export const requestDataExport = onCall(async (request) => {
  const { auth, data } = request;
  
  if (!auth) {
    throw new Error("Authentication required");
  }

  const { dataTypes, format = 'json' } = data;

  try {
    // Create export request
    const exportRequest = {
      uid: auth.uid,
      dataTypes: dataTypes || ['all'],
      format,
      status: 'pending',
      requestedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const exportRef = await db.collection("dataExports").add(exportRequest);

    // Log export request for audit
    await db.collection("privacyAudit").add({
      uid: auth.uid,
      action: 'data_export_requested',
      exportId: exportRef.id,
      dataTypes,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { 
      success: true, 
      exportId: exportRef.id,
      message: "Data export request submitted. You will be notified when ready." 
    };
  } catch (error) {
    logger.error("Error requesting data export:", error);
    throw new Error("Failed to request data export");
  }
});

/**
 * V6 Foundation: Request data deletion (Right to be forgotten)
 */
export const requestDataDeletion = onCall(async (request) => {
  const { auth, data } = request;
  
  if (!auth) {
    throw new Error("Authentication required");
  }

  const { dataTypes, confirmation } = data;

  if (confirmation !== 'I understand this action cannot be undone') {
    throw new Error("Confirmation phrase is required for data deletion");
  }

  try {
    // Create deletion request
    const deletionRequest = {
      uid: auth.uid,
      dataTypes: dataTypes || ['all'],
      status: 'pending',
      requestedAt: admin.firestore.FieldValue.serverTimestamp(),
      confirmationPhrase: confirmation,
    };

    const deletionRef = await db.collection("dataDeletions").add(deletionRequest);

    // Log deletion request for audit
    await db.collection("privacyAudit").add({
      uid: auth.uid,
      action: 'data_deletion_requested',
      deletionId: deletionRef.id,
      dataTypes,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { 
      success: true, 
      deletionId: deletionRef.id,
      message: "Data deletion request submitted. This will be processed within 30 days." 
    };
  } catch (error) {
    logger.error("Error requesting data deletion:", error);
    throw new Error("Failed to request data deletion");
  }
});

/**
 * Helper function to schedule data cleanup when consent is revoked
 */
async function scheduleDataCleanup(uid: string, consentType: string, dataTypes: string[]): Promise<void> {
  try {
    await db.collection("dataCleanupQueue").add({
      uid,
      consentType,
      dataTypes,
      status: 'pending',
      scheduledAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    logger.info(`Scheduled data cleanup for user ${uid}, consent type: ${consentType}`);
  } catch (error) {
    logger.error(`Error scheduling data cleanup for user ${uid}:`, error);
  }
}