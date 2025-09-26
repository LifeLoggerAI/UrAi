import { ChildProcess, spawn } from 'child_process';
import path from 'path';
import { act, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import HomePage from '../home/page';
import OnboardingPage from '../onboarding/page';
import { initAuthClient, useAuth } from '../auth';
import { auth as getFirebaseAuth } from '@/lib/firebase';

const routerPushMock = jest.fn();
const routerReplaceMock = jest.fn();

let mockPathname = '/';

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: () => ({
    push: routerPushMock,
    replace: routerReplaceMock,
  }),
  usePathname: () => mockPathname,
}));

const PROJECT_ID = 'demo-urai';
const EMULATOR_HOST = '127.0.0.1';
const EMULATOR_PORT = 9099;
const EMULATOR_URL = `http://${EMULATOR_HOST}:${EMULATOR_PORT}`;

let emulatorProcess: ChildProcess | null = null;
let emulatorAvailable = true;

async function startAuthEmulator() {
  const binCandidates = [
    path.join(process.cwd(), 'node_modules', '.bin', 'firebase'),
    'firebase',
  ];

  for (const candidate of binCandidates) {
    try {
      const child = spawn(candidate, [
        'emulators:start',
        '--only',
        'auth',
        '--project',
        PROJECT_ID,
        '--host',
        EMULATOR_HOST,
        '--port',
        String(EMULATOR_PORT),
      ], {
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      const readyPromise = new Promise<void>((resolve, reject) => {
        const handleOutput = (data: Buffer) => {
          const text = data.toString();
          if (text.includes('All emulators ready!')) {
            child.stdout?.off('data', handleOutput);
            child.stderr?.off('data', handleOutput);
            resolve();
          }
        };

        const handleError = (error: Error) => {
          child.stdout?.off('data', handleOutput);
          child.stderr?.off('data', handleOutput);
          reject(error);
        };

        child.once('error', handleError);
        child.stdout?.on('data', handleOutput);
        child.stderr?.on('data', handleOutput);
      });

      emulatorProcess = child;
      await readyPromise;
      return;
    } catch (error) {
      // Try the next candidate
    }
  }

  throw new Error('Unable to locate firebase-tools CLI to start the Auth emulator');
}

async function stopAuthEmulator() {
  if (!emulatorProcess) {
    return;
  }

  emulatorProcess.kill();
  await new Promise<void>((resolve) => {
    emulatorProcess?.once('exit', () => resolve());
  });
  emulatorProcess = null;
}

async function assignCustomClaims(uid: string, claims: Record<string, unknown>) {
  const response = await fetch(`${EMULATOR_URL}/emulator/v1/projects/${PROJECT_ID}/accounts:update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      localId: uid,
      customAttributes: JSON.stringify(claims),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to set custom claims: ${response.status} ${response.statusText}`);
  }
}

const { AuthProvider } = initAuthClient();

function AuthStateProbe() {
  const authState = useAuth();
  return (
    <div data-testid="auth-state">
      {authState.userStatus}:{authState.user?.email ?? 'none'}
    </div>
  );
}

beforeAll(async () => {
  jest.setTimeout(120000);
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST = EMULATOR_URL;
  process.env.FIREBASE_AUTH_EMULATOR_HOST = `${EMULATOR_HOST}:${EMULATOR_PORT}`;
  try {
    await startAuthEmulator();
  } catch (error) {
    emulatorAvailable = false;
    console.warn('Skipping auth integration tests; unable to launch Firebase emulator.', error);
  }
});

afterAll(async () => {
  if (emulatorAvailable) {
    await stopAuthEmulator();
  }
});

beforeEach(async () => {
  routerPushMock.mockClear();
  routerReplaceMock.mockClear();
  mockPathname = '/';

  if (!emulatorAvailable) {
    return;
  }

  const auth = getFirebaseAuth();
  await firebaseSignOut(auth).catch(() => undefined);
});

describe('Auth integration (Firebase emulator)', () => {
  test('sign-in and sign-out update the auth context state', async () => {
    if (!emulatorAvailable) {
      return;
    }

    const auth = getFirebaseAuth();
    const email = `user-${Date.now()}@example.com`;
    const password = 'Password123!';

    render(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>
    );

    await act(async () => {
      await createUserWithEmailAndPassword(auth, email, password);
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent(`authenticated:${email}`);
    });

    await act(async () => {
      await firebaseSignOut(auth);
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('unauthenticated:none');
    });
  });

  test('home route redirects anonymous or signed-out users to onboarding', async () => {
    if (!emulatorAvailable) {
      return;
    }

    const auth = getFirebaseAuth();
    await firebaseSignOut(auth).catch(() => undefined);

    mockPathname = '/home';

    render(
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(routerReplaceMock).toHaveBeenCalledWith('/onboarding');
    });

    expect(screen.getByText(/Redirecting you to onboarding/i)).toBeInTheDocument();
  });

  test('home route renders role-based content once claims resolve', async () => {
    if (!emulatorAvailable) {
      return;
    }

    const auth = getFirebaseAuth();
    const email = `guide-${Date.now()}@example.com`;
    const password = 'Password123!';

    await act(async () => {
      await createUserWithEmailAndPassword(auth, email, password);
    });

    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not available after sign-in');
    }

    await assignCustomClaims(currentUser.uid, { roles: ['guide'] });
    await act(async () => {
      await currentUser.getIdToken(true);
    });

    mockPathname = '/home';

    render(
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Guide Dashboard')).toBeInTheDocument();
    });

    expect(screen.getByText('Review Journeys')).toBeInTheDocument();
  });

  test('onboarding route forwards signed-in members to home', async () => {
    if (!emulatorAvailable) {
      return;
    }

    const auth = getFirebaseAuth();
    const email = `member-${Date.now()}@example.com`;
    const password = 'Password123!';

    await act(async () => {
      await createUserWithEmailAndPassword(auth, email, password);
    });

    mockPathname = '/onboarding';

    render(
      <AuthProvider>
        <OnboardingPage />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(routerReplaceMock).toHaveBeenCalledWith('/home');
    });
  });
});

