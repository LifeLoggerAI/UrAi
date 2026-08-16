export const DETERMINISTIC_OUTPUT_VERSION = 'deterministic-json-normalizer-v1';

function parsed(candidate) {
  try {
    return { found: true, value: JSON.parse(String(candidate ?? '').trim()) };
  } catch {
    return { found: false, value: null };
  }
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

  const normalized = JSON.stringify(extracted.value);
  return {
    text: normalized,
    changed: normalized !== raw,
    extraction_source: extracted.source,
  };
}
