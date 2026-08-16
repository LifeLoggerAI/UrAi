export const SELECTIVE_ROUTER_VERSION = 'prompt-complexity-router-v1';

export function promptComplexityFeatures(prompt) {
  const text = String(prompt ?? '').toLowerCase();
  return {
    state_revision: /(supersed|stale|historical duplicate|revers|latest active|later update|explicitly removes)/.test(text),
    multi_constraint: /(cost\s*<=|risk\s*<=|filter to|among valid|highest score|highest priority|then highest|ties? go|lowest cost)/.test(text),
    dependency_reasoning: /(transitive prerequisites|requires .* and|active path|initial edges|before .*;)/.test(text),
    reconciliation: /(start balance|entry \d|starting inventory|shipment subtracts|fully allocated|remainder)/.test(text),
    competing_records: /(candidate|rows:|available versions|policy [a-z]|initial:)/.test(text),
  };
}

export function routePrompt(prompt, options = {}) {
  const threshold = Number(options.threshold ?? 2);
  const features = promptComplexityFeatures(prompt);
  const score = Object.values(features).filter(Boolean).length;
  return {
    action: score >= threshold ? 'reduced_council' : 'direct',
    score,
    threshold,
    features,
    router_version: SELECTIVE_ROUTER_VERSION,
  };
}

export function createSelectiveRouterHarness(baseProvider, reducedCouncil, options = {}) {
  return {
    id: `${baseProvider.id}+router`,
    model: `${baseProvider.model ?? 'unknown'} + prompt selective router`,
    availability: baseProvider.availability,
    async complete({ task, prompt, maxOutputTokens }) {
      const route = routePrompt(prompt, options);
      if (route.action === 'direct') {
        const result = await baseProvider.complete({ task, prompt, maxOutputTokens });
        return {
          ...result,
          model: `${baseProvider.model ?? result.model} + selective direct`,
          metadata: {
            ...(result.metadata ?? {}),
            harness: SELECTIVE_ROUTER_VERSION,
            route,
            nominal_model_calls: 1,
          },
          raw: { route, selected_method: 'direct', selected_raw: result.raw },
        };
      }

      const result = await reducedCouncil.complete({ task, prompt, maxOutputTokens });
      return {
        ...result,
        model: `${baseProvider.model ?? result.model} + selective reduced Council`,
        metadata: {
          ...(result.metadata ?? {}),
          harness: SELECTIVE_ROUTER_VERSION,
          route,
          nominal_model_calls: 2,
        },
        raw: { route, selected_method: 'reduced_council', selected_raw: result.raw },
      };
    },
  };
}
