import { canonicalizeOutputContract, OUTPUT_CANONICALIZER_VERSION } from './canonicalizer.mjs';
import { decideIndependentBuilderPreservation, BUILDER_PRESERVATION_GATE_VERSION } from './gate.mjs';

const CRITIC_SCHEMA = `{
  "decision": "preserve" | "replace",
  "defect_verified": true | false,
  "defect_type": "arithmetic_error" | "contradiction" | "constraint_violation" | "missing_condition" | "invalid_option" | "output_contract_error" | "none",
  "defect_claim": "one specific falsifiable claim",
  "evidence": ["concise checkable reason"],
  "candidate_answer": "complete exact replacement answer, or exact builder answer when preserving",
  "confidence": 0.0
}`;

function usageSum(...items) {
  return items.reduce((acc, value) => {
    acc.input_tokens += Number(value?.input_tokens ?? 0);
    acc.output_tokens += Number(value?.output_tokens ?? 0);
    acc.total_tokens += Number(value?.total_tokens ?? (Number(value?.input_tokens ?? 0) + Number(value?.output_tokens ?? 0)));
    return acc;
  }, { input_tokens: 0, output_tokens: 0, total_tokens: 0 });
}

function stagePrompt({ task, role, instruction, prior = '' }) {
  return [
    'You are participating in a controlled development benchmark. Do not mention benchmark mechanics.',
    role ? `Role: ${role}.` : '',
    instruction,
    '',
    'Original task:',
    task.prompt,
    prior ? `\nPrior working state:\n${prior}` : '',
  ].filter(Boolean).join('\n');
}

const ARCHIVIST_INSTRUCTION = [
  'Extract authoritative facts, superseding updates, dependencies, constraints, ranking/precedence rules, and the exact requested output contract. Do not solve.',
  'Preserve unchanged identity fields and values even when later updates omit them.',
  'A later note marked duplicate or historical does not retroactively cancel an earlier real event.',
  'Copy requested top-level keys and container type exactly.',
].join('\n');

const BUILDER_INSTRUCTION = [
  'Solve the original task completely. Treat the original task as authoritative and use the ledger only as an aid.',
  'Re-read the original task before emitting the answer. Preserve unchanged fields, apply chronology and precedence exactly, and distinguish an original event from a later duplicate note.',
  'For ranking, apply criteria lexicographically in the stated order. Recompute arithmetic and verify stated constraints once before output.',
  'Return only the exact structure requested: no explanation, no extra keys, no alternate schema, and no prose around the answer.',
].join('\n');

async function runArchivistBuilder(baseProvider, syntheticTask, totalBudget) {
  const archivistBudget = Math.max(64, Math.floor(totalBudget * 0.18));
  const builderBudget = Math.max(64, Math.floor(totalBudget * 0.37));
  const archivist = await baseProvider.complete({
    task: syntheticTask,
    maxOutputTokens: archivistBudget,
    prompt: stagePrompt({ task: syntheticTask, role: 'Archivist / Memory Keeper', instruction: ARCHIVIST_INSTRUCTION }),
  });
  const builder = await baseProvider.complete({
    task: syntheticTask,
    maxOutputTokens: builderBudget,
    prompt: stagePrompt({
      task: syntheticTask,
      role: 'Builder / Candidate Solver',
      instruction: BUILDER_INSTRUCTION,
      prior: `STATE LEDGER:\n${archivist.text}`,
    }),
  });
  const canonical = canonicalizeOutputContract(syntheticTask.prompt, builder.text);
  return { archivist, builder, canonical, budgets: { archivist: archivistBudget, builder: builderBudget } };
}

export function createCanonicalizedDirectProvider(baseProvider) {
  return {
    id: `${baseProvider.id}+direct-canon`,
    model: `${baseProvider.model} + shared deterministic output canonicalizer`,
    availability: baseProvider.availability,
    async complete({ task, prompt, maxOutputTokens }) {
      const result = await baseProvider.complete({ task, prompt, maxOutputTokens });
      const canonical = canonicalizeOutputContract(task.prompt, result.text);
      return {
        ...result,
        text: canonical.answer,
        model: `${baseProvider.model} + shared deterministic output canonicalizer`,
        metadata: { ...(result.metadata ?? {}), harness: 'direct-canonicalized-v1', canonicalizer: OUTPUT_CANONICALIZER_VERSION, canonicalizer_changed: canonical.changed, canonicalizer_reason: canonical.reason },
        raw: { base: result.raw, pre_canonical_output: result.text, canonicalizer: canonical },
      };
    },
  };
}

