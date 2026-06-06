# URAI Evidence Gates

This document outlines the evidence required to mark a product, feature, or version as `complete`. Completion is based on evidence, not intent.

*Last Updated: 2024-05-23*

---

## Core Principle: Evidence, Not Optimism

No item can be marked `complete` without tangible evidence artifacts. If evidence is unavailable, the status must be `blocked` or `unknown`.

## Evidence Checklist

For any given work product, the following evidence must be collected and recorded in the `urai-evidence-ledger.md`.

| Evidence Type | Artifact | Required For |
|---|---|---|
| **Build Result** | Build logs, CI/CD reports | All software releases |
| **Test Result** | Test runner output, code coverage reports | All software releases |
| **Lint/Typecheck Result** | Linter and TypeScript compiler output | All software releases |
| **Visual QA Result** | Screenshots, screen recordings | All UI/UX changes |
| **UX Feel Result** | UX review notes, `FEELING_GATE.md` | All UI/UX changes |
| **Privacy Result**| `PRIVACY_AUDIT.md` report | All releases, especially those with data changes |
| **Passport Compliance**| `PASSPORT_AUDIT.md` report | All releases |
| **AR/VR/XR Result** | Device test logs, performance metrics | All Spatial releases |
| **Passive Data Result**| `PASSIVE_DATA_AUDIT.md` report | All changes to passive data ingestion |
| **Mobile/PWA Result** | Mobile device screenshots, Lighthouse reports | All UI/UX changes |
| **Deployment Result** | Deployment logs, smoke test results | All releases |
| **Known Blockers** | A list of issues preventing completion. | All releases |
| **Final Decision** | A `Launch`/`Hold`/`Defer` decision. | All releases |

## Special Evidence Gates

### URAI Feeling Gate

Before any user-facing feature is marked complete, it must pass the "Feeling Gate" questionnaire. This is a subjective but critical review to ensure the experience aligns with URAI's core values.

### URAI Privacy & Passport Gate

No feature that touches user data can be released without a thorough privacy and Passport compliance review. The default for all sensitive data must be `off`.

### URAI Spatial Gate

No Spatial feature can be released without on-device testing (Quest, visionOS, etc.) and a review of comfort, performance, and spatial privacy.
