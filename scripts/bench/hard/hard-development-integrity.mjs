#!/usr/bin/env node
// Offline consistency verifier for the exposed 2026-10-14 synthetic development pilot.
// No provider credentials, model calls, data writes, or external requests.
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const METHODS = Object.freeze([
  'direct', 'self_refinement', 'historical_council_v3',
  'historical_council_v3_plus_refinement', 'self_refinement_six_call',
]);
const FAMILIES = Object.freeze([
  'temporal-corrections', 'multi-generation-relationships', 'consent-revocation',
  'provenance-and-unknowns', 'ledger-reconstruction', 'critical-path-timelines',
  'revised-memory-graph', 'multi-constraint-decisions',
]);
const RATE = Object.freeze({ input: 0.15 / 1e6, output: 0.60 / 1e6 });
const round = (v, p = 8) => Math.round(v * 10 ** p) / 10 ** p;
const fail = (code) => { throw new Error(`HARD_DEVELOPMENT_INTEGRITY_${code}`); };
const assert = (ok, code) => { if (!ok) fail(code); };
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const uint = v => Number.isSafeInteger(v) && v >= 0;
const finite = v => typeof v === 'number' && Number.isFinite(v);
const close = (a, b, tolerance = 0.000001) => finite(a) && Math.abs(a - b) <= tolerance;
const sameSet = (a, b) => a.length === b.length && new Set(a).size === a.length && a.every(x => b.includes(x));
const sha256 = s => createHash('sha256').update(s).digest('hex');

function parseJsonl(raw, name) {
  assert(typeof raw === 'string' && raw.endsWith('\n'), `${name}_TRAILING_NEWLINE`);
  const lines = raw.slice(0, -1).split('\n');
  assert(lines.every(line => line.length > 0), `${name}_BLANK_LINE`);
  try { return lines.map(line => JSON.parse(line)); }
  catch { fail(`${name}_JSON_INVALID`); }
}
function normalized(value) {
  if (Array.isArray(value)) return value.map(normalized);
  if (object(value)) return Object.fromEntries(Object.keys(value).sort().map(k => [k, normalized(value[k])]));
  return value;
}
function extractJsonLikeRunner(text) {
  const cleaned = String(text ?? '').trim().replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/i, '$1').trim();
  try { return JSON.parse(cleaned); } catch { /* continue */ }
  const first = cleaned.indexOf('{'), last = cleaned.lastIndexOf('}');
  if (first >= 0 && last > first) {
    try { return JSON.parse(cleaned.slice(first, last + 1)); } catch { /* continue */ }
  }
  const a = cleaned.indexOf('['), b = cleaned.lastIndexOf(']');
  if (a >= 0 && b > a) return JSON.parse(cleaned.slice(a, b + 1));
  throw new Error('no valid JSON');
}
function independentlyScore(task, output) {
  try {
    return JSON.stringify(normalized(extractJsonLikeRunner(output))) ===
      JSON.stringify(normalized(task.scorer.value));
  } catch { return false; }
}
function pct(values, percentile) {
  if (!values.length) return null;
  const a = [...values].sort((x, y) => x - y), p = (a.length - 1) * percentile;
  return round(a[Math.floor(p)] + (a[Math.ceil(p)] - a[Math.floor(p)]) * (p % 1), 3);
}
function methodSummary(rows) {
  return {
    completed: rows.length,
    correct: rows.filter(r => r.passed).length,
    accuracy: rows.length ? rows.filter(r => r.passed).length / rows.length : null,
    mean_latency_ms: rows.length ? round(rows.reduce((n, r) => n + r.latency_ms, 0) / rows.length, 3) : null,
    p95_latency_ms: pct(rows.map(r => r.latency_ms), 0.95),
    model_calls: rows.reduce((n, r) => n + r.usage.calls, 0),
    refinement_helped: rows.filter(r => r.refinement_transition?.helped).length,
    refinement_harmed: rows.filter(r => r.refinement_transition?.harmed).length,
    refinement_changed: rows.filter(r => r.refinement_transition?.selected_changed).length,
    estimated_cost_usd: round(rows.reduce((n, r) => n + r.usage.estimated_cost_usd, 0)),
  };
}

