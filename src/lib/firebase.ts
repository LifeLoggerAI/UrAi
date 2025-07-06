
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator, type Functions } from "firebase/functions";

const devMode = process.env.NODE_ENV === 'development';

const firebaseConfig = {
  apiKey: "AIzaSyAMovq3zvqgmsBBPhsjDQudb8kltxUbYV4",
  authDomain: "lifelogger-clean.firebaseapp.com",
  projectId: "lifelogger-clean",
  storageBucket: "lifelogger-clean.appspot.com",
  messagingSenderId: "360527756764",
  appId: "1:360527756764:web:a8b052be78d57340c8a319"
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
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "localhost", 8080);
    connectFunctionsEmulator(functions, "localhost", 5001);
    console.log("✅ Firebase emulators connected.");
  } catch (e) {
    console.warn("Could not connect to emulators, assuming they are not running. Error: ", e);
  }
}

export { app, db, auth, functions };
