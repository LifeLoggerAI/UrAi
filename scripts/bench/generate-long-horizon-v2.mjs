#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const tasks = [];
const add = (id, family, prompt, value) => tasks.push({ id, family, prompt, scorer: { type: 'json_equals', value } });

const names = ['Aster', 'Birch', 'Cedar', 'Dune', 'Ember'];
for (let i = 1; i <= 5; i += 1) {
  const name = names[i - 1];
  const initial = 20 + i;
  const middle = initial + 4 + i;
  const final = middle - (i % 3);
  const mode = i % 2 ? 'green' : 'blue';
  add(`state-${i}`, 'state-supersession', `Return only JSON with keys name, score, flag. Initial: ${name} score=${initial}, flag=gray. Update A explicitly replaces it with score=${middle}, flag=amber. A later stale cache repeats the initial record and must be ignored. Update B explicitly replaces the score with ${final} and the flag with ${mode}. What is the final authoritative record?`, { name, score: final, flag: mode });
}

for (let i = 1; i <= 5; i += 1) {
  const oldLimit = 8 + i * 3;
  const middleLimit = oldLimit + 9;
  const finalLimit = middleLimit - 2;
  const mode = i % 2 ? 'strict' : 'relaxed';
  add(`precedence-${i}`, 'instruction-precedence', `Return only JSON with keys limit and mode. Policy A says limit=${oldLimit}, mode=legacy. Policy B explicitly supersedes A: limit=${middleLimit}, mode=${mode}. A quoted archive then repeats Policy A, but quoted archives are informational only. Policy C supersedes all earlier policies and sets limit=${finalLimit}, leaving mode unchanged from the latest active policy. What policy is active?`, { limit: finalLimit, mode });
}

const scheduleOrders = [
  ['C','E','A','B','D'], ['M','K','P','L','N'], ['T','S','R','U','V'], ['J','G','H','Q','W'], ['C2','C5','C1','C3','C4'],
];
for (let i = 1; i <= 5; i += 1) {
  const order = scheduleOrders[i - 1];
  const listed = [order[3], order[0], order[4], order[2], order[1]];
  const chain = order.slice(0, -1).map((item, index) => `${item} before ${order[index + 1]}`).join('; ');
  add(`schedule-${i}`, 'dependency-schedule', `Return only a JSON array giving the unique five-slot schedule. Items are listed out of order: ${listed.join(', ')}. Constraints: ${chain}.`, order);
}

for (let i = 1; i <= 5; i += 1) {
  const start = 120 + i * 11;
  const add1 = 7 + i;
  const subtract = 3 + i;
  const finalSubtract = 5 + (i % 3);
  const balance = start + add1 - subtract + subtract - finalSubtract;
  add(`ledger-${i}`, 'ledger-recovery', `Return only JSON with keys balance and entries_applied. Start balance=${start}. Entry 1 adds ${add1}. Entry 2 subtracts ${subtract}. Entry 3 explicitly reverses Entry 2, adding ${subtract} back. Entry 4 subtracts ${finalSubtract}. An audit note later repeats Entry 2 but labels it a historical duplicate; do not apply duplicates. Count the reversal as an applied entry.`, { balance, entries_applied: 4 });
}

for (let i = 1; i <= 5; i += 1) {
  const base = i * 20;
  const candidates = [
    { id: `A${i}`, cost: base + 3, risk: 2, score: 80 + i },
    { id: `B${i}`, cost: base + 8, risk: 1, score: 86 + i },
    { id: `C${i}`, cost: base + 1, risk: 3, score: 92 + i },
    { id: `D${i}`, cost: base + 6, risk: 1, score: 84 + i },
  ];
  const budget = base + 7;
  add(`selection-${i}`, 'constraint-selection', `Return only JSON with keys selected and score. Choose exactly one candidate with cost <= ${budget} and risk <= 2. Among valid candidates choose highest score; ties go to lower cost. Candidates: ${JSON.stringify(candidates)}`, { selected: `D${i}`, score: 84 + i });
}

for (let i = 1; i <= 5; i += 1) {
  const s = `S${i}`, a = `A${i}`, b = `B${i}`, t = `T${i}`, x = `X${i}`;
  add(`path-${i}`, 'multi-hop-path', `Return only a JSON array of node IDs for the unique active path from ${s} to ${t}. Initial edges: ${s}->${a}, ${a}->${b}, ${b}->${t}, ${s}->${x}, ${x}->${t}. Later update explicitly removes ${s}->${x}. A stale cache still lists that removed edge; ignore it. No other edges exist.`, [s, a, b, t]);
}

