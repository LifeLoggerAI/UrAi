import { fetchJson, usageSum } from './lib.mjs';
import { decideAnswerPreservation, PRESERVATION_GATE_VERSION } from './preservation-gate.mjs';

function providerResult({ text, model, usage, raw, attempts = 1, metadata = {} }) {
  const normalizedUsage = {
    input_tokens: Number(usage?.input_tokens ?? 0),
    output_tokens: Number(usage?.output_tokens ?? 0),
    total_tokens: Number(usage?.total_tokens ?? (Number(usage?.input_tokens ?? 0) + Number(usage?.output_tokens ?? 0))),
  };
  return { text: String(text ?? '').trim(), model, usage: normalizedUsage, raw, attempts, metadata };
}

export function createGeminiProvider(env = process.env) {
  const apiKey = env.GEMINI_API_KEY;
  const model = env.GEMINI_BENCH_MODEL ?? 'gemini-3.6-flash';
  return {
    id: 'gemini',
    model,
    availability: apiKey ? { available: true } : { available: false, reason: 'GEMINI_API_KEY is not set' },
    async complete({ prompt, maxOutputTokens }) {
      if (!apiKey) throw new Error('GEMINI_API_KEY is not set');
      const { body, attempts } = await fetchJson(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens },
          }),
        },
      );
      const text = (body.candidates?.[0]?.content?.parts ?? [])
        .filter((part) => typeof part?.text === 'string')
        .map((part) => part.text)
        .join('\n');
      const usage = body.usageMetadata ?? {};
      return providerResult({
        text,
        model,
        attempts,
        usage: {
          input_tokens: usage.promptTokenCount,
          output_tokens: usage.candidatesTokenCount,
          total_tokens: usage.totalTokenCount,
        },
        raw: body,
      });
    },
  };
}

function createAnthropicProvider({ id, model, apiKey, unavailableReason }) {
  return {
    id,
    model,
    availability: apiKey && model ? { available: true } : { available: false, reason: unavailableReason },
    async complete({ prompt, maxOutputTokens }) {
      if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
      if (!model) throw new Error(unavailableReason);
      const { body, attempts } = await fetchJson('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: maxOutputTokens,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const text = (body.content ?? [])
        .filter((block) => block?.type === 'text' && typeof block?.text === 'string')
        .map((block) => block.text)
        .join('\n');
      return providerResult({
        text,
        model,
        attempts,
        usage: {
          input_tokens: body.usage?.input_tokens,
          output_tokens: body.usage?.output_tokens,
          total_tokens: Number(body.usage?.input_tokens ?? 0) + Number(body.usage?.output_tokens ?? 0),
        },
        raw: body,
      });
    },
  };
}

export function createFableProvider(env = process.env) {
  return createAnthropicProvider({
    id: 'fable',
    model: env.ANTHROPIC_FABLE_MODEL ?? 'claude-fable-5',
    apiKey: env.ANTHROPIC_API_KEY,
    unavailableReason: 'ANTHROPIC_API_KEY is not set',
  });
}

export function createMythosProvider(env = process.env) {
  const model = env.ANTHROPIC_MYTHOS_MODEL;
  return createAnthropicProvider({
    id: 'mythos',
    model,
    apiKey: env.ANTHROPIC_API_KEY,
    unavailableReason: model
      ? 'ANTHROPIC_API_KEY is not set'
      : 'ANTHROPIC_MYTHOS_MODEL is not set; Mythos access is restricted and no public model ID is assumed',
  });
}

export function createOpenAIProvider(env = process.env) {
  const apiKey = env.OPENAI_API_KEY;
  const model = env.OPENAI_BENCH_MODEL ?? env.OPENAI_MODEL ?? 'gpt-4o-mini';
  return {
    id: 'openai',
    model,
    availability: apiKey ? { available: true } : { available: false, reason: 'OPENAI_API_KEY is not set' },
    async complete({ prompt, maxOutputTokens }) {
      if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
      const { body, attempts } = await fetchJson('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          max_tokens: maxOutputTokens,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      return providerResult({
        text: body.choices?.[0]?.message?.content ?? '',
        model,
        attempts,
        usage: {
          input_tokens: body.usage?.prompt_tokens,
          output_tokens: body.usage?.completion_tokens,
          total_tokens: body.usage?.total_tokens,
        },
        raw: body,
      });
    },
  };
}

export function createMockProvider() {
  return {
    id: 'mock',
    model: 'deterministic-mock-v1',
    availability: { available: true },
    async complete({ prompt }) {
      const marker = prompt.match(/<MOCK_ANSWER>([\s\S]*?)<\/MOCK_ANSWER>/);
      const text = marker ? marker[1].trim() : '{"ok":true}';
      return providerResult({
        text,
        model: 'deterministic-mock-v1',
        usage: { input_tokens: 1, output_tokens: 1, total_tokens: 2 },
        raw: { mock: true },
      });
    },
  };
}

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

