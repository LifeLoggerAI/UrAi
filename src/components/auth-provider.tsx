
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
    // This function should only run in a browser environment.
    if (typeof window === 'undefined') {
        return;
    }

    // Prevent re-initializing emulators, which can happen with hot-reloading
    if ((globalThis as any)._firebaseEmulatorsConnected) {
        return;
    }

    try {
        const host = window.location.hostname;
        const protocol = window.location.protocol;

        if (protocol === 'https:' && host.includes('cloudworkstations.dev')) {
            const baseHost = host.substring(host.indexOf('-') + 1);
            
            const authHost = `9099-${baseHost}`;
            const firestoreHost = `8080-${baseHost}`;
            
            console.log(`- Auth Host: https://${authHost}`);
            console.log(`- Firestore Host: ${firestoreHost} (SSL)`);
            
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
        
        (globalThis as any)._firebaseEmulatorsConnected = true;

    } catch (error) {
        // Don't crash the app if emulators fail to connect.
        // This can happen in production or if the emulators are not running.
        console.error("Error initiating connection to Firebase Emulators:", error);
    }
};


const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // This effect runs only once on the client, after the initial render.
  useEffect(() => {
    setIsClient(true);

    if (process.env.NODE_ENV === 'development') {
        // Defer connection to allow network proxies to initialize.
        setTimeout(connectToEmulators, 100);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // On the server, and on the initial client render, `isClient` is false.
  // In this case, we render nothing to guarantee a match and avoid hydration errors.
  if (!isClient) {
    return null;
  }
  
  // After the component has mounted on the client, `isClient` is true.
  // Now we can safely render the loader or the children based on the auth state.
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
