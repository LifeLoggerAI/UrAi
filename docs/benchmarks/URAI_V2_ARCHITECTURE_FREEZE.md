# URAI-HOLDOUT-v2 Architecture Freeze

Frozen before holdout generation on 2026-08-16.

## Decision

The confirmatory candidate is **openai+urai-v3 (full Council v3)**. The selective router is not part of the confirmatory architecture.

This freeze is based on fresh development-only GitHub Actions run **31952628038** at commit `3c51d2cba5e643c254f590b20ac0cc88b5e1e038`. The run completed successfully and produced artifact `urai-v2-final-dev-isolated-evidence`, artifact id `9265864405`, digest `sha256:169ff4ac3ea9aff7679395855156cad855fc92f990a79fcd71661722d059a467`.

Fresh development results on 60 tasks:

- direct + canonicalizer: 54/60 = 90.0%, 7,180 tokens
- self-refine + same canonicalizer: 49/60 = 81.7%, 98,599 tokens
- Builder + canonicalizer: 48/60 = 80.0%, 29,382 tokens
- Council v3: 52/60 = 86.7%, 88,124 tokens

Council v3 gate behavior:

- replacements: 8
- useful replacements: 6
- harmful replacements: 1
- futile replacements: 1
- net gate value: +5
- correct Builder trials: 48
- harmful replacement rate conditional on correct Builder: 1/48 = 2.0833%

The staged confirmatory safety rule caps harmful replacements conditional on a correct Builder at 2.5%, requires useful replacements to exceed harmful replacements, and requires zero unexplained correct-Builder-to-wrong-final preservation integrity failures.

The development suite remains development-only. These results are not a superiority claim.

## Frozen method and evaluation identities

The following runtime identities are frozen for URAI-HOLDOUT-v2 unless the holdout has not yet been generated and an explicit new development cycle supersedes this freeze.

- `scripts/bench/v3/canonicalizer.mjs`: `3b1ac1c3dbda2d067ee53b726ca0914870e59b82`
- `scripts/bench/v3/gate.mjs`: `05458d21d431b1cca410d4a0e90183e50910c52a`
- `scripts/bench/v3/harnesses.mjs`: `3d28bcecee969c83a8a2ca7aaaebb06e5bdcd352`
- `scripts/bench/deterministic-output.mjs`: `dcb658f078c0608036a7b9040833c19f498b4962`
- `scripts/bench/v3/paired-stats.mjs`: `5eb98c2dfe9632a58cce6de3512d1d685c8c6c61`
- `scripts/bench/v3/strict-contract.mjs`: `0ff140a3fdbaa6cbee4f78bab66d104b776ea237`
- `scripts/bench/providers.mjs`: `6d40b44770ab65b9df0b04f137266374c7e7158c`
- `scripts/bench/lib.mjs`: `8a74c312584a8eb5fc0380852043c4749715e020`
- `scripts/bench/run-holdout-v2.mjs`: `92df9077c95d2bd586dfcb32da022d7bb1d9dc51`
- `scripts/bench/verify-protocol-lock.mjs`: `edfa64a03b07f4a48d727cd1ea8914de5f76a56a`

## Confirmatory design frozen in principle

- Model: `gpt-4o-mini`
- Maximum output tokens: 1200
- Council gate minimum confidence: 0.95
- Holdout size: 240 tasks
- Families: 12
- Tasks per family: 20
- Primary comparison: self-refine + shared canonicalizer vs Council v3
- Primary endpoint: shared deterministic contract-normalized semantic task accuracy
- Secondary strict endpoint: whole-output JSON exact task accuracy before final deterministic canonicalization
- Exact two-sided McNemar paired task test
- Hierarchical paired family/task bootstrap: 50,000 replicates, seed 20260816, 95% interval
- Strong-support rule: valid run + safety pass + Council advantage at least 5 percentage points + McNemar p <= 0.05 + hierarchical macro-family lower 95% bound > 0
- Any unrecoverable trial error or incomplete pair invalidates the confirmatory run; exposed v2 holdout cannot be rerun as fresh evidence.

## Holdout boundary

At the time of this freeze record, **URAI-HOLDOUT-v2 has not been generated, inspected, scored, or model-run**.

The next permitted steps are:

1. Author the deterministic 240-task generator without executing it.
2. Lock the generator blob and all other runtime blobs into `bench/protocols/urai-holdout-v2-lock.json`.
3. Create the one-shot workflow with preflight lock verification and an assertion that the holdout file is absent before generation.
4. Only then generate the holdout and execute the frozen compared methods exactly once per task.

No result from URAI-HOLDOUT-v2 may be used to tune prompts, architecture, canonicalization, scoring, thresholds, statistical rules, or task generation for the same holdout version.
