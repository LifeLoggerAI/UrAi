import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if all required environment variables are present and not placeholder values
const hasValidFirebaseKeys = 
    firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("YOUR_") &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId;

if (!hasValidFirebaseKeys) {
    throw new Error("Firebase configuration keys are missing or are still using placeholder values. Please update the .env.local file with your Firebase project's credentials.");
}


// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);
const analytics: Promise<Analytics | null> = isSupported().then(yes => yes ? getAnalytics(app) : null);

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
