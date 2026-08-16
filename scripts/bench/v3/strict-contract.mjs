import { scoreTask } from '../lib.mjs';

export function strictWholeJsonScore(task, rawText) {
  const text = String(rawText ?? '').trim();
  try {
    const value = JSON.parse(text);
    return scoreTask(task, JSON.stringify(value));
  } catch (error) {
    return {
      score: 0,
      passed: false,
      detail: `strict whole-JSON contract failed: ${error.message}`,
    };
  }
}

export function extractPreCanonicalSystemOutput(harnessKind, result) {
  if (harnessKind === 'direct') return result?.raw?.pre_canonical_output ?? result?.text ?? '';
  if (harnessKind === 'self_refine') return result?.raw?.stages?.final?.text ?? result?.text ?? '';
  if (harnessKind === 'council_v3') {
    return result?.raw?.gate?.selected_answer
      ?? result?.raw?.builder_canonical?.answer
      ?? result?.text
      ?? '';
  }
  return result?.text ?? '';
}
