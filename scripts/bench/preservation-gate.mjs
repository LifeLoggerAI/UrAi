import { extractJson, stripCodeFence } from './lib.mjs';

export const PRESERVATION_GATE_VERSION = 'answer-preservation-gate-v1';

const REPLACEABLE_DEFECT_TYPES = new Set([
  'arithmetic_error',
  'contradiction',
  'constraint_violation',
  'missing_condition',
  'invalid_option',
  'format_error',
  'other',
]);

function stableJson(value) {
  if (Array.isArray(value)) return value.map(stableJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableJson(value[key])]));
  }
  return value;
}

export function normalizeAnswerForComparison(answer) {
  const text = stripCodeFence(String(answer ?? '')).trim();
  if (!text) return '';
  try {
    return `json:${JSON.stringify(stableJson(extractJson(text)))}`;
  } catch {
    return `text:${text.replace(/\s+/g, ' ').trim()}`;
  }
}

export function answersEquivalent(left, right) {
  return normalizeAnswerForComparison(left) === normalizeAnswerForComparison(right);
}

export function validateOutputContract(taskPrompt, answer) {
  const prompt = String(taskPrompt ?? '');
  const text = String(answer ?? '').trim();
  const reasons = [];
  if (!text) return { valid: false, reasons: ['empty_answer'] };

  const requestsJson = /(?:return|output|respond)[\s\S]{0,80}\bjson\b|\bjson\s+(?:object|array)\b/i.test(prompt);
  if (requestsJson) {
    try {
      const parsed = extractJson(text);
      if (/\bjson\s+array\b/i.test(prompt) && !Array.isArray(parsed)) reasons.push('expected_json_array');
      if (/\bjson\s+object\b|\bjson\s+with\s+keys\b/i.test(prompt) && (Array.isArray(parsed) || parsed === null || typeof parsed !== 'object')) {
        reasons.push('expected_json_object');
      }
    } catch {
      reasons.push('invalid_json');
    }
  }

  if (/return\s+only\s+(?:the\s+)?(?:candidate\s+)?letter/i.test(prompt)) {
    const cleaned = stripCodeFence(text).trim();
    if (!/^[A-Za-z0-9_-]+$/.test(cleaned)) reasons.push('expected_single_token');
  }

  return { valid: reasons.length === 0, reasons };
}

export function parseGateStage(text, stageName) {
  try {
    const value = extractJson(text);
    if (!value || Array.isArray(value) || typeof value !== 'object') {
      return { ok: false, stage: stageName, error: 'stage_output_not_object' };
    }
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

function replacementRecord(parsed, candidateField) {
  if (!parsed?.ok) return null;
  const value = parsed.value;
  return {
    decision: String(value.decision ?? '').toLowerCase(),
    defectVerified: value.defect_verified === true,
    defectType: String(value.defect_type ?? '').toLowerCase(),
    defectClaim: String(value.defect_claim ?? '').trim(),
    evidence: value.evidence,
    candidate: String(value[candidateField] ?? ''),
    confidence: confidence(value.confidence),
  };
}

export function decideAnswerPreservation({
  taskPrompt,
  baseAnswer,
  challengeText,
  verificationText,
  arbiterText,
  minimumConfidence = 0.9,
}) {
  const baseContract = validateOutputContract(taskPrompt, baseAnswer);
  const challengeParsed = parseGateStage(challengeText, 'challenge');
  const verificationParsed = parseGateStage(verificationText, 'verification');
  const arbiterParsed = parseGateStage(arbiterText, 'arbiter');
  const challenge = replacementRecord(challengeParsed, 'candidate_answer');
  const verification = replacementRecord(verificationParsed, 'candidate_answer');
  const arbiter = replacementRecord(arbiterParsed, 'candidate_answer');

  const trace = {
    gate_version: PRESERVATION_GATE_VERSION,
    threshold: minimumConfidence,
    base_contract: baseContract,
    stage_parse: {
      challenge: challengeParsed.ok ? 'ok' : challengeParsed.error,
      verification: verificationParsed.ok ? 'ok' : verificationParsed.error,
      arbiter: arbiterParsed.ok ? 'ok' : arbiterParsed.error,
    },
  };

  const preserve = (reason, extra = {}) => ({
    decision: 'preserve',
    selected_answer: String(baseAnswer ?? ''),
    reason,
    trace: { ...trace, ...extra },
  });

  if (!challenge || !verification || !arbiter) return preserve('unparseable_or_missing_gate_stage');

  const records = [challenge, verification, arbiter];
  if (records.some((record) => record.decision !== 'replace')) return preserve('replacement_not_unanimous');
  if (!verification.defectVerified || !arbiter.defectVerified) return preserve('defect_not_independently_verified');
  if (records.some((record) => record.confidence < minimumConfidence)) {
    return preserve('confidence_below_threshold', { confidences: records.map((record) => record.confidence) });
  }
  if (records.some((record) => !REPLACEABLE_DEFECT_TYPES.has(record.defectType))) {
    return preserve('invalid_or_non_replaceable_defect_type');
  }
  if (new Set(records.map((record) => record.defectType)).size !== 1) {
    return preserve('defect_type_disagreement');
  }
  if (records.some((record) => record.defectClaim.length < 12 || !nonEmptyEvidence(record.evidence))) {
    return preserve('defect_claim_or_evidence_not_concrete');
  }
  if (!challenge.candidate || !verification.candidate || !arbiter.candidate) return preserve('missing_candidate_answer');
  if (!answersEquivalent(challenge.candidate, verification.candidate) || !answersEquivalent(verification.candidate, arbiter.candidate)) {
    return preserve('candidate_disagreement');
  }
  if (answersEquivalent(baseAnswer, verification.candidate)) return preserve('candidate_equivalent_to_base');

  const candidateContract = validateOutputContract(taskPrompt, verification.candidate);
  if (!candidateContract.valid) return preserve('candidate_violates_output_contract', { candidate_contract: candidateContract });
  if (baseContract.valid && records.every((record) => record.defectType === 'format_error')) {
    return preserve('unsupported_format_only_rewrite');
  }

  return {
    decision: 'replace',
    selected_answer: verification.candidate,
    reason: baseContract.valid ? 'unanimous_verified_defect' : 'verified_defect_with_invalid_base_contract',
    trace: {
      ...trace,
      candidate_contract: candidateContract,
      defect_type: verification.defectType,
      defect_claim: verification.defectClaim,
      confidences: records.map((record) => record.confidence),
    },
  };
}
