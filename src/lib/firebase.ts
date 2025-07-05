
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
  // Use a global flag to prevent reconnecting on every hot reload
  if (!(globalThis as any)._firebaseEmulatorsConnected) {
    console.log("Connecting to Firebase Emulators...");

    try {
      const isSecure = window.location.protocol === 'https:';
      
      if (isSecure) {
        // In a secure cloud IDE, ports are often forwarded to subdomains.
        // We construct the emulator hostnames based on the current window location.
        // Example: if window.location.hostname is "6000-....", we want "9099-...." for Auth.
        const originalHost = window.location.hostname;
        const baseHost = originalHost.includes('-') ? originalHost.substring(originalHost.indexOf('-') + 1) : originalHost;
        
        const authHost = `9099-${baseHost}`;
        const firestoreHost = `8080-${baseHost}`;

        console.log(`Configuring emulators for secure cloud host:`);
        console.log(`- Auth URL: https://${authHost}`);
        console.log(`- Firestore Host: ${firestoreHost}`);

        // connectAuthEmulator accepts a full URL
        connectAuthEmulator(auth, `https://${authHost}`, { disableWarnings: true });
        
        // connectFirestoreEmulator accepts host and port, and has an ssl option.
        // When connecting to the HTTPS proxy, the port is 443.
        connectFirestoreEmulator(db, firestoreHost, 443, { ssl: true });

      } else {
        // Standard local development (e.g., http://localhost)
        console.log("Configuring emulators for local http host...");
        connectAuthEmulator(auth, `http://localhost:9099`, { disableWarnings: true });
        connectFirestoreEmulator(db, 'localhost', 8080);
      }
      
      (globalThis as any)._firebaseEmulatorsConnected = true;
      console.log("Emulator connections configured successfully.");

    } catch (error) {
      console.error("Fatal error connecting to emulators:", error);
    }
  }
}

export { db, auth };