export function createBuilderCanonicalHarness(baseProvider) {
  return {
    id: `${baseProvider.id}+builder-canon`,
    model: `${baseProvider.model} + Archivist/Builder + shared canonicalizer`,
    availability: baseProvider.availability,
    async complete({ task, prompt, maxOutputTokens }) {
      const totalBudget = Math.max(256, Number(maxOutputTokens ?? 1024));
      const syntheticTask = { ...task, prompt };
      const run = await runArchivistBuilder(baseProvider, syntheticTask, totalBudget);
      return {
        text: run.canonical.answer,
        model: `${baseProvider.model} + Archivist/Builder + shared canonicalizer`,
        usage: usageSum(run.archivist.usage, run.builder.usage),
        attempts: Number(run.archivist.attempts ?? 1) + Number(run.builder.attempts ?? 1),
        metadata: {
          harness: 'urai-builder-canonical-v1',
          base_provider: baseProvider.id,
          canonicalizer: OUTPUT_CANONICALIZER_VERSION,
          canonicalizer_changed: run.canonical.changed,
          canonicalizer_reason: run.canonical.reason,
        },
        raw: {
          stage_budgets: { ...run.budgets, unallocated: totalBudget - run.budgets.archivist - run.budgets.builder },
          stages: {
            archivist: { text: run.archivist.text, usage: run.archivist.usage },
            builder: { text: run.builder.text, usage: run.builder.usage },
          },
          builder_canonical: run.canonical,
        },
      };
    },
  };
}

export function createSelfRefineCanonicalHarness(baseProvider) {
  return {
    id: `${baseProvider.id}+selfrefine-canon`,
    model: `${baseProvider.model} + generic four-pass self-refine + shared canonicalizer`,
    availability: baseProvider.availability,
    async complete({ task, prompt, maxOutputTokens }) {
      const totalBudget = Math.max(256, Number(maxOutputTokens ?? 1024));
      const stageBudgets = {
        requirements: Math.max(64, Math.floor(totalBudget * 0.18)),
        draft: Math.max(64, Math.floor(totalBudget * 0.37)),
        critique: Math.max(64, Math.floor(totalBudget * 0.17)),
      };
      stageBudgets.final = Math.max(64, totalBudget - stageBudgets.requirements - stageBudgets.draft - stageBudgets.critique);
      const syntheticTask = { ...task, prompt };
      const requirements = await baseProvider.complete({
        task: syntheticTask,
        maxOutputTokens: stageBudgets.requirements,
        prompt: stagePrompt({ task: syntheticTask, instruction: 'Extract the important facts, requirements, constraints, dependencies, and required output format. Do not solve yet. Keep the notes compact.' }),
      });
      const draft = await baseProvider.complete({
        task: syntheticTask,
        maxOutputTokens: stageBudgets.draft,
        prompt: stagePrompt({ task: syntheticTask, instruction: 'Use the requirement notes to solve the task completely. Produce a candidate answer in the requested format.', prior: `REQUIREMENT NOTES:\n${requirements.text}` }),
      });
      const critique = await baseProvider.complete({
        task: syntheticTask,
        maxOutputTokens: stageBudgets.critique,
        prompt: stagePrompt({ task: syntheticTask, instruction: 'Critique the candidate against the original task and notes. Identify concrete factual, logical, arithmetic, constraint, dependency, or formatting errors. Be terse.', prior: `REQUIREMENT NOTES:\n${requirements.text}\n\nCANDIDATE:\n${draft.text}` }),
      });
      const final = await baseProvider.complete({
        task: syntheticTask,
        maxOutputTokens: stageBudgets.final,
        prompt: stagePrompt({ task: syntheticTask, instruction: 'Produce the final answer. Resolve only valid critique and output only what the original task requested. Do not include analysis or process commentary.', prior: `REQUIREMENT NOTES:\n${requirements.text}\n\nCANDIDATE:\n${draft.text}\n\nCRITIQUE:\n${critique.text}` }),
      });
      const canonical = canonicalizeOutputContract(task.prompt, final.text);
      return {
        text: canonical.answer,
        model: `${baseProvider.model} + generic four-pass self-refine + shared canonicalizer`,
        usage: usageSum(requirements.usage, draft.usage, critique.usage, final.usage),
        attempts: Number(requirements.attempts ?? 1) + Number(draft.attempts ?? 1) + Number(critique.attempts ?? 1) + Number(final.attempts ?? 1),
        metadata: { harness: 'generic-self-refine-canonical-v1', base_provider: baseProvider.id, canonicalizer: OUTPUT_CANONICALIZER_VERSION, canonicalizer_changed: canonical.changed, canonicalizer_reason: canonical.reason },
        raw: {
          stage_budgets: stageBudgets,
          stages: {
            requirements: { text: requirements.text, usage: requirements.usage },
            draft: { text: draft.text, usage: draft.usage },
            critique: { text: critique.text, usage: critique.usage },
            final: { text: final.text, usage: final.usage },
          },
          final_canonical: canonical,
        },
      };
    },
  };
}

