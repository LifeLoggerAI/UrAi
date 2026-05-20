const fs = require('fs');
const path = require('path');
const vm = require('vm');

class PermissionDeniedError extends Error {
  constructor(message = 'Missing or insufficient permissions.') {
    super(message);
    this.code = 'permission-denied';
  }
}

function normalizeAuth(auth) {
  if (!auth) return null;
  return { uid: auth.uid, token: auth.token || {} };
}

function convertRulesSyntax(source) {
  return source.replace(/([A-Za-z0-9_.()]+)\s+is string/g, 'typeof ($1) === "string"');
}

function extractFunctionsBlock(rules) {
  const start = rules.indexOf('function isSignedIn');
  const firstMatch = rules.indexOf('\n    match /', start);
  const end = firstMatch;
  if (start === -1 || end === -1 || end <= start) throw new Error('Unable to locate reusable functions in firestore.rules');
  return convertRulesSyntax(rules.slice(start, end));
}

function extractBlockBody(rules, openBraceIndex) {
  let depth = 0;
  for (let i = openBraceIndex; i < rules.length; i += 1) {
    if (rules[i] === '{') depth += 1;
    if (rules[i] === '}') {
      depth -= 1;
      if (depth === 0) return rules.slice(openBraceIndex + 1, i);
    }
  }
  throw new Error('Unclosed rules block');
}

function extractCollectionRules(rules, collections) {
  const map = new Map();
  for (const collection of collections) {
    const pattern = new RegExp(`match\\s+\\/${collection}\\/\\{[^}]+\\}\\s*\\{`, 'm');
    const match = pattern.exec(rules);
    if (!match) throw new Error(`Missing rules for collection: ${collection}`);
    const openBraceIndex = rules.indexOf('{', match.index);
    const block = extractBlockBody(rules, openBraceIndex);
    const allowPattern = /allow\s+([^:]+):\s*if\s*([^;]+);/g;
    const operations = {};
    let allowMatch;
    while ((allowMatch = allowPattern.exec(block)) !== null) {
      for (const op of allowMatch[1].split(',').map((value) => value.trim())) {
        operations[op] = allowMatch[2].trim();
      }
    }
    map.set(collection, operations);
  }
  return map;
}

function compileExpression(functionsCode, expression) {
  const cleaned = convertRulesSyntax(expression.trim());
  const script = new vm.Script(`${functionsCode}\n(${cleaned});`);
  return ({ request, resource }) => {
    const context = vm.createContext({ request, resource });
    return script.runInContext(context);
  };
}

class RulesEvaluator {
  constructor(rules, collections) {
    this.functionsCode = extractFunctionsBlock(rules);
    const ruleMap = extractCollectionRules(rules, collections);
    this.compiled = new Map();
    for (const [collection, operations] of ruleMap.entries()) {
      const opEvaluators = {};
      for (const [operation, expression] of Object.entries(operations)) {
        opEvaluators[operation] = compileExpression(this.functionsCode, expression);
      }
      this.compiled.set(collection, opEvaluators);
    }
  }

  evaluate(collection, operation, context) {
    const opEvaluators = this.compiled.get(collection);
    if (!opEvaluators || !opEvaluators[operation]) return false;
    return Boolean(opEvaluators[operation](context));
  }
}

class DocumentSnapshot {
  constructor(exists, data) {
    this.exists = exists;
    this._data = data ? JSON.parse(JSON.stringify(data)) : null;
  }
  data() {
    return this._data ? JSON.parse(JSON.stringify(this._data)) : undefined;
  }
}

class FirestoreClient {
  constructor(env, auth, bypass) {
    this.env = env;
    this.auth = normalizeAuth(auth);
    this.bypass = bypass;
  }
  collection(name) {
    return new CollectionReference(this.env, this.auth, this.bypass, name);
  }
}

class CollectionReference {
  constructor(env, auth, bypass, name) {
    this.env = env;
    this.auth = auth;
    this.bypass = bypass;
    this.name = name;
  }
  doc(id) {
    return new DocumentReference(this.env, this.auth, this.bypass, this.name, id);
  }
}

