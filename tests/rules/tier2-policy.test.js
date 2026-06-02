const fs = require('fs');
const path = require('path');

const rulesPath = path.resolve(__dirname, '../../firestore.rules');
const rules = fs.readFileSync(rulesPath, 'utf8');

function expectRuleBlock(name) {
  expect(rules).toContain(name);
}

describe('Tier 2 Firestore policy boundaries', () => {
  test('feature flags are server-only', () => {
    expectRuleBlock('match /features/{flagId}');
    expect(rules).toContain('match /features/{flagId} {\n      allow read, write: if false;\n    }');
  });

  test('entitlements are server-only and cannot be client-written', () => {
    expectRuleBlock('match /entitlements/{uid}');
    expect(rules).toContain('match /entitlements/{uid} {\n      allow read, write: if false;\n    }');
  });

  test('audit logs are server-only', () => {
    expectRuleBlock('match /auditLogs/{id}');
    expect(rules).toContain('match /auditLogs/{id} {\n      allow read, write: if false;\n    }');
  });

  test('users cannot write protected entitlement or admin fields on their profile', () => {
    expectRuleBlock('function hasNoProtectedUserFields()');
    for (const field of [
      'entitlementTier',
      'roles',
      'admin',
      'founder',
      'internal',
      'internalOverride',
      'isAdmin',
      'isFounder',
    ]) {
      expect(rules).toContain(`"${field}"`);
    }
    expect(rules).toContain('allow create, update: if request.auth != null && request.auth.uid == uid && hasNoProtectedUserFields();');
  });

  test('consents are owner-bound and source-bound', () => {
    expectRuleBlock('match /users/{uid}');
    expectRuleBlock('match /consents/{source}');
    expectRuleBlock('function canCreateConsent(uid, source)');
    expectRuleBlock('function canUpdateConsent(uid, source)');
    expect(rules).toContain('request.auth.uid == uid');
    expect(rules).toContain('request.resource.data.ownerUid == uid');
    expect(rules).toContain('request.resource.data.source == source');
    expect(rules).toContain('allow delete: if false;');
  });

  test('consent source list matches Tier 2 gate categories', () => {
    for (const source of [
      'profile',
      'timeline_events',
      'memory_blooms',
      'mood_inference',
      'relationship_signals',
      'rituals',
      'offline_cache',
    ]) {
      expect(rules).toContain(`"${source}"`);
    }
  });
});
