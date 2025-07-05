
'use client'; // This ensures the code only runs on the client

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

// Initialize Firebase App
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

// This block will only run on the client side, where window is defined.
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Check if emulators have already been connected to avoid re-connecting on hot reloads.
    const globalWithEmulators = window as typeof window & {
        _firebaseEmulatorsConnected?: boolean;
    };

    if (!globalWithEmulators._firebaseEmulatorsConnected) {
        console.log("Connecting to Firebase Emulators on host:", window.location.hostname);
        
        // Use the current page's hostname to connect to the emulators.
        // This is crucial for cloud development environments where the emulators
        // are not on 'localhost' from the browser's perspective.
        const host = window.location.hostname;
        
        connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
        connectFirestoreEmulator(db, host, 8080);
        
        // Set a flag to indicate that the emulators are connected.
        globalWithEmulators._firebaseEmulatorsConnected = true;
        console.log("Connection to emulators established.");
    }
}

export { db, auth };
