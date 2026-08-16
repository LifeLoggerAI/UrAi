import { fetchJson, usageSum } from './lib.mjs';

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

export function createUraiCouncilHarness(baseProvider) {
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
    'fable+urai': createUraiCouncilHarness(base.fable),
    'mythos+urai': createUraiCouncilHarness(base.mythos),
    'openai+urai': createUraiCouncilHarness(base.openai),
    'mock+urai': createUraiCouncilHarness(base.mock),
  };
}
