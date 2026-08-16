export const BUILDER_PRESERVATION_GATE_VERSION = 'builder-preservation-gate-v2-independent';

const REPLACEABLE_DEFECT_TYPES = new Set([
  'arithmetic_error',
  'contradiction',
  'constraint_violation',
  'missing_condition',
  'invalid_option',
  'output_contract_error',
]);

function stripCodeFence(text) {
  const trimmed = String(text ?? '').trim();
  const match = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return match ? match[1].trim() : trimmed;
}

function stableJson(value) {
  if (Array.isArray(value)) return value.map(stableJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableJson(value[key])]));
  }
  return value;
}

function permissiveExtractJson(text) {
  const cleaned = stripCodeFence(text);
  try { return JSON.parse(cleaned); } catch {}
  const firstObject = cleaned.indexOf('{');
  const lastObject = cleaned.lastIndexOf('}');
  if (firstObject !== -1 && lastObject > firstObject) {
    try { return JSON.parse(cleaned.slice(firstObject, lastObject + 1)); } catch {}
  }
  const firstArray = cleaned.indexOf('[');
  const lastArray = cleaned.lastIndexOf(']');
  if (firstArray !== -1 && lastArray > firstArray) {
    return JSON.parse(cleaned.slice(firstArray, lastArray + 1));
  }
  throw new Error('No valid JSON value found in model output.');
}

export function normalizeAnswerForComparison(answer) {
  const text = stripCodeFence(String(answer ?? '')).trim();
  if (!text) return '';
  try {
    return `json:${JSON.stringify(stableJson(permissiveExtractJson(text)))}`;
  } catch {
    return `text:${text.replace(/\s+/g, ' ').trim()}`;
  }
}

export function answersEquivalent(left, right) {
  return normalizeAnswerForComparison(left) === normalizeAnswerForComparison(right);
}

function requestedKeys(prompt) {
  const match = String(prompt ?? '').match(/\bkeys?\s+([A-Za-z_][A-Za-z0-9_]*(?:\s*,\s*[A-Za-z_][A-Za-z0-9_]*)*(?:\s*,?\s*and\s+[A-Za-z_][A-Za-z0-9_]*)?)/i);
  if (!match) return [];
  return match[1].replace(/\s+and\s+/gi, ',').split(',').map((value) => value.trim()).filter(Boolean);
}

export function validateOutputContract(taskPrompt, answer) {
  const prompt = String(taskPrompt ?? '');
  const text = String(answer ?? '').trim();
  const reasons = [];
  if (!text) return { valid: false, reasons: ['empty_answer'] };

  const requestsJson = /(?:return|output|respond)[\s\S]{0,80}\bjson\b|\bjson\s+(?:object|array)\b/i.test(prompt);
  const requestsOnlyJson = /(?:return|output|respond)\s+only\s+(?:(?:a|an|the)\s+)?json\b/i.test(prompt);
  let parsed;
  if (requestsJson) {
    try {
      parsed = requestsOnlyJson ? JSON.parse(stripCodeFence(text)) : permissiveExtractJson(text);
    } catch {
      reasons.push('invalid_json');
    }
  }

  if (parsed !== undefined) {
    if (/\bjson\s+array\b/i.test(prompt) && !Array.isArray(parsed)) reasons.push('expected_json_array');
    const keys = requestedKeys(prompt);
    if (keys.length) {
      if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
        reasons.push('expected_json_object');
      } else {
        const actual = Object.keys(parsed).sort();
        const expected = [...new Set(keys)].sort();
        if (JSON.stringify(actual) !== JSON.stringify(expected)) reasons.push(`expected_exact_keys:${expected.join(',')}`);
      }
    } else if (/\bjson\s+object\b/i.test(prompt) && (Array.isArray(parsed) || parsed === null || typeof parsed !== 'object')) {
      reasons.push('expected_json_object');
    }
  }

  if (/return\s+only\s+(?:the\s+)?(?:candidate\s+)?letter/i.test(prompt)) {
    const cleaned = stripCodeFence(text).trim();
    if (!/^[A-Za-z0-9_-]+$/.test(cleaned)) reasons.push('expected_single_token');
  }

  return { valid: reasons.length === 0, reasons };
}

