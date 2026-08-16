#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const tasks = [];
const add = (id, family, prompt, value) => tasks.push({ id, family, prompt, scorer: { type: 'json_equals', value } });
const pad = (i) => String(i).padStart(3, '0');

const names = ['Alder','Beryl','Coral','Drift','Elm','Fjord','Grove','Harbor','Indigo','Juniper','Kestrel','Lumen','Mica','Nectar','Onyx','Prairie','Quartz','Reed','Solace','Tundra'];
const flags = ['teal','violet','gold','cyan'];
for (let i = 1; i <= 20; i += 1) {
  const name = names[i - 1];
  const initial = 37 + i * 3;
  const interim = initial + 6 + (i % 7);
  const final = interim - (i % 4) + 2;
  const flag = flags[i % flags.length];
  add(`h2-state-${pad(i)}`, 'state-supersession', `Return only JSON with keys name, score, flag. The authoritative starting record is ${name} with score ${initial} and flag slate. Revision One supersedes it with score ${interim} and flag amber. A delayed cache then repeats the starting record; it is stale and must be ignored. Revision Two supersedes the active record by setting score=${final} and flag=${flag}. What is the final authoritative record?`, { name, score: final, flag });
}

for (let i = 1; i <= 20; i += 1) {
  const oldLimit = 31 + i * 2;
  const middleLimit = oldLimit + 11 + (i % 3);
  const finalLimit = middleLimit - 4 - (i % 2);
  const mode = i % 3 === 0 ? 'audit' : (i % 2 ? 'strict' : 'balanced');
  add(`h2-precedence-${pad(i)}`, 'instruction-precedence', `Return only JSON with keys limit and mode. Rule Alpha sets limit=${oldLimit}, mode=legacy. Rule Beta explicitly supersedes Alpha and sets limit=${middleLimit}, mode=${mode}. A quoted historical excerpt later repeats Alpha but is non-operative. Rule Gamma supersedes all earlier operative rules, changes only limit to ${finalLimit}, and leaves mode inherited from the latest operative rule. Return the active policy.`, { limit: finalLimit, mode });
}

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
for (let i = 1; i <= 20; i += 1) {
  const base = (i * 5) % 21;
  const order = [0,1,2,3,4].map((k) => `${letters[(base + k) % 26]}${i}`);
  const listed = [order[2], order[4], order[0], order[3], order[1]];
  const chain = order.slice(0, -1).map((item, index) => `${item} must occur before ${order[index + 1]}`).join('; ');
  add(`h2-schedule-${pad(i)}`, 'dependency-schedule', `Return only a JSON array containing the unique five-position schedule. Items: ${listed.join(', ')}. Constraints: ${chain}.`, order);
}

for (let i = 1; i <= 20; i += 1) {
  const start = 205 + i * 13;
  const add1 = 9 + (i % 8);
  const subtract = 5 + (i % 6);
  const finalSubtract = 4 + (i % 5);
  const balance = start + add1 - subtract + subtract - finalSubtract;
  add(`h2-ledger-${pad(i)}`, 'ledger-recovery', `Return only JSON with keys balance and entries_applied. Opening balance=${start}. Transaction A adds ${add1}. Transaction B subtracts ${subtract}. Transaction C is an explicit reversal of B and therefore adds ${subtract} back. Transaction D subtracts ${finalSubtract}. A later audit attachment repeats B and marks it duplicate history; do not apply it. Count the reversal as an applied entry.`, { balance, entries_applied: 4 });
}

for (let i = 1; i <= 20; i += 1) {
  const base = 35 + i * 4;
  const candidates = [
    { id: `HA${i}`, cost: base + 2, risk: 2, score: 71 + i },
    { id: `HB${i}`, cost: base + 9, risk: 1, score: 89 + i },
    { id: `HC${i}`, cost: base + 1, risk: 3, score: 94 + i },
    { id: `HD${i}`, cost: base + 5, risk: 1, score: 78 + i + (i % 5) },
  ];
  const budget = base + 6;
  const aScore = candidates[0].score;
  const dScore = candidates[3].score;
  const winner = dScore > aScore ? candidates[3] : candidates[0];
  add(`h2-selection-${pad(i)}`, 'constraint-selection', `Return only JSON with keys selected and score. Select exactly one candidate satisfying cost <= ${budget} and risk <= 2. Among valid candidates select highest score; if scores tie, select lower cost. Candidates: ${JSON.stringify(candidates)}`, { selected: winner.id, score: winner.score });
}

for (let i = 1; i <= 20; i += 1) {
  const s = `HS${i}`, a = `HA${i}`, b = `HB${i}`, t = `HT${i}`, x = `HX${i}`;
  add(`h2-path-${pad(i)}`, 'multi-hop-path', `Return only a JSON array of node IDs for the unique active path from ${s} to ${t}. Active graph begins with ${s}->${a}, ${a}->${b}, ${b}->${t}, ${s}->${x}, ${x}->${t}. A later authoritative update removes ${s}->${x}. A stale replica still lists that removed edge and must be ignored. No other edges exist.`, [s, a, b, t]);
}

for (let i = 1; i <= 20; i += 1) {
  const total = 145 + i * 9;
  const alpha = 26 + i;
  const beta = 19 + (i % 7) * 2;
  const reserve = 13 + (i % 6);
  const gamma = total - alpha - beta - reserve;
  add(`h2-allocation-${pad(i)}`, 'constraint-arithmetic', `Return only JSON with keys alpha, beta, gamma, reserve. Allocate all ${total} units exactly once. Alpha is fixed at ${alpha}; Beta is fixed at ${beta}; Reserve is fixed at ${reserve}; Gamma must receive the exact remainder.`, { alpha, beta, gamma, reserve });
}

