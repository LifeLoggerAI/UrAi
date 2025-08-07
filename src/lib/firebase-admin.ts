// src/lib/firebase-admin.ts
// Server-side Firebase Admin SDK (Node.js only)
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // Alternative: credential: admin.credential.cert(serviceAccount)
  });
}

export { admin };