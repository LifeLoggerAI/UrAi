
// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Ensure singleton (fixes Next.js hot-reload multiple init issues)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
let messaging;

if (typeof window !== 'undefined') {
  try {
    enableIndexedDbPersistence(db);
    messaging = getMessaging(app);
  } catch (err) {
    console.error('Error initializing Firebase services on client:', err);
  }
}

export const auth = getAuth(app);
export const storage = getStorage(app);

export { app, db, messaging };
export default app;
