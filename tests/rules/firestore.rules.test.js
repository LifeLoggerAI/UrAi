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
const ADMIN_UID = 'admin-789';
const SAMPLE_COLLECTIONS = [
  { name: 'rituals', sample: { name: 'Morning pages' } },
  { name: 'timelineEvents', sample: { type: 'milestone' } },
  { name: 'memoryBlooms', sample: { title: 'Memory bloom' } },
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

  describe('admin-only collections', () => {
    test('allows admins to read and write feature flags', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { admin: true }).firestore();
      await expect(assertSucceeds(adminDb.collection('featureFlags').doc('cinematic').set({ enabled: false }))).resolves.toBeNull();
      const snapshot = await assertSucceeds(adminDb.collection('featureFlags').doc('cinematic').get());
      expect(snapshot.exists).toBe(true);
    });

    test('rejects non-admin access to feature flags', async () => {
      await seedDocument(testEnv, 'featureFlags', 'cinematic', { enabled: false });
      const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
      await expect(assertFails(ownerDb.collection('featureFlags').doc('cinematic').get())).resolves.toBeInstanceOf(PermissionDeniedError);
      await expect(assertFails(ownerDb.collection('featureFlags').doc('cinematic').set({ enabled: true }))).resolves.toBeInstanceOf(PermissionDeniedError);
    });

    test('keeps admin audit logs immutable after creation', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { admin: true }).firestore();
      await expect(assertSucceeds(adminDb.collection('adminAuditLogs').doc('event-1').set({ action: 'seed' }))).resolves.toBeNull();
      await expect(assertFails(adminDb.collection('adminAuditLogs').doc('event-1').update({ action: 'tamper' }))).resolves.toBeInstanceOf(PermissionDeniedError);
    });
  });

  describe('server-only and server-mediated collections', () => {
    test('denies all client access to implementation-only feature definitions', async () => {
      await seedDocument(testEnv, 'features', 'doc-1', { value: true });
      const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { admin: true }).firestore();
      await expect(assertFails(ownerDb.collection('features').doc('doc-1').get())).resolves.toBeInstanceOf(PermissionDeniedError);
      await expect(assertFails(adminDb.collection('features').doc('doc-1').set({ ownerUid: ADMIN_UID }))).resolves.toBeInstanceOf(PermissionDeniedError);
    });

    test.each(['entitlements', 'transactions', 'eventEnrichments'])('%s allows owner reads but rejects client writes', async (collection) => {
      await seedDocument(testEnv, collection, 'doc-1', { ownerUid: OWNER_UID, value: true });
      const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
      const otherDb = testEnv.authenticatedContext(OTHER_UID).firestore();
      await expect(assertSucceeds(ownerDb.collection(collection).doc('doc-1').get())).resolves.toBeTruthy();
      await expect(assertFails(otherDb.collection(collection).doc('doc-1').get())).resolves.toBeInstanceOf(PermissionDeniedError);
      await expect(assertFails(ownerDb.collection(collection).doc('new').set({ ownerUid: OWNER_UID }))).resolves.toBeInstanceOf(PermissionDeniedError);
    });

    test('audit logs remain admin-only and immutable', async () => {
      await seedDocument(testEnv, 'auditLogs', 'doc-1', { value: true });
      const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { admin: true }).firestore();
      await expect(assertSucceeds(adminDb.collection('auditLogs').doc('doc-1').get())).resolves.toBeTruthy();
      await expect(assertFails(ownerDb.collection('auditLogs').doc('doc-1').get())).resolves.toBeInstanceOf(PermissionDeniedError);
      await expect(assertFails(adminDb.collection('auditLogs').doc('doc-1').update({ value: false }))).resolves.toBeInstanceOf(PermissionDeniedError);
    });
  });

  describe('public and demo-readable collections', () => {
    test('allows public reads of system status only', async () => {
      await seedDocument(testEnv, 'systemStatus', 'public', { status: 'ok' });
      const anonDb = testEnv.unauthenticatedContext().firestore();
      const snapshot = await assertSucceeds(anonDb.collection('systemStatus').doc('public').get());
      expect(snapshot.exists).toBe(true);
      await expect(assertFails(anonDb.collection('systemStatus').doc('public').set({ status: 'bad' }))).resolves.toBeInstanceOf(PermissionDeniedError);
    });

    test('allows published marketplace item reads and rejects draft reads', async () => {
      await seedDocument(testEnv, 'marketplaceItems', 'published', { status: 'published', title: 'Public ritual' });
      await seedDocument(testEnv, 'marketplaceItems', 'draft', { status: 'draft', title: 'Private ritual' });
      const anonDb = testEnv.unauthenticatedContext().firestore();
      await expect(assertSucceeds(anonDb.collection('marketplaceItems').doc('published').get())).resolves.toMatchObject({ exists: true });
      await expect(assertFails(anonDb.collection('marketplaceItems').doc('draft').get())).resolves.toBeInstanceOf(PermissionDeniedError);
    });

    test('allows public waitlist submissions but not reads or edits', async () => {
      const anonDb = testEnv.unauthenticatedContext().firestore();
      await expect(assertSucceeds(anonDb.collection('waitlistEntries').doc('entry-1').set({ createdAt: 'now', email: 'demo@example.com' }))).resolves.toBeNull();
      await expect(assertFails(anonDb.collection('waitlistEntries').doc('entry-1').get())).resolves.toBeInstanceOf(PermissionDeniedError);
      await expect(assertFails(anonDb.collection('waitlistEntries').doc('entry-1').update({ email: 'changed@example.com' }))).resolves.toBeInstanceOf(PermissionDeniedError);
    });
  });

  describe('export, deletion, telemetry, safety, narrator, and replay protections', () => {
    test('allows owner-created export and deletion requests but blocks mutation after submission', async () => {
      const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
      await expect(assertSucceeds(ownerDb.collection('dataExportRequests').doc('export-1').set({ ownerUid: OWNER_UID, createdAt: 'now' }))).resolves.toBeNull();
      await expect(assertSucceeds(ownerDb.collection('accountDeletionRequests').doc('delete-1').set({ ownerUid: OWNER_UID, createdAt: 'now' }))).resolves.toBeNull();
      await expect(assertFails(ownerDb.collection('dataExportRequests').doc('export-1').update({ status: 'changed' }))).resolves.toBeInstanceOf(PermissionDeniedError);
      await expect(assertFails(ownerDb.collection('accountDeletionRequests').doc('delete-1').update({ status: 'changed' }))).resolves.toBeInstanceOf(PermissionDeniedError);
    });

    test('allows telemetry owner writes and reads but blocks client edits', async () => {
      const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
      const otherDb = testEnv.authenticatedContext(OTHER_UID).firestore();
      await expect(assertSucceeds(ownerDb.collection('telemetryEvents').doc('event-1').set({ ownerUid: OWNER_UID, type: 'route_view' }))).resolves.toBeNull();
      await expect(assertSucceeds(ownerDb.collection('telemetryEvents').doc('event-1').get())).resolves.toBeTruthy();
      await expect(assertFails(otherDb.collection('telemetryEvents').doc('event-1').get())).resolves.toBeInstanceOf(PermissionDeniedError);
      await expect(assertFails(ownerDb.collection('telemetryEvents').doc('event-1').update({ type: 'tamper' }))).resolves.toBeInstanceOf(PermissionDeniedError);
    });

    test('protects narrator, replay, constellation, and passive signal docs by ownership', async () => {
      for (const collection of ['narratorMessages', 'scrolls', 'constellations', 'passiveSignals']) {
        await seedDocument(testEnv, collection, 'doc-1', { ownerUid: OWNER_UID, title: collection });
        const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
        const otherDb = testEnv.authenticatedContext(OTHER_UID).firestore();
        await expect(assertSucceeds(ownerDb.collection(collection).doc('doc-1').get())).resolves.toMatchObject({ exists: true });
        await expect(assertFails(otherDb.collection(collection).doc('doc-1').get())).resolves.toBeInstanceOf(PermissionDeniedError);
      }
    });

    test('allows safety event owner creation and admin triage update only', async () => {
      const ownerDb = testEnv.authenticatedContext(OWNER_UID).firestore();
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { admin: true }).firestore();
      const otherDb = testEnv.authenticatedContext(OTHER_UID).firestore();
      await expect(assertSucceeds(ownerDb.collection('safetyEvents').doc('safety-1').set({ ownerUid: OWNER_UID, severity: 'low' }))).resolves.toBeNull();
      await expect(assertFails(otherDb.collection('safetyEvents').doc('safety-1').get())).resolves.toBeInstanceOf(PermissionDeniedError);
      await expect(assertSucceeds(adminDb.collection('safetyEvents').doc('safety-1').update({ triageStatus: 'reviewed', ownerUid: OWNER_UID }))).resolves.toBeNull();
      await expect(assertFails(otherDb.collection('safetyEvents').doc('safety-1').update({ triageStatus: 'tamper', ownerUid: OTHER_UID }))).resolves.toBeInstanceOf(PermissionDeniedError);
    });
  });
});

async function seedDocument(testEnv, collection, id, data) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await context.firestore().collection(collection).doc(id).set(data);
  });
}