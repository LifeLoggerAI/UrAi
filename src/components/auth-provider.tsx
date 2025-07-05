
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

const connectToEmulators = () => {
    // Use a global flag to ensure this logic only runs once per full page load.
    if (typeof window === 'undefined' || (window as any).emulatorsConnected) {
        return;
    }

    const host = window.location.hostname;
    const isCloudDev = host.includes('cloudworkstations.dev');

    // In a cloud IDE, we connect to the emulators via HTTPS proxies.
    // Otherwise, we connect to them directly via HTTP on localhost.
    if (isCloudDev) {
        const baseHost = host.substring(host.indexOf('-') + 1);
        const authHost = `9099-${baseHost}`;
        const firestoreHost = `8080-${baseHost}`;
        
        console.log("Attempting to connect to Cloud IDE emulators...");
        console.log(`- Auth Host: https://${authHost}`);
        console.log(`- Firestore Host: ${firestoreHost} (SSL)`);
        
        // connectAuthEmulator accepts a full URL
        connectAuthEmulator(auth, `https://${authHost}`, { disableWarnings: true });
        
        // connectFirestoreEmulator accepts host and port, and has an ssl option.
        // When connecting to the HTTPS proxy, the port is 443.
        connectFirestoreEmulator(db, firestoreHost, 443, { ssl: true });

    } else {
        console.log("Attempting to connect to local emulators...");
        // For local development, connect to standard localhost ports.
        connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
        connectFirestoreEmulator(db, "127.0.0.1", 8080);
    }
    
    console.log("✅ Firebase Emulators connected successfully.");
    (window as any).emulatorsConnected = true; // Set the global flag
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
        // This timeout gives the cloud environment's network proxies time to initialize.
        // A longer delay is used here to be more robust against slow startup times.
        setTimeout(connectToEmulators, 3000);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isClient]);

  if (!isClient) {
    return null;
  }

  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
