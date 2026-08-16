export const OUTPUT_CANONICALIZER_VERSION = 'prompt-contract-canonicalizer-v1';

function stripCodeFence(text) {
  const trimmed = String(text ?? '').trim();
  const match = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return match ? match[1].trim() : trimmed;
}

function requestedKeys(prompt) {
  const match = String(prompt ?? '').match(/\bkeys?\s+([A-Za-z_][A-Za-z0-9_]*(?:\s*,\s*[A-Za-z_][A-Za-z0-9_]*)*(?:\s*,?\s*and\s+[A-Za-z_][A-Za-z0-9_]*)?)/i);
  if (!match) return [];
  return match[1].replace(/\s+and\s+/gi, ',').split(',').map((value) => value.trim()).filter(Boolean);
}

function parseWholeJson(text) {
  return JSON.parse(stripCodeFence(text));
}

function extractSingleFencedJson(text) {
  const matches = [...String(text ?? '').matchAll(/```(?:json)?\s*([\s\S]*?)\s*```/gi)];
  if (matches.length !== 1) return null;
  try { return JSON.parse(matches[0][1].trim()); } catch { return null; }
}

function canonicalJson(value) {
  return JSON.stringify(value);
}

export function canonicalizeOutputContract(taskPrompt, answer) {
  const prompt = String(taskPrompt ?? '');
  const original = String(answer ?? '').trim();
  const onlyJson = /(?:return|output|respond)\s+only\s+(?:(?:a|an|the)\s+)?json\b/i.test(prompt);
  const expectsArray = /\bjson\s+array\b/i.test(prompt);
  const keys = requestedKeys(prompt);
  if (!onlyJson && !expectsArray && !keys.length) {
    return { answer: original, changed: false, reason: 'no_supported_contract' };
  }

  let parsed;
  let source = 'whole';
  try {
    parsed = parseWholeJson(original);
  } catch {
    if (!onlyJson) return { answer: original, changed: false, reason: 'not_strict_json' };
    parsed = extractSingleFencedJson(original);
    if (parsed == null) return { answer: original, changed: false, reason: 'no_unique_fenced_json' };
    source = 'single_fenced_json';
  }

  if (expectsArray) {
    if (!Array.isArray(parsed)) return { answer: original, changed: false, reason: 'array_contract_mismatch' };
    const answerText = canonicalJson(parsed);
    return { answer: answerText, changed: answerText !== original, reason: source === 'whole' ? 'canonical_json_array' : 'extracted_fenced_json_array' };
  }

  if (!keys.length) {
    const answerText = canonicalJson(parsed);
    return { answer: answerText, changed: answerText !== original, reason: source === 'whole' ? 'canonical_json' : 'extracted_fenced_json' };
  }
  if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
    return { answer: original, changed: false, reason: 'object_contract_mismatch' };
  }

  const expected = [...new Set(keys)];
  const actual = Object.keys(parsed);
  let value = parsed;

  if (expected.length === 1 && expected[0] === 'selected') {
    if (actual.length === 1 && actual[0] === 'id' && typeof parsed.id !== 'object') {
      value = { selected: parsed.id };
    } else if (actual.length === 1 && actual[0] === 'selected' && parsed.selected && !Array.isArray(parsed.selected) && typeof parsed.selected === 'object' && 'id' in parsed.selected) {
      value = { selected: parsed.selected.id };
    }
  }

  if (expected.length === 2 && expected.includes('selected') && expected.includes('score')) {
    if (parsed.selected && !Array.isArray(parsed.selected) && typeof parsed.selected === 'object' && 'id' in parsed.selected) {
      const selectedScore = parsed.selected.score;
      const score = 'score' in parsed ? parsed.score : selectedScore;
      if (score !== undefined) value = { selected: parsed.selected.id, score };
    }
  }

  const valueKeys = Object.keys(value).sort();
  const expectedSorted = [...expected].sort();
  if (JSON.stringify(valueKeys) !== JSON.stringify(expectedSorted)) {
    return { answer: original, changed: false, reason: 'exact_key_contract_unrepairable' };
  }

  const answerText = canonicalJson(value);
  return {
    answer: answerText,
    changed: answerText !== original,
    reason: value !== parsed ? 'deterministic_selection_shape_repair' : (source === 'whole' ? 'canonical_exact_key_json' : 'extracted_fenced_exact_key_json'),
  };
}
