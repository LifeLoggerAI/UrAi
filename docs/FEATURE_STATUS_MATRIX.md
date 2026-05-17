# URAI Feature Status Matrix

This matrix prevents launch copy from overclaiming unverified systems.

| Feature | V1 status | Launch copy rule | Next action |
| --- | --- | --- | --- |
| Cinematic home scene | Implemented demo | May describe as demo experience | Keep smoke tested |
| Public constellation `/u/adamclamp` | Implemented demo | May describe as public demo | Keep smoke tested |
| Companion narrator | Deterministic/mock with safety shell | Do not describe as therapist, clinician, crisis service, diagnosis, or live autonomous AI | Expand tests before live model |
| Waitlist capture | Implemented server route; dry-run without Admin env | May describe as early-access signup | Verify staging Firestore write |
| Seeded demo memory blooms/timeline/forecast/reflection | Implemented demo data | Use demo/sample wording | Keep seed tests healthy |
| Firebase owner-gated private collections | Rules scaffolded | May describe as planned private architecture | Add emulator tests |
| Full passive audio capture | Not live | Do not claim live capture | Build only after consent gate |
| GPS/location intelligence | Not live | Do not claim live location tracking | Build only after consent gate |
| Device/activity signals | Not live | Do not claim live device sensing | Build only after consent gate |
| Relationship/social graph | Schema scaffold only | Do not claim live relationship intelligence | Add consent + enrichment pipeline |
| Cognitive mirror | Scaffold/future phase | Use future-roadmap language only | Define UI/API contract |
| AI therapist replay | Missing/future phase | Do not use therapy claims | Add safety and clinical-boundary design first |
| Data marketplace | Missing/future phase | Do not claim users can sell data yet | Requires consent, anonymization, audit logging |
| B2B/admin dashboards | Not part of V1 spine | Future-enterprise language only | Integrate separate repos later |
| Studio/export/media pipeline | Not part of V1 spine | Future phase only | Integrate asset-factory when ready |
| AR/VR/spatial | Not part of V1 spine | Future phase only | Integrate spatial repo later |

## Definitions

- **Implemented demo**: visible in V1 routes and safe to show publicly with demo wording.
- **Rules scaffolded**: Firestore contract exists, but user-facing feature may not be live.
- **Not live**: must not appear in public copy as an active feature.
- **Future phase**: backlog only until code, tests, consent, security, and deployment are verified.
