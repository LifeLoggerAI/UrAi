const path = require('path');
const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
  PermissionDeniedError,
} = require('./rulesEmulator');

const TEST_PROJECT = 'urai-focus-replay-rules-test';
const OWNER_UID = 'owner-focus';
const OTHER_UID = 'other-focus';

const COLLECTIONS = [
  { name: 'focusSessions', sample: { status: 'active', starId: 'star-1', activeReplayId: 'replay-1' } },
  { name: 'replayEvidence', sample: { replayId: 'replay-1', sourceRef: 'audio:1', kind: 'audio', confidence: 'direct', visibility: 'visible', displayOrder: 1 } },
];

describe('Focus and replay Firestore policy boundaries', () => {
  let testEnv;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: TEST_PROJECT,
      firestore: {
        rulesPath: path.resolve(__dirname, '../../firestore.rules'),
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  afterEach(async () => {
    await testEnv.clearFirestore();
  });

  describe.each(COLLECTIONS)('$name', ({ name, sample }) => {
    test('allows owner-bound create/read/update/delete', async () => {
      const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
      const doc = ownerDb.collection(name).doc('doc-1');

      await expect(assertSucceeds(doc.set({ ownerUid: OWNER_UID, ...sample }))).resolves.toBeNull();
      await expect(assertSucceeds(doc.get())).resolves.toBeTruthy();
      await expect(assertSucceeds(doc.update({ ownerUid: OWNER_UID, updatedAt: 'now' }))).resolves.toBeNull();
    });

    test('rejects cross-user create/read/update', async () => {
      const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
      const otherDb = testEnv.authenticatedContext(OTHER_UID).firestore();

      await expect(assertFails(otherDb.collection(name).doc('bad-create').set({ ownerUid: OWNER_UID, ...sample }))).resolves.toBeInstanceOf(PermissionDeniedError);
      await expect(assertSucceeds(ownerDb.collection(name).doc('doc-1').set({ ownerUid: OWNER_UID, ...sample }))).resolves.toBeNull();
      await expect(assertFails(otherDb.collection(name).doc('doc-1').get())).resolves.toBeInstanceOf(PermissionDeniedError);
      await expect(assertFails(otherDb.collection(name).doc('doc-1').update({ ownerUid: OWNER_UID, status: 'tamper' }))).resolves.toBeInstanceOf(PermissionDeniedError);
    });

    test('rejects owner reassignment', async () => {
      const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
      const doc = ownerDb.collection(name).doc('doc-1');

      await expect(assertSucceeds(doc.set({ ownerUid: OWNER_UID, ...sample }))).resolves.toBeNull();
      await expect(assertFails(doc.update({ ownerUid: OTHER_UID }))).resolves.toBeInstanceOf(PermissionDeniedError);
    });
  });
});
