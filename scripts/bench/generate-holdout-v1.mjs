#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const tasks = [];
const add = (id, family, prompt, value) => tasks.push({ id, family, prompt, scorer: { type: 'json_equals', value } });

const labels = ['Kite', 'Lumen', 'Morrow', 'Nacre', 'Opal', 'Pine'];
for (let i = 1; i <= 6; i += 1) {
  const name = labels[i - 1];
  const initial = 31 + i * 3;
  const revised = initial + 8 - (i % 2);
  const finalScore = revised - (2 + (i % 3));
  const finalFlag = i % 3 === 0 ? 'violet' : (i % 2 ? 'teal' : 'gold');
  add(`hold-state-${i}`, 'state-supersession', `Respond only with JSON using exactly the keys name, score, flag. Baseline record: name=${name}, score=${initial}, flag=white. Revision 1 expressly supersedes the baseline score and flag with score=${revised}, flag=orange. A delayed replica then repeats the baseline record and is stale. Revision 2 expressly supersedes only the score with ${finalScore} and flag with ${finalFlag}; name remains unchanged. Return the authoritative record after all messages.`, { name, score: finalScore, flag: finalFlag });
}

for (let i = 1; i <= 6; i += 1) {
  const oldLimit = 19 + i * 4;
  const activeLimit = oldLimit + 11;
  const finalLimit = activeLimit - (3 + (i % 2));
  const mode = i % 2 ? 'guarded' : 'fast';
  add(`hold-precedence-${i}`, 'instruction-precedence', `Return only JSON with exactly keys limit and mode. Rulebook v1 says limit=${oldLimit}, mode=legacy. Rulebook v2 explicitly replaces v1 and sets limit=${activeLimit}, mode=${mode}. A quoted training example later reproduces v1 but is non-authoritative. Rulebook v3 explicitly overrides every earlier limit and sets limit=${finalLimit}; it does not change mode. What values are active?`, { limit: finalLimit, mode });
}

const scheduleOrders = [
  ['H','B','F','D','J'], ['Q','A','M','C','R'], ['V','K','N','E','T'], ['G2','G5','G1','G4','G3'], ['U','P','S','L','X'], ['C7','C2','C9','C4','C8'],
];
for (let i = 1; i <= 6; i += 1) {
  const order = scheduleOrders[i - 1];
  const listed = [order[2], order[4], order[0], order[3], order[1]];
  const constraints = order.slice(0, -1).map((item, index) => `${item} must occur before ${order[index + 1]}`).join('; ');
  add(`hold-schedule-${i}`, 'dependency-schedule', `Return only a JSON array containing the unique five-position schedule. Items are presented unsorted: ${listed.join(', ')}. Ordering constraints: ${constraints}.`, order);
}

for (let i = 1; i <= 6; i += 1) {
  const start = 203 + i * 13;
  const credit = 9 + i * 2;
  const debit = 5 + i;
  const fee = 4 + (i % 4);
  const balance = start + credit - debit + debit - fee;
  add(`hold-ledger-${i}`, 'ledger-recovery', `Return only JSON with exactly keys balance and entries_applied. Opening balance=${start}. Transaction A credits ${credit}. Transaction B debits ${debit}. Transaction C is an explicit reversal of B and credits ${debit}. Transaction D debits fee=${fee}. A later audit excerpt repeats Transaction B and marks it duplicate history, so it must not be applied again. Count the reversal as an applied transaction.`, { balance, entries_applied: 4 });
}

for (let i = 1; i <= 6; i += 1) {
  const base = 17 * i;
  const candidates = [
    { id: `J${i}`, cost: base + 4, risk: 2, score: 71 + i },
    { id: `K${i}`, cost: base + 9, risk: 1, score: 88 + i },
    { id: `L${i}`, cost: base + 2, risk: 4, score: 97 + i },
    { id: `M${i}`, cost: base + 7, risk: 1, score: 84 + i },
    { id: `N${i}`, cost: base + 5, risk: 2, score: 86 + i },
  ];
  const budget = base + 8;
  add(`hold-selection-${i}`, 'constraint-selection', `Return only JSON with exactly keys selected and score. Pick exactly one option satisfying cost <= ${budget} and risk <= 2. Among eligible options choose the largest score; if scores tie, choose lower cost. Options: ${JSON.stringify(candidates)}`, { selected: `N${i}`, score: 86 + i });
}

for (let i = 1; i <= 6; i += 1) {
  const s = `R${i}`, a = `C${i}`, b = `D${i}`, c = `E${i}`, t = `Z${i}`, x = `X${i}`;
  add(`hold-path-${i}`, 'multi-hop-path', `Return only a JSON array of node IDs for the only active route from ${s} to ${t}. Initial directed edges: ${s}->${a}, ${a}->${b}, ${b}->${c}, ${c}->${t}, ${s}->${x}, ${x}->${t}. A later authoritative change removes ${s}->${x}. A cached graph shown afterward still contains that removed edge and is stale. No other edges exist.`, [s, a, b, c, t]);
}

