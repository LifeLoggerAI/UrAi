# Council v3 + safeguarded self-refinement — development pilot

Date: 2026-10-14
Owner: historical, isolated LifeLoggerAI/UrAi benchmark branch bench/spatial-memory-pilot-20261011.
This is NOT the Spatial release controller, an integrated UrAi Council feature, or production deployment.

## What changed
The existing, unchanged Council v3 (Archivist, Builder, independent critics and preservation gate) is the starting point. A new optional sixth-call variant independently checks the Council-selected output twice and accepts a refinement only through the existing high-confidence, typed, two-critic preservation gate. Neither refinement reviewer sees the other's output. Disagreement, low confidence, invalid output or unsupported defect types preserve the original Council answer; provider errors halt execution.

The old URAI-HOLDOUT-v2 240-task dataset and locked protocol remain RETIRED/UNMODIFIED. Its existing result was Direct 176/240 (73.33%), generic Self-Refinement 201/240 (83.75%), Council v3 192/240 (80.00%). Council did not show superiority to generic self-refinement. No fresh score is claimed here.

The six synthetic development examples in bench/pilot-20261011/suite.jsonl are reused (unchanged). Four methods now run against each example:
- direct
- self_refinement
- historical_council_v3
- historical_council_v3_plus_refinement

The fourth method adds two extra provider calls after the original four, so this comparison is explicitly NOT matched-compute. Accuracy, latency, token use and estimated cost must be compared together, with errors and any harmful refinement also disclosed. Six examples cannot establish statistical superiority, even if all six pass.

## Safe operation
Offline validation occurs automatically on branch changes to the isolated benchmark code, using Node 22 and zero credentials. Paid provider evaluation remains available only through manual workflow_dispatch on the exact isolated branch. It has a USD 0.30 local usage ceiling, fixed model gpt-4o-mini-2024-07-18, no retries, no alternate model, and fail-closed transport/billing conditions. A missing GitHub secret or unapproved execution stops before any call. No private family data is used.

Run locally without any provider:
node --check scripts/bench/v3/council-refinement.mjs
node --check scripts/bench/pilot-20261011-execution.mjs
node --test scripts/bench/v3/gate.test.mjs scripts/bench/v3/canonicalizer.test.mjs scripts/bench/v3/strict-contract.test.mjs scripts/bench/v3/council-refinement.test.mjs

The paid job is NOT activated by push or pull request. Starting it requires an explicit manual dispatch of the existing workflow from the isolated branch. If that workflow cannot be dispatched because GitHub requires a default-branch workflow registration, do not route through production or bypass controls; register an approved benchmark-only path first.

## Evidence needed for claims
Save exact commit SHA, pinned model response identity, task suite digest, unedited trial records, timestamps, all failures, method-level exact correctness, refinement helped/hurt/preserved counts, cost, p50/p95 latency, and attempts. A new never-before-seen holdout is required before a new confirmatory claim, and a separate authenticated adapter is required to evaluate the current Spatial Council and memory graph.
