
'use client';

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { devMode, mockUser, loadMockData } from '@/lib/dev-mode';
import { doc, getDoc, setDoc, serverTimestamp, disableNetwork, enableNetwork } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  useEffect(() => {
    // This function attempts to verify and, if necessary, recover the Firestore connection.
    const checkFirestoreConnection = async () => {
        console.log("Checking Firestore connection...");
        const testDocRef = doc(db, "healthCheck", "status");
        
        const reconnectFirestore = async () => {
          try {
            console.log("🚫 Disabling Firestore network...");
            await disableNetwork(db);
            console.log("🔄 Re-enabling Firestore network...");
            await enableNetwork(db);
            console.log("✅ Network re-enabled.");
          } catch (err) {
            console.error("❌ Network toggle failed:", err);
          }
        };

        try {
            const docSnap = await getDoc(testDocRef);
            if (docSnap.exists()) {
                console.log("✅ Firestore connection healthy. Document found:", docSnap.data());
            } else {
                console.warn("⚠️ Health check document not found. Attempting to create.");
                await setDoc(testDocRef, { status: "ok", timestamp: serverTimestamp() });
                console.log("🆕 Health check document created.");
            }
        } catch (error: any) {
            console.error("❌ Initial Firestore read failed:", error.message);
            if (error.code === 'unavailable' || error.message.includes("offline")) {
                console.log("🔁 Detected offline error. Attempting to recover...");
                await reconnectFirestore();
                try {
                    // Retry the read/write
                    const retryDoc = await getDoc(testDocRef);
                    if (retryDoc.exists()) {
                        console.log("✅ Retry success. Document found:", retryDoc.data());
                    } else {
                        await setDoc(testDocRef, { status: "ok_after_retry", timestamp: serverTimestamp() });
                        console.log("🆕 Health check document created after retry.");
                    }
                } catch (retryError: any) {
                    console.error("❌ Firestore connection recovery failed:", retryError.message);
                    toast({
                        variant: "destructive",
                        title: "Firestore Connection Failed",
                        description: "Could not connect to the database even after a retry. Please check the emulator status.",
                    });
                }
            }
        }
    };

    if (devMode) {
      // --- Development Mode ---
      // Verify connection and load mock data
      checkFirestoreConnection();
      loadMockData(); // This function is idempotent.
      setUser(mockUser as User);
      setLoading(false);
    } else {
      // --- Production Mode ---
      // Listen for real auth state changes.
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, [toast]);

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
