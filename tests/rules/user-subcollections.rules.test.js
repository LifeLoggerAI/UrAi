const path = require('path');
const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
  PermissionDeniedError,
} = require('./rulesEmulator');

const TEST_PROJECT = 'urai-user-subcollection-rules-test';
const OWNER_UID = 'owner-user-subcollections';
const OTHER_UID = 'other-user-subcollections';

const OWNER_SUBCOLLECTIONS = [
  ['homeState', 'current'],
  ['lifeMapNodes', 'node-1'],
  ['memories', 'memory-1'],
  ['memoryStars', 'star-1'],
  ['memoryBlooms', 'bloom-1'],
  ['companionState', 'current'],
  ['narratorInsights', 'insight-1'],
  ['passport', 'profile'],
  ['onboarding', 'profile'],
  ['system', 'syncState'],
  ['lifeMapStars', 'star-1'],
  ['spatialSettings', 'default'],
];

describe('User-scoped URAI subcollection rules', () => {
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

  test.each(OWNER_SUBCOLLECTIONS)('allows owner access to users/{uid}/%s/{doc}', async (collection, docId) => {
    const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
    const ref = ownerDb.collection('users').doc(OWNER_UID).collection(collection).doc(docId);

    await expect(assertSucceeds(ref.set({ userId: OWNER_UID, title: collection, updatedAt: 'now' }))).resolves.toBeNull();
    await expect(assertSucceeds(ref.get())).resolves.toBeTruthy();
    await expect(assertSucceeds(ref.update({ userId: OWNER_UID, updatedAt: 'later' }))).resolves.toBeNull();
  });

  test('rejects cross-user reads and writes to approved owner subcollections', async () => {
    await seedNested(testEnv, OWNER_UID, 'lifeMapNodes', 'node-1', { userId: OWNER_UID, title: 'private node' });
    const otherDb = testEnv.authenticatedContext(OTHER_UID).firestore();
    const ref = otherDb.collection('users').doc(OWNER_UID).collection('lifeMapNodes').doc('node-1');

    await expect(assertFails(ref.get())).resolves.toBeInstanceOf(PermissionDeniedError);
    await expect(assertFails(ref.set({ userId: OTHER_UID, title: 'tamper' }))).resolves.toBeInstanceOf(PermissionDeniedError);
  });

  test('keeps unknown user subcollections denied by default', async () => {
    const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
    const ref = ownerDb.collection('users').doc(OWNER_UID).collection('unknownNestedSystem').doc('doc-1');

    await expect(assertFails(ref.set({ userId: OWNER_UID, title: 'unknown' }))).resolves.toBeInstanceOf(PermissionDeniedError);
  });
});

async function seedNested(testEnv, uid, collection, docId, data) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await context.firestore().collection('users').doc(uid).collection(collection).doc(docId).set(data);
  });
}
