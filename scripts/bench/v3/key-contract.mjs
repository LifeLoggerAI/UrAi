/**
 * Extract exact JSON output keys from explicit return/respond/output instructions.
 * Ordinary task context mentioning an API key is not an output contract.
 * This intentionally supports a small, auditable grammar: identifier keys
 * (bare, backticked, or quoted), with comma/"and"-separated plural lists.
 * Ambiguous contracts without this grammar are not inferred.
 */
function stripTypeAnnotation(rest) {
  // The 12K corpus includes contracts like "keys id (string), value (integer)".
  const annotation = /^\s*\(\s*(?:(?:[A-Za-z][A-Za-z0-9_-]*\s+){0,2})(?:integer|string|number|boolean|array|object|float|int|bool)(?:\[\])?\s*\)/i.exec(rest);
  return annotation ? rest.slice(annotation[0].length) : rest;
}

function nextIdentifier(input) {
  const m = /^\s*(?:`([A-Za-z_][A-Za-z0-9_]*)`|"([A-Za-z_][A-Za-z0-9_]*)"|'([A-Za-z_][A-Za-z0-9_]*)'|([A-Za-z_][A-Za-z0-9_]*))/.exec(input);
  if (!m) return null;
  return {
    name: m[1] ?? m[2] ?? m[3] ?? m[4],
    quoted: m[4] === undefined,
    rest: stripTypeAnnotation(input.slice(m[0].length)),
  };
}

export function requestedKeys(prompt) {
  const source = String(prompt ?? '');
  // Do not mistake arbitrary mentions like "the API key is expired" for an
  // instruction about the generated answer's JSON keys.
  const contract = /\b(?:return|respond|output)\b[^.!?\n]{0,160}?\bJSON\b[^.!?\n]{0,120}?\b(key|keys)\s+/gi;
  let match;
  let lastContract = null;
  while ((match = contract.exec(source))) lastContract = { kind: match[1].toLowerCase(), end: contract.lastIndex };
  if (!lastContract) return [];

  const first = nextIdentifier(source.slice(lastContract.end));
  if (!first) return [];
  const keys = [first.name];
  if (lastContract.kind === 'key') {
    // A typed singular-key pair, e.g. "integer key cost and array key path".
    // Do not infer an extra field unless a second explicit "key" follows.
    let rest = first.rest;
    while (true) {
      const nextDeclaration = /^\s+and\s+(?:(?:integer|number|string|array|boolean|object|float|int|bool)\s+)?key\s+/i.exec(rest);
      if (!nextDeclaration) break;
      const next = nextIdentifier(rest.slice(nextDeclaration[0].length));
      if (!next) break;
      keys.push(next.name);
      rest = next.rest;
    }
    return [...new Set(keys)];
  }

  let remaining = first.rest;
  while (true) {
    const separator = /^(?:\s*,\s*(?:and\s+)?|\s+and\s+)/i.exec(remaining);
    if (!separator) break;
    const next = nextIdentifier(remaining.slice(separator[0].length));
    if (!next) break;
    // Natural-language type annotations are not additional output keys.
    if (!next.quoted && /^(?:a|an)$/i.test(next.name) && /^\s+(?:(?:signed|unsigned)\s+)?(?:integer|number|string|boolean|array|object|float)\b/i.test(next.rest)) break;
    if (!next.quoted && /^(?:both|all|each|then|where|which|otherwise)$/i.test(next.name)) break;
    keys.push(next.name);
    remaining = next.rest;
  }
  return [...new Set(keys)];
}
