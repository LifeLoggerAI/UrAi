
'use client';

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

const connectToEmulators = () => {
    // This global flag prevents re-connecting on every hot-reload.
    if ((globalThis as any).emulatorsConnected) {
        return;
    }

    // A delay helps ensure the network proxies in the cloud dev env are ready.
    setTimeout(() => {
        try {
            const isCloudDev = window.location.hostname.includes('cloudworkstations.dev');
            if (isCloudDev) {
                const hostname = window.location.hostname;
                const authHost = hostname.replace('6000-', '9099-');
                const firestoreHost = hostname.replace('6000-', '8080-');
                
                const authUrl = `https://${authHost}`;

                console.log(`Cloud Dev environment detected. Connecting to proxied emulators...`);
                connectAuthEmulator(auth, authUrl, { disableWarnings: true });
                
                // When connecting to the HTTPS proxy for Firestore, the port is 443.
                connectFirestoreEmulator(db, firestoreHost, 443, { ssl: true });
            } else {
                // For local development, connect to localhost.
                console.log("Local environment detected. Connecting to localhost emulators...");
                connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
                connectFirestoreEmulator(db, "127.0.0.1", 8080);
            }

            (globalThis as any).emulatorsConnected = true;
            console.log("✅ Firebase Emulators connected.");

        } catch (error) {
            console.error("Failed to connect to emulators:", error);
        }
    }, 1000); // 1-second delay for safety
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
        connectToEmulators();
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!isClient) {
    return null;
  }
  
  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading: false }}>
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