/** Verify internal integrity; does not authenticate the publisher or certify the production Council. */
export function verifyHardDevelopmentEvidence({ manifest, summary, suiteRaw, trialsRaw }) {
  assert(object(manifest) && object(summary), 'DOCUMENT_INVALID');
  assert(manifest.current_urai_council === false && manifest.development_only === true &&
    manifest.confirmatory === false && manifest.hard_development_suite === true,
  'EXPOSED_DEVELOPMENT_LABEL_MISSING');
  assert(manifest.suite_generator === 'synthetic-life-evidence-hard-v1' &&
    manifest.suite_seed === 'development-only-seed-hard-20261014-v1', 'SUITE_IDENTITY_INVALID');
  assert(typeof manifest.git_sha === 'string' && /^[a-f0-9]{40}$/.test(manifest.git_sha), 'COMMIT_INVALID');
  assert(manifest.model === 'gpt-4o-mini-2024-07-18', 'MODEL_INVALID');
  assert(sameSet(manifest.method_ids ?? [], METHODS), 'METHODS_INVALID');
  assert(manifest.task_count === 16, 'MANIFEST_TASK_COUNT_INVALID');
  assert(manifest.cap_usd === 0.30 && summary.hard_local_cap_usd === 0.30, 'SPENDING_CAP_INVALID');
  assert(manifest.model_rate_usd_per_million?.input === 0.15 &&
    manifest.model_rate_usd_per_million?.output === 0.60, 'RATE_INVALID');
  assert(sha256(suiteRaw) === manifest.suite_sha256, 'SUITE_DIGEST_MISMATCH');

  const suite = parseJsonl(suiteRaw, 'SUITE'), trials = parseJsonl(trialsRaw, 'TRIALS');
  assert(suite.length === 16 && trials.length === 80, 'RECORD_COUNT_INVALID');
  const tasks = new Map();
  for (const task of suite) {
    assert(object(task) && typeof task.id === 'string' && !tasks.has(task.id) &&
      FAMILIES.includes(task.family) && task.id.startsWith(`hard-v1-${task.family}-`) &&
      typeof task.prompt === 'string' && task.prompt.length > 0 &&
      task.scorer?.type === 'json_equals' && object(task.scorer.value), 'SUITE_CASE_INVALID');
    tasks.set(task.id, task);
  }
  for (const family of FAMILIES) assert(suite.filter(t => t.family === family).length === 2, 'FAMILY_DISTRIBUTION_INVALID');
  const keys = new Set();
  for (const row of trials) {
    assert(object(row) && row.status === 'completed' && tasks.has(row.case_id) &&
      METHODS.includes(row.method), 'TRIAL_IDENTITY_INVALID');
    const key = `${row.case_id}\0${row.method}`;
    assert(!keys.has(key), 'DUPLICATE_TRIAL'); keys.add(key);
    assert(row.family === tasks.get(row.case_id).family && row.model === manifest.model, 'TRIAL_CONTEXT_INVALID');
    assert(typeof row.output === 'string' && typeof row.passed === 'boolean' &&
      (row.score === 0 || row.score === 1) &&
      row.passed === independentlyScore(tasks.get(row.case_id), row.output) &&
      row.score === Number(row.passed), 'TRIAL_SCORE_MISMATCH');
    const u = row.usage;
    assert(object(u) && uint(u.input_tokens) && uint(u.output_tokens) &&
      uint(u.calls) && u.calls > 0 && finite(row.latency_ms) && row.latency_ms >= 0 &&
      finite(u.estimated_cost_usd) && u.estimated_cost_usd >= 0, 'TRIAL_USAGE_INVALID');
    const cost = u.input_tokens * RATE.input + u.output_tokens * RATE.output;
    assert(close(u.estimated_cost_usd, cost, 1.1e-8), 'TRIAL_COST_MISMATCH');
    const t = row.refinement_transition;
    if (t !== null && t !== undefined) {
      assert(object(t) && ['baseline_passed','refined_passed','helped','harmed','selected_changed']
        .every(k => typeof t[k] === 'boolean') && t.refined_passed === row.passed &&
        t.helped === (!t.baseline_passed && t.refined_passed) &&
        t.harmed === (t.baseline_passed && !t.refined_passed), 'REFINEMENT_TRANSITION_INVALID');
    }
  }
  for (const task of suite) for (const method of METHODS) {
    assert(keys.has(`${task.id}\0${method}`), 'MISSING_TRIAL');
  }
  assert(summary.status === 'COMPLETE' && summary.fail_code === null &&
    summary.uncertain_billing === false && summary.total_trials === 80 &&
    summary.expected_trials === 80, 'SUMMARY_STATUS_INVALID');
  const all = { model_calls: 0, input_tokens: 0, output_tokens: 0, estimated_spend_usd: 0 };
  for (const row of trials) {
    all.model_calls += row.usage.calls;
    all.input_tokens += row.usage.input_tokens;
    all.output_tokens += row.usage.output_tokens;
    all.estimated_spend_usd += row.usage.estimated_cost_usd;
  }
  assert(summary.model_calls === all.model_calls && summary.input_tokens === all.input_tokens &&
    summary.output_tokens === all.output_tokens &&
    close(summary.estimated_spend_usd, round(all.estimated_spend_usd), 1.1e-8) &&
    summary.estimated_spend_usd <= manifest.cap_usd, 'SUMMARY_USAGE_MISMATCH');
  assert(object(summary.methods) && sameSet(Object.keys(summary.methods), METHODS), 'SUMMARY_METHODS_INVALID');
  for (const method of METHODS) {
    const expected = methodSummary(trials.filter(r => r.method === method));
    const actual = summary.methods[method];
    for (const key of ['completed','correct','model_calls','refinement_helped','refinement_harmed','refinement_changed']) {
      assert(actual?.[key] === expected[key], `METHOD_${method}_${key}_MISMATCH`);
    }
    for (const key of ['accuracy','mean_latency_ms','p95_latency_ms','estimated_cost_usd']) {
      assert(close(actual?.[key], expected[key], key === 'estimated_cost_usd' ? 1.1e-8 : 0.002),
        `METHOD_${method}_${key}_MISMATCH`);
    }
  }
  return {
    status: 'PASS', scope: 'synthetic development evidence consistency only',
    productionCouncilCertified: false, independentProvenanceAuthenticated: false,
    git_sha: manifest.git_sha, suite_sha256: manifest.suite_sha256,
    case_count: suite.length, trial_count: trials.length, model_calls: all.model_calls,
    estimated_spend_usd: summary.estimated_spend_usd,
    method_correct: Object.fromEntries(METHODS.map(m => [m, summary.methods[m].correct])),
  };
}
export async function verifyDirectory(directory) {
  const names = ['manifest.json', 'summary.json', 'suite.jsonl', 'trials.jsonl'];
  const [manifest, summary, suiteRaw, trialsRaw] = await Promise.all(
    names.map(n => readFile(resolve(directory, n), 'utf8')),
  );
  return verifyHardDevelopmentEvidence({
    manifest: JSON.parse(manifest), summary: JSON.parse(summary), suiteRaw, trialsRaw,
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const dir = process.argv[2];
  if (!dir) { console.error('Usage: node hard-development-integrity.mjs <unpacked-evidence-directory>'); process.exitCode = 2; }
  else {
    try { console.log(JSON.stringify(await verifyDirectory(dir), null, 2)); }
    catch (error) { console.error(error.message); process.exitCode = 1; }
  }
}
