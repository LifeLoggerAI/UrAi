
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { initializeFirestore, memoryLocalCache, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith("REPLACE_WITH")) {
    console.error("Firebase config is not set. Please add your Firebase project's web configuration to the .env file.");
}

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db: Firestore = initializeFirestore(app, {
    cache: memoryLocalCache({})
});

const auth: Auth = getAuth(app);

// In this development environment, we connect to the emulators unconditionally.
// This is the most reliable way to ensure the app connects to the local
// emulators instead of the production backend.
try {
    // @ts-ignore - emulatorConfig is a private property but a reliable way to check for emulator connection.
    if (!auth.emulatorConfig) {
        console.log("Attempting to connect to Firebase Auth emulator at http://localhost:9099...");
        connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
        console.log("Auth emulator connection configured.");
    }
} catch (e) {
    console.error("Error connecting to Auth emulator:", e);
}

try {
    // @ts-ignore - _isInitialized is a private property but a reliable way to check for emulator connection.
    if (!db.emulator) {
        console.log("Attempting to connect to Firestore emulator at localhost:8080...");
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log("Firestore emulator connection configured.");
    }
} catch (e) {
    console.error("Error connecting to Firestore emulator:", e);
}

// Initialize Analytics
const analytics: Promise<Analytics | null> = isSupported().then(yes => (yes ? getAnalytics(app) : null));

export { db, auth, analytics };
