
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { initializeFirestore, memoryLocalCache, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

// For local development and testing with emulators, we use a dummy project config.
// This is a robust strategy to prevent the Firebase SDK from ever attempting to
// contact the live production backend.
const firebaseConfig = {
  apiKey: "dummy-key",
  authDomain: "dummy-project.firebaseapp.com",
  projectId: "lifelogger-demo", // A dummy Project ID is crucial here.
  storageBucket: "dummy-project.appspot.com",
  messagingSenderId: "dummy-sender-id",
  appId: "dummy-app-id"
};


// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db: Firestore = initializeFirestore(app, { cache: memoryLocalCache({}) });
const auth: Auth = getAuth(app);

// Conditionally initialize Analytics only in production to avoid Installations API errors with dummy keys.
let analytics: Promise<Analytics | null>;
if (process.env.NODE_ENV === 'production') {
    analytics = isSupported().then(yes => (yes ? getAnalytics(app) : null));
} else {
    analytics = Promise.resolve(null);
}

// --- EMULATOR CONNECTION ---
// In a development environment, we unconditionally connect to the emulators.
// The Firebase SDKs are designed to handle this gracefully and will not
// create duplicate connections or throw errors on hot-reloading.
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
}
// --- END EMULATOR CONNECTION ---

export { db, auth, analytics };