export function createUraiCouncilHarnessV1(baseProvider) {
  return {
    id: `${baseProvider.id}+urai`,
    model: `${baseProvider.model ?? 'unknown'} + URAI Council harness v1`,
    availability: baseProvider.availability,
    async complete({ task, prompt, maxOutputTokens }) {
      const totalBudget = Math.max(128, Number(maxOutputTokens ?? 1024));
      const stageBudgets = {
        archivist: Math.max(64, Math.floor(totalBudget * 0.18)),
        builder: Math.max(64, Math.floor(totalBudget * 0.37)),
        mirror: Math.max(64, Math.floor(totalBudget * 0.17)),
      };
      stageBudgets.final = Math.max(64, totalBudget - stageBudgets.archivist - stageBudgets.builder - stageBudgets.mirror);

      const syntheticTask = { ...task, prompt };
      const archivist = await baseProvider.complete({
        task: syntheticTask,
        maxOutputTokens: stageBudgets.archivist,
        prompt: stagePrompt({
          task: syntheticTask,
          role: 'Archivist / Memory Keeper',
          instruction: 'Extract the authoritative facts, updates that supersede earlier facts, dependencies, constraints, and required output format. Build a compact state ledger. Do not solve yet.',
        }),
      });
      const builder = await baseProvider.complete({
        task: syntheticTask,
        maxOutputTokens: stageBudgets.builder,
        prompt: stagePrompt({
          task: syntheticTask,
          role: 'Builder / Next Step Maker',
          instruction: 'Using the state ledger, solve the task completely. Check each dependency and constraint. Produce a candidate answer in the requested format.',
          prior: `STATE LEDGER:\n${archivist.text}`,
        }),
      });
      const mirror = await baseProvider.complete({
        task: syntheticTask,
        maxOutputTokens: stageBudgets.mirror,
        prompt: stagePrompt({
          task: syntheticTask,
          role: 'Mirror / Pattern Reflection',
          instruction: 'Audit the candidate against the original task and state ledger. Identify concrete mistakes, stale facts, missing constraints, arithmetic errors, or formatting violations. Be terse and specific.',
          prior: `STATE LEDGER:\n${archivist.text}\n\nCANDIDATE:\n${builder.text}`,
        }),
      });
      const final = await baseProvider.complete({
        task: syntheticTask,
        maxOutputTokens: stageBudgets.final,
        prompt: stagePrompt({
          task: syntheticTask,
          role: 'Guardian + Guide',
          instruction: 'Produce the final answer. Resolve every valid critique, preserve user constraints, and output only what the original task requested. Do not include analysis, the ledger, Council role names, or commentary.',
          prior: `STATE LEDGER:\n${archivist.text}\n\nCANDIDATE:\n${builder.text}\n\nAUDIT:\n${mirror.text}`,
        }),
      });

      return providerResult({
        text: final.text,
        model: `${baseProvider.model ?? final.model} + URAI Council harness v1`,
        usage: usageSum(archivist.usage, builder.usage, mirror.usage, final.usage),
        attempts: Number(archivist.attempts ?? 1) + Number(builder.attempts ?? 1) + Number(mirror.attempts ?? 1) + Number(final.attempts ?? 1),
        raw: {
          stages: {
            archivist: { text: archivist.text, usage: archivist.usage },
            builder: { text: builder.text, usage: builder.usage },
            mirror: { text: mirror.text, usage: mirror.usage },
            final: { text: final.text, usage: final.usage },
          },
          stage_budgets: stageBudgets,
        },
        metadata: { harness: 'urai-council-v1', base_provider: baseProvider.id },
      });
    },
  };
}

const GATE_SCHEMA = `{
  "decision": "preserve" | "replace",
  "defect_verified": true | false,
  "defect_type": "arithmetic_error" | "contradiction" | "constraint_violation" | "missing_condition" | "invalid_option" | "format_error" | "other" | "none",
  "defect_claim": "one specific falsifiable claim",
  "evidence": ["concise checkable reason"],
  "candidate_answer": "the complete exact replacement answer, or the exact base answer when preserving",
  "confidence": 0.0
}`;

