# Hard Council development pilot (October 14, 2026)

Execution file: `scripts/bench/hard/run-hard-development-v1.mjs`. Synthetic life histories only. Exactly 16 cases, 2 from each of 8 families, and five arms/80 trials. A separate 240-case generator exists at `scripts/bench/hard/hard-case-generator.mjs`; do NOT run the entire 240 as an exposed holdout before preregistration and sealed fresh seed.

Methods: direct, four-pass self-refine, historical Council v3, historical Council v3 plus safeguarded refinement, six-call self-refinement. All use pinned gpt-4o-mini-2024-07-18 in this development workflow. The sixth-call hybrid and six-call self-refinement use matching completion caps but NOT guaranteed matched total context tokens or cost. Report full measured costs/latencies. This is **not** the production spatial Council or long-lived memory graph. Each case supplies its fictional evidence as text; no memory service ingestion or real user data is tested.

The previous worker arithmetic issue should not be mistaken for an architecture result; all methods failed on a simple short prompt in the preceding six-case pilot. The new suite directly probes missing facts, provenance, temporal supersession, multigenerational relationships, privacy revocation, ledger arithmetic, graph updates and critical path calculations.

Development pilot only: it is exposed after execution; do not use it as a confirmatory holdout. The historical URAI-HOLDOUT-v2 protocol and scores remain frozen. After development analysis, freeze architecture and a separate virgin seed for a one-shot blind 240-case comparison. Never claim competitive superiority based on the 16 development cases.

The job is a single explicit founder-authorized manual workflow with a one-time trigger also permitted for the exact commit message `bench: founder-authorized hard development pilot 2026-10-14`; no scheduled runs or paid retry. Model expenditure capped by script at US$0.30 (local estimate); transport uncertainty fails closed. Captures raw trials and a deterministic summary as an artifact. If the provider key is unavailable the job fails before any paid calls.

One-time five-arm hard development run authorized by founder, 2026-10-14; GitHub Actions exact-message guard, no repeat paid runs on push.
