import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import type { User } from "../../lib/types";

// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const db = admin.firestore();

/**
 * Triggered on new user creation to create a default profile in Firestore.
 */
export const createDefaultProfile = functions.auth.user().onCreate(async (user) => {
    const { uid, email, displayName, photoURL } = user;

    try {
        const newUserDoc: User = {
            uid: uid,
            displayName: displayName || email?.split('@')[0] || "Anonymous",
            email: email || "",
            createdAt: Date.now(),
            avatarUrl: photoURL || `https://placehold.co/128x128.png?text=${(displayName || email || "A").charAt(0)}`,
            settings: {
                moodTrackingEnabled: true,
                passiveAudioEnabled: true,
                faceEmotionEnabled: false,
                dataExportEnabled: true,
            },
            personaProfile: {},
            symbolLexicon: {},
            subscriptionTier: 'free',
        };

        await db.collection("users").doc(uid).set(newUserDoc);
        functions.logger.info(`Successfully created profile for user: ${uid}`);

        // Placeholder for enqueueing a welcome notification
        functions.logger.info(`Enqueued welcome notification for user ${uid}`);

    } catch (error) {
        functions.logger.error(`Error creating profile for user ${uid}:`, error);
    }
});

/**
 * Triggered on user deletion to clean up their data.
 */
export const onUserDelete = functions.auth.user().onDelete(async (user) => {
    const { uid } = user;
    functions.logger.info(`Starting data cleanup for deleted user: ${uid}`);
    
    // In a real application, you would add logic here to delete or anonymize
    // all data associated with the user from Firestore, Storage, etc.
    // For now, we will just log the event.
    const userDocRef = db.collection("users").doc(uid);
    
    try {
        await userDocRef.delete();
        functions.logger.info(`Successfully deleted user profile for ${uid}. Further cleanup may be required.`);
    } catch (error) {
        functions.logger.error(`Error deleting user profile for ${uid}:`, error);
    }
});
