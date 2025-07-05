
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { initializeFirestore, memoryLocalCache, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";

// Use a dummy project config for local development to prevent production connections.
const firebaseConfig = {
  apiKey: "dummy-key",
  authDomain: "dummy-project.firebaseapp.com",
  projectId: "lifelogger-demo",
  storageBucket: "dummy-project.appspot.com",
  messagingSenderId: "dummy-sender-id",
  appId: "dummy-app-id"
};

// Initialize Firebase App
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db: Firestore = initializeFirestore(app, { cache: memoryLocalCache({}) });
const auth: Auth = getAuth(app);

// In a development environment, we connect to the emulators.
// We use a global flag to ensure this only runs once, even with hot-reloading.
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // @ts-ignore
    if (!globalThis._firebaseEmulatorsConnected) {
        console.log("Attempting to connect to Firebase emulators...");
        connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
        console.log("Successfully connected to Firebase emulators.");
        // @ts-ignore
        globalThis._firebaseEmulatorsConnected = true;
    }
}

export { db, auth };
