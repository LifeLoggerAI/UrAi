import { getApps, getApp, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  enableIndexedDbPersistence,
  // initializeFirestore, // uncomment if you want long polling
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// If networking is flaky, you can force long polling:
// initializeFirestore(app, { experimentalAutoDetectLongPolling: true });

const db = getFirestore(app);

// Enable persistence in the browser (ignore if it fails)
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch(() => {});
}

const auth = getAuth(app);

export { app, db, auth };
