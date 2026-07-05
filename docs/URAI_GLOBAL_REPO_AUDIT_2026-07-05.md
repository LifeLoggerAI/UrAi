# URAI Global Repo Audit Snapshot — 2026-07-05

Auditor: ChatGPT URAI GLOBAL REPO AUDIT / DOCUMENTATION RECONCILIATION AGENT  
Primary source: connected GitHub installation plus current sandbox probe  
Scope: accessible URAI / LifeLoggerAI repositories surfaced by GitHub repository search and production-lock code search.

## Hard limitation

The current execution sandbox is not inside a git checkout. The requested first commands were run exactly and produced:

```bash
pwd
# /

git remote -v || true
# fatal: not a git repository (or any of the parent directories): .git

git branch --show-current || true
# fatal: not a git repository (or any of the parent directories): .git

git rev-parse HEAD || true
# fatal: not a git repository (or any of the parent directories): .git

git status --short || true
# fatal: not a git repository (or any of the parent directories): .git

ls
# bin boot caas_toolbox dev etc home initrd.img initrd.img.old lib lib64 media mnt openai opt proc root run sbin srv sys tmp usr var vmlinuz vmlinuz.old
```

Because there is no local checkout, this audit could not truthfully verify local dirty working trees, unpushed local changes, or run local install/lint/build/test commands across the repos. GitHub default-branch state, repository metadata, indexed files, committed launch-proof docs, package files, and documented evidence folders were used instead. Any local-only work in another ChatGPT terminal is outside this snapshot unless it has been pushed or committed into GitHub.

## Repositories found

At least 19 related repositories were found or cross-referenced:

| Repo | Role | Current classification | Evidence basis | Launch blocking? |
| --- | --- | --- | --- | --- |
| LifeLoggerAI/UrAi | Canonical public Genesis / main front door | YELLOW | package scripts and Genesis production-lock docs exist; live/source parity, deploy proof, rollback, monitoring, privacy gate still blocked | YES |
| LifeLoggerAI/urai-spatial | Spatial / AR / VR / XR runtime | YELLOW | source-of-truth lock identifies canonical runtime and CI gates; Tier 5 remains partial until checks/signoffs/deploy proof pass | YES for spatial/XR claims |
| LifeLoggerAI/urai-storytime | Story / timeline / narrative runtime | YELLOW | package has production-readiness scripts; docs record green PR CI but red live Firebase/hosting/auth/deployment gates | YES for storytime launch |
| LifeLoggerAI/asset-factory | Asset generation and rendering pipeline | YELLOW | workflow dispatch evidence cleared local verification but live secrets/smoke/DNS/authenticated proof remain blocked | YES for asset-generation launch |
| LifeLoggerAI/urai-admin | Admin/operator control plane | YELLOW | FINAL_LOCK says PARTIAL / BLOCKED FOR PRODUCTION with many missing command/deploy/DNS/owner proofs | YES for admin launch |
| LifeLoggerAI/urai-jobs | Background workers / async pipelines | YELLOW | source hardening and proof folder exist; CI, emulator, staging, worker artifact, retry/fail/cancel, monitoring/rollback proof required | YES for jobs launch |
| LifeLoggerAI/urai-analytics | Analytics / insight engine | YELLOW | Fly deploy and production-lock workflows exist; deployment-proof says not live-verified and missing URL/monitoring/smoke/artifacts | YES for analytics claims |
| LifeLoggerAI/urai-labs-llc | Labs/company infra and public operating layer | YELLOW | blocker file lists failing production verification, missing command logs, deploy/DNS/API/contact/legal proof | YES for Labs public launch |
| LifeLoggerAI/urai-staging | Staging / release-candidate environment | YELLOW | production-lock blockers file exists; should not be treated as public production | Indirect |
| LifeLoggerAI/UrAi-Dev | Staging/governance/dev support | SUPPORTING / STAGING | development/staging repo; not canonical public production source | NO, unless used as source of truth |
| LifeLoggerAI/UrAiProd | Legacy / production-support / non-canonical until proven otherwise | DEPRECATED/LEGACY CANDIDATE | prior repo map treats UrAi as canonical; this repo needs separate reconciliation before being used | NO, if clearly labeled legacy |
| LifeLoggerAI/urai-foundation | Foundation standards/docs/static site | SUPPORTING/NON-RUNTIME, YELLOW for live site | docs-first repo; audit says formation-era standards site, not legal nonprofit/charity/grant/donation/clinical outcome surface; DNS/routes/backend proof blocked | YES for foundation public/legal claims |
| LifeLoggerAI/urai-privacy | Privacy/consent/governance layer | SUPPORTING/NON-RUNTIME | production-lock scripts and package found; not deeply revalidated in this pass | Indirect, because privacy gate blocks public claims |
| LifeLoggerAI/urai-content | Content/publishing automation | SUPPORTING/NON-RUNTIME | production-lock folder and blockers/checklists found; not core runtime | NO for core runtime, YES for content launch claims |
| LifeLoggerAI/urai-marketing | Marketing site/content | SUPPORTING/NON-RUNTIME | repo found; not deeply revalidated | NO unless public marketing launch depends on it |
| LifeLoggerAI/urai-investors | Investor portal/data room landing | SUPPORTING/YELLOW | production status and release checklist docs found; needs proof before investor-grade claims | YES before investor review |
| LifeLoggerAI/urai-studio | Creator/admin studio | YELLOW | audit and Firebase doctor scripts found; not fully revalidated here | YES for studio claims |
| LifeLoggerAI/urai-communications | Call intelligence / communications engine | YELLOW | production-lock README found; not fully revalidated here | YES for comms product claims |
| LifeLoggerAI/B2Bportal | B2B portal / legacy candidate | DEPRECATED/LEGACY CANDIDATE | final-lock report found; earlier system context says real admin repo is urai-admin, not B2Bportal | NO if labeled legacy/non-canonical |

