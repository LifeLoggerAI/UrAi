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

// A one-time flag to ensure emulators are connected only once.
let emulatorsConnected = false;

const connectToEmulators = () => {
    if (emulatorsConnected) {
        return;
    }

    // This code will only run in the browser, in a development environment.
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        console.log("Connecting to Firebase Emulators...");
        try {
            const isSecure = window.location.protocol === 'https:';
            
            if (isSecure) {
                // In a secure cloud IDE, ports are often forwarded to subdomains.
                const originalHost = window.location.hostname;
                const baseHost = originalHost.substring(originalHost.indexOf('-') + 1);
                
                const authHost = `9099-${baseHost}`;
                const firestoreHost = `8080-${baseHost}`;

                console.log(`Configuring emulators for secure cloud host:`);
                console.log(`- Auth URL: https://${authHost}`);
                console.log(`- Firestore Host: ${firestoreHost} (SSL)`);
                
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
            
            emulatorsConnected = true;
            console.log("Emulator connections configured successfully.");
        } catch (error) {
            console.error("Fatal error connecting to emulators:", error);
        }
    }
};


const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Connect to emulators on initial mount.
  // This is more robust than connecting when the module is imported.
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

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
         <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
         </div>
      ) : (
        children
      )}
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