export function createBuilderPreservationHarnessV3(baseProvider, options = {}) {
  const minimumConfidence = Number(options.minimumConfidence ?? 0.95);
  return {
    id: `${baseProvider.id}+urai-v3`,
    model: `${baseProvider.model} + URAI Council v3 independent builder preservation`,
    availability: baseProvider.availability,
    async complete({ task, prompt, maxOutputTokens }) {
      const totalBudget = Math.max(256, Number(maxOutputTokens ?? 1024));
      const syntheticTask = { ...task, prompt };
      const run = await runArchivistBuilder(baseProvider, syntheticTask, totalBudget);
      const builderAnswer = run.canonical.answer;
      const remaining = totalBudget - run.budgets.archivist - run.budgets.builder;
      const criticABudget = Math.max(64, Math.floor(remaining / 2));
      const criticBBudget = Math.max(64, totalBudget - run.budgets.archivist - run.budgets.builder - criticABudget);
      const criticInstruction = [
        'The Builder answer is presumed correct. Independently attempt to falsify it against the original task and ledger.',
        'Do not rewrite for style. Replace only for one concrete typed defect that you can verify yourself.',
        'If no exact defect is proved, choose preserve. If replacing, give the complete exact corrected answer.',
        `Use confidence >= ${minimumConfidence.toFixed(2)} only when the defect and exact correction are directly checkable.`,
        'Return only one valid JSON object using this schema:',
        CRITIC_SCHEMA,
      ].join('\n');
      const criticPrior = `STATE LEDGER:\n${run.archivist.text}\n\nBUILDER ANSWER (preserve unless independently proved wrong):\n${builderAnswer}`;
      const criticA = await baseProvider.complete({
        task: syntheticTask,
        maxOutputTokens: criticABudget,
        prompt: stagePrompt({ task: syntheticTask, role: 'Critic A / Independent Falsifier', instruction: criticInstruction, prior: criticPrior }),
      });
      const criticB = await baseProvider.complete({
        task: syntheticTask,
        maxOutputTokens: criticBBudget,
        prompt: stagePrompt({ task: syntheticTask, role: 'Critic B / Independent Falsifier', instruction: criticInstruction, prior: criticPrior }),
      });
      const gate = decideIndependentBuilderPreservation({
        taskPrompt: task.prompt,
        builderAnswer,
        criticAText: criticA.text,
        criticBText: criticB.text,
        minimumConfidence,
      });
      const finalCanonical = canonicalizeOutputContract(task.prompt, gate.selected_answer);
      return {
        text: finalCanonical.answer,
        model: `${baseProvider.model} + URAI Council v3 independent builder preservation`,
        usage: usageSum(run.archivist.usage, run.builder.usage, criticA.usage, criticB.usage),
        attempts: Number(run.archivist.attempts ?? 1) + Number(run.builder.attempts ?? 1) + Number(criticA.attempts ?? 1) + Number(criticB.attempts ?? 1),
        metadata: {
          harness: 'urai-council-v3-builder-preservation',
          gate_version: BUILDER_PRESERVATION_GATE_VERSION,
          gate_decision: gate.decision,
          gate_reason: gate.reason,
          base_provider: baseProvider.id,
          canonicalizer: OUTPUT_CANONICALIZER_VERSION,
          builder_canonicalizer_changed: run.canonical.changed,
          final_canonicalizer_changed: finalCanonical.changed,
        },
        raw: {
          stage_budgets: { archivist: run.budgets.archivist, builder: run.budgets.builder, critic_a: criticABudget, critic_b: criticBBudget },
          stages: {
            archivist: { text: run.archivist.text, usage: run.archivist.usage },
            builder: { text: run.builder.text, usage: run.builder.usage },
            critic_a: { text: criticA.text, usage: criticA.usage },
            critic_b: { text: criticB.text, usage: criticB.usage },
          },
          builder_canonical: run.canonical,
          gate,
          final_canonical: finalCanonical,
        },
      };
    },
  };
}
