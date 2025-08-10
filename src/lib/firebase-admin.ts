// src/lib/firebase-admin.ts
// Server-side Firebase Admin SDK (Node.js only)
import * as admin from 'firebase-admin';

// Check if the service account details are available in environment variables
const serviceAccount =
  process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL
    ? {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }
    : undefined;

if (!admin.apps.length) {
  admin.initializeApp({
    // Use service account from env vars if available, otherwise use Application Default Credentials
    credential: serviceAccount
      ? admin.credential.cert(serviceAccount)
      : admin.credential.applicationDefault(),
  });
}

export { admin };
