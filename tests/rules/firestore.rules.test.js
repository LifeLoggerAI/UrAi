const path = require('path');
const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
  PermissionDeniedError,
} = require('./rulesEmulator');

const TEST_PROJECT = 'urai-security-rules-test';
const OWNER_UID = 'owner-123';
const OTHER_UID = 'other-456';
const SAMPLE_COLLECTIONS = [
  { name: 'dreams', sample: { title: 'Lucid exploration' } },
  { name: 'rituals', sample: { name: 'Morning pages' } },
  { name: 'timelineEvents', sample: { type: 'milestone' } },
];

describe('Firestore security rules', () => {
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

  describe.each(SAMPLE_COLLECTIONS)('%s collection', ({ name, sample }) => {
    const docId = 'doc-1';

    test('allows the owner to create documents', async () => {
      const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
      const data = { ownerUid: OWNER_UID, ...sample };
      await expect(assertSucceeds(ownerDb.collection(name).doc(docId).set(data))).resolves.toBeNull();
    });

    test('rejects creation from other users', async () => {
      const otherDb = testEnv.authenticatedContext(OTHER_UID).firestore();
      const data = { ownerUid: OWNER_UID, ...sample };
      const error = await assertFails(otherDb.collection(name).doc(docId).set(data));
      expect(error).toBeInstanceOf(PermissionDeniedError);
    });

    test('allows the owner to read their document', async () => {
      await seedDocument(testEnv, name, docId, { ownerUid: OWNER_UID, ...sample });
      const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
      const snapshot = await assertSucceeds(ownerDb.collection(name).doc(docId).get());
      expect(snapshot.exists).toBe(true);
      expect(snapshot.data()).toMatchObject(sample);
    });

    test('rejects reads from other users', async () => {
      await seedDocument(testEnv, name, docId, { ownerUid: OWNER_UID, ...sample });
      const otherDb = testEnv.authenticatedContext(OTHER_UID).firestore();
      const error = await assertFails(otherDb.collection(name).doc(docId).get());
      expect(error).toBeInstanceOf(PermissionDeniedError);
    });

    test('allows the owner to update without changing ownership', async () => {
      await seedDocument(testEnv, name, docId, { ownerUid: OWNER_UID, ...sample });
      const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
      await expect(
        assertSucceeds(
          ownerDb.collection(name).doc(docId).update({ description: 'updated', ownerUid: OWNER_UID }),
        ),
      ).resolves.toBeNull();
      const snapshot = await ownerDb.collection(name).doc(docId).get();
      expect(snapshot.data()).toMatchObject({ ownerUid: OWNER_UID, description: 'updated' });
    });

    test('rejects updates from other users', async () => {
      await seedDocument(testEnv, name, docId, { ownerUid: OWNER_UID, ...sample });
      const otherDb = testEnv.authenticatedContext(OTHER_UID).firestore();
      const error = await assertFails(
        otherDb.collection(name).doc(docId).update({ description: 'bad update' }),
      );
      expect(error).toBeInstanceOf(PermissionDeniedError);
    });

    test('rejects attempts to change ownerUid', async () => {
      await seedDocument(testEnv, name, docId, { ownerUid: OWNER_UID, ...sample });
      const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
      const error = await assertFails(
        ownerDb.collection(name).doc(docId).update({ ownerUid: OTHER_UID }),
      );
      expect(error).toBeInstanceOf(PermissionDeniedError);
    });
  });
});

async function seedDocument(testEnv, collection, id, data) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await context.firestore().collection(collection).doc(id).set(data);
  });
}
