# URAI Spatial Readiness Matrix

| Capability | V1 status | Required gate before live | Launch decision |
|---|---|---|---|
| Magical home shell | Required for public demo | Build, smoke test, mobile and reduced-motion pass | V1 scope |
| Ground layer | Required for public demo | Accessible fallback and mobile layout | V1 scope |
| Orb | Required for public demo | Local/demo mode and safe copy | V1 scope |
| Companion/chat | Staged local/demo surface | Verified auth and memory grounding before production personalization | V1 fallback only |
| Sky / Life Map preview | Required for public demo | Synthetic/demo or owner-scoped data only | V1 scope |
| Memory/spatial layers | Preview only | Owner-scoped persistence and rules tests | Gated |
| XR / WebXR / AR / VR | Not live in V1 | Runtime support, explicit consent, device QA, feature flag, smoke tests | Private beta only |
| Passive sensing | Not live in V1 | Explicit consent, provider checks, owner-scoped persistence, deletion/export | Disabled/gated |
| Audio/location/device signals | Not live in V1 | Explicit consent, privacy review, platform permission flows | Disabled/gated |
| Biometric/wearable data | Not live in V1 | Provider contract, consent, non-diagnostic copy, rules tests | Disabled/gated |
| Asset Factory / exports | Not live in V1 | Server auth, base URL, worker pipeline, queue tests, storage rules | Private beta only |
| Data marketplace | Not live in V1 | Legal/privacy/product review and explicit consent model | Blocked from V1 |
| Enterprise/admin | Not live in V1 | Server-side authorization and separate admin release gate | Blocked from V1 public copy |
| Clinical/therapy claims | Not live in V1 | Do not launch as medical/clinical product | Blocked |
| Firestore persistence | Conditional | Rules/index coverage and emulator tests | Required for live user data |
| Consent persistence | Conditional | Verified auth, owner-scoped rules, revoke path | Required before sensitive features |
| `/api/spatial/health` | Required | Must report blockers truthfully | Required |
| Public-copy checker | Required | Readable patterns, Spatial route scan, aria/metadata scan | Launch blocker until fixed |
