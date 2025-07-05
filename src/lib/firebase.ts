
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

// This block will run on both server and client, in development mode.
if (process.env.NODE_ENV === 'development') {
    // Check if we are on the server or the client
    if (typeof window === 'undefined') {
        // We are on the server, connect to localhost
        // Check if emulators are already connected to prevent errors on hot-reloads
        if (!auth.emulatorConfig) {
            console.log("Connecting to Firebase Emulators from SERVER...");
            connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
            connectFirestoreEmulator(db, 'localhost', 8080);
            console.log("Server-side emulator connection established.");
        }
    } else {
        // We are on the client
        // Check if emulators are already connected to prevent errors on hot-reloads
        if (!auth.emulatorConfig) {
            console.log("Connecting to Firebase Emulators from CLIENT...");
            // Use window.location.hostname for cloud development environments
            const host = window.location.hostname;
            connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
            connectFirestoreEmulator(db, host, 8080);
            console.log("Client-side emulator connection established.");
        }
    }
}

export { db, auth };
