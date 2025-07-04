import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

// Enable Firestore offline persistence
try {
    enableIndexedDbPersistence(db);
} catch (error: any) {
    if (error.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time.
        console.warn('Firestore persistence failed: multiple tabs open.');
    } else if (error.code == 'unimplemented') {
        // The current browser does not support all of the features required to enable persistence
        console.warn('Firestore persistence not available in this browser.');
    }
}


export { db, auth, analytics };
