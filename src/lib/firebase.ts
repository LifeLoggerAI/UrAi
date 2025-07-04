
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

// --- START EMULATOR CONNECTION ---
// This block ensures the app connects to the local Firebase emulators.
// It includes checks to prevent re-connecting during hot reloads.
// We use 127.0.0.1 to avoid any potential DNS/hostname resolution issues
// within the development environment's sandboxed network.
if (typeof window !== 'undefined' && !(window as any)._firebaseEmulatorsConnected) {
    console.log("Attempting to connect to Firebase Emulators...");
    try {
        connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
        console.log("Successfully connected to Firebase Emulators.");
        // Set a flag to indicate that the emulators are connected.
        (window as any)._firebaseEmulatorsConnected = true;
    } catch (error) {
        console.error("CRITICAL: Failed to connect to Firebase Emulators.", error);
    }
}
// --- END EMULATOR CONNECTION ---


// Initialize Analytics
const analytics: Promise<Analytics | null> = isSupported().then(yes => (yes ? getAnalytics(app) : null));

export { db, auth, analytics };
