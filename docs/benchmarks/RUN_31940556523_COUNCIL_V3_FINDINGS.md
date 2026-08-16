# GitHub Actions run 31940556523 — Council v3 development selection findings

Status: **development evidence only — v3 clears the frozen development rule after correcting a selector bookkeeping bug**

This record preserves the result from GitHub Actions run `31940556523` on the existing 60-task development suite. It is not untouched validation and must not be presented as a holdout superiority claim.

## Reproducibility anchor

- Repository: `LifeLoggerAI/UrAi`
- Branch: `agent/frontier-benchmark-harness`
- Run commit: `6085982a856d63b57e28ee6aebf2f0eb2c405711`
- GitHub Actions run: `31940556523`
- Job: `95148970637`
- Suite SHA-256: `9166d8ad126315653a2e177f7d23d90acd77713a58da4bd5fabb2cfc4acf8e5c`
- Tasks: 60 across 12 families
- Evidence artifact: `frontier-benchmark-evidence-council-v3-dev-selection`
- Artifact id: `9262086002`
- Artifact SHA-256: `c421d90684f46118b2e27abeaa195a9e52ac60523663b7e4f048f8da83a61cdd`
- Existing GitHub Actions `OPENAI_API_KEY` secret used; secret value remained masked.

## Development results

| Method | Correct | Accuracy | Total tokens | Mean latency |
| --- | ---: | ---: | ---: | ---: |
| Direct + shared canonicalizer | 49/60 | 81.7% | 6,991 | 1,110 ms |
| Generic self-refinement + shared canonicalizer | 46/60 | 76.7% | 97,610 | 7,424 ms |
| Archivist -> Builder + shared canonicalizer | 50/60 | 83.3% | 29,126 | 2,124 ms |
| Council v3 independent Builder-preservation gate | 54/60 | **90.0%** | 87,766 | 6,010 ms |

Paired task outcomes:

- Direct canonicalized vs Council v3: 46 both pass, 3 direct-only, 8 v3-only, 3 both fail; v3 net +5 tasks; exact two-sided McNemar `p = 0.2266`.
- Self-refinement canonicalized vs Council v3: 41 both pass, 5 self-refine-only, 13 v3-only, 1 both fail; v3 net +8 tasks; exact two-sided McNemar `p = 0.0963`.
- Builder canonicalized vs Council v3: 48 both pass, 2 Builder-only, 6 v3-only, 4 both fail; v3 net +4 tasks; exact two-sided McNemar `p = 0.2891`.

These p-values are descriptive development statistics, not confirmatory holdout tests.

## Gate safety result

Council v3 was evaluated against its own canonicalized Builder stage, which is the correct do-no-harm reference for the gate.

- Builder-stage correct -> final correct: 46
- Builder-stage correct -> final wrong: 1
- Builder-stage wrong -> final correct: 8
- Builder-stage wrong -> final wrong: 5
- Explicit replacements: 9
- Net gate value: `8 - 1 = +7` tasks

The nine replacements were:

- Useful: `ledger-1`, `ledger-2`, `ledger-4`, `ledger-5`, `inventory-1`, `inventory-3`, `inventory-4`, `ranking-4`
- Harmful: `filter-5`

This is a major reversal from Council v2, whose gate had net internal value `-7` on the prior development run.

## Family-level signal

Council v3 scored:

- 5/5 on constraint arithmetic, dependency closure, dependency schedule, instruction precedence, multi-hop path, ranking/tiebreak, state supersession, and version resolution;
- 4/5 on ledger recovery and filter/sort;
- 3/5 on constraint selection and inventory reconciliation.

The remaining errors are therefore concentrated rather than uniform, with constraint selection and inventory reconciliation the clearest residual development clusters.

## Selector bookkeeping defect in the run

The model results and gate statistics are valid, but the run's final printed selection was wrong because `run-development-selection.mjs` attempted to read a nonexistent `passed` field from `summarizeTrials()` output:

```js
const builderPasses = Number(byProvider[builder.id]?.passed ?? 0);
const v3Passes = Number(byProvider[v3.id]?.passed ?? 0);
```

`summarizeTrials()` returns `completed` and `pass_rate`, not `passed`. Both counts therefore became zero, causing the script to print:

`SELECTED=openai+builder-canon reason=builder_preferred_under_frozen_complexity_rule`

That printed selection conflicts with the frozen rule and the recorded results.

The selector has been fixed on the branch to compute pass counts from `completed * pass_rate`. No model rerun is required to interpret run `31940556523` because the frozen rule can be applied directly to the immutable evidence:

- safety veto: **not triggered** because net gate value is +7;
- complexity rule: **cleared** because v3 scored 54/60 versus Builder 50/60, a +4-task margin, exceeding the required +2 tasks.

Therefore the corrected frozen-rule result is:

> **Development selection: Council v3 independent Builder-preservation gate.**

## What this does and does not mean

This run is strong development evidence that the v3 gate fixed the central v2 failure mode. It is not enough to declare Council superior in general because:

1. the 60 tasks are a tuning/development set;
2. there is only one stochastic repetition;
3. the remaining errors are clustered by family;
4. the selective router has not yet been cross-validated and frozen;
5. untouched holdout inference has not begun.

The next valid step is to finish development-only reduced/router comparison, select and freeze routing with leave-one-family-out diagnostics, then lock the architecture and protocol before constructing or running the untouched holdout.
