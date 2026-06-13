
import { UraiAuthProvider, useUraiAuth } from '@/providers/UraiAuthProvider';
import { render, act, findByTestId } from '@testing-library/react';
import { UraiFirebaseClientState } from '../firebase/firebaseTypes';

let authStateCallback: (user: any) => void;

// Mock Firebase client
const mockAuth = {
  onAuthStateChanged: jest.fn(callback => {
    authStateCallback = callback;
    return () => {}; // Unsubscribe function
  }),
  signInAnonymously: jest.fn(),
  signInWithPopup: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  signOut: jest.fn(() => {
    // Simulate sign-out by clearing the user
    // @ts-ignore
    mockAuth.currentUser = null;
  }),
  deleteUser: jest.fn(),
  currentUser: null,
};

jest.mock('@/lib/firebase/firebaseClient', () => ({
  getUraiFirebaseClient: () => ({
    state: { configured: true, reason: 'ready' },
    auth: mockAuth,
    db: {},
    storage: {},
  }),
  isFirebaseConfigured: () => true,
}));

describe('UraiAuthProvider', () => {
  it('should allow a user to sign in and out', async () => {
    const TestComponent = () => {
      const {
        signInWithEmail,
        signOut,
        isAuthenticated,
      } = useUraiAuth();

      return (
        <div>
          <button onClick={() => signInWithEmail('test@example.com', 'password')}>Sign In</button>
          <button onClick={() => signOut()}>Sign Out</button>
          <div data-testid="status">{isAuthenticated ? 'Signed In' : 'Signed Out'}</div>
        </div>
      );
    };

    const { getByText, findByTestId, container } = render(
      <UraiAuthProvider>
        <TestComponent />
      </UraiAuthProvider>
    );

    await act(async () => {
      getByText('Sign In').click();
      // Simulate auth state change for sign-in
      authStateCallback({ uid: 'test-user' });
    });

    expect(await findByTestId('status')).toHaveTextContent('Signed In');

    await act(async () => {
      getByText('Sign Out').click();
      // Simulate auth state change for sign-out
      authStateCallback(null);
    });

    expect(await findByTestId('status')).toHaveTextContent('Signed Out');
  });
});
