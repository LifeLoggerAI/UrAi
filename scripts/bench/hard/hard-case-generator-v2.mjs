// All fictional data. Pure deterministic generators; never insert private user records.
// A seed is chosen only after the benchmark architecture and scorer are frozen.
export const HARD_FAMILIES = Object.freeze([
  'temporal-corrections',
  'multi-generation-relationships',
  'consent-revocation',
  'provenance-and-unknowns',
  'ledger-reconstruction',
  'critical-path-timelines',
  'revised-memory-graph',
  'multi-constraint-decisions',
]);
export const HARD_GENERATOR_VERSION = 'synthetic-life-evidence-hard-v2-development-only';

function seededRandom(seed) {
  let state = 2166136261;
  for (const character of String(seed)) state = Math.imul(state ^ character.charCodeAt(0), 16777619) >>> 0;
  if (!state) state = 2463534242;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}

function pad(n) { return String(n).padStart(3, '0'); }
function integer(rng, min, max) { return min + Math.floor(rng() * (max - min + 1)); }
function permute(values, rng) {
  const result = [...values];
  for (let j = result.length - 1; j > 0; j -= 1) {
    const k = integer(rng, 0, j);
    [result[j], result[k]] = [result[k], result[j]];
  }
  return result;
}
function lineRecords(records, rng) {
  return permute(records, rng).map((v, index) => String(index + 1) + '. ' + v).join('\n');
}

