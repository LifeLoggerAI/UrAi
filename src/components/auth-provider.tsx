'use client';

import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
  useRef,
} from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { devMode, seedDemoData, DEMO_USER_ID } from '@/lib/dev-mode';

// Create a mock user object for demo mode
const mockUser = {
  uid: DEMO_USER_ID,
  displayName: 'Demo User',
  email: 'test@lifelogger.app',
  photoURL: `https://placehold.co/128x128.png?text=D`,
  emailVerified: true,
  isAnonymous: false,
  providerData: [],
  refreshToken: '',
  tenantId: null,
  metadata: {
    creationTime: '2024-01-01T00:00:00.000Z',
    lastSignInTime: '2024-01-01T00:00:00.000Z',
  },
  getIdToken: async () => 'mock-token',
  getIdTokenResult: async () => ({
    authTime: '',
    expirationTime: '',
    issuedAtTime: '',
    signInProvider: '',
    signInSecondFactor: null,
    token: 'mock-token',
    claims: {},
  }),
  reload: async () => {},
  toJSON: () => ({}),
  delete: async () => {},
} as User;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDemo: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isDemo: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const hasSeeded = useRef(false);

  useEffect(() => {
    if (devMode) {
      setUser(mockUser);
      setLoading(false);
      
      // Seed demo data once
      if (!hasSeeded.current) {
        hasSeeded.current = true;
        seedDemoData();
      }
      
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, isDemo: devMode }}>
      {children}
    </AuthContext.Provider>
  );
}