## Global counts

- Total repos found/cross-referenced: 19
- GREEN: 0 verified in this pass
- YELLOW: 10
- RED: 0 hard-red from this pass, but several are blocked from production
- SUPPORTING/NON-RUNTIME: 6
- DEPRECATED/LEGACY CANDIDATE: 3

This is not a failure. It means the ecosystem has substantial source-side production machinery, but the public claim should be "launch-candidate / source-proven / evidence-gated," not "fully production launched".

## Top launch blockers

1. No repo-wide current local clean-tree/build/test proof from this sandbox because there is no local checkout.
2. Canonical UrAi live/source parity unresolved; `/ground` and `/system` proof issues documented.
3. Canonical UrAi deploy SHA, deploy log, rollback proof, monitoring proof, and privacy gate proof missing.
4. Spatial Tier 5 remains partial until automated checks, preview deploy, visual review, and signoffs pass.
5. Storytime has no live Firebase/hosting/auth/provider/job evidence.
6. Asset Factory needs GitHub environment secrets fixed and live smoke targets healthy.
7. Admin is explicitly PARTIAL / BLOCKED FOR PRODUCTION pending command, deploy, DNS/SSL, owner seed, claims, monitoring, rollback, and owner approval proof.
8. Jobs needs CI, emulator lifecycle, staging worker artifact, retry/fail/cancel, monitoring/rollback, and production smoke evidence.
9. Analytics needs deployed URL, monitoring URL, authenticated ingest smoke, B2B aggregate smoke, runtime logs/artifacts, and rollback proof.
10. Foundation/Labs public surfaces need DNS/SSL/live-domain verification, safe legal/formation claims, route completion, and legal/owner approval.

## Top documentation contradictions

1. Some docs use production-lock language while their own evidence says blocked or partial.
2. Canonical UrAi docs say source exists for private memory/provider/XR/waitlist/system but also state those live proofs are missing.
3. Asset Factory evidence says local verification cleared, but live smoke/secrets still block production lock.
4. Admin docs list source hardening improvements but FINAL_LOCK explicitly says not production-ready.
5. Foundation docs describe a foundation standards project but explicitly warn not to claim nonprofit/charity/grant/donation/legal status.
6. Spatial docs call Tier 1-4 lock candidates but Tier 5 partial with pending checklist/signoffs.
7. Storytime docs record green PR CI while listing red live Firebase/hosting/auth/deployment gates.
8. Labs public infra has deployment/runbook docs but blockers show production verification failing or incomplete.
9. UrAiProd/B2Bportal appear historically important but should not be treated as canonical unless reconciled with current UrAi/urai-admin reality.
10. Many proof folders exist, but proof folder presence is not the same as final production proof.