export function generateHardTasks(seed, options = {}) {
  const perFamily = options.perFamily === undefined ? 30 : Number(options.perFamily);
  if (!Number.isInteger(perFamily) || perFamily < 1 || perFamily > 30) throw new Error('INVALID_PER_FAMILY');
  if (typeof seed !== 'string' || seed.length < 12 || seed.length > 250) throw new Error('INVALID_SEED');
  const rng = seededRandom(seed);
  const tasks = [];
  function add(family, index, corpus, question, expected) {
    const id = 'hard-v1-' + family + '-' + pad(index);
    const prompt = [
      'FICTIONAL LIFE-RECORD RECONCILIATION / CASE ' + id,
      'This is a synthetic test. Use only the supplied records. Do not infer facts from missing evidence.',
      'Records are presented out of chronological order; quoted snapshots and cached copies are not new events.',
      'Original factual constraints, authenticated amendments and explicit privacy grants determine the result.',
      'SOURCE RECORDS:',
      corpus,
      'QUESTION: ' + question,
      'Return ONLY a valid JSON value matching the requested shape. No markdown, explanation or extra keys.',
    ].join('\n\n');
    if (prompt.length < 450 || prompt.length > 12000) throw new Error('TASK_LENGTH_INVALID:' + id + ':' + prompt.length);
    tasks.push({ id, family, prompt, scorer: { type: 'json_equals', value: expected } });
  }

  for (let i = 1; i <= perFamily; i += 1) {
    const code = pad(i);
    const seen = integer(rng, 1994, 2012);
    const bought = seen + integer(rng, 2, 5);
    const sold = bought + integer(rng, 4, 9);
    const queryYear = i % 2 ? bought + integer(rng, 0, 2) : sold + integer(rng, 0, 3);
    const object = 'fictional notebook-' + code;
    const quotedOldPurchase = seen + 1;
    const records = [
      '[OLD INTAKE signed in ' + (seen + 1) + '] ' + object + ': first inspected in ' + seen + '; draft purchase year ' + quotedOldPurchase + '. The intake box is explicitly preliminary.',
      '[AUTHENTICATED OWNER CORRECTION signed in ' + (sold + 1) + '] For this same ' + object + ', first inspection occurred in ' + seen + ' and the completed purchase was in ' + bought + '. Supersedes the preliminary purchase box only.',
      '[TRANSFER RECORD signed in ' + sold + '] The owner sold this exact item in ' + sold + ', with the signed transfer kept in the permanent ledger.',
      '[SEARCH CACHE indexed in ' + (sold + 3) + '] A duplicate of the original draft purchase box claims ' + quotedOldPurchase + '. Its source date was ' + (seen + 1) + ', despite the later ingestion date.',
      '[UNRELATED ARCHIVE] A different model of notebook was acquired in ' + (bought + 1) + '; it is not ' + object + '.',
      '[PHOTO CAPTION archived in ' + (sold + 3) + '] A picture of ' + object + ' was printed in ' + (seen + 2) + ', which is not evidence of a purchase.',
      '[FORWARDED QUOTE indexed in ' + (sold + 3) + '] A repost repeats the preliminary purchase year, explicitly without independent verification.',
      '[LATER AUDIT] Transfer does not erase prior ownership years and a sale year is not a purchase year.',
    ];
    add('temporal-corrections', i, lineRecords(records, rng),
      'For ' + object + ', determine first_seen_year, purchase_year, sale_year, and whether the person owned it at the end of ' + queryYear + '. Respond as JSON with EXACT keys first_seen_year, purchase_year, sale_year, owned_at_query_year.',
      { first_seen_year: seen, purchase_year: bought, sale_year: sold, owned_at_query_year: queryYear >= bought && queryYear < sold });
  }

  for (let i = 1; i <= perFamily; i += 1) {
    const code = pad(i);
    const parentId = 'PA-' + code, partnerId = 'PB-' + code, siblingId = 'PS-' + code;
    const childId = 'CH-' + code, child2 = 'CZ-' + code, cousinId = 'CU-' + code, stepId = 'ST-' + code;
    const oldName = 'Arden-' + code, newName = 'Briar-' + code;
    const cousinOld = 'Cedar-' + code, cousinNew = 'Dawn-' + code;
    const records = [
      '[SIGNED FAMILY TREE 2012] ' + parentId + ' and ' + siblingId + ' are biological siblings; both descend from the same two listed parents.',
      '[SIGNED FAMILY TREE 2012] ' + parentId + ' and ' + partnerId + ' are the biological parents of ' + childId + ' and ' + child2 + '.',
      '[SIGNED FAMILY TREE 2012] ' + siblingId + ' is the biological parent of ' + cousinId + '.',
      '[LEGAL NAME RECORD 2020] ' + siblingId + ' used the name ' + oldName + ' before 2020, and changed their legal name to ' + newName + ' in 2020.',
      '[LEGAL NAME RECORD 2022] ' + cousinId + ' used the name ' + cousinOld + ' and changed their legal name to ' + cousinNew + ' in 2022.',
      '[MARRIAGE-ONLY RECORD] ' + stepId + ' is a step-sibling of ' + parentId + ', with no biological shared parent established.',
      '[YEARBOOK 2016] A caption lists ' + oldName + ' and ' + cousinOld + '; this is historical naming, not a new name change.',
      '[FRIENDSHIP REGISTER] ' + child2 + ' has a godparent and several close friends; none is asserted to be a biological first cousin.',
      '[SEARCH CACHE 2025] A copy of a 2010 document still labels ' + siblingId + ' as ' + oldName + '. The content date is 2010.',
    ];
    add('multi-generation-relationships', i, lineRecords(records, rng),
      'As of 2025, identify the biological FIRST COUSIN of ' + childId + ' by person ID, the current legal name of that cousin, and the current legal name of the biological sibling of ' + parentId + '. Do not substitute a step-relative or a historical alias. Return JSON with EXACT keys cousin_id, cousin_name, parent_sibling_name.',
      { cousin_id: cousinId, cousin_name: cousinNew, parent_sibling_name: newName });
  }

  for (let i = 1; i <= perFamily; i += 1) {
    const code = pad(i);
    const ids = Array.from({ length: 8 }, (_, j) => 'MEM-' + code + '-' + j);
    const scope = i % 2 ? 'public' : 'therapist';
    let day = 1;
    const events = [];
    const state = Object.fromEntries(ids.map(id => [id, { public: false, therapist: false }]));
    function change(id, action, purpose) {
      const recordedDay = day++;
      events.push({
        day: recordedDay,
        text: '[PRIVACY LEDGER day ' + recordedDay + '] artifact=' + id + ', action=' + action + ', purpose=' + purpose + ', authenticated=true.',
      });
      for (const p of purpose === 'all' ? ['public', 'therapist'] : [purpose]) state[id][p] = action === 'grant';
    }
    for (let j = 0; j < ids.length; j += 1) {
      if (j % 4 === 0) change(ids[j], 'grant', 'all');
      if (j % 4 === 1) change(ids[j], 'grant', 'public');
      if (j % 4 === 2) change(ids[j], 'grant', 'therapist');
    }
    change(ids[(i + 1) % 8], 'revoke', 'all');
    change(ids[(i + 3) % 8], 'grant', 'therapist');
    change(ids[(i + 5) % 8], 'revoke', 'public');
    change(ids[(i + 1) % 8], 'grant', i % 2 ? 'therapist' : 'public');
    const records = events.map(event => event.text);
    records.push('[IMPORTED SNAPSHOT day 25] Shows only early grants and is explicitly marked stale; does not itself grant permission.');
    records.push('[SECURITY POLICY] Absent explicit grants means denied. A scope-specific regrant never restores another scope.');
    records.push('[NOTE] A cache was indexed later than a revocation; indexing is not authorization.');
    const allowed = ids.filter(id => state[id][scope]).sort();
    add('consent-revocation', i, lineRecords(records, rng),
      'At the end of day 26, which artifact IDs may be shared for purpose=' + scope + '? Apply the authenticated day-ordered permission ledger, including explicit revokes and scope-specific regrants. Respond as JSON with EXACT keys purpose, allowed_ids, denied_count. allowed_ids MUST be alphabetically sorted.',
      { purpose: scope, allowed_ids: allowed, denied_count: ids.length - allowed.length });
  }

  for (let i = 1; i <= perFamily; i += 1) {
    const code = pad(i);
    const actual = integer(rng, 2, 11);
    const witnessA = actual === 3 ? 6 : 3;
    const witnessB = actual === 9 ? 4 : 9;
    const lease = integer(rng, 1, 12);
    const photo = integer(rng, 1, 12);
    const direct = i % 2 === 0;
    const month = m => '2021-' + String(m).padStart(2, '0');
    const signedId = 'DIRECT-' + code;
    const records = [
      '[LEASE-' + code + '] Lease start=' + month(lease) + '-01; lease explicitly does not certify physical arrival date.',
      '[INTERVIEW-' + code + '-A] Recalled arrival in ' + month(witnessA) + ', marked retrospective, no contemporary supporting record.',
      '[INTERVIEW-' + code + '-B] Recalled arrival in ' + month(witnessB) + ', disputes Interview A; neither witness has authenticated date proof.',
      '[PHOTO-' + code + '] Camera timestamp=' + month(photo) + '-18 but location is an unrelated city; cannot be used to date the arrival.',
      '[UTILITY-' + code + '] Account opened in ' + month(integer(rng, 1, 12)) + '; not evidence of the physical moving day.',
      '[AUTHORITY RULE] Only an authenticated contemporaneous physical-arrival record settles the exact arrival month in this case.',
      '[REPOSTED ARCHIVE] A later copy of Interview A remains an interview, not a signed arrival record.',
    ];
    if (direct) records.push('[' + signedId + '] Signed same-day physical-arrival log: arrival=' + month(actual) + '-12; authenticated=true; document directly observes move-in.');
    else records.push('[UNSIGNED SCRAP-' + code + '] A scrap reads ' + month(actual) + ' with no proven author, date, or observed event; it is not verified.');
    add('provenance-and-unknowns', i, lineRecords(records, rng),
      'What exact physical arrival MONTH is established, if any? Return a JSON object with EXACT keys arrival_month, supporting_source_id, lease_month, resolved. Use string unknown and null source when no authenticated direct event evidence exists. Month format is YYYY-MM.',
      { arrival_month: direct ? month(actual) : 'unknown', supporting_source_id: direct ? signedId : null, lease_month: month(lease), resolved: direct });
  }

  for (let i = 1; i <= perFamily; i += 1) {
    const code = pad(i);
    const opening = integer(rng, 430, 1200);
    const creditA = integer(rng, 35, 145);
    const debitB = integer(rng, 24, 97);
    const draftC = integer(rng, 31, 125);
    const correctedC = draftC - integer(rng, 6, 20);
    const creditE = integer(rng, 20, 72);
    const debitF = integer(rng, 14, 48);
    const final = opening + creditA - debitB - correctedC + debitB + creditE - debitF;
    const records = [
      '[ACCOUNT] Opening total ' + opening + ' points before entries; all amounts are integer points.',
      '[ENTRY A] Verified new credit +' + creditA + '.',
      '[ENTRY B] Verified new debit -' + debitB + '.',
      '[ENTRY C] Preliminary debit -' + draftC + '; the same entry ID C is corrected later.',
      '[CORRECTION TO C] Authenticated recount: Entry C actual debit is -' + correctedC + ', replacing the preliminary C amount rather than adding another entry.',
      '[ENTRY D] A new adjustment explicitly REVERSES entry B with +' + debitB + '; reversal D counts as its own applied entry.',
      '[ENTRY E] Verified new credit +' + creditE + '.',
      '[ENTRY F] Verified new debit -' + debitF + '.',
      '[DUPLICATE IMPORT A] The system repeats Entry A under its original ID; ignore duplicate imports.',
      '[STALE SNAPSHOT] An earlier total was cached before the C correction and the D reversal; ignore this snapshot.',
      '[AUDIT] Six unique entry IDs A through F count as applied. Correction of C does not create a seventh entry.',
    ];
    add('ledger-reconstruction', i, lineRecords(records, rng),
      'Apply authoritative corrections, reversals, and duplicate rules. Return JSON with EXACT numeric keys final_balance, net_change, applied_entries.',
      { final_balance: final, net_change: final - opening, applied_entries: 6 });
  }

  for (let i = 1; i <= perFamily; i += 1) {
    const code = pad(i);
    const a = integer(rng, 2, 5), b = integer(rng, 3, 9), cOld = integer(rng, 2, 7);
    const c = cOld + integer(rng, 1, 3), d = integer(rng, 3, 7), e = integer(rng, 2, 6), f = integer(rng, 1, 4);
    const aEnd = a, bEnd = b, cEnd = aEnd + c, dEnd = Math.max(aEnd, bEnd) + d;
    const eStart = Math.max(cEnd, dEnd), eEnd = eStart + e, finish = eEnd + f;
    const records = [
      '[PLAN] Unlimited independent workers. All durations are integer HOURS starting at time 0; a task begins when ALL of its prerequisites finish.',
      '[TASK A] Duration ' + a + '; no prerequisite.',
      '[TASK B] Duration ' + b + '; no prerequisite.',
      '[TASK C] Prerequisite A; draft duration ' + cOld + '.',
      '[C AMENDMENT] Verified final duration for the SAME task C is ' + c + '; replaces its draft, not a new task.',
      '[TASK D] Prerequisites A and B; duration ' + d + '.',
      '[TASK E] Prerequisites C and D; duration ' + e + '.',
      '[TASK F] Prerequisite E; duration ' + f + '. F is the delivery milestone.',
      '[STALE SCREENSHOT] A screenshot still says C=' + cOld + ' and was captured before the verified amendment.',
      '[UNRELATED TASK] A canceled task Z had duration 99; Z is not a prerequisite for anything.',
      '[AUDIT RULE] Parallel independent tasks may overlap; never sum their durations as if only one worker exists.',
    ];
    add('critical-path-timelines', i, lineRecords(records, rng),
      'Calculate earliest feasible START of task E and earliest COMPLETE time of delivery task F, using the authoritative task C duration. Return JSON with EXACT numeric keys e_start_hour, delivery_finish_hour, c_final_duration.',
      { e_start_hour: eStart, delivery_finish_hour: finish, c_final_duration: c });
  }

  for (let i = 1; i <= perFamily; i += 1) {
    const code = pad(i);
    const S = 'S-' + code, A = 'A-' + code, B = 'B-' + code, C = 'C-' + code;
    const D = 'D-' + code, T = 'T-' + code, X = 'X-' + code, Y = 'Y-' + code;
    const R = 'R-' + code;
    const records = [
      '[ORIGINAL GRAPH] Active directed transitions: ' + S + '->' + A + ', ' + A + '->' + B + ', ' + B + '->' + C + ', ' + C + '->' + D + ', ' + D + '->' + T + '.',
      '[ORIGINAL GRAPH] Also included an older shortcut ' + S + '->' + X + ', ' + X + '->' + T + '.',
      '[SIGNED EDGE REVOCATION] Remove ' + S + '->' + X + ' permanently; later cached sightings of this edge do not restore it.',
      '[SIGNED ROUTE CORRECTION] Remove ' + B + '->' + C + '; the recorded route now uses ' + B + '->' + Y + ' and ' + Y + '->' + C + ' instead.',
      '[IRRELEVANT] A separate archive has ' + R + '->' + X + ' and ' + R + '->' + R + '; no edge starts from the active path to ' + R + '.',
      '[STALE PEER] A delayed replica still contains ' + B + '->' + C + ' and ' + S + '->' + X + ', both before signed removals.',
      '[CONSTRAINT] Routes must use CURRENT directed edges in their stated direction; ignore disconnected or removed edges.',
      '[AUDIT] Every active route step corresponds to one linked memory relation; do not infer unstated edges.',
    ];
    const path = [S, A, B, Y, C, D, T];
    add('revised-memory-graph', i, lineRecords(records, rng),
      'Find the UNIQUE current directed path from ' + S + ' to ' + T + '. Return JSON with EXACT keys path and hops, where path is an array of node IDs and hops is the number of directed edges.',
      { path, hops: path.length - 1 });
  }

  for (let i = 1; i <= perFamily; i += 1) {
    const code = pad(i);
    const budget = integer(rng, 50, 120);
    const candidates = [];
    for (let j = 0; j <= 6; j += 1) {
      const eligible = [0, 2, 4, 6].includes(j);
      candidates.push({
        id: 'OPT-' + code + '-' + j,
        priority: j === 4 ? (i % 3 === 0 ? 6 : 4) : j === 6 ? 5 : 4,
        quality: 70 + integer(rng, 0, 24),
        cost: eligible ? budget - integer(rng, 2, 15) : budget + integer(rng, 1, 18),
        risk: j === 1 ? 4 : integer(rng, 0, 2),
        authorized: j !== 3,
        evidence_verified: j !== 5,
      });
    }
    const valid = candidates.filter(c => c.cost <= budget && c.risk <= 2 && c.authorized && c.evidence_verified);
    const sorted = [...valid].sort((a, b) => b.priority - a.priority || b.quality - a.quality || a.cost - b.cost || a.id.localeCompare(b.id));
    const winner = sorted[0];
    const records = [
      '[POLICY] A candidate is ELIGIBLE only when cost <= ' + budget + ', risk <= 2, authorized=true and evidence_verified=true.',
      '[POLICY] Among eligible candidates rank by HIGHEST priority, then HIGHEST quality, then LOWEST cost, then alphabetically smallest ID.',
      '[CANDIDATE ARCHIVE] ' + JSON.stringify(permute(candidates, rng)),
      '[AUDIT] Quality never excuses an unauthorized candidate or a cost above the hard ceiling.',
      '[STALE REPORT] A legacy ranking used quality first; that historical ranking is no longer the active policy.',
      '[INSTRUCTION] Return the selected candidate ID, eligible candidate count, winning priority, and winning quality only; do not return the complete candidate object.',
      '[DATA PROVENANCE] Every row above is fictional and is fully specified. Do not add unstated approvals or convert a false evidence_verified flag to true.',
    ];
    add('multi-constraint-decisions', i, lineRecords(records, rng),
      'Select the current eligible winner. Return JSON with EXACT keys selected, eligible_count, winning_priority, winning_quality.',
      { selected: winner.id, eligible_count: valid.length, winning_priority: winner.priority, winning_quality: winner.quality });
  }

  if (tasks.length !== HARD_FAMILIES.length * perFamily) throw new Error('WRONG_TASK_COUNT');
  if (new Set(tasks.map(t => t.id)).size !== tasks.length) throw new Error('DUPLICATE_TASK_IDS');
  const counts = Object.fromEntries(HARD_FAMILIES.map(f => [f, tasks.filter(t => t.family === f).length]));
  if (Object.values(counts).some(n => n !== perFamily)) throw new Error('UNBALANCED_FAMILIES');
  return tasks;
}
