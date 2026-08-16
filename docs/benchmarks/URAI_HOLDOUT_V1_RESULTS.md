# URAI-HOLDOUT-v1 Results

Status: completed one-shot holdout; architecture remains frozen.

## Provenance

- Protocol: `bench/protocols/urai-holdout-v1-lock.json`
- Protocol lock commit: `4dbb2882e5d2194c048f8245af0eb50ef12052b5`
- Frozen development architecture commit: `a38c811ed3a346ba5fcd7075066502ace8cb3c10`
- Freeze-validation Actions run: `31942437146`
- One-shot holdout Actions run: `31944072604`
- Holdout run head: `a6d68c2d7fd4f950a1283101d30b6410f686ea95`
- Evidence artifact: `urai-holdout-v1-evidence`, artifact ID `9262986202`
- Artifact SHA-256: `44446642dd249c474d04d7b897c44271010b237c7ac79eeee700be917315b6f6`
- Holdout suite SHA-256: `39ebb545f57c80577548b1c9fe1e26a43f10d0285e00c68108e1936c9f3ff460`
- Model: `gpt-4o-mini`
- Max output-token budget: 1,200 per task/harness
- Gate confidence threshold: 0.95
- Holdout size: 72 tasks, 12 families, 6 tasks per family

The holdout was generated only after the architecture/protocol lock. Before any model call, the runner verified the frozen Git blob identities for the v3 gate, harnesses, canonicalizer, provider path, and scorer library. Preflight and gate tests passed. No architecture, prompt, threshold, canonicalizer, scorer, or model changes were made after the lock.

## Official preregistered result

| Method | Correct | Accuracy | Total tokens | Mean latency |
|---|---:|---:|---:|---:|
| Direct + shared canonicalizer | 34/72 | 47.2% | 8,819 | 1,093 ms |
| Generic four-pass self-refine + shared canonicalizer | 35/72 | 48.6% | 124,641 | 6,420 ms |
| URAI Council v3 | 44/72 | 61.1% | 113,999 | 5,547 ms |

Primary paired comparison, self-refine vs Council v3:

- both correct: 30
- self-refine only: 5
- Council v3 only: 14
- both wrong: 23
- Council v3 minus self-refine: +9 tasks / +12.5 percentage points
- exact two-sided McNemar p = 0.063568115234375

The predeclared claim status is **`directionally_supported`**. Council v3 exceeded self-refine by more than the predeclared five-percentage-point effect threshold and passed the safety rule, but the exact paired p-value did not clear the predeclared 0.05 threshold. Therefore this run does **not** support a preregistered claim of statistically strong superiority.

Secondary direct-vs-v3 paired comparison:

- direct only: 3
- Council v3 only: 13
- Council v3 minus direct: +10 tasks / +13.89 percentage points
- exact two-sided McNemar p = 0.021270751953125

## Gate safety

Council v3 internal Builder-to-final gate outcomes:

- replacements: 7
- useful replacements: 5
- harmful replacements: 1
- futile replacements: 1
- net gate value: +4
- preserved-correct outcomes: 39
- persistent failures: 27

This passes the frozen holdout safety rule: harmful replacements <= 1 and useful replacements > harmful replacements.

## Family-level official exact-schema accuracy

| Family | Direct | Self-refine | Council v3 |
|---|---:|---:|---:|
| constraint-arithmetic | 6/6 | 6/6 | 6/6 |
| constraint-selection | 0/6 | 2/6 | 0/6 |
| dependency-closure | 6/6 | 3/6 | 6/6 |
| dependency-schedule | 6/6 | 5/6 | 6/6 |
| filter-sort | 0/6 | 0/6 | 0/6 |
| instruction-precedence | 0/6 | 2/6 | 3/6 |
| inventory-reconciliation | 0/6 | 6/6 | 4/6 |
| ledger-recovery | 4/6 | 0/6 | 1/6 |
| multi-hop-path | 6/6 | 5/6 | 6/6 |
| ranking-tiebreak | 0/6 | 0/6 | 0/6 |
| state-supersession | 6/6 | 0/6 | 6/6 |
| version-resolution | 0/6 | 6/6 | 6/6 |

## Forensic output-contract audit

After the sealed run completed, a diagnostic audit found a format-contract confound concentrated in `constraint-selection`, `filter-sort`, and `ranking-tiebreak`.

Examples:

- Many correct selection/filter answers returned `{ "id": "...", "score": ... }` when the task demanded top-level key `selected`.
- The frozen canonicalizer supports some deterministic selection-shape repairs, but it does not convert a two-key `id` + `score` object into `selected` + `score`.
- Many ranking answers correctly put the expected winner first but returned the full ranking even though the scorer required `{ "selected": "..." }`.
- The holdout ranking wording (`Rank candidates lexicographically...`) was more likely to induce a full ranking than the development wording, despite the requested exact `selected` key.

These remain failures in the **official** preregistered score. They are not rescored or used to change the claim status.

For diagnosis only, if one applies a post-hoc semantic shape normalization limited to these three families — accepting `id` as the requested winner key and accepting the first element of a returned ranking as the selected winner — the counts become:

- Direct: 50/72 = 69.4%
- Self-refine: 49/72 = 68.1%
- Council v3: 61/72 = 84.7%
- paired self-refine-only: 4
- paired Council-v3-only: 16
- exact two-sided McNemar p ≈ 0.0118179

This semantic audit is **not confirmatory evidence** because it was defined after observing the holdout. It is recorded only to explain where exact-schema failures occurred and to guide a future development cycle.

## Interpretation and limitations

1. The frozen Council v3 architecture generalized directionally on untouched task instances and passed its safety criterion.
2. The preregistered primary superiority test narrowly missed the 0.05 significance threshold, so strong superiority is not claimed from URAI-HOLDOUT-v1.
3. The result is sensitive to output-contract adherence. A future benchmark version should predefine semantic-vs-schema endpoints and repair rules before any holdout is generated.
4. URAI-HOLDOUT-v1 contains 72 tasks. The canonical evaluation brief originally called for a larger 200-500 item untouched holdout. This run is therefore a bounded staged holdout, not the full-scale validation originally specified.
5. The 12 holdout families are the same conceptual families as development, with fresh instances, labels, values, and wording. This tests instance generalization within the benchmark domain, not broad out-of-distribution generalization.
6. Per the frozen protocol, no Council v3 tuning may use these holdout outcomes while retaining the name URAI-HOLDOUT-v1. Any future tuning requires a new development cycle and a new untouched holdout version.

## Final claim for v1

**Supported:** Council v3 showed a meaningful directional advantage over generic self-refinement on this sealed 72-item instance holdout while maintaining a positive safety gate (5 useful vs 1 harmful replacement).

**Not supported:** a preregistered statistically strong superiority claim at p <= 0.05 on URAI-HOLDOUT-v1.
