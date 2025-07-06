
'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator, type Functions } from "firebase/functions";
import { devMode } from "./dev-mode";

const firebaseConfig = {
  apiKey: "dummy-key",
  authDomain: "dummy-project.firebaseapp.com",
  projectId: "lifelogger-demo",
  storageBucket: "dummy-project.appspot.com",
  messagingSenderId: "dummy-sender-id",
  appId: "dummy-app-id"
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const functions: Functions = getFunctions(app);

if (devMode) {
    // In development mode, we connect to the local emulators.
    // The try/catch block prevents errors during hot-reloads.
    try {
        connectAuthEmulator(auth, 'http://localhost:9199', { disableWarnings: true });
        connectFirestoreEmulator(db, 'localhost', 8280);
        connectFunctionsEmulator(functions, 'localhost', 5150);
        console.log("✅ Firebase Emulators connected.");
    } catch (error) {
        console.log("Ignoring emulator connection error on hot-reload.");
    }
}

export { app, db, auth, functions };
