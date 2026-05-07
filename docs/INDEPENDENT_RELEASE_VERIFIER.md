# URAI Independent Release Verifier

This repo includes a strict release verifier that checks whether the URAI System-of-Systems convergence work is actually wired, documented, tested, and release-ready.

The verifier is intentionally skeptical. If a claim is missing, stubbed, untested, or only implied, it reports the release as blocked.

## Local usage

Static verification only:

```bash
npm run verify:release
```

Full verification, including configured npm commands:

```bash
npm run verify:release:full
```

The full mode executes the available release commands declared in `package.json`, including lint, typecheck, tests, E2E, rules tests, smoke tests, and build when those scripts exist.

## CI usage

The workflow lives at:

```text
.github/workflows/independent-release-verifier.yml
```

It runs on pull requests, pushes to `main`, pushes to `system-release-verifier`, and manual dispatch.

Manual dispatch includes a `run_commands` option:

- `false`: static verification only
- `true`: run the verifier plus package commands

## Output

The verifier writes:

```text
release-verification/INDEPENDENT_RELEASE_VERIFICATION.md
```

The report contains:

1. Verified pass items
2. Failed or unverified claims
3. Blockers to staging
4. Blockers to production
5. Security / privacy risks
6. Broken user journeys
7. Broken developer workflows
8. Exact patch list required
9. Exact commands to re-run
10. Final verdict

## Verdicts

The verifier returns exactly one of:

- `PRODUCTION READY`
- `STAGING READY ONLY`
- `NOT READY — BLOCKERS REMAIN`

Any failed required report, route, Firebase function, security rule, Firestore domain, feature flag, consent gate, seed path, E2E path, or developer workflow blocks production readiness.

## Required core journey

The release is not considered verified until this journey is backed by working code and E2E/smoke coverage:

```text
Landing → Demo/Auth → Home → Narrator Whisper → Life Map → Star Detail → Insight → Ritual → Forecast → Council → Story/Scroll → Export → Settings/Consent → Admin System Health
```

## Design intent

This verifier does not replace human QA. It creates a repeatable release gate so URAI cannot accidentally ship as a collection of disconnected prototypes.
