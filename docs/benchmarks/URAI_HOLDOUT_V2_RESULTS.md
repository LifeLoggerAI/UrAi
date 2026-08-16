# URAI-HOLDOUT-v2 Confirmatory Results

Date: 2026-08-16  
GitHub Actions run: `31958485157`  
Frozen workflow commit: `5f5b4fc7583c4c4067c8118053565f0d657b5f19`  
Evidence artifact: `urai-holdout-v2-one-shot-evidence` (`9267341252`)  
Artifact digest: `sha256:295a3139b91dbafeb5eb06e4e16af21dd4e3035fd29a8b919df7a95befc1e7fc`  
Sealed suite SHA-256: `68dbb46ea001d4c89bdf47fbf361728a561af0b969b1554148c298bb9bf153a3`

## Confirmatory verdict

**Predeclared claim status: NOT SUPPORTED.**

The run was valid: all 720 expected provider-task trials completed, with zero unrecoverable errors. The preregistered Council preservation safety rule passed, but Council v3 did not outperform generic self-refinement on the primary endpoint.

Primary semantic accuracy:

- `openai+direct-canon`: 176/240 = **73.33%**
- `openai+selfrefine-canon`: 201/240 = **83.75%**
- `openai+urai-v3`: 192/240 = **80.00%**

Primary paired comparison, self-refine vs Council v3:

- Both correct: 166
- Self-refine only: 35
- Council only: 26
- Both wrong: 13
- Council minus self-refine: **-9 tasks / -3.75 percentage points**
- Exact two-sided McNemar p: **0.30567741986311836**
- Hierarchical macro-family bootstrap 95% CI: **[-0.2416666667, 0.1208333333]**

The frozen strong-support rule required Council minus self-refine semantic accuracy >= 5 percentage points, McNemar p <= 0.05, and a hierarchical macro-family bootstrap lower bound > 0, with safety passing. Those criteria were not met. Because Council semantic accuracy was below self-refine, the preregistered result category is `not_supported`.

## Preservation safety

Council v3's preservation gate passed the frozen safety rule:

- Builder correct: 183/240 = **76.25%**
- Council final correct: 192/240 = **80.00%**
- Replacements: 32
- Useful replacements: 11
- Harmful replacements: 2
- Futile replacements: 19
- Net gate value: +9
- Harmful replacement rate conditional on a correct Builder: **2/183 = 1.09%**
- Frozen maximum: **2.5%**
- Preservation integrity failures: **0**

Thus the gate improved the Builder overall while satisfying the preregistered correct-Builder preservation constraint. This safety success does not establish superiority over self-refinement.

## Secondary direct comparison

Council v3 did outperform the direct canonicalized baseline:

- Direct: 176/240 = 73.33%
- Council v3: 192/240 = 80.00%
- Council minus direct: **+16 tasks / +6.67 percentage points**
- Exact two-sided McNemar p: **0.03648340000835981**

This was a preregistered secondary comparison and does not replace the primary self-refine comparison.

## Family-level primary results

| Family | Self-refine | Council v3 | Council delta |
|---|---:|---:|---:|
| constraint-arithmetic | 100% | 100% | 0 pp |
| constraint-selection | 80% | 65% | -15 pp |
| dependency-closure | 60% | 100% | +40 pp |
| dependency-schedule | 95% | 100% | +5 pp |
| filter-sort | 100% | 100% | 0 pp |
| instruction-precedence | 95% | 100% | +5 pp |
| inventory-reconciliation | 100% | 5% | -95 pp |
| ledger-recovery | 40% | 45% | +5 pp |
| multi-hop-path | 90% | 100% | +10 pp |
| ranking-tiebreak | 70% | 50% | -20 pp |
| state-supersession | 75% | 95% | +20 pp |
| version-resolution | 100% | 100% | 0 pp |

Council was better in 6 families, tied in 3, and worse in 3. The dominant negative family was inventory reconciliation, followed by ranking/tiebreak and constraint selection. These are descriptive confirmatory results only; URAI-HOLDOUT-v2 may not be used for post-hoc tuning and then rerun as a fresh confirmatory test.

## Strict whole-output secondary endpoint

- Direct canonicalized harness: 0/240 = 0.00%
- Self-refine canonicalized harness: 2/240 = 0.83%
- Council v3: 192/240 = 80.00%

This was preregistered as a secondary endpoint before final deterministic canonicalization. It is reported as observed and is not used to override the primary semantic conclusion.

## Compute

- Direct: 28,045 total tokens
- Self-refine: 398,325 total tokens
- Council v3: 358,266 total tokens

Council used fewer tokens than self-refinement in this run while scoring 3.75 percentage points lower on the primary semantic endpoint.

## Integrity statement

The frozen-tooling preflight passed before holdout generation. The 240-task suite was generated exactly once inside the one-shot workflow, after protocol lock verification. No score-improving rerun, architecture change, prompt change, canonicalizer change, scorer change, threshold change, generation change, or statistical-rule change was made after holdout exposure.

URAI-HOLDOUT-v2 is now exposed and retired as a fresh confirmatory holdout. Any subsequent architecture tuning must use development data and a newly generated untouched holdout version for future confirmatory claims.