class DocumentReference {
  constructor(env, auth, bypass, collection, id) {
    this.env = env;
    this.auth = auth;
    this.bypass = bypass;
    this.collection = collection;
    this.id = id;
  }
  _docKey() {
    return `${this.collection}/${this.id}`;
  }
  _currentData() {
    return this.env.store.get(this._docKey()) || null;
  }
  async set(data, options = {}) {
    const existing = this._currentData();
    const isCreate = !existing;
    const targetOperation = isCreate ? 'create' : 'update';
    const nextData = options.merge && existing ? { ...existing, ...data } : { ...data };
    await this._assertAllowed(targetOperation, existing, nextData);
    this.env.store.set(this._docKey(), JSON.parse(JSON.stringify(nextData)));
    return null;
  }
  async update(partial) {
    const existing = this._currentData();
    if (!existing) throw new Error('not-found');
    const nextData = { ...existing, ...partial };
    await this._assertAllowed('update', existing, nextData);
    this.env.store.set(this._docKey(), JSON.parse(JSON.stringify(nextData)));
    return null;
  }
  async get() {
    const existing = this._currentData();
    await this._assertAllowed('read', existing, existing);
    return new DocumentSnapshot(Boolean(existing), existing);
  }
  async _assertAllowed(operation, existing, nextData) {
    if (this.bypass) return;
    const allowed = this.env.evaluator.evaluate(this.collection, operation, {
      request: {
        auth: this.auth,
        resource: { data: JSON.parse(JSON.stringify(nextData || {})) },
      },
      resource: { data: JSON.parse(JSON.stringify(existing || {})) },
    });
    if (!allowed) throw new PermissionDeniedError();
  }
}

class TestEnvironment {
  constructor(rulesPath, collections) {
    const rules = fs.readFileSync(rulesPath, 'utf8');
    this.evaluator = new RulesEvaluator(rules, collections);
    this.store = new Map();
  }
  async clearFirestore() { this.store.clear(); }
  async cleanup() { this.store.clear(); }
  authenticatedContext(uid, token = {}) { return new AuthenticatedContext(this, { uid, token }); }
  unauthenticatedContext() { return new AuthenticatedContext(this, null); }
  async withSecurityRulesDisabled(callback) { return callback(new AdminContext(this)); }
}

class AuthenticatedContext {
  constructor(env, auth) {
    this.env = env;
    this.auth = auth;
  }
  firestore() { return new FirestoreClient(this.env, this.auth, false); }
}

class AdminContext extends AuthenticatedContext {
  constructor(env) { super(env, { uid: '__admin__', token: { admin: true } }); }
  firestore() { return new FirestoreClient(this.env, { uid: '__admin__', token: { admin: true } }, true); }
}

const CANONICAL_TEST_COLLECTIONS = [
  'adminUsers', 'adminAuditLogs', 'auditLogs', 'creatorSubmissions', 'incidents', 'waitlistEntries',
  'contactMessages', 'marketplaceItems', 'jobs', 'featureFlags', 'systemStatus', 'profiles', 'consents',
  'narratorMemory', 'memoryShards', 'insights', 'journeys', 'journeyChapters', 'stars', 'moodWeather',
  'emotionalForecasts', 'weeklyRecaps', 'storyProjects', 'storyAssets', 'marketplacePurchases', 'referrals',
  'jobApplications', 'telemetryEvents', 'safetyEvents', 'dataExportRequests', 'accountDeletionRequests',
  'eventEnrichments', 'lifeMapEvents', 'constellations', 'scrolls', 'storyScripts', 'relationships',
  'socialGraph', 'obscuraSignals', 'mentalLoadScores', 'councilSessions', 'narratorMessages', 'entitlements',
  'transactions', 'dataRequests', 'dreams', 'rituals', 'timelineEvents', 'personaEvolutions', 'soulThreads',
  'socialArchetypes', 'weeklyScrolls', 'moods', 'shadowMetrics', 'obscuraPatterns', 'cognitiveStress',
  'recoveryBlooms', 'relationshipConstellations', 'voiceEvents', 'dreamConstellations', 'memoryBlooms',
  'badges', 'notifications', 'journalEntries', 'events', 'insightMarket', 'moodForecasts', 'weeklyReflections',
  'companionMessages', 'narratorInsights', 'relationshipSignals', 'passiveSignals', 'symbolicStates',
  'waitlistSignups', 'features', 'assetLifecycleEvents',
];

function initializeTestEnvironment({ projectId, firestore }) {
  void projectId;
  const rulesPath = firestore?.rulesPath || firestore?.rules;
  const resolvedPath = rulesPath && fs.existsSync(rulesPath) ? rulesPath : path.resolve(__dirname, '../../firestore.rules');
  return Promise.resolve(new TestEnvironment(resolvedPath, CANONICAL_TEST_COLLECTIONS));
}

async function assertSucceeds(promise) { return promise; }
async function assertFails(promise) {
  try { await promise; } catch (err) { return err; }
  throw new Error('Expected operation to fail, but it succeeded.');
}

module.exports = { initializeTestEnvironment, assertSucceeds, assertFails, PermissionDeniedError, CANONICAL_TEST_COLLECTIONS };
