const path = require('path');
const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
  PermissionDeniedError,
} = require('./rulesEmulator');

const TEST_PROJECT = 'urai-canonical-rules-test';
const OWNER_UID = 'owner-123';
const OTHER_UID = 'other-456';
const ADMIN_UID = 'admin-789';

const USER_OWNED_COLLECTIONS = [
  'profiles',
  'consents',
  'narratorMemory',
  'memoryShards',
  'insights',
  'journeys',
  'journeyChapters',
  'stars',
  'moodWeather',
  'emotionalForecasts',
  'weeklyRecaps',
  'storyProjects',
  'storyAssets',
  'lifeMapEvents',
  'constellations',
  'scrolls',
  'storyScripts',
  'relationships',
  'socialGraph',
  'obscuraSignals',
  'mentalLoadScores',
  'councilSessions',
  'narratorMessages',
  'dataRequests',
];

const ADMIN_ONLY_COLLECTIONS = ['adminUsers', 'adminAuditLogs', 'auditLogs', 'incidents', 'featureFlags'];
const SERVER_MEDIATED_COLLECTIONS = ['marketplacePurchases', 'eventEnrichments', 'entitlements', 'transactions'];
const REQUEST_COLLECTIONS = ['dataExportRequests', 'accountDeletionRequests', 'safetyEvents', 'telemetryEvents'];

describe('Canonical Firestore security model', () => {
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

  test.each(USER_OWNED_COLLECTIONS)('%s enforces signed-in ownership', async (collection) => {
    await seedDocument(testEnv, collection, 'owned-doc', { ownerUid: OWNER_UID, title: collection });
    const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
    const otherDb = testEnv.authenticatedContext(OTHER_UID).firestore();
    const anonDb = testEnv.unauthenticatedContext().firestore();

    await expect(assertSucceeds(ownerDb.collection(collection).doc('new-doc').set({ ownerUid: OWNER_UID, title: 'new' }))).resolves.toBeNull();
    await expect(assertSucceeds(ownerDb.collection(collection).doc('owned-doc').get())).resolves.toBeTruthy();
    await expect(assertFails(otherDb.collection(collection).doc('owned-doc').get())).resolves.toBeInstanceOf(PermissionDeniedError);
    await expect(assertFails(anonDb.collection(collection).doc('owned-doc').get())).resolves.toBeInstanceOf(PermissionDeniedError);
    await expect(assertFails(otherDb.collection(collection).doc('new-doc').set({ ownerUid: OWNER_UID }))).resolves.toBeInstanceOf(PermissionDeniedError);
  });

  test.each(ADMIN_ONLY_COLLECTIONS)('%s is admin-only', async (collection) => {
    await seedDocument(testEnv, collection, 'admin-doc', { status: 'private' });
    const adminDb = testEnv.authenticatedContext(ADMIN_UID, { admin: true }).firestore();
    const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();

    await expect(assertSucceeds(adminDb.collection(collection).doc('admin-doc').get())).resolves.toBeTruthy();
    await expect(assertFails(ownerDb.collection(collection).doc('admin-doc').get())).resolves.toBeInstanceOf(PermissionDeniedError);
  });

  test('public/demo collections expose only intended reads and keep writes admin-only', async () => {
    await seedDocument(testEnv, 'marketplaceItems', 'published', { status: 'published', title: 'Public item' });
    await seedDocument(testEnv, 'jobs', 'published', { visibility: 'public', title: 'Public role' });
    await seedDocument(testEnv, 'systemStatus', 'live', { ok: true });

    const anonDb = testEnv.unauthenticatedContext().firestore();
    const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();

    await expect(assertSucceeds(anonDb.collection('marketplaceItems').doc('published').get())).resolves.toBeTruthy();
    await expect(assertSucceeds(anonDb.collection('jobs').doc('published').get())).resolves.toBeTruthy();
    await expect(assertSucceeds(anonDb.collection('systemStatus').doc('live').get())).resolves.toBeTruthy();
    await expect(assertFails(ownerDb.collection('marketplaceItems').doc('new').set({ status: 'published' }))).resolves.toBeInstanceOf(PermissionDeniedError);
  });

  test.each(SERVER_MEDIATED_COLLECTIONS)('%s is server-mediated and not client writable', async (collection) => {
    await seedDocument(testEnv, collection, 'server-doc', { ownerUid: OWNER_UID });
    const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
    const otherDb = testEnv.authenticatedContext(OTHER_UID).firestore();

    await expect(assertSucceeds(ownerDb.collection(collection).doc('server-doc').get())).resolves.toBeTruthy();
    await expect(assertFails(otherDb.collection(collection).doc('server-doc').get())).resolves.toBeInstanceOf(PermissionDeniedError);
    await expect(assertFails(ownerDb.collection(collection).doc('new').set({ ownerUid: OWNER_UID }))).resolves.toBeInstanceOf(PermissionDeniedError);
  });

  test.each(REQUEST_COLLECTIONS)('%s allows owned request creation but prevents client mutation', async (collection) => {
    const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
    const otherDb = testEnv.authenticatedContext(OTHER_UID).firestore();

    await expect(assertSucceeds(ownerDb.collection(collection).doc('request-doc').set({ ownerUid: OWNER_UID, type: collection }))).resolves.toBeNull();
    await expect(assertSucceeds(ownerDb.collection(collection).doc('request-doc').get())).resolves.toBeTruthy();
    await expect(assertFails(otherDb.collection(collection).doc('request-doc').get())).resolves.toBeInstanceOf(PermissionDeniedError);
    await expect(assertFails(ownerDb.collection(collection).doc('request-doc').update({ status: 'closed', ownerUid: OWNER_UID }))).resolves.toBeInstanceOf(PermissionDeniedError);
  });

  test('inbound public submissions are create-only and admin-readable', async () => {
    const anonDb = testEnv.unauthenticatedContext().firestore();
    const adminDb = testEnv.authenticatedContext(ADMIN_UID, { admin: true }).firestore();

    await expect(assertSucceeds(anonDb.collection('waitlistEntries').doc('one').set({ createdAt: 'now', email: 'test@example.com' }))).resolves.toBeNull();
    await expect(assertFails(anonDb.collection('waitlistEntries').doc('one').get())).resolves.toBeInstanceOf(PermissionDeniedError);
    await expect(assertSucceeds(adminDb.collection('waitlistEntries').doc('one').get())).resolves.toBeTruthy();
    await expect(assertFails(anonDb.collection('waitlistEntries').doc('one').update({ status: 'read' }))).resolves.toBeInstanceOf(PermissionDeniedError);
  });

  test('deny-by-default blocks unknown collections', async () => {
    const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
    await expect(assertFails(ownerDb.collection('unknownCollection').doc('doc').set({ ownerUid: OWNER_UID }))).resolves.toBeInstanceOf(PermissionDeniedError);
  });
});

async function seedDocument(testEnv, collection, id, data) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await context.firestore().collection(collection).doc(id).set(data);
  });
}
