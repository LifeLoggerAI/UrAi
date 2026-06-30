# Build And Test Logs

Generated: 2026-06-30T01:30:00-05:00
Repo: LifeLoggerAI/UrAi
Starting SHA: 409dda09c0381510ee95923a5851eade5e6733ea
Ending SHA: captured in final response

## Execution environment

This pass used the GitHub connector and web fetches. It did not provide a checked-out repo terminal with Node/npm/Firebase CLI. Therefore no command below is marked PASS unless previously evidenced elsewhere. No fake green status is claimed.

## Commands required

| Command | Result | Notes |
| --- | --- | --- |
| `npm ci` | BLOCKED | No terminal in connector-only pass. |
| `npm run check:v1` | BLOCKED | No terminal. |
| `npm run check:system-registry` | BLOCKED | No terminal. |
| `npm run check:production-lock` | BLOCKED | No terminal. |
| `npm run check:firestore-contract` | BLOCKED | No terminal. |
| `npm run check:public-copy` | BLOCKED | No terminal. |
| `npm run check:production-claims` | BLOCKED | No terminal. |
| `npm run validate:completion` | BLOCKED | No terminal. |
| `npm run typecheck` | BLOCKED | No terminal. |
| `npm run lint` | BLOCKED | No terminal. |
| `npm run test:unit` | BLOCKED | No terminal. |
| `npm run test:rules` | BLOCKED | No terminal. |
| `npm run build` | BLOCKED | No terminal. |
| `npm run test:smoke` | BLOCKED | No browser/test runtime. |
| `npm run smoke:linked-routes` | ADDED, NOT RUN | Source-side smoke script added in this pass. |
| `npm run smoke:linked-routes:live` | ADDED, NOT RUN | Must be run after deploy from Node 20 shell. |
| `npm run verify:release:full` | BLOCKED | Requires shell and live deploy evidence. |

## Current build/test verdict

BLOCKED: command proof is absent. READY cannot be claimed until raw logs pass.
