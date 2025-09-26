const path = require('path');
const fs = require('fs');
const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} = require('@firebase/rules-unit-testing');

const PROJECT_ID = 'urai-security-rules-test';
const RULES_PATH = path.resolve(__dirname, '../../firestore.rules');
const OWNER_ENFORCED_COLLECTIONS = [
  'dreams',
  'rituals',
  'timelineEvents',
  'personaEvolutions',
  'soulThreads',
  'socialArchetypes',
  'weeklyScrolls',
  'moods',
  'shadowMetrics',
  'obscuraPatterns',
  'cognitiveStress',
  'recoveryBlooms',
  'relationshipConstellations',
  'voiceEvents',
  'dreamConstellations',
  'memoryBlooms',
  'badges',
  'notifications',
  'journalEntries',
  'events',
  'insightMarket',
];

let testEnv;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: fs.readFileSync(RULES_PATH, 'utf8'),
    },
  });
});

afterAll(async () => {
  if (testEnv) {
    await testEnv.cleanup();
  }
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

const getAuthedDb = (uid) => testEnv.authenticatedContext(uid).firestore();

describe('owner-enforced collections', () => {
  describe.each(OWNER_ENFORCED_COLLECTIONS)('%s', (collectionName) => {
    it('allows an authenticated user to create their own document', async () => {
      const uid = 'user_123';
      const db = getAuthedDb(uid);
      const docRef = db.collection(collectionName).doc('doc-owner');

      await assertSucceeds(
        docRef.set({
          ownerUid: uid,
          createdAt: new Date().toISOString(),
        }),
      );
    });

    it("denies creating a document when the ownerUid doesn't match the authenticated user", async () => {
      const uid = 'user_123';
      const db = getAuthedDb(uid);
      const docRef = db.collection(collectionName).doc('doc-mismatch');

      await assertFails(
        docRef.set({
          ownerUid: 'someone_else',
          createdAt: new Date().toISOString(),
        }),
      );
    });
  });
});
