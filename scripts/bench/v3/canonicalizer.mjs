import { extractFinalJsonValue } from '../deterministic-output.mjs';

export const OUTPUT_CANONICALIZER_VERSION = 'prompt-contract-canonicalizer-v2';

function requestedKeys(prompt) {
  const match = String(prompt ?? '').match(/\bkeys?\s+([A-Za-z_][A-Za-z0-9_]*(?:\s*,\s*[A-Za-z_][A-Za-z0-9_]*)*(?:\s*,?\s*and\s+[A-Za-z_][A-Za-z0-9_]*)?)/i);
  if (!match) return [];
  return match[1].replace(/\s+and\s+/gi, ',').split(',').map((value) => value.trim()).filter(Boolean);
}

function canonicalJson(value) {
  return JSON.stringify(value);
}

function scalarId(value) {
  if (value == null) return undefined;
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (!Array.isArray(value) && typeof value === 'object' && 'id' in value) {
    const id = value.id;
    if (typeof id === 'string' || typeof id === 'number') return id;
  }
  return undefined;
}

function rankedWinner(value) {
  if (!Array.isArray(value) || value.length === 0) return undefined;
  return scalarId(value[0]);
}

function promptRequestsWinner(prompt) {
  return /\b(rank|ranking|ranked|choose|pick|select|winner|highest|lowest|best)\b/i.test(String(prompt ?? ''));
}

function extractionReason(prefix, source) {
  return source === 'whole_output_json' ? prefix : `${prefix}:${source}`;
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

  const extracted = extractFinalJsonValue(original);
  if (!extracted.found) return { answer: original, changed: false, reason: 'no_json_value_found' };
  const parsed = extracted.value;
  const source = extracted.source;

  if (expectsArray) {
    if (!Array.isArray(parsed)) return { answer: original, changed: false, reason: 'array_contract_mismatch' };
    const answerText = canonicalJson(parsed);
    return { answer: answerText, changed: answerText !== original, reason: extractionReason('canonical_json_array', source) };
  }

  if (!keys.length) {
    const answerText = canonicalJson(parsed);
    return { answer: answerText, changed: answerText !== original, reason: extractionReason('canonical_json', source) };
  }

  const expected = [...new Set(keys)];
  let value = parsed;
  let repairReason = null;

  if (expected.length === 1 && expected[0] === 'selected' && promptRequestsWinner(prompt)) {
    if (Array.isArray(parsed)) {
      const winner = rankedWinner(parsed);
      if (winner !== undefined) {
        value = { selected: winner };
        repairReason = 'deterministic_ranked_winner_projection';
      }
    } else if (parsed && typeof parsed === 'object') {
      const actual = Object.keys(parsed);
      if (actual.length === 1 && actual[0] === 'id') {
        const winner = scalarId(parsed.id);
        if (winner !== undefined) {
          value = { selected: winner };
          repairReason = 'deterministic_selection_shape_repair';
        }
      } else if ('selected' in parsed) {
        if (Array.isArray(parsed.selected)) {
          const winner = rankedWinner(parsed.selected);
          if (winner !== undefined) {
            value = { selected: winner };
            repairReason = 'deterministic_ranked_winner_projection';
          }
        } else if (parsed.selected && typeof parsed.selected === 'object') {
          const winner = scalarId(parsed.selected);
          if (winner !== undefined) {
            value = { selected: winner };
            repairReason = 'deterministic_selection_shape_repair';
          }
        }
      }
    }
  }

  if (expected.length === 2 && expected.includes('selected') && expected.includes('score') && parsed && !Array.isArray(parsed) && typeof parsed === 'object') {
    if (parsed.selected && !Array.isArray(parsed.selected) && typeof parsed.selected === 'object' && 'id' in parsed.selected) {
      const selectedScore = parsed.selected.score;
      const score = 'score' in parsed ? parsed.score : selectedScore;
      const winner = scalarId(parsed.selected);
      if (winner !== undefined && score !== undefined) {
        value = { selected: winner, score };
        repairReason = 'deterministic_selection_shape_repair';
      }
    } else if ('id' in parsed && 'score' in parsed) {
      const winner = scalarId(parsed.id);
      if (winner !== undefined && (typeof parsed.score === 'number' || typeof parsed.score === 'string')) {
        value = { selected: winner, score: parsed.score };
        repairReason = 'deterministic_requested_key_projection';
      }
    }
  }

  if (!value || Array.isArray(value) || typeof value !== 'object') {
    return { answer: original, changed: false, reason: 'object_contract_mismatch' };
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
    reason: repairReason ?? extractionReason('canonical_exact_key_json', source),
  };
}
