const path = require('path');
const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
  PermissionDeniedError,
} = require('./rulesEmulator');

const TEST_PROJECT = 'urai-home-world-rules-test';
const OWNER_UID = 'owner-home-world';
const OTHER_UID = 'other-home-world';

const HOME_WORLD_STATE = {
  userId: OWNER_UID,
  groundTier: 3,
  orbTier: 4,
  skyTier: 2,
  moodState: 'recovery',
  recoveryState: 'growing',
  energyScore: 74,
  narratorSpeaking: false,
  orbPulseIntensity: 0.72,
  skyWeatherIntensity: 0.32,
  groundGrowthIntensity: 0.64,
  updatedAt: '2026-05-21T00:00:00.000Z',
};

describe('HomeWorld Firestore policy boundaries', () => {
  let testEnv;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: TEST_PROJECT,
      firestore: { rulesPath: path.resolve(__dirname, '../../firestore.rules') },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  afterEach(async () => {
    await testEnv.clearFirestore();
  });

  test('allows the owner to create, read, and update their canonical HomeWorld state', async () => {
    const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
    const doc = ownerDb.collection('users').doc(OWNER_UID).collection('homeWorld').doc('state');

    await expect(assertSucceeds(doc.set(HOME_WORLD_STATE))).resolves.toBeNull();
    await expect(assertSucceeds(doc.get())).resolves.toBeTruthy();
    await expect(assertSucceeds(doc.update({ ...HOME_WORLD_STATE, energyScore: 81 }))).resolves.toBeNull();
  });

  test('rejects cross-user reads and writes to HomeWorld state', async () => {
    await seedHomeWorld(testEnv, OWNER_UID, HOME_WORLD_STATE);
    const otherDb = testEnv.authenticatedContext(OTHER_UID).firestore();
    const otherView = otherDb.collection('users').doc(OWNER_UID).collection('homeWorld').doc('state');

    await expect(assertFails(otherView.get())).resolves.toBeInstanceOf(PermissionDeniedError);
    await expect(assertFails(otherView.set({ ...HOME_WORLD_STATE, userId: OTHER_UID }))).resolves.toBeInstanceOf(PermissionDeniedError);
    await expect(assertFails(otherView.update({ energyScore: 4 }))).resolves.toBeInstanceOf(PermissionDeniedError);
  });

  test('rejects anonymous access to HomeWorld state', async () => {
    await seedHomeWorld(testEnv, OWNER_UID, HOME_WORLD_STATE);
    const anonDb = testEnv.unauthenticatedContext().firestore();
    const anonView = anonDb.collection('users').doc(OWNER_UID).collection('homeWorld').doc('state');

    await expect(assertFails(anonView.get())).resolves.toBeInstanceOf(PermissionDeniedError);
  });
});

async function seedHomeWorld(testEnv, uid, data) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await context.firestore().collection('users').doc(uid).collection('homeWorld').doc('state').set(data);
  });
}
