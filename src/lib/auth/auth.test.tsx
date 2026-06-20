import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UraiAuthProvider, useUraiAuth } from '@/providers/UraiAuthProvider';
import { signInWithEmailAndPassword } from 'firebase/auth';

const mockSignedInUser = {
  uid: 'test-user',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null,
  isAnonymous: false,
  getIdToken: jest.fn(async () => 'test-token'),
};

let mockAuthStateCallback: ((user: unknown) => void) | null = null;

const mockAuth = {
  app: { name: '[DEFAULT]' },
  currentUser: null as unknown,
};

jest.mock('@/lib/firebase/firebaseClient', () => ({
  getUraiFirebaseClient: jest.fn(() => ({
    state: { configured: true, reason: 'ready' },
    auth: mockAuth,
    db: {},
    storage: {},
  })),
  getFirebaseClient: jest.fn(() => ({
    state: { configured: true, reason: 'ready' },
    auth: mockAuth,
    db: {},
    storage: {},
  })),
  isFirebaseConfigured: jest.fn(() => true),
}));

jest.mock('firebase/auth', () => ({
  GoogleAuthProvider: jest.fn(),
  browserLocalPersistence: {},
  setPersistence: jest.fn(async () => undefined),
  onAuthStateChanged: jest.fn((_auth, callback) => {
    mockAuthStateCallback = callback;
    callback(null);
    return jest.fn();
  }),
  signInWithEmailAndPassword: jest.fn(async () => {
    mockAuth.currentUser = mockSignedInUser;
    mockAuthStateCallback?.(mockSignedInUser);
    return { user: mockSignedInUser };
  }),
  signOut: jest.fn(async () => {
    mockAuth.currentUser = null;
    mockAuthStateCallback?.(null);
  }),
  signInAnonymously: jest.fn(async () => {
    const user = {
      ...mockSignedInUser,
      uid: 'anonymous-user',
      email: null,
      displayName: null,
      isAnonymous: true,
    };
    mockAuth.currentUser = user;
    mockAuthStateCallback?.(user);
    return { user };
  }),
  signInWithPopup: jest.fn(async () => {
    mockAuth.currentUser = mockSignedInUser;
    mockAuthStateCallback?.(mockSignedInUser);
    return { user: mockSignedInUser };
  }),
  createUserWithEmailAndPassword: jest.fn(async () => {
    mockAuth.currentUser = mockSignedInUser;
    mockAuthStateCallback?.(mockSignedInUser);
    return { user: mockSignedInUser };
  }),
  sendPasswordResetEmail: jest.fn(async () => undefined),
  updateProfile: jest.fn(async () => undefined),
  deleteUser: jest.fn(async () => undefined),
}));

function TestAuthStatus() {
  const { isAuthenticated, signInWithEmail, signOut } = useUraiAuth();

  return (
    <div>
      <button onClick={() => signInWithEmail('test@example.com', 'password')}>Sign In</button>
      <button onClick={() => signOut({ clearLocal: true })}>Sign Out</button>
      <div data-testid="status">{isAuthenticated ? 'Signed In' : 'Signed Out'}</div>
    </div>
  );
}

describe('UraiAuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.currentUser = null;
    mockAuthStateCallback = null;
  });

  it('should allow a user to sign in and expose a safe sign-out control', async () => {
    const { findByTestId, getByText } = render(
      <UraiAuthProvider>
        <TestAuthStatus />
      </UraiAuthProvider>,
    );

    await waitFor(async () => {
      expect(await findByTestId('status')).toHaveTextContent('Signed Out');
    });

    await act(async () => {
      getByText('Sign In').click();
    });

    await waitFor(async () => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, 'test@example.com', 'password');
      expect(await findByTestId('status')).toHaveTextContent('Signed In');
    });

    await act(async () => {
      getByText('Sign Out').click();
    });

    expect(getByText('Sign Out')).toBeInTheDocument();
  });
});
