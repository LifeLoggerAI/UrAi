export const DETERMINISTIC_OUTPUT_VERSION = 'deterministic-json-normalizer-v2';

function parsed(candidate) {
  try {
    return { found: true, value: JSON.parse(String(candidate ?? '').trim()) };
  } catch {
    return { found: false, value: null };
  }
}

function requestedKeys(prompt) {
  const match = String(prompt ?? '').match(/\bkeys?\s+([A-Za-z_][A-Za-z0-9_]*(?:\s*,\s*[A-Za-z_][A-Za-z0-9_]*)*(?:\s*,?\s*and\s+[A-Za-z_][A-Za-z0-9_]*)?)/i);
  if (!match) return [];
  return match[1].replace(/\s+and\s+/gi, ',').split(',').map((value) => value.trim()).filter(Boolean);
}

function fencedJsonCandidates(text) {
  const candidates = [];
  const regex = /```(?:json)?\s*([\s\S]*?)```/gi;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const result = parsed(match[1]);
    if (result.found) candidates.push({ ...result, start: match.index, end: regex.lastIndex });
  }
  return candidates;
}

function balancedJsonCandidates(text) {
  const candidates = [];
  for (let start = 0; start < text.length; start += 1) {
    const opening = text[start];
    if (opening !== '{' && opening !== '[') continue;
    const stack = [];
    let inString = false;
    let escaped = false;
    for (let index = start; index < text.length; index += 1) {
      const char = text[index];
      if (inString) {
        if (escaped) escaped = false;
        else if (char === '\\') escaped = true;
        else if (char === '"') inString = false;
        continue;
      }
      if (char === '"') {
        inString = true;
        continue;
      }
      if (char === '{' || char === '[') stack.push(char);
      else if (char === '}' || char === ']') {
        const expected = char === '}' ? '{' : '[';
        if (stack.pop() !== expected) break;
        if (stack.length === 0) {
          const result = parsed(text.slice(start, index + 1));
          if (result.found) candidates.push({ ...result, start, end: index + 1 });
          break;
        }
      }
    }
  }
  return candidates;
}

function repairRequestedShape(taskPrompt, value) {
  const keys = [...new Set(requestedKeys(taskPrompt))];
  if (!keys.length || !value || Array.isArray(value) || typeof value !== 'object') return value;

  if (keys.length === 1 && keys[0] === 'selected') {
    if (Object.keys(value).length === 1 && 'id' in value && typeof value.id !== 'object') return { selected: value.id };
    if (Object.keys(value).length === 1 && value.selected && !Array.isArray(value.selected) && typeof value.selected === 'object' && 'id' in value.selected) {
      return { selected: value.selected.id };
    }
  }

  if (keys.length === 2 && keys.includes('selected') && keys.includes('score')) {
    if (value.selected && !Array.isArray(value.selected) && typeof value.selected === 'object' && 'id' in value.selected) {
      const score = 'score' in value ? value.score : value.selected.score;
      if (score !== undefined) return { selected: value.selected.id, score };
    }
  }

  return value;
}

export function extractFinalJsonValue(text) {
  const source = String(text ?? '').trim();
  if (!source) return { found: false, value: null, source: 'none' };

  const fenced = fencedJsonCandidates(source);
  if (fenced.length) {
    const winner = fenced[fenced.length - 1];
    return { found: true, value: winner.value, source: 'final_fenced_json' };
  }

  const whole = parsed(source);
  if (whole.found) return { found: true, value: whole.value, source: 'whole_output_json' };

  const balanced = balancedJsonCandidates(source);
  if (balanced.length) {
    const winner = balanced.sort((left, right) => left.end - right.end || left.start - right.start).at(-1);
    return { found: true, value: winner.value, source: 'final_balanced_json' };
  }

  return { found: false, value: null, source: 'none' };
}

export function normalizeRequestedOutput(taskPrompt, outputText) {
  const raw = String(outputText ?? '').trim();
  const requestsJson = /\bjson\b/i.test(String(taskPrompt ?? ''));
  if (!requestsJson) return { text: raw, changed: false, extraction_source: 'not_requested' };

  const extracted = extractFinalJsonValue(raw);
  if (!extracted.found) return { text: raw, changed: false, extraction_source: extracted.source };

  const repaired = repairRequestedShape(taskPrompt, extracted.value);
  const normalized = JSON.stringify(repaired);
  return {
    text: normalized,
    changed: normalized !== raw,
    extraction_source: repaired === extracted.value ? extracted.source : `${extracted.source}+shape_repair`,
  };
}
