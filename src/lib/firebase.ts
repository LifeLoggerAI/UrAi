
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

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
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

// In a development environment, we connect to the emulators.
// This is done unconditionally on every load in dev. The Firebase SDKs are
// idempotent and will not create duplicate connections. This is the most
// robust way to ensure emulators are used in a hot-reloading dev environment.
if (process.env.NODE_ENV === 'development') {
    console.log("Connecting to Firebase Emulators...");
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
}

export { db, auth };
