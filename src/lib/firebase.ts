
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { initializeFirestore, memoryLocalCache, type Firestore } from "firebase/firestore";
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

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Updated Firestore initialization with offline persistence
const db: Firestore = initializeFirestore(app, {
    cache: memoryLocalCache({})
});

const auth: Auth = getAuth(app);

// Conditionally initialize Analytics
let analytics: Promise<Analytics | null>;
if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    analytics = isSupported().then(yes => (yes ? getAnalytics(app) : null));
} else {
    console.warn("Firebase Analytics is disabled. Please provide Firebase credentials in .env.local to enable it.");
    analytics = Promise.resolve(null);
}

export { db, auth, analytics };
