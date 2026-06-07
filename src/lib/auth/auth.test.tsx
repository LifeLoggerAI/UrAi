import { UraiAuthProvider, useUraiAuth } from '@/providers/UraiAuthProvider';
import { render, act, waitFor } from '@testing-library/react';
import { UraiFirebaseClientState } from '../firebase/firebaseTypes';

const mockUser = {
  uid: 'test-user',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null,
  isAnonymous: false,
};

let authListener: ((user: typeof mockUser | null) => void) | null = null;
const mockAuth = { currentUser: null as typeof mockUser | null };

jest.mock('firebase/auth', () => ({
  GoogleAuthProvider: jest.fn(),
  onAuthStateChanged: jest.fn((_auth, next) => {
    authListener = next;
    next(null);
    return jest.fn();
  }),
  signInWithEmailAndPassword: jest.fn(async () => {
    mockAuth.currentUser = mockUser;
    authListener?.(mockUser);
    return { user: mockUser };
  }),
  signOut: jest.fn(async () => {
    mockAuth.currentUser = null;
    authListener?.(null);
  }),
  createUserWithEmailAndPassword: jest.fn(async () => ({ user: mockUser })),
  deleteUser: jest.fn(async () => undefined),
  sendPasswordResetEmail: jest.fn(async () => undefined),
  signInAnonymously: jest.fn(async () => ({ user: { ...mockUser, isAnonymous: true } })),
  signInWithPopup: jest.fn(async () => ({ user: mockUser })),
  updateProfile: jest.fn(async () => undefined),
}));

jest.mock('@/lib/firebase/firebaseClient', () => ({
  getUraiFirebaseClient: (): { state: UraiFirebaseClientState; auth: typeof mockAuth; db: object; storage: object } => ({
    state: { configured: true, reason: 'ready' },
    auth: mockAuth,
    db: {},
    storage: {},
  }),
  isFirebaseConfigured: () => true,
}));

jest.mock('@/lib/auth/userProfileService', () => ({
  createOrUpdateUserProfile: jest.fn(async (userId, profile) => ({ ...profile, userId })),
  getUserProfile: jest.fn(async () => null),
  markAccountDeleted: jest.fn(async () => undefined),
  markAccountPendingDeletion: jest.fn(async () => undefined),
  markUserLogin: jest.fn(async () => undefined),
}));

describe('UraiAuthProvider', () => {
  beforeEach(() => {
    authListener = null;
    mockAuth.currentUser = null;
    window.localStorage.clear();
  });

  it('should allow a user to sign in and out', async () => {
    const TestComponent = () => {
      const { signInWithEmail, signOut, isAuthenticated } = useUraiAuth();

      return (
        <div>
          <button onClick={() => signInWithEmail('test@example.com', 'password')}>Sign In</button>
          <button onClick={() => signOut()}>Sign Out</button>
          <div data-testid="status">{isAuthenticated ? 'Signed In' : 'Signed Out'}</div>
        </div>
      );
    };

    const { getByText, findByTestId } = render(
      <UraiAuthProvider>
        <TestComponent />
      </UraiAuthProvider>
    );

    await act(async () => {
      getByText('Sign In').click();
    });

    await waitFor(async () => {
      expect(await findByTestId('status')).toHaveTextContent('Signed In');
    });

    await act(async () => {
      getByText('Sign Out').click();
    });

    await waitFor(async () => {
      expect(await findByTestId('status')).toHaveTextContent('Signed Out');
    });
  });
});
