
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

let emulatorsConnected = false;

const connectToEmulators = () => {
    // This function should only run in a browser environment.
    if (typeof window === 'undefined') {
        return;
    }

    // Prevent re-initializing emulators
    if (emulatorsConnected) {
        return;
    }

    try {
        const host = window.location.hostname;

        if (host.includes('cloudworkstations.dev')) {
            const baseHost = host.substring(host.indexOf('-') + 1);
            
            const authHost = `9099-${baseHost}`;
            const firestoreHost = `8080-${baseHost}`;
            
            console.log(`- Connecting to Cloud Emulators...`);
            console.log(`  - Auth Host: https://${authHost}`);
            console.log(`  - Firestore Host: ${firestoreHost} (SSL)`);
            
            // connectAuthEmulator accepts a full URL
            connectAuthEmulator(auth, `https://${authHost}`, { disableWarnings: true });
            
            // connectFirestoreEmulator accepts host and port, and has an ssl option.
            // When connecting to the HTTPS proxy, the port is 443.
            connectFirestoreEmulator(db, firestoreHost, 443, { ssl: true });

        } else {
            console.log("- Connecting to localhost emulators");
            connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
            connectFirestoreEmulator(db, 'localhost', 8080);
        }
        
        emulatorsConnected = true;

    } catch (error) {
        console.error("Error initiating connection to Firebase Emulators:", error);
    }
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
    if (isClient && process.env.NODE_ENV === 'development') {
        // Adding a more robust delay to ensure network proxies are ready.
        setTimeout(connectToEmulators, 1000);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isClient]);

  if (!isClient || loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