for (let i = 1; i <= 6; i += 1) {
  const total = 127 + i * 9;
  const alpha = 24 + i;
  const beta = 18 + i * 2;
  const reserve = 13 + (i % 3);
  const gamma = total - alpha - beta - reserve;
  add(`hold-allocation-${i}`, 'constraint-arithmetic', `Return only JSON with exactly keys alpha, beta, gamma, reserve. Allocate all ${total} units. Alpha is exactly ${alpha}; beta is exactly ${beta}; reserve is exactly ${reserve}; gamma receives the entire remainder.`, { alpha, beta, gamma, reserve });
}

for (let i = 1; i <= 6; i += 1) {
  const quantities = { bolts: 48 + i * 2, gears: 33 + i * 3, seals: 27 + i };
  const ship = { bolts: 6 + i, gears: 4 + i, seals: 3 + (i % 2) };
  const returned = { bolts: 2, gears: 1 + (i % 2), seals: 2 };
  const correction = 3 + i;
  const final = {
    bolts: quantities.bolts - ship.bolts + returned.bolts,
    gears: quantities.gears - ship.gears + returned.gears + correction,
    seals: quantities.seals - ship.seals + returned.seals,
  };
  add(`hold-inventory-${i}`, 'inventory-reconciliation', `Return only JSON with exactly keys bolts, gears, seals. Initial stock: ${JSON.stringify(quantities)}. A shipment removes ${JSON.stringify(ship)}. A customer return restores ${JSON.stringify(returned)}. A verified physical count then adds ${correction} gears. A subsequently displayed snapshot predates the count correction and must be ignored. Return final stock.`, final);
}

for (let i = 1; i <= 6; i += 1) {
  const rows = [
    { id: `Q${i}A`, active: true, tier: 1, age: 14 + i, score: 70 + i },
    { id: `Q${i}B`, active: true, tier: 1, age: 9 + i, score: 82 + i },
    { id: `Q${i}C`, active: false, tier: 1, age: 8 + i, score: 98 },
    { id: `Q${i}D`, active: true, tier: 2, age: 7 + i, score: 96 + i },
    { id: `Q${i}E`, active: true, tier: 1, age: 10 + i, score: 80 + i },
  ];
  add(`hold-filter-${i}`, 'filter-sort', `Return only JSON with exactly keys selected and score. Keep rows where active=true, tier=1, and age <= ${11 + i}. From the survivors choose the row with highest score. Rows: ${JSON.stringify(rows)}`, { selected: `Q${i}B`, score: 82 + i });
}

for (let i = 1; i <= 6; i += 1) {
  const root = `Root${i}`, a = `A${i}`, b = `B${i}`, c = `C${i}`, d = `D${i}`, e = `E${i}`;
  const expected = [a, b, c, d, e].sort();
  add(`hold-closure-${i}`, 'dependency-closure', `Return only a JSON array sorted alphabetically. Deploying ${root} requires every transitive prerequisite. ${root} requires ${a} and ${b}; ${a} requires ${c} and ${d}; ${b} requires ${d} and ${e}; ${c}, ${d}, and ${e} require nothing. Return all prerequisites, excluding ${root}.`, expected);
}

for (let i = 1; i <= 6; i += 1) {
  const versions = [`3.${i}.7`, `3.${i}.8-alpha`, `3.${i}.8`, `3.${i}.9-rc2`, `3.${i}.9`, `3.${i}.10-beta`];
  add(`hold-version-${i}`, 'version-resolution', `Return only JSON with exactly key selected. Choose the highest stable semantic version; alpha, beta, and rc builds are prereleases and do not count as stable. Available in arbitrary order: ${versions[3]}, ${versions[0]}, ${versions[5]}, ${versions[2]}, ${versions[4]}, ${versions[1]}.`, { selected: versions[4] });
}

for (let i = 1; i <= 6; i += 1) {
  const rows = [
    { id: `A${i}`, priority: 4, quality: 91 + i, cost: 26 },
    { id: `B${i}`, priority: 4, quality: 91 + i, cost: 19 },
    { id: `C${i}`, priority: 3, quality: 100, cost: 5 },
    { id: `D${i}`, priority: 4, quality: 89 + i, cost: 8 },
    { id: `E${i}`, priority: 2, quality: 105, cost: 1 },
  ];
  add(`hold-ranking-${i}`, 'ranking-tiebreak', `Return only JSON with exactly key selected. Rank candidates lexicographically by highest priority, then highest quality, then lowest cost. Candidates: ${JSON.stringify(rows)}`, { selected: `B${i}` });
}

if (tasks.length !== 72) throw new Error(`Expected 72 tasks, got ${tasks.length}`);
const ids = new Set(tasks.map((task) => task.id));
if (ids.size !== tasks.length) throw new Error('Holdout task IDs must be unique.');
const familyCounts = new Map();
for (const task of tasks) familyCounts.set(task.family, (familyCounts.get(task.family) ?? 0) + 1);
if (familyCounts.size !== 12 || [...familyCounts.values()].some((count) => count !== 6)) throw new Error(`Expected 12 families x 6 tasks, got ${JSON.stringify(Object.fromEntries(familyCounts))}`);

const output = path.resolve(process.cwd(), process.argv[2] ?? 'bench/holdout/urai-holdout-v1.jsonl');
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${tasks.map((task) => JSON.stringify(task)).join('\n')}\n`, 'utf8');
console.log(`wrote sealed holdout ${tasks.length} tasks across ${familyCounts.size} families to ${output}`);
