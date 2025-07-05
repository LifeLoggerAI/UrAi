
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

// Use a global flag on the window object to ensure this logic only runs once per full page load,
// preventing issues with Next.js fast refresh.
if (typeof window !== 'undefined') {
  (window as any).emulatorsConnected = (window as any).emulatorsConnected || false;
}

/**
 * Connects to the Firebase emulators with a robust retry mechanism.
 * This is necessary to handle the race condition where the app tries to
 * connect before the cloud dev environment's network proxies are ready.
 */
const connectToEmulators = async () => {
    if (typeof window === 'undefined' || (window as any).emulatorsConnected) {
        return;
    }

    const host = window.location.hostname;
    const isCloudDev = host.includes('cloudworkstations.dev');

    // Define emulator connection details based on the environment.
    const authHost = isCloudDev ? `9099-${host.substring(host.indexOf('-') + 1)}` : '127.0.0.1:9099';
    const firestoreHost = isCloudDev ? `8080-${host.substring(host.indexOf('-') + 1)}` : '127.0.0.1';
    const firestorePort = isCloudDev ? 443 : 8080;
    const protocol = isCloudDev ? 'https' : 'http';
    const authUrl = `${protocol}://${authHost}`;
    
    // The URL to ping. We add a path to ensure it's a valid URL object.
    const pingUrl = `${authUrl}/`;

    const maxRetries = 5;
    const initialDelay = 400; // Start with a slightly longer delay

    console.log("Attempting to connect to Firebase Emulators...");

    for (let i = 0; i < maxRetries; i++) {
        try {
            // Manually ping the auth emulator to see if the proxy is ready.
            // We use 'no-cors' because we don't care about the response, only that the network request succeeds.
            await fetch(pingUrl, { mode: 'no-cors' });
            console.log(`✅ Ping to Auth emulator at ${pingUrl} successful.`);
            
            // If ping is successful, connect the real emulators.
            connectAuthEmulator(auth, authUrl, { disableWarnings: true });
            connectFirestoreEmulator(db, firestoreHost, firestorePort, { ssl: isCloudDev });
            
            console.log("✅ Firebase Emulators connected successfully.");
            (window as any).emulatorsConnected = true; // Set the global flag
            return; // Success, exit function.
        } catch (error) {
            console.warn(`- Emulator connection attempt ${i + 1} failed.`);
            if (i < maxRetries - 1) {
                const delay = initialDelay * Math.pow(2, i);
                console.log(`  Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error("❌ Failed to connect to Firebase Emulators after all retries. Please refresh the page.");
            }
        }
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
    // This ensures the component has mounted on the client, avoiding hydration errors.
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && process.env.NODE_ENV === 'development') {
      connectToEmulators();
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isClient]);

  if (!isClient) {
    // Render nothing on the server and initial client render to prevent hydration mismatches.
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
