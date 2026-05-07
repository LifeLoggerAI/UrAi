# URAI Docs Index

This folder contains the working V1 launch, implementation, safety, and product documentation.

## Start here

| Doc | Purpose |
| --- | --- |
| `V1_PRODUCT_SPEC.md` | Defines the V1 demo spine, scope, success criteria, and definition of done |
| `IMPLEMENTATION_NEXT.md` | Tracks the immediate implementation priorities |
| `V1_DEPLOY_CHECKLIST.md` | Deployment readiness checklist |
| `V1_QA_CHECKLIST.md` | Manual QA checklist for launch-readiness |
| `V1_MANUAL_TESTS.md` | Browser and curl test recipes |
| `API_V1.md` | Companion and waitlist API docs |

## Data and Firebase

| Doc | Purpose |
| --- | --- |
| `FIRESTORE_V1_COLLECTIONS.md` | Canonical V1 Firestore collection contract |
| `LOCKFILE_REFRESH.md` | How to regenerate `package-lock.json` after dependency changes |

## Safety and trust

| Doc | Purpose |
| --- | --- |
| `PRIVACY_CONSENT_V1.md` | Privacy, consent, and data sensitivity model |
| `AI_SAFETY_V1.md` | Companion/reflection AI safety guidance |

## Demo and storytelling

| Doc | Purpose |
| --- | --- |
| `V1_DEMO_SCRIPT.md` | 30-second and 3-minute demo script |
| `URAI_MASTER_COMPLETION_PROMPT.md` | Full master prompt for expanding/finalizing the URAI system |

## Useful commands

```bash
npm run check:v1
npm run check:lockfile
npm run seed:demo
npm run seed:firestore
npm run waitlist:export
npm run test:unit
npm run preflight
```

## Current known requirement

After dependency changes, run:

```bash
npm install
```

Then commit the refreshed:

```txt
package-lock.json
```