## Highest-leverage fixes

1. Create one global `repo-index.json` or `docs/ECOSYSTEM_SOURCE_OF_TRUTH.md` that marks canonical, supporting, legacy, and deprecated repos.
2. For each runtime repo, add a single `PRODUCTION_STATUS.md` with the same schema: source status, CI status, deploy status, live smoke, rollback, monitoring, owner signoff.
3. Fix GitHub environment secrets for Asset Factory and rerun the four documented workflow phases.
4. Close UrAi live/source route parity and prove `/system` against deployed SHA.
5. Run fresh CI/local commands for UrAi, Spatial, Storytime, Admin, Jobs, Analytics, and Labs and attach artifacts.
6. Record deployed commit SHA and Firebase/Fly/Vercel/Hosting target for every live surface.
7. Add rollback proof per repo before marking production-ready.
8. Add monitoring/alert proof per live repo.
9. Update public copy to say "demo," "preview," "formation-era," or "source-proven" wherever runtime/live/legal/clinical claims are not proven.
10. Build a global release dashboard only after every repo emits a machine-readable status artifact.

## What is actually already done

- A multi-repo URAI ecosystem exists and is accessible under LifeLoggerAI.
- The canonical public app, spatial runtime, storytime runtime, asset factory, admin, jobs, analytics, labs, foundation, privacy, content, investors, staging, studio, communications, and marketing repos are present.
- Many repos have serious production-lock/check scripts, launch-proof folders, deployment/runbook docs, and evidence templates.
- UrAi has a large validation script surface for doctor, V1, Genesis, AR preview, Firestore contracts, public copy, production claims, typecheck, lint, tests, build, deployment evidence, and tier locks.
- Spatial has a documented canonical runtime path and explicit route set for Home, Ascent, Life Map, Focus, Replay, and Mirror.
- Asset Factory has workflow evidence showing local verification gates cleared and remaining blockers narrowed to live environment/secrets/smoke.
- Admin has documented safety hardening around confirmations, PII minimization, and copy truthfulness.
- Foundation has safety language limiting legal/nonprofit/clinical/grant/donation claims.

## What is not done yet

- No globally verified all-green production release exists in this pass.
- Live deploy proof, DNS/SSL, smoke tests, monitoring, rollback, owner approval, and deployed commit SHA evidence are missing or incomplete across multiple repos.
- Several docs still need reconciliation so public claims match actual proof.
- Local dirty-tree/unpushed work cannot be seen from GitHub and was not validated.

## Public claim guidance

Safe public claim now:

> URAI is a multi-repo, source-built launch-candidate ecosystem with a canonical public Genesis app, spatial/XR runtime work, narrative Storytime runtime, asset generation pipeline, admin/jobs/analytics infrastructure, and foundation/privacy/governance documentation. The system has substantial production-lock and evidence machinery, but final live production claims are gated on deploy, smoke, monitoring, rollback, DNS/SSL, secrets, and owner/legal/clinical review evidence.

Do not claim yet:

- Fully production launched across all repos.
- Clinical, therapeutic, diagnostic, crisis, deception-detection, medical-device, or trust-scoring outcomes.
- Formal nonprofit/charity/tax-exempt/grantmaking/donation status for the Foundation.
- Provider-backed AI companion, private-memory runtime, passive-sensing pipeline, XR headset production, autonomous jobs, analytics aggregation, or asset generation as fully live unless that repo has current deploy and smoke proof.

## Review readiness

- IP/funding/advisor review: READY for source architecture and roadmap review, NOT ready to claim fully deployed production without evidence addendum.
- Clinical/research review: READY for concept/governance/research-method discussion, NOT ready for clinical outcome claims.
- Public launch: NOT globally ready; public demo/preview surfaces may be claim-safe if copy remains evidence-bounded.
- Cleanup before important review: reconcile canonical repo map, remove/label legacy repos, add deployed SHA/live proof/rollback/monitoring, and update every "green" claim that is really yellow.

## Final verdict

URAI is genuinely substantial in scope and repo proof: this is not a toy single app. But the honest classification today is global YELLOW / evidence-gated launch candidate, with zero repos marked fully GREEN by this pass because live production proof is incomplete or not accessible from the current environment.
