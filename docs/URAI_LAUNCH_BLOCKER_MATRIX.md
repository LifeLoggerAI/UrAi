# URAI Launch Blocker Matrix

Date: 2026-06-08
Owner: Adam Clamp
Scope: Cross-repo launch control for the URAI V1 / Genesis-adjacent repo lattice.

This matrix distinguishes code readiness from production evidence. Do not mark a repo launched because code exists; launch means the release SHA, deploy target, live smoke, artifacts, rollback path, domain, and owner approval are recorded.

## Status key

- GREEN: verified live or no launch-blocking dependency for core UrAi V1.
- YELLOW: repo-side implementation is mostly ready, but evidence, domain, or final deploy proof is missing.
- RED: production lock is explicitly blocked or required gates are incomplete.
- DEFER: not required for core UrAi V1 launch.

## Core launch sequence

1. Lock exact release SHA for `LifeLoggerAI/UrAi`.
2. Run Production Evidence workflow on `main`.
3. Attach run URL and `production-evidence-results` artifact to issue #300.
4. Verify Firebase Hosting URL: `https://urai-4dc1d.web.app`.
5. Verify custom domain: `https://www.urai.app`.
6. Verify `/`, `/home`, `/ochat`, `/u/adamclamp`, `/api/status`, `/api/waitlist`, and `/api/companion`.
7. Record Firestore rules/index deploy evidence.
8. Record rollback SHA and owner approval.
9. Only then close #300 / #323 as completed.

## Matrix

| Repo | Launch role | Current status | Main blocker | Evidence / issue |
| --- | --- | --- | --- | --- |
| `LifeLoggerAI/UrAi` | Core public V1 app | YELLOW | Production Evidence workflow result, artifact review, Firebase/custom-domain proof, waitlist/companion proof | #300, #323, `docs/URAI_POST_MERGE_DEPLOYMENT_EVIDENCE.md` |
| `LifeLoggerAI/urai-jobs` | Internal runtime queue/workers | YELLOW/GREEN | Canonical Firebase production is verified, but `uraijobs.com` and `www.uraijobs.com` DNS/custom domain remain open | #50, #53, #55 |
| `LifeLoggerAI/urai-spatial` | Spatial/home-world layer | YELLOW | Live deploy evidence, locked SHA, live smoke, evidence ledger update | #250, #254, #255-#260, #268 |
| `LifeLoggerAI/asset-factory` | Asset generation / Studio backend pipeline | YELLOW | Staging + production live evidence, authenticated smoke, JWT/API-key/tenant proof, provider/DNS/secrets artifacts | #63, #111 |
| `LifeLoggerAI/urai-studio` | Studio / creator-admin surface | YELLOW | Production readiness evidence, waitlist/contact persistence, fail-closed diagnostics, live smoke | #41, #43 |
| `LifeLoggerAI/urai-admin` | Internal ops/admin console | RED for public admin launch; DEFER for core UrAi V1 | `FINAL_LOCK.md` is BLOCKED; needs latest-main deploy/verify/smoke, DNS/SSL, monitoring, rollback, owner approval | #4, #10, `FINAL_LOCK.md` |
| `LifeLoggerAI/urai-marketing` | Marketing site | DEFER unless launch copy points traffic there | Not audited in this pass | TBD |
| `LifeLoggerAI/urai-privacy` | Privacy/compliance surface | DEFER unless public V1 links depend on it | Not audited in this pass | TBD |
| `LifeLoggerAI/urai-analytics` | Analytics surface | DEFER for V1 public launch | Not required for core V1 unless instrumentation is claimed live | TBD |
| `LifeLoggerAI/urai-communications` | Communications/SMS/email layer | DEFER for V1 public launch | Not required unless launch notifications are promised | TBD |

## Core UrAi V1 blockers

These are the only blockers that should prevent a controlled V1 launch of `urai.app`:

- Production Evidence workflow must complete successfully or failures must be triaged and fixed.
- `production-evidence-results` artifact must be reviewed or attached.
- Firebase Hosting URL must serve the expected app.
- `www.urai.app` must be verified or explicitly deferred in favor of Firebase Hosting URL.
- Waitlist must either persist successfully or clearly report documented dry-run mode.
- Companion endpoint must return safety-bounded fallback behavior.
- Firestore rules/index deployment evidence must be recorded.
- Rollback target and command must be recorded.
- Owner approval must be recorded against the final SHA.

## Non-blockers for core V1

These should not delay controlled V1 if public copy does not claim them as live:

- Full passive sensing
- AI therapist / diagnosis
- Marketplace / user data selling
- Full AR/VR/XR
- Enterprise admin console
- Studio/export/media pipeline
- Provider-backed asset generation
- Jobs marketplace / candidate-employer product

## Next command checklist

Run or trigger these from the correct environments with secrets configured:

### UrAi core

```bash
npm run verify:release:full
npm run deploy:evidence
npm run test:smoke:production
```

Manual GitHub Actions path:

```text
Actions -> Production Evidence -> Run workflow -> main
```

### Asset Factory

```text
Actions -> Deploy Asset Factory
- staging, deploy=true, smoke_mode=both
- production, deploy=false, smoke_mode=readonly
- production, deploy=true, smoke_mode=both
```

### Spatial

```bash
corepack pnpm live:check
corepack pnpm live:deploy
HOST=<live-url> corepack pnpm smoke
```

### Jobs

```bash
pnpm domains:verify -- https://uraijobs.com https://www.uraijobs.com
```

### Admin

```bash
pnpm release:lock
pnpm run deploy:production
pnpm verify:production
pnpm test:smoke
```

## Decision

The shortest honest launch path is: launch the core `LifeLoggerAI/UrAi` V1 demo after #300/#323 evidence is attached. Treat Spatial, Studio, Asset Factory, Admin, Jobs custom domains, and wider Genesis features as follow-on locks unless public launch copy depends on them.
