'use client';

import { auth as getFirebaseAuth } from '@/lib/firebase';
import {
  Auth,
  GoogleAuthProvider,
  IdTokenResult,
  User,
  UserCredential,
  connectAuthEmulator,
  onIdTokenChanged,
  signInAnonymously as firebaseSignInAnonymously,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
export type ClaimsStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface AuthContextValue {
  /** Firebase Auth instance */
  auth: Auth;
  /** Current signed-in Firebase user */
  user: User | null;
  /** Custom claims decoded from the ID token */
  claims: IdTokenResult['claims'] | null;
  /** Whether we are currently resolving the user */
  userStatus: AuthStatus;
  /** Whether we are currently resolving the claims for the active user */
  claimsStatus: ClaimsStatus;
  /** Last error encountered while resolving auth state */
  error: Error | null;
  /** Signs a user in with the configured Google provider */
  signInWithGoogle: () => Promise<UserCredential>;
  /** Signs the current user out */
  signOut: () => Promise<void>;
  /** Issues an anonymous sign-in (primarily for tests) */
  signInAnonymously: () => Promise<UserCredential>;
}

interface AuthClient {
  AuthProvider: React.FC<{ children: ReactNode }>;
}

let cachedClient: AuthClient | null = null;
let AuthContext: React.Context<AuthContextValue | undefined> | null = null;
let emulatorLinked = false;

function useFirebaseAuthInstance(): Auth {
  const auth = getFirebaseAuth();

  if (!emulatorLinked) {
    const host = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;
    if (host) {
      connectAuthEmulator(auth, host.startsWith('http') ? host : `http://${host}`, {
        disableWarnings: true,
      });
    }
    emulatorLinked = true;
  }

  return auth;
}

export function initAuthClient(): AuthClient {
  if (cachedClient && AuthContext) {
    return cachedClient;
  }

  AuthContext = createContext<AuthContextValue | undefined>(undefined);
  const firebaseAuth = useFirebaseAuthInstance();
  const providers = {
    google: new GoogleAuthProvider(),
  } as const;

  const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [claims, setClaims] = useState<IdTokenResult['claims'] | null>(null);
    const [userStatus, setUserStatus] = useState<AuthStatus>('idle');
    const [claimsStatus, setClaimsStatus] = useState<ClaimsStatus>('idle');
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      setUserStatus('loading');

      const unsubscribe = onIdTokenChanged(
        firebaseAuth,
        async (firebaseUser) => {
          setError(null);
          setUser(firebaseUser);

          if (!firebaseUser) {
            setClaims(null);
            setUserStatus('unauthenticated');
            setClaimsStatus('idle');
            return;
          }

          setUserStatus('authenticated');
          setClaimsStatus('loading');

          try {
            const tokenResult = await firebaseUser.getIdTokenResult(true);
            setClaims(tokenResult.claims);
            setClaimsStatus('ready');
          } catch (err) {
            setClaims(null);
            setClaimsStatus('error');
            setError(err instanceof Error ? err : new Error('Failed to resolve ID token claims.'));
          }
        },
        (err) => {
          setError(err instanceof Error ? err : new Error('Failed to resolve auth state.'));
          setUser(null);
          setClaims(null);
          setUserStatus('unauthenticated');
          setClaimsStatus('idle');
        }
      );

      return () => unsubscribe();
    }, [firebaseAuth]);

    const signInWithGoogle = useCallback(async () => {
      try {
        setError(null);
        return await signInWithPopup(firebaseAuth, providers.google);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unable to sign in with Google.'));
        throw err;
      }
    }, [firebaseAuth]);

    const signOut = useCallback(async () => {
      try {
        setError(null);
        await firebaseSignOut(firebaseAuth);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unable to sign out.'));
        throw err;
      }
    }, [firebaseAuth]);

    const signInAnonymously = useCallback(async () => {
      try {
        setError(null);
        return await firebaseSignInAnonymously(firebaseAuth);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unable to sign in anonymously.'));
        throw err;
      }
    }, [firebaseAuth]);

    const value = useMemo<AuthContextValue>(
      () => ({
        auth: firebaseAuth,
        user,
        claims,
        userStatus,
        claimsStatus,
        error,
        signInWithGoogle,
        signOut,
        signInAnonymously,
      }),
      [firebaseAuth, user, claims, userStatus, claimsStatus, error, signInWithGoogle, signOut, signInAnonymously]
    );

    return <AuthContext!.Provider value={value}>{children}</AuthContext!.Provider>;
  };

  cachedClient = { AuthProvider };
  return cachedClient;
}

export function useAuth(): AuthContextValue {
  if (!AuthContext) {
    initAuthClient();
  }

  const context = useContext(AuthContext!);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}

