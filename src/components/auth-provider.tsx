
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const connectToEmulators = () => {
    // This function should only run in a browser environment during development.
    if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
        return;
    }

    console.log("Attempting to connect to Firebase Emulators...");
    try {
        const host = window.location.hostname;
        const protocol = window.location.protocol;

        // In a secure cloud IDE, ports are often forwarded to subdomains over HTTPS.
        if (protocol === 'https:' && host.includes('cloudworkstations.dev')) {
            // Construct the base hostname by removing the port prefix (e.g., '6000-')
            const baseHost = host.substring(host.indexOf('-') + 1);
            
            const authHost = `9099-${baseHost}`;
            const firestoreHost = `8080-${baseHost}`;

            console.log(`Secure Cloud IDE detected. Connecting via HTTPS proxy...`);
            console.log(`- Auth URL: https://${authHost}`);
            console.log(`- Firestore Host: ${firestoreHost}, Port: 443 (SSL)`);
            
            // Auth emulator requires the full HTTPS URL
            connectAuthEmulator(auth, `https://${authHost}`, { disableWarnings: true });
            
            // Firestore emulator has a specific SSL option for this proxy scenario
            connectFirestoreEmulator(db, firestoreHost, 443, { ssl: true });

        } else {
            // Standard local development environment
            console.log("Local development environment detected. Connecting via HTTP...");
            connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
            connectFirestoreEmulator(db, 'localhost', 8080);
        }
        
        console.log("Successfully configured Firebase Emulator connections.");
    } catch (error) {
        // We log the error but don't crash the app. The SDK will retry.
        console.error("Error connecting to Firebase Emulators during initial attempt:", error);
    }
};


const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Connect to emulators on initial mount. The useEffect hook ensures this runs
  // only on the client after the component has mounted.
  useEffect(() => {
    connectToEmulators();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, loading };

  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