export function createUraiCouncilHarness(baseProvider, options = {}) {
  const minimumConfidence = Number(options.minimumConfidence ?? 0.9);
  return {
    id: `${baseProvider.id}+urai`,
    model: `${baseProvider.model ?? 'unknown'} + URAI Council harness v2 preservation gate`,
    availability: baseProvider.availability,
    async complete({ task, prompt, maxOutputTokens }) {
      const totalBudget = Math.max(256, Number(maxOutputTokens ?? 1024));
      const stageBudgets = {
        base: Math.max(64, Math.floor(totalBudget * 0.35)),
        challenge: Math.max(64, Math.floor(totalBudget * 0.2)),
        verification: Math.max(64, Math.floor(totalBudget * 0.28)),
      };
      stageBudgets.arbiter = Math.max(64, totalBudget - stageBudgets.base - stageBudgets.challenge - stageBudgets.verification);

      const syntheticTask = { ...task, prompt };
      const base = await baseProvider.complete({
        task: syntheticTask,
        prompt,
        maxOutputTokens: stageBudgets.base,
      });

      const challenge = await baseProvider.complete({
        task: syntheticTask,
        maxOutputTokens: stageBudgets.challenge,
        prompt: stagePrompt({
          task: syntheticTask,
          role: 'Archivist / Base Answer Challenger',
          instruction: [
            'The base answer is presumed correct. Try to falsify it, but do not rewrite it for style.',
            'A replacement is allowed only for a concrete factual, arithmetic, logical, constraint, option, missing-condition, or output-contract defect.',
            'If no exact defect can be proved, choose preserve. Return only one valid JSON object using this schema:',
            GATE_SCHEMA,
          ].join('\n'),
          prior: `BASE ANSWER (preserve exactly unless proved wrong):\n${base.text}`,
        }),
      });

      const verification = await baseProvider.complete({
        task: syntheticTask,
        maxOutputTokens: stageBudgets.verification,
        prompt: stagePrompt({
          task: syntheticTask,
          role: 'Mirror / Independent Defect Verifier',
          instruction: [
            'Independently verify the challenge against the original task and base answer.',
            'Recalculate arithmetic and recheck every cited constraint. Reject stylistic disagreement, vague concern, and speculative correction.',
            'Do not defer to the challenger. If the defect is not concrete and verified, choose preserve.',
            'When replacing, provide the complete exact corrected answer. Return only one valid JSON object using this schema:',
            GATE_SCHEMA,
          ].join('\n'),
          prior: `BASE ANSWER:\n${base.text}\n\nCHALLENGE:\n${challenge.text}`,
        }),
      });

      const arbiter = await baseProvider.complete({
        task: syntheticTask,
        maxOutputTokens: stageBudgets.arbiter,
        prompt: stagePrompt({
          task: syntheticTask,
          role: 'Guardian / Preservation Arbiter',
          instruction: [
            'Choose between the exact base answer and the exact verified candidate. Do not generate a third answer.',
            'The default is preserve. Choose replace only when the challenger and independent verifier identify the same concrete defect and the verifier candidate actually fixes it.',
            'Reject low-confidence, stylistic, malformed, contradictory, or unverified revisions.',
            'Copy the selected candidate answer exactly. Return only one valid JSON object using this schema:',
            GATE_SCHEMA,
          ].join('\n'),
          prior: `BASE ANSWER:\n${base.text}\n\nCHALLENGE:\n${challenge.text}\n\nINDEPENDENT VERIFICATION:\n${verification.text}`,
        }),
      });

      const gate = decideAnswerPreservation({
        taskPrompt: task.prompt,
        baseAnswer: base.text,
        challengeText: challenge.text,
        verificationText: verification.text,
        arbiterText: arbiter.text,
        minimumConfidence,
      });

      return providerResult({
        text: gate.selected_answer,
        model: `${baseProvider.model ?? base.model} + URAI Council harness v2 preservation gate`,
        usage: usageSum(base.usage, challenge.usage, verification.usage, arbiter.usage),
        attempts: Number(base.attempts ?? 1) + Number(challenge.attempts ?? 1) + Number(verification.attempts ?? 1) + Number(arbiter.attempts ?? 1),
        raw: {
          stages: {
            base: { text: base.text, usage: base.usage },
            challenge: { text: challenge.text, usage: challenge.usage },
            verification: { text: verification.text, usage: verification.usage },
            arbiter: { text: arbiter.text, usage: arbiter.usage },
          },
          stage_budgets: stageBudgets,
          gate,
        },
        metadata: {
          harness: 'urai-council-v2',
          gate: PRESERVATION_GATE_VERSION,
          gate_decision: gate.decision,
          gate_reason: gate.reason,
          base_provider: baseProvider.id,
        },
      });
    },
  };
}

export function providerRegistry(env = process.env) {
  const base = {
    gemini: createGeminiProvider(env),
    fable: createFableProvider(env),
    mythos: createMythosProvider(env),
    openai: createOpenAIProvider(env),
    mock: createMockProvider(),
  };
  return {
    ...base,
    'gemini+urai': createUraiCouncilHarness(base.gemini),
    'gemini+urai-v1': createUraiCouncilHarnessV1(base.gemini),
    'fable+urai': createUraiCouncilHarness(base.fable),
    'fable+urai-v1': createUraiCouncilHarnessV1(base.fable),
    'mythos+urai': createUraiCouncilHarness(base.mythos),
    'mythos+urai-v1': createUraiCouncilHarnessV1(base.mythos),
    'openai+urai': createUraiCouncilHarness(base.openai),
    'openai+urai-v1': createUraiCouncilHarnessV1(base.openai),
    'mock+urai': createUraiCouncilHarness(base.mock),
    'mock+urai-v1': createUraiCouncilHarnessV1(base.mock),
  };
}
