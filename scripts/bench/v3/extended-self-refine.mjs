import { createSelfRefineCanonicalHarness } from './harnesses.mjs';
import { canonicalizeOutputContract, OUTPUT_CANONICALIZER_VERSION } from './canonicalizer.mjs';

export const EXTENDED_SELF_REFINE_VERSION = 'generic-six-call-self-refinement-v1';
function addUsage(...usage) {
  return usage.reduce((out, item) => {
    out.input_tokens += Number(item?.input_tokens ?? 0);
    out.output_tokens += Number(item?.output_tokens ?? 0);
    out.total_tokens += Number(item?.total_tokens ?? (Number(item?.input_tokens ?? 0) + Number(item?.output_tokens ?? 0)));
    return out;
  }, { input_tokens: 0, output_tokens: 0, total_tokens: 0 });
}

/**
 * A six-call generic self-refinement comparator: existing four-pass
 * requirements/draft/critique/revision, then one renewed critique and
 * one final answer pass. Matches the Council hybrid on call count and
 * output-token ceilings, NOT actual input tokens, spend or latency.
 */
export function createExtendedSelfRefineCanonicalHarness(baseProvider) {
  const fourCall = createSelfRefineCanonicalHarness(baseProvider);
  return {
    id: baseProvider.id + '+six-call-self-refine',
    model: baseProvider.model + ' + six-call generic self-refinement',
    availability: baseProvider.availability,
    async complete({ task, prompt, maxOutputTokens }) {
      const original = String(task?.prompt ?? prompt ?? '');
      if (!original.trim()) throw new Error('MISSING_ORIGINAL_TASK');
      const totalBudget = Number(maxOutputTokens ?? 1024);
      if (!Number.isFinite(totalBudget) || totalBudget < 256) throw new Error('INVALID_TOTAL_BUDGET');
      const extraReviewBudget = Math.max(128, Math.min(300, Math.floor(totalBudget * 0.25)));
      const first = await fourCall.complete({ task, prompt: original, maxOutputTokens: totalBudget });
      const critique = await baseProvider.complete({
        task,
        maxOutputTokens: extraReviewBudget,
        prompt: [
          'Controlled synthetic benchmark. Check the answer independently against the original task.',
          'Identify specific, falsifiable mistakes in chronology, arithmetic, constraints and requested output format.',
          'Do not invent missing facts or use any hidden answer key. If the answer is valid, say no concrete defect found.',
          'ORIGINAL TASK:',
          original,
          'CURRENT SELF-REFINED ANSWER:',
          first.text,
        ].join('\n\n'),
      });
      const final = await baseProvider.complete({
        task,
        maxOutputTokens: extraReviewBudget,
        prompt: [
          'Controlled synthetic benchmark. This is the final self-refinement round.',
          'Review the proposed critique against the original task. Only correct demonstrable errors.',
          'Keep a correct answer unchanged. Preserve the exact requested output schema.',
          'Return only the answer requested in the ORIGINAL TASK, never commentary.',
          'ORIGINAL TASK:',
          original,
          'CURRENT ANSWER:',
          first.text,
          'ADDITIONAL CRITIQUE:',
          critique.text,
        ].join('\n\n'),
      });
      const canonical = canonicalizeOutputContract(original, final.text);
      return {
        text: canonical.answer,
        model: baseProvider.model + ' + six-call generic self-refinement',
        usage: addUsage(first.usage, critique.usage, final.usage),
        attempts: Number(first.attempts ?? 0) + Number(critique.attempts ?? 1) + Number(final.attempts ?? 1),
        metadata: {
          harness: EXTENDED_SELF_REFINE_VERSION,
          base_provider: baseProvider.id,
          canonicalizer: OUTPUT_CANONICALIZER_VERSION,
          additional_review_max_tokens_each: extraReviewBudget,
          post_canonicalizer_changed: canonical.changed,
          production_council: false,
        },
        raw: {
          self_refinement_prior: { text: first.text, usage: first.usage },
          post_critique: { text: critique.text, usage: critique.usage },
          post_revision: { text: final.text, usage: final.usage },
          canonical,
        },
      };
    },
  };
}
