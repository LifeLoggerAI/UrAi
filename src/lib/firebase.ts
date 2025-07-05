
'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";

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

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Use a global flag to prevent reconnecting on hot reloads
  if (!(globalThis as any)._firebaseEmulatorsConnected) {
    console.log("Connecting to Firebase Emulators for the first time...");

    try {
      const host = window.location.hostname;
      const isSecure = window.location.protocol === 'https:';
      
      console.log(`Configuring emulators on host: ${host} with SSL: ${isSecure}`);

      if (isSecure) {
        // When in a secure context (like a cloud IDE), connect via HTTPS.
        // The IDE's proxy will handle forwarding to the correct http port.
        connectAuthEmulator(auth, `https://${host}:9099`, { disableWarnings: true });
        connectFirestoreEmulator(db, host, 8080, { ssl: true });
      } else {
        // For local development without HTTPS.
        connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
        connectFirestoreEmulator(db, host, 8080);
      }
      
      (globalThis as any)._firebaseEmulatorsConnected = true;
      console.log("Emulator connections configured.");
    } catch (error) {
      console.error("Error connecting to emulators:", error);
    }
  }
}

export { db, auth };
