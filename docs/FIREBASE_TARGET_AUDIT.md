# URAI Firebase Target Audit

Generated: 2026-06-25

This audit records Firebase target safety for the Genesis spine. It does not deploy or change Firebase configuration.

## Genesis Spine Findings

| Repo | Firebase project evidence | Hosting target/site | Deploy command evidence | Rules present | Target safety |
| --- | --- | --- | --- | --- | --- |
| LifeLoggerAI/UrAi | Registry and public URL indicate `urai-4dc1d`; local checkout unsafe on Windows, so config was not trusted from disk | `urai.app`, `www.urai.app`, `urai-4dc1d.web.app` respond | `firebase deploy`, `ship:urai:*` scripts exist in `package.json`; production deploy requires launch checks | Needs clean checkout verification | Partial; must verify clean checkout and exact project target before launch |
| LifeLoggerAI/urai-staging | `.firebaserc` has `default: urai-staging`, `staging: urai-staging`, `production: urai-4dc1d` | `firebase.json` hosting site `urai-staging` | `npm run deploy:staging` delegates to staging lock scripts | Firestore and Storage rules present | Safe only if staging lock script keeps production override disabled |
| LifeLoggerAI/urai-privacy | No `.firebaserc` found in local checkout | Framework hosting config exists without explicit project alias | `npm run deploy` is plain `firebase deploy` | Firestore and Storage rules present | Unsafe for production until project alias/target is explicit |
| LifeLoggerAI/urai-admin | `.firebaserc` has `default: urai-4dc1d`, `admin: urai-4dc1d` | Framework hosting source `apps/urai-admin` | `pnpm deploy:production` / shell scripts exist | Firestore and Storage rules present | Blocked; live URL returns 503 and admin/DNS proof missing |
| LifeLoggerAI/urai-jobs | `.firebaserc` has `default: urai-jobs` | `firebase.json` hosting site `urai-jobs-563121397472` | `deploy:prod`, `deploy:firebase:prod`, worker deploy scripts exist | Firestore and Storage rules present | Partial; strict deploy/rollback/monitoring/privacy evidence missing |
| LifeLoggerAI/urai-content | No `.firebaserc` found in local checkout | `firebase.json` has hosting but no explicit site | `npm run deploy` intentionally exits with blocker message | Firestore and Storage rules present | Safe as package; standalone deployment blocked |

## Hard Rules

- `LifeLoggerAI/UrAi-Dev` must never be a production Firebase target.
- `LifeLoggerAI/UrAiProd` must never be a production Firebase target unless explicitly re-integrated into `LifeLoggerAI/UrAi`, and even then the canonical repo must own the release.
- Any deploy command that can hit the wrong project must be wrapped by a project/target check before production use.
- Any repo that stores user data must have Firestore/Storage rules verified before launch.

## Target Blockers

- `urai-privacy` needs explicit Firebase project alias and target-locked deploy docs before release-gate production claims.
- `urai-admin` needs live route recovery, custom domain target correction, admin bootstrap proof, and monitoring evidence.
- `urai-staging` must keep production alias from being selected accidentally.
- `urai-content` must choose a standalone host/project/site before any standalone launch.
- `UrAi` needs clean checkout validation because the local Windows checkout is unsafe due invalid tracked paths in the repo.
