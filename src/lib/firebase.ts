
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator, type Functions } from "firebase/functions";
import { devMode } from "./dev-mode";

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

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const functions: Functions = getFunctions(app);

if (devMode) {
  // Connect to emulators in development mode.
  // The SDK handles preventing multiple connections, so it's safe to call this on hot reloads.
  try {
    connectAuthEmulator(auth, "http://localhost:9199", { disableWarnings: true });
    connectFirestoreEmulator(db, "localhost", 8280);
    connectFunctionsEmulator(functions, "localhost", 5150);
    console.log("✅ Firebase emulators connected.");
  } catch (e) {
    console.warn("Could not connect to emulators, assuming they are not running. Error: ", e);
  }
}

export { app, db, auth, functions };
