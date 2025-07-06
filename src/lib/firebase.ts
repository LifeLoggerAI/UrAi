
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator, type Functions } from "firebase/functions";
import { devMode } from "./dev-mode";

const firebaseConfig = {
  apiKey: "dummy-key",
  authDomain: "lifelogger-demo.firebaseapp.com",
  projectId: "lifelogger-demo",
  storageBucket: "lifelogger-demo.appspot.com",
  messagingSenderId: "dummy-sender-id",
  appId: "dummy-app-id"
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const functions: Functions = getFunctions(app);

if (devMode) {
  // Connect to emulators in development mode.
  // The SDK handles preventing multiple connections, so it's safe to call this on hot reloads.
  connectAuthEmulator(auth, "http://localhost:9199", { disableWarnings: true });
  connectFirestoreEmulator(db, "localhost", 8280);
  connectFunctionsEmulator(functions, "localhost", 5150);
}

export { app, db, auth, functions };