for (let i = 1; i <= 20; i += 1) {
  const quantities = { bolts: 48 + i * 2, gears: 32 + i * 3, seals: 27 + i };
  const ship = { bolts: 5 + (i % 5), gears: 4 + (i % 4), seals: 3 + (i % 3) };
  const returned = { bolts: 1 + (i % 2), gears: 2, seals: 1 };
  const correction = 3 + (i % 6);
  const final = {
    bolts: quantities.bolts - ship.bolts + returned.bolts,
    gears: quantities.gears - ship.gears + returned.gears + correction,
    seals: quantities.seals - ship.seals + returned.seals,
  };
  add(`h2-inventory-${pad(i)}`, 'inventory-reconciliation', `Return only JSON with keys bolts, gears, seals. Starting counts: ${JSON.stringify(quantities)}. Shipment subtracts ${JSON.stringify(ship)}. A verified return adds ${JSON.stringify(returned)}. Physical recount then adds ${correction} gears. A stale snapshot from before the recount appears afterward and must be ignored. Return final inventory.`, final);
}

for (let i = 1; i <= 20; i += 1) {
  const ageLimit = 18 + (i % 7);
  const rows = [
    { id: `HF${i}A`, active: true, tier: 2, age: ageLimit - 2, score: 74 + i },
    { id: `HF${i}B`, active: true, tier: 1, age: ageLimit - 1, score: 82 + i },
    { id: `HF${i}C`, active: false, tier: 1, age: ageLimit - 3, score: 99 + i },
    { id: `HF${i}D`, active: true, tier: 1, age: ageLimit + 2, score: 91 + i },
  ];
  add(`h2-filter-${pad(i)}`, 'filter-sort', `Return only JSON with keys selected and score. Keep only rows with active=true, tier=1, and age <= ${ageLimit}. From the survivors select the highest score. Rows: ${JSON.stringify(rows)}`, { selected: `HF${i}B`, score: 82 + i });
}

for (let i = 1; i <= 20; i += 1) {
  const root = `HR${i}`, a = `HCA${i}`, b = `HCB${i}`, c = `HCC${i}`, d = `HCD${i}`;
  add(`h2-closure-${pad(i)}`, 'dependency-closure', `Return only a JSON array sorted alphabetically. Deploying ${root} requires every transitive prerequisite. ${root} requires ${a} and ${b}; ${a} requires ${c}; ${b} requires ${c} and ${d}; ${c} and ${d} have no prerequisites. Exclude ${root} itself.`, [a, b, c, d].sort());
}

for (let i = 1; i <= 20; i += 1) {
  const major = 3 + (i % 3);
  const minor = 10 + i;
  const versions = [`${major}.${minor}.0`, `${major}.${minor}.1-beta`, `${major}.${minor}.1`, `${major}.${minor}.2-rc1`, `${major}.${minor}.2`];
  add(`h2-version-${pad(i)}`, 'version-resolution', `Return only JSON with key selected. Choose the highest stable release; beta and rc builds are pre-release and not stable. Available in arbitrary order: ${versions[3]}, ${versions[0]}, ${versions[4]}, ${versions[1]}, ${versions[2]}.`, { selected: versions[4] });
}

for (let i = 1; i <= 20; i += 1) {
  const priority = 4 + (i % 3);
  const quality = 81 + i;
  const rows = [
    { id: `HRK${i}X`, priority, quality, cost: 26 + (i % 5) },
    { id: `HRK${i}Y`, priority, quality, cost: 19 + (i % 4) },
    { id: `HRK${i}Z`, priority: priority - 1, quality: quality + 12, cost: 8 },
    { id: `HRK${i}W`, priority, quality: quality - 3, cost: 6 },
  ];
  add(`h2-ranking-${pad(i)}`, 'ranking-tiebreak', `Return only JSON with key selected. Rank candidates by highest priority, then highest quality, then lowest cost. Select the single winner. Candidates: ${JSON.stringify(rows)}`, { selected: `HRK${i}Y` });
}

const expectedFamilies = [
  'constraint-arithmetic','constraint-selection','dependency-closure','dependency-schedule',
  'filter-sort','instruction-precedence','inventory-reconciliation','ledger-recovery',
  'multi-hop-path','ranking-tiebreak','state-supersession','version-resolution',
];
if (tasks.length !== 240) throw new Error(`Expected 240 tasks, got ${tasks.length}`);
const ids = new Set(tasks.map((task) => task.id));
if (ids.size !== tasks.length) throw new Error('Task IDs must be unique.');
const families = new Set(tasks.map((task) => task.family));
if (families.size !== expectedFamilies.length || expectedFamilies.some((family) => !families.has(family))) throw new Error('Unexpected holdout family set.');
for (const family of expectedFamilies) {
  const count = tasks.filter((task) => task.family === family).length;
  if (count !== 20) throw new Error(`Expected 20 tasks for ${family}, got ${count}`);
}
const output = path.resolve(process.cwd(), process.argv[2] ?? 'bench/holdout/urai-holdout-v2.jsonl');
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${tasks.map((task) => JSON.stringify(task)).join('\n')}\n`, 'utf8');
console.log(`wrote ${tasks.length} sealed tasks across ${families.size} families to ${output}`);
