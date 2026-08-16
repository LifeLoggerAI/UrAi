function choose(n, k) {
  const kk = Math.min(k, n - k);
  let value = 1;
  for (let i = 1; i <= kk; i += 1) value = value * (n - kk + i) / i;
  return value;
}

export function exactTwoSidedMcNemar(leftOnly, rightOnly) {
  const n = Number(leftOnly) + Number(rightOnly);
  if (n === 0) return 1;
  const k = Math.min(Number(leftOnly), Number(rightOnly));
  let lower = 0;
  for (let i = 0; i <= k; i += 1) lower += choose(n, i) * (0.5 ** n);
  return Math.min(1, 2 * lower);
}

export function pairedAccuracyStats(leftTrials, rightTrials) {
  const left = new Map(leftTrials.map((trial) => [trial.task_id, trial]));
  const right = new Map(rightTrials.map((trial) => [trial.task_id, trial]));
  let bothPass = 0;
  let leftOnly = 0;
  let rightOnly = 0;
  let bothFail = 0;
  const pairs = [];

  for (const [taskId, l] of left) {
    const r = right.get(taskId);
    if (!r) continue;
    const leftPass = l.passed === true;
    const rightPass = r.passed === true;
    if (leftPass && rightPass) bothPass += 1;
    else if (leftPass) leftOnly += 1;
    else if (rightPass) rightOnly += 1;
    else bothFail += 1;
    pairs.push({
      task_id: taskId,
      family: l.family ?? r.family ?? 'unknown',
      left_passed: leftPass,
      right_passed: rightPass,
      delta: Number(rightPass) - Number(leftPass),
    });
  }

  const n = pairs.length;
  return {
    pairs: n,
    both_pass: bothPass,
    left_only: leftOnly,
    right_only: rightOnly,
    both_fail: bothFail,
    right_minus_left_tasks: rightOnly - leftOnly,
    right_minus_left_accuracy: n ? (rightOnly - leftOnly) / n : null,
    mcnemar_exact_two_sided_p: exactTwoSidedMcNemar(leftOnly, rightOnly),
    pair_rows: pairs,
  };
}

function makePrng(seed) {
  let state = (Number(seed) >>> 0) || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}

function sampleIndex(length, random) {
  return Math.min(length - 1, Math.floor(random() * length));
}

function quantile(sorted, p) {
  if (!sorted.length) return null;
  const index = (sorted.length - 1) * p;
  const lo = Math.floor(index);
  const hi = Math.ceil(index);
  if (lo === hi) return sorted[lo];
  const weight = index - lo;
  return sorted[lo] * (1 - weight) + sorted[hi] * weight;
}

export function hierarchicalPairedBootstrap(pairRows, options = {}) {
  const replicates = Number(options.replicates ?? 50000);
  const seed = Number(options.seed ?? 20260816);
  if (!Number.isInteger(replicates) || replicates < 1000) throw new Error('bootstrap replicates must be an integer >= 1000');
  const byFamily = new Map();
  for (const row of pairRows) {
    const family = String(row.family ?? 'unknown');
    if (!byFamily.has(family)) byFamily.set(family, []);
    byFamily.get(family).push(row);
  }
  const families = [...byFamily.keys()].sort();
  if (!families.length) throw new Error('hierarchical bootstrap requires at least one family');
  const random = makePrng(seed);
  const micro = new Array(replicates);
  const macro = new Array(replicates);

  for (let b = 0; b < replicates; b += 1) {
    let allDelta = 0;
    let allCount = 0;
    let macroDelta = 0;
    for (let f = 0; f < families.length; f += 1) {
      const sampledFamily = families[sampleIndex(families.length, random)];
      const rows = byFamily.get(sampledFamily);
      let familyDelta = 0;
      for (let i = 0; i < rows.length; i += 1) {
        const row = rows[sampleIndex(rows.length, random)];
        familyDelta += Number(row.delta ?? 0);
      }
      const familyMean = familyDelta / rows.length;
      macroDelta += familyMean;
      allDelta += familyDelta;
      allCount += rows.length;
    }
    micro[b] = allCount ? allDelta / allCount : 0;
    macro[b] = macroDelta / families.length;
  }

  micro.sort((a, b) => a - b);
  macro.sort((a, b) => a - b);
  return {
    method: 'hierarchical_paired_bootstrap_family_then_task',
    seed,
    replicates,
    families: families.length,
    micro_accuracy_delta_ci95: [quantile(micro, 0.025), quantile(micro, 0.975)],
    macro_family_accuracy_delta_ci95: [quantile(macro, 0.025), quantile(macro, 0.975)],
  };
}

export function macroFamilyAccuracyDelta(pairRows) {
  const byFamily = new Map();
  for (const row of pairRows) {
    const family = String(row.family ?? 'unknown');
    if (!byFamily.has(family)) byFamily.set(family, []);
    byFamily.get(family).push(Number(row.delta ?? 0));
  }
  const familyDeltas = Object.fromEntries([...byFamily.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([family, values]) => [family, values.reduce((a, b) => a + b, 0) / values.length]));
  const values = Object.values(familyDeltas);
  return {
    macro_delta: values.length ? values.reduce((a, b) => a + b, 0) / values.length : null,
    family_deltas: familyDeltas,
    families_positive: values.filter((value) => value > 0).length,
    families_tied: values.filter((value) => value === 0).length,
    families_negative: values.filter((value) => value < 0).length,
  };
}