for (let i = 1; i <= 5; i += 1) {
  const total = 70 + i * 10;
  const alpha = 20 + i;
  const beta = 15 + i * 2;
  const reserve = 10 + i;
  const gamma = total - alpha - beta - reserve;
  add(`allocation-${i}`, 'constraint-arithmetic', `Return only JSON with keys alpha, beta, gamma, reserve. A total pool of ${total} units must be fully allocated. Alpha is fixed at ${alpha}. Beta is fixed at ${beta}. Reserve is fixed at ${reserve}. Gamma receives exactly the remainder.`, { alpha, beta, gamma, reserve });
}

for (let i = 1; i <= 5; i += 1) {
  const quantities = { bolts: 30 + i, gears: 20 + i * 2, seals: 15 + i };
  const ship = { bolts: 4 + i, gears: 3 + i, seals: 2 + i };
  const returned = { bolts: 1, gears: 2, seals: 1 };
  const correction = 2 + i;
  const final = {
    bolts: quantities.bolts - ship.bolts + returned.bolts,
    gears: quantities.gears - ship.gears + returned.gears + correction,
    seals: quantities.seals - ship.seals + returned.seals,
  };
  add(`inventory-${i}`, 'inventory-reconciliation', `Return only JSON with keys bolts, gears, seals. Starting inventory: ${JSON.stringify(quantities)}. Shipment subtracts ${JSON.stringify(ship)}. Customer return adds ${JSON.stringify(returned)}. Then a verified count correction adds ${correction} gears. A stale pre-correction snapshot appears afterward; ignore it. What is final inventory?`, final);
}

for (let i = 1; i <= 5; i += 1) {
  const rows = [
    { id: `P${i}A`, active: true, tier: 2, age: 10 + i, score: 75 + i },
    { id: `P${i}B`, active: true, tier: 1, age: 8 + i, score: 80 + i },
    { id: `P${i}C`, active: false, tier: 1, age: 7 + i, score: 99 },
    { id: `P${i}D`, active: true, tier: 1, age: 12 + i, score: 83 + i },
  ];
  add(`filter-${i}`, 'filter-sort', `Return only JSON with keys selected and score. Filter to active=true, tier=1, age <= ${10 + i}. From survivors choose highest score. Rows: ${JSON.stringify(rows)}`, { selected: `P${i}B`, score: 80 + i });
}

for (let i = 1; i <= 5; i += 1) {
  const root = `R${i}`, a = `A${i}`, b = `B${i}`, c = `C${i}`, d = `D${i}`;
  add(`closure-${i}`, 'dependency-closure', `Return only a JSON array sorted alphabetically. To deploy ${root}, all transitive prerequisites are required. Dependencies: ${root} requires ${a} and ${b}; ${a} requires ${c}; ${b} requires ${c} and ${d}; ${c} and ${d} require nothing. Return the complete prerequisite set, excluding ${root}.`, [a, b, c, d].sort());
}

for (let i = 1; i <= 5; i += 1) {
  const versions = [`2.${i}.0`, `2.${i}.1-beta`, `2.${i}.1`, `2.${i}.2-rc1`, `2.${i}.2`];
  add(`version-${i}`, 'version-resolution', `Return only JSON with key selected. Choose the highest stable release. Pre-release labels beta and rc are not stable. Available versions in arbitrary order: ${versions[1]}, ${versions[4]}, ${versions[0]}, ${versions[3]}, ${versions[2]}.`, { selected: versions[4] });
}

for (let i = 1; i <= 5; i += 1) {
  const rows = [
    { id: `X${i}`, priority: 3, quality: 88 + i, cost: 20 },
    { id: `Y${i}`, priority: 3, quality: 88 + i, cost: 17 },
    { id: `Z${i}`, priority: 2, quality: 99, cost: 10 },
    { id: `W${i}`, priority: 3, quality: 85 + i, cost: 8 },
  ];
  add(`ranking-${i}`, 'ranking-tiebreak', `Return only JSON with key selected. Select by highest priority first, then highest quality, then lowest cost. Candidates: ${JSON.stringify(rows)}`, { selected: `Y${i}` });
}

if (tasks.length !== 60) throw new Error(`Expected 60 tasks, got ${tasks.length}`);
const ids = new Set(tasks.map((task) => task.id));
if (ids.size !== tasks.length) throw new Error('Task IDs must be unique.');
const output = path.resolve(process.cwd(), process.argv[2] ?? 'bench/suites/urai-long-horizon-v2.jsonl');
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${tasks.map((task) => JSON.stringify(task)).join('\n')}\n`, 'utf8');
console.log(`wrote ${tasks.length} tasks across ${new Set(tasks.map((task) => task.family)).size} families to ${output}`);
