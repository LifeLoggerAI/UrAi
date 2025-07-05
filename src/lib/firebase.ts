
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { initializeFirestore, memoryLocalCache, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";

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

// Dummy exports to prevent breaking other files that might import these.
// Firebase Analytics is not used in this project to avoid installation issues.
const analytics = Promise.resolve(null);
const logEvent = () => {};

// In a development environment, we connect to the emulators.
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Check if emulators are already connected to prevent errors on hot-reloads
    if (!auth.emulatorConfig) {
        console.log("Connecting to Firebase emulators...");
        connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log("Successfully connected to Firebase emulators.");
    }
}

export { db, auth, analytics, logEvent };
