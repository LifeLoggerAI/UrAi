
'use client';

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { devMode, mockUser, loadMockData } from '@/lib/dev-mode';
import { doc, getDoc, setDoc, serverTimestamp, disableNetwork, enableNetwork, onSnapshot } from 'firebase/firestore';
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
        console.log("Health Check: Starting advanced Firestore connection check...");

        const DOCS_TO_CHECK = [
            { collection: "healthCheck", docId: "status" },
            { collection: "users", docId: mockUser.uid },
        ];

        const fallbackData = {
            message: "Auto-created fallback document",
            createdAt: serverTimestamp()
        };

        const reconnectFirestore = async () => {
            try {
                console.log("Health Check: Disabling Firestore network...");
                await disableNetwork(db);
                console.log("Health Check: Re-enabling Firestore network...");
                await enableNetwork(db);
                console.log("Health Check: Network toggled successfully.");
            } catch (err) {
                console.error("Health Check: Network toggle failed:", err);
            }
        };
        
        const writeLog = async (results: any[]) => {
            const logRef = doc(db, "logs", "firestoreStatus");
            try {
                await setDoc(logRef, {
                    timestamp: serverTimestamp(),
                    results: results,
                    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : "unknown"
                });
                console.log("Health Check: Log written to /logs/firestoreStatus");
            } catch (err) {
                console.error("Health Check: Failed to write log:", err);
            }
        };
        
        const checkOrCreateDoc = async (collectionName: string, docId: string) => {
            const ref = doc(db, collectionName, docId);
            try {
                const docSnap = await getDoc(ref);
                if (docSnap.exists()) {
                    console.log(`Health Check: [${collectionName}/${docId}] exists.`);
                    return { status: "exists", docId: `${collectionName}/${docId}` };
                } else {
                    console.warn(`Health Check: [${collectionName}/${docId}] not found. Creating fallback...`);
                    // Skip creating user doc, as loadMockData handles it.
                    if (collectionName !== 'users') {
                       await setDoc(ref, fallbackData);
                       console.log(`Health Check: [${collectionName}/${docId}] created.`);
                    } else {
                       console.log(`Health Check: Skipping creation for users doc, handled by mock data loader.`);
                    }
                    return { status: "created", docId: `${collectionName}/${docId}` };
                }
            } catch (err: any) {
                console.error(`Health Check: Error reading [${collectionName}/${docId}]:`, err.message);
                if (err.message.includes("offline") || err.code === "unavailable") {
                    await reconnectFirestore();
                }
                return { status: "error", docId: `${collectionName}/${docId}`, error: err.message };
            }
        };

        const checkAllDocsWithRetry = async () => {
            console.log("Health Check: Running check on all specified documents...");
            const results = [];
            let allGood = true;

            for (const { collection, docId } of DOCS_TO_CHECK) {
                const result = await checkOrCreateDoc(collection, docId);
                results.push(result);
                if (result.status === "error") allGood = false;
            }

            await writeLog(results);

            if (!allGood) {
                console.log("Health Check: Some doc checks failed. Retrying in 10 seconds...");
                setTimeout(checkAllDocsWithRetry, 10000);
            } else {
                console.log("Health Check: All documents are healthy.");
                // All good, now load mock data which may rely on a healthy connection.
                loadMockData(); 
            }
        };
        
        onSnapshot(doc(db, "healthCheck", "status"), (doc) => {
             if (!doc.metadata.fromCache) {
                console.log("Health Check: Firestore is now online and synced.");
             }
        });

        // Start the check process
        checkAllDocsWithRetry();
    };


    if (devMode) {
      // --- Development Mode ---
      // Run advanced health check, which will then trigger mock data loading upon success.
      checkFirestoreConnection();
      
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
