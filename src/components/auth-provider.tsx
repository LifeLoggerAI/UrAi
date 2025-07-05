
'use client';

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

// This global flag prevents re-connecting on every hot-reload in development.
let emulatorsConnected = false;

const connectToEmulators = () => {
    if (emulatorsConnected) {
        return;
    }

    // A robust delay to ensure the cloud environment's network proxies are ready.
    setTimeout(() => {
        try {
            console.log("Connecting to Firebase Emulators...");

            const host = window.location.hostname;
            const firestoreHost = host.replace("6000-", "8080-");
            const authHost = host.replace("6000-", "9099-");
            
            const authUrl = `https://_workstation-dev-ext.${authHost}`;

            connectAuthEmulator(auth, authUrl, { disableWarnings: true });
            connectFirestoreEmulator(db, firestoreHost, 443, { ssl: true });

            emulatorsConnected = true;
            console.log("✅ Firebase Emulators connected.");
        } catch (error) {
            console.error("!!! Failed to connect to emulators:", error);
        }
    }, 1500); // Increased delay for stability
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

  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
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
