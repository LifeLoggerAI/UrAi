import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, appendFile } from 'node:fs/promises';
import path from 'node:path';

export function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

export async function sha256File(filePath) {
  return sha256(await readFile(filePath));
}

export function parseArgs(argv) {
  const out = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const body = token.slice(2);
    const equals = body.indexOf('=');
    if (equals !== -1) {
      out[body.slice(0, equals)] = body.slice(equals + 1);
      continue;
    }
    const next = argv[index + 1];
    if (next && !next.startsWith('--')) {
      out[body] = next;
      index += 1;
    } else {
      out[body] = true;
    }
  }
  return out;
}

export function asPositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function csv(value, fallback = []) {
  if (!value) return fallback;
  return String(value).split(',').map((item) => item.trim()).filter(Boolean);
}

export async function readJsonl(filePath) {
  const raw = await readFile(filePath, 'utf8');
  const rows = [];
  for (const [index, line] of raw.split(/\r?\n/).entries()) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    try {
      rows.push(JSON.parse(trimmed));
    } catch (error) {
      throw new Error(`Invalid JSONL at ${filePath}:${index + 1}: ${error.message}`);
    }
  }
  return rows;
}

export async function ensureDir(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

export async function writeJson(filePath, value) {
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export async function appendJsonl(filePath, value) {
  await ensureDir(path.dirname(filePath));
  await appendFile(filePath, `${JSON.stringify(value)}\n`, 'utf8');
}

export function nowIsoCompact() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

export function clampText(text, maxChars = 20000) {
  const value = String(text ?? '');
  if (value.length <= maxChars) return value;
  return `${value.slice(0, maxChars)}\n...[truncated ${value.length - maxChars} chars]`;
}

export function stripCodeFence(text) {
  const trimmed = String(text ?? '').trim();
  const match = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return match ? match[1].trim() : trimmed;
}

export function extractJson(text) {
  const cleaned = stripCodeFence(text);
  try {
    return JSON.parse(cleaned);
  } catch {
    const firstObject = cleaned.indexOf('{');
    const lastObject = cleaned.lastIndexOf('}');
    if (firstObject !== -1 && lastObject > firstObject) {
      try {
        return JSON.parse(cleaned.slice(firstObject, lastObject + 1));
      } catch {
        // Continue to array attempt.
      }
    }
    const firstArray = cleaned.indexOf('[');
    const lastArray = cleaned.lastIndexOf(']');
    if (firstArray !== -1 && lastArray > firstArray) return JSON.parse(cleaned.slice(firstArray, lastArray + 1));
    throw new Error('No valid JSON value found in model output.');
  }
}

function normalizeJson(value) {
  if (Array.isArray(value)) return value.map(normalizeJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, normalizeJson(value[key])]));
  }
  return value;
}

export function scoreTask(task, outputText) {
  const scorer = task.scorer ?? { type: 'nonempty' };
  if (scorer.type === 'nonempty') {
    const pass = Boolean(String(outputText ?? '').trim());
    return { score: pass ? 1 : 0, passed: pass, detail: pass ? 'non-empty output' : 'empty output' };
  }
  if (scorer.type === 'contains_all') {
    const haystack = String(outputText ?? '').toLowerCase();
    const needles = (scorer.values ?? []).map((value) => String(value).toLowerCase());
    const missing = needles.filter((needle) => !haystack.includes(needle));
    const score = needles.length === 0 ? 1 : (needles.length - missing.length) / needles.length;
    return { score, passed: missing.length === 0, detail: missing.length ? `missing: ${missing.join(', ')}` : 'all required strings present' };
  }
  if (scorer.type === 'regex') {
    const regex = new RegExp(scorer.pattern, scorer.flags ?? 'i');
    const pass = regex.test(String(outputText ?? ''));
    return { score: pass ? 1 : 0, passed: pass, detail: pass ? 'regex matched' : 'regex did not match' };
  }
  if (scorer.type === 'json_equals') {
    try {
      const actual = normalizeJson(extractJson(outputText));
      const expected = normalizeJson(scorer.value);
      const pass = JSON.stringify(actual) === JSON.stringify(expected);
      return { score: pass ? 1 : 0, passed: pass, detail: pass ? 'JSON matched exactly' : `expected ${JSON.stringify(expected)}; got ${JSON.stringify(actual)}` };
    } catch (error) {
      return { score: 0, passed: false, detail: `invalid JSON output: ${error.message}` };
    }
  }
  throw new Error(`Unknown scorer type: ${scorer.type}`);
}

export function summarizeTrials(trials) {
  const completed = trials.filter((trial) => trial.status === 'completed');
  const passed = completed.filter((trial) => trial.passed);
  const scores = completed.map((trial) => Number(trial.score ?? 0));
  const latencies = completed.map((trial) => Number(trial.latency_ms ?? 0));
  const usage = completed.reduce((acc, trial) => {
    acc.input_tokens += Number(trial.usage?.input_tokens ?? 0);
    acc.output_tokens += Number(trial.usage?.output_tokens ?? 0);
    acc.total_tokens += Number(trial.usage?.total_tokens ?? 0);
    return acc;
  }, { input_tokens: 0, output_tokens: 0, total_tokens: 0 });
  return {
    trials: trials.length,
    completed: completed.length,
    unavailable: trials.filter((trial) => trial.status === 'unavailable').length,
    errors: trials.filter((trial) => trial.status === 'error').length,
    pass_rate: completed.length ? passed.length / completed.length : null,
    mean_score: scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null,
    mean_latency_ms: latencies.length ? latencies.reduce((a, b) => a + b, 0) / latencies.length : null,
    usage,
  };
}

export async function fetchJson(url, options = {}, retry = {}) {
  const timeoutMs = retry.timeoutMs ?? 120000;
  const attempts = retry.attempts ?? 3;
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let shouldRetry = false;
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      const text = await response.text();
      let body;
      try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }
      if (response.ok) return { response, body, attempts: attempt };
      const serialized = JSON.stringify(body);
      const billingBlocked = /prepayment credits are depleted|credit balance is too low|billing.*(disabled|required)/i.test(serialized);
      shouldRetry = !billingBlocked && (response.status === 429 || response.status >= 500);
      const error = new Error(`HTTP ${response.status}: ${clampText(serialized, 2000)}`);
      error.nonRetryable = !shouldRetry;
      throw error;
    } catch (error) {
      lastError = error;
      if (error?.nonRetryable || attempt === attempts) throw error;
      shouldRetry = true;
    } finally {
      clearTimeout(timer);
    }
    if (shouldRetry) await new Promise((resolve) => setTimeout(resolve, 750 * 2 ** (attempt - 1)));
  }
  throw lastError ?? new Error('Request failed');
}

export function usageSum(...values) {
  return values.reduce((acc, usage) => {
    acc.input_tokens += Number(usage?.input_tokens ?? 0);
    acc.output_tokens += Number(usage?.output_tokens ?? 0);
    acc.total_tokens += usage?.total_tokens == null ? Number(usage?.input_tokens ?? 0) + Number(usage?.output_tokens ?? 0) : Number(usage.total_tokens);
    return acc;
  }, { input_tokens: 0, output_tokens: 0, total_tokens: 0 });
}
