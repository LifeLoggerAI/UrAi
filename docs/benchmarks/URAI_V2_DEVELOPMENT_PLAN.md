# URAI Benchmark v2 Development Plan

Status: development-only. No v2 holdout has been generated or inspected.

## Why a v2 cycle exists

URAI-HOLDOUT-v1 is retired confirmatory evidence. Its official exact-schema endpoint produced a meaningful directional advantage for Council v3 over generic self-refinement, but a post-run audit showed that output-contract shape errors materially affected all methods. The v1 result remains unchanged and must not be rescored as confirmatory evidence.

This v2 cycle uses v1 only as development evidence, under the v1 post-holdout rule requiring a new architecture/evaluation cycle and a new untouched holdout version.

## Frozen architectural direction under development

Unless fresh development evidence contradicts it, the candidate architecture remains:

- base model: `gpt-4o-mini`
- Council: Archivist -> Builder -> Critic A + Critic B -> safe typed preservation gate
- minimum critic confidence: 0.95
- replacement allowed only for the safe typed defect classes already implemented by the v3 gate
- no selective router in the confirmatory path; prior leave-one-family-out router validation was unstable
- generic four-pass self-refinement remains the primary baseline
- direct inference remains a secondary baseline

## Contract-aware canonicalizer v2

Version: `prompt-contract-canonicalizer-v2`.

The canonicalizer is shared by all compared methods and may only transform values already present in the model output according to the prompt's explicit output contract. It may not inspect the scorer answer or compute a new candidate.

Predeclared deterministic repairs:

1. If the prompt requests exactly `selected` + `score`, an output containing scalar `id` + `score` may be projected to `{selected: id, score}`. Extra candidate metadata may be dropped because it was not requested.
2. If the prompt requests exactly one `selected` winner and explicitly contains winner/ranking intent, a returned ranked array may be projected to its first already-ranked scalar ID or first object's scalar `id`.
3. If a returned object has `selected` containing a ranked array under the same winner contract, the first already-ranked scalar ID/object ID may be projected to scalar `selected`.
4. Existing deterministic nested-selection repairs remain allowed.
5. No arithmetic, constraint checking, reranking, substitution, or answer-key-dependent repair is allowed.

Regression tests include deliberately wrong first-ranked winners to ensure normalization preserves wrong decisions as wrong.

## Retired-v1 replay sanity check

Applying only the v2 deterministic contract policy to the already-completed v1 outputs produces the same diagnostic counts previously recorded in the v1 report:

- Direct: 34/72 -> 50/72
- Generic self-refine: 35/72 -> 49/72
- Council v3: 44/72 -> 61/72
- Previously correct answers harmed by the policy: 0 for all three methods

These replay numbers are development evidence only and do not alter URAI-HOLDOUT-v1.

## Development validation gate

Before any new holdout is generated:

1. Run the current 60-task development suite with the shared v2 canonicalizer.
2. Confirm the canonicalizer tests and safe gate tests pass.
3. Inspect family-level failures and gate regressions.
4. If the architecture is changed, rerun development validation and repeat this gate.
5. Freeze architecture, prompts, model, token budget, canonicalizer, scorer semantics, and statistical protocol.
6. Record exact Git blob identities in the v2 protocol lock.

## Planned full confirmatory holdout

Target: **240 untouched tasks**, 12 benchmark families x 20 fresh instances per family. This satisfies the original 200-500 item evaluation requirement while keeping family balance exact.

The 240-task suite must not be generated until the v2 protocol and implementation are frozen.

### Planned endpoints

Primary endpoint: contract-normalized semantic task accuracy using the frozen shared deterministic canonicalizer.

Secondary endpoints:

- strict raw output-contract accuracy before deterministic canonicalization
- overall exact paired accuracy
- per-family accuracy
- Council Builder-to-final preservation safety
- model calls, total tokens, and latency

### Planned primary comparison

Generic four-pass self-refinement vs URAI Council v3, paired on identical holdout tasks.

### Planned statistics

Pre-register before holdout generation:

- overall paired accuracy difference
- macro-average family accuracy difference
- exact two-sided McNemar test as a paired task-level test
- hierarchical paired bootstrap confidence interval that resamples benchmark families and then paired tasks within family
- family-level result table and dispersion

The bootstrap seed, number of replicates, effect threshold, safety threshold, and claim rule must be locked in the v2 protocol before generation.

## Evidence boundary

No result from URAI-HOLDOUT-v1 may be presented as v2 confirmatory evidence. No v2 holdout task, answer, failure, or score may be used to tune Council, the canonicalizer, prompts, gate thresholds, scorer, or statistical rule. Any tuning after the v2 holdout is opened requires a v3 evaluation cycle with another untouched holdout.
