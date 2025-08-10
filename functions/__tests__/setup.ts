
import * as admin from 'firebase-admin';

// Initialize the Firebase Admin SDK for testing
if (admin.apps.length === 0) {
  admin.initializeApp({
    projectId: 'urai-4dc1d', // Use your project ID
  });
}
