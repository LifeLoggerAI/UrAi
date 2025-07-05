
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { initializeFirestore, memoryLocalCache, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

// For local development and testing with emulators, we use a dummy project config.
// This is a robust strategy to prevent the Firebase SDK from ever attempting to
// contact the live production backend, which is the root cause of the network errors.
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
const analytics: Promise<Analytics | null> = isSupported().then(yes => (yes ? getAnalytics(app) : null));

// --- EMULATOR CONNECTION ---
// In a development environment, we unconditionally connect to the emulators.
// The Firebase SDKs are designed to handle this gracefully and will not
// create duplicate connections. This is the most reliable way to ensure
// the app works correctly with hot-reloading.
if (typeof window !== 'undefined') {
    console.log("Connecting to Firebase Emulators at localhost...");
    try {
        // The host for the emulators is localhost.
        connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log("Successfully connected to Firebase Emulators.");
    } catch (error) {
        // We can ignore 'already-connected' errors, which can happen with hot-reloading.
        if (error instanceof Error && !error.message.includes("already-connected")) {
            console.error("CRITICAL: Failed to connect to Firebase Emulators.", error);
        }
    }
}
// --- END EMULATOR CONNECTION ---

export { db, auth, analytics };
