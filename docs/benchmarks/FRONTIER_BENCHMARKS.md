# URAI frontier benchmark harness

This directory documents the reproducible model-vs-harness benchmark runner under `scripts/bench/`.

## What it tests

The runner supports direct base-model calls and the same base model wrapped in an experimental URAI Council orchestration pass:

1. Archivist extracts authoritative state and superseding updates.
2. Builder solves from that state.
3. Mirror audits concrete errors and missed constraints.
4. Guardian + Guide synthesizes the final answer.

The wrapper uses the same underlying provider and splits one configured aggregate output-token budget across those stages. It records aggregate input/output token usage so any quality lift can be weighed against added context/cost.

This benchmark wrapper is an evaluation harness inspired by URAI Council concepts. It is not a claim that the production companion runtime already executes these four stages.

## Provider targets

- Gemini defaults to `gemini-3.6-flash` and requires `GEMINI_API_KEY`.
- Fable defaults to `claude-fable-5` and requires `ANTHROPIC_API_KEY`.
- Mythos requires both `ANTHROPIC_API_KEY` and an explicitly authorized `ANTHROPIC_MYTHOS_MODEL`. The harness does not invent a public Mythos model ID because access is restricted.
- OpenAI is included to compare the model family already used by the current URAI AI integration. It uses `OPENAI_BENCH_MODEL`, then `OPENAI_MODEL`, then `gpt-4o-mini`.

Optional model overrides:

```bash
export GEMINI_BENCH_MODEL=gemini-3.6-flash
export ANTHROPIC_FABLE_MODEL=claude-fable-5
export ANTHROPIC_MYTHOS_MODEL='<authorized-model-id>'
export OPENAI_BENCH_MODEL='<model-id>'
```

## Commands

Check provider readiness without revealing secrets:

```bash
node scripts/bench/doctor.mjs
```

Run the deterministic local self-check:

```bash
node scripts/bench/run-frontier-bench.mjs --suite bench/suites/smoke.jsonl --providers mock,mock+urai --max-output-tokens 512
```

Run the included synthetic long-horizon suite against the public providers for which credentials are configured:

```bash
node scripts/bench/run-frontier-bench.mjs --providers=gemini,gemini+urai,fable,fable+urai,mythos,mythos+urai --repeats=3
```

Run a private/frozen suite:

```bash
node scripts/bench/run-frontier-bench.mjs --suite=/secure/path/blind-suite.jsonl --providers=gemini,gemini+urai,fable,fable+urai --repeats=5 --max-output-tokens=1200
```

Every run writes:

- `manifest.json`: suite SHA-256, provider/model IDs, budget, repeat count, runtime metadata.
- `trials.jsonl`: raw output, score, latency, attempts, token usage, and stage traces for wrapped providers.
- `summary.json`: aggregate pass rate, mean score, token totals, and direct-vs-URAI lift.

`bench/results/` should remain uncommitted when it contains private benchmark data or raw model outputs.

## Scoring and fairness

The included suite uses deterministic scorers (`json_equals`, `contains_all`, or regex). That avoids a hidden LLM judge favoring one provider. For serious claims:

- freeze the task set before running models;
- keep blind tasks outside the public repository until the run is complete;
- run multiple repeats;
- pin exact model IDs rather than `latest` aliases;
- report token usage, latency, failures, and unavailable providers alongside score;
- preserve the suite hash and raw trial logs;
- do not present this synthetic suite as Terminal-Bench, OSWorld, AutomationBench, or any other external benchmark.

External benchmark suites should be executed with their official harnesses and result schemas. This runner is the controlled A/B layer for testing whether URAI orchestration improves a fixed base model.
