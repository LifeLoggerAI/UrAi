import { usageSum } from './lib.mjs';

function stagePrompt({ task, role, instruction, prior = '' }) {
  return [
    'You are participating in a controlled benchmark. Do not mention the benchmark mechanics in your answer.',
    `URAI Council role: ${role}.`,
    instruction,
    '',
    'Original task:',
    task.prompt,
    prior ? `\nPrior working state:\n${prior}` : '',
  ].join('\n');
}

function providerResult({ text, model, usage, raw, attempts = 1, metadata = {} }) {
  return {
    text: String(text ?? '').trim(),
    model,
    usage: {
      input_tokens: Number(usage?.input_tokens ?? 0),
      output_tokens: Number(usage?.output_tokens ?? 0),
      total_tokens: Number(usage?.total_tokens ?? (Number(usage?.input_tokens ?? 0) + Number(usage?.output_tokens ?? 0))),
    },
    attempts,
    metadata,
    raw,
  };
}

export const REDUCED_COUNCIL_VERSION = 'urai-archivist-builder-v1';

export function createReducedCouncilHarness(baseProvider, options = {}) {
  const archivistShare = Number(options.archivistShare ?? 0.35);
  return {
    id: `${baseProvider.id}+builder2`,
    model: `${baseProvider.model ?? 'unknown'} + URAI Archivist→Builder`,
    availability: baseProvider.availability,
    async complete({ task, prompt, maxOutputTokens }) {
      const totalBudget = Math.max(256, Number(maxOutputTokens ?? 1024));
      const archivistBudget = Math.max(96, Math.floor(totalBudget * archivistShare));
      const builderBudget = Math.max(128, totalBudget - archivistBudget);
      const syntheticTask = { ...task, prompt };

      const archivist = await baseProvider.complete({
        task: syntheticTask,
        maxOutputTokens: archivistBudget,
        prompt: stagePrompt({
          task: syntheticTask,
          role: 'Archivist / State Reconstructor',
          instruction: [
            'Build a compact but lossless state ledger for the solver.',
            'Preserve every authoritative value, candidate row, dependency, ordering rule, tiebreak, output key, and required value type that can affect the answer.',
            'Apply explicit supersession, stale-cache, reversal, duplicate, and precedence rules exactly.',
            'Do not invent missing facts and do not solve the task yet.',
          ].join('\n'),
        }),
      });

      const builder = await baseProvider.complete({
        task: syntheticTask,
        maxOutputTokens: builderBudget,
        prompt: stagePrompt({
          task: syntheticTask,
          role: 'Builder / Exact Solver',
          instruction: [
            'Solve the original task using the state ledger as a cross-check, not as a substitute for the original prompt.',
            'Recompute arithmetic, filtering, dependency closure, ordering, and tiebreaks from source facts when relevant.',
            'Honor the exact requested output schema and value types.',
            'If JSON is requested, end with exactly one complete JSON value containing the final answer and no trailing prose.',
          ].join('\n'),
          prior: `STATE LEDGER:\n${archivist.text}`,
        }),
      });

      return providerResult({
        text: builder.text,
        model: `${baseProvider.model ?? builder.model} + URAI Archivist→Builder`,
        usage: usageSum(archivist.usage, builder.usage),
        attempts: Number(archivist.attempts ?? 1) + Number(builder.attempts ?? 1),
        metadata: {
          harness: REDUCED_COUNCIL_VERSION,
          base_provider: baseProvider.id,
          nominal_model_calls: 2,
        },
        raw: {
          stage_budgets: { archivist: archivistBudget, builder: builderBudget },
          stages: {
            archivist: { text: archivist.text, usage: archivist.usage },
            builder: { text: builder.text, usage: builder.usage },
          },
        },
      });
    },
  };
}
