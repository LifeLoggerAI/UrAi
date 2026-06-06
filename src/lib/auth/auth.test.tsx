
import { UraiAuthProvider, useUraiAuth } from '@/providers/UraiAuthProvider';
import { render, act } from '@testing-library/react';
import { UraiFirebaseClientState } from '../firebase/firebaseTypes';

// Mock Firebase client
jest.mock('@/lib/firebase/firebaseClient', () => ({
  getUraiFirebaseClient: (): { state: UraiFirebaseClientState } => ({
    state: { configured: true, reason: 'ready' },
    auth: {
      onAuthStateChanged: jest.fn(),
      signInAnonymously: jest.fn(),
      signInWithPopup: jest.fn(),
      signInWithEmailAndPassword: jest.fn(),
      createUserWithEmailAndPassword: jest.fn(),
      sendPasswordResetEmail: jest.fn(),
      signOut: jest.fn(),
      deleteUser: jest.fn(),
      currentUser: null,
    },
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

    const { getByText, findByTestId } = render(
      <UraiAuthProvider>
        <TestComponent />
      </UraiAuthProvider>
    );

    await act(async () => {
      getByText('Sign In').click();
    });

    expect(await findByTestId('status')).toHaveTextContent('Signed In');

    await act(async () => {
      getByText('Sign Out').click();
    });

    expect(await findByTestId('status')).toHaveTextContent('Signed Out');
  });
});