function parseStage(text, stageName) {
  try {
    const value = permissiveExtractJson(text);
    if (!value || Array.isArray(value) || typeof value !== 'object') return { ok: false, stage: stageName, error: 'stage_output_not_object' };
    return { ok: true, stage: stageName, value };
  } catch (error) {
    return { ok: false, stage: stageName, error: `invalid_stage_json: ${error.message}` };
  }
}

function confidence(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(1, parsed));
}

function nonEmptyEvidence(value) {
  return Array.isArray(value) && value.some((item) => String(item ?? '').trim().length >= 8);
}

function record(parsed) {
  if (!parsed?.ok) return null;
  const value = parsed.value;
  return {
    decision: String(value.decision ?? '').toLowerCase(),
    defectVerified: value.defect_verified === true,
    defectType: String(value.defect_type ?? '').toLowerCase(),
    defectClaim: String(value.defect_claim ?? '').trim(),
    evidence: value.evidence,
    candidate: String(value.candidate_answer ?? ''),
    confidence: confidence(value.confidence),
  };
}

export function decideIndependentBuilderPreservation({ taskPrompt, builderAnswer, criticAText, criticBText, minimumConfidence = 0.95 }) {
  const baseContract = validateOutputContract(taskPrompt, builderAnswer);
  const parsedA = parseStage(criticAText, 'critic_a');
  const parsedB = parseStage(criticBText, 'critic_b');
  const a = record(parsedA);
  const b = record(parsedB);
  const trace = {
    gate_version: BUILDER_PRESERVATION_GATE_VERSION,
    threshold: minimumConfidence,
    base_contract: baseContract,
    stage_parse: { critic_a: parsedA.ok ? 'ok' : parsedA.error, critic_b: parsedB.ok ? 'ok' : parsedB.error },
  };
  const preserve = (reason, extra = {}) => ({
    decision: 'preserve',
    selected_answer: String(builderAnswer ?? ''),
    reason,
    trace: { ...trace, ...extra },
  });

  if (!a || !b) return preserve('unparseable_or_missing_critic');
  if (a.decision !== 'replace' || b.decision !== 'replace') return preserve('replacement_not_independently_unanimous');
  if (!a.defectVerified || !b.defectVerified) return preserve('defect_not_independently_verified');
  if (a.confidence < minimumConfidence || b.confidence < minimumConfidence) return preserve('confidence_below_threshold', { confidences: [a.confidence, b.confidence] });
  if (!REPLACEABLE_DEFECT_TYPES.has(a.defectType) || !REPLACEABLE_DEFECT_TYPES.has(b.defectType)) return preserve('invalid_or_non_replaceable_defect_type');
  if (a.defectType !== b.defectType) return preserve('defect_type_disagreement');
  if (a.defectClaim.length < 12 || b.defectClaim.length < 12 || !nonEmptyEvidence(a.evidence) || !nonEmptyEvidence(b.evidence)) return preserve('defect_claim_or_evidence_not_concrete');
  if (!a.candidate || !b.candidate) return preserve('missing_candidate_answer');
  if (!answersEquivalent(a.candidate, b.candidate)) return preserve('candidate_disagreement');
  if (answersEquivalent(builderAnswer, a.candidate)) return preserve('candidate_equivalent_to_builder');

  const candidateContract = validateOutputContract(taskPrompt, a.candidate);
  if (!candidateContract.valid) return preserve('candidate_violates_output_contract', { candidate_contract: candidateContract });
  if (a.defectType === 'output_contract_error' && baseContract.valid) return preserve('unsupported_output_contract_rewrite');

  return {
    decision: 'replace',
    selected_answer: a.candidate,
    reason: baseContract.valid ? 'independent_verified_defect' : 'independent_verified_defect_with_invalid_builder_contract',
    trace: {
      ...trace,
      candidate_contract: candidateContract,
      defect_type: a.defectType,
      critic_confidences: [a.confidence, b.confidence],
    },
  };
}
