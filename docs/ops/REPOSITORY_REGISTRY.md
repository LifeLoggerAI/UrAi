# URAI Repository Registry

Every URAI repository must have one role, one owner, one deployment status, and one receipt trail.

| Repo | Classification | Purpose | Status | Next Action |
|---|---|---|---|---|
| LifeLoggerAI/UrAi | Canonical V1 app | Main public demo/product spine | Evidence-gated | Verify deploy SHA, /system, smoke, rollback, monitoring |
| LifeLoggerAI/urai-spatial | Canonical spatial runtime | Spatial memory world, Life Map, XR | Evidence-gated | Verify staging/deploy/privacy/device proof |
| LifeLoggerAI/asset-factory | Canonical asset service | Graphics, 3D, audio, bundles | Evidence-gated | Fix www domain, provider proof, privacy proof |
| LifeLoggerAI/urai-privacy | Canonical privacy gate | Consent, export, delete, audit | Blocking gate | Prove workflows and legal/owner signoff |
| LifeLoggerAI/urai-admin | Canonical admin control plane | Operator dashboard | Blocked | Fix 503/custom domain/admin bootstrap |
| LifeLoggerAI/urai-jobs | Canonical async jobs | Workers, queues, artifacts | Evidence-gated | Add deploy, rollback, monitoring receipts |
| LifeLoggerAI/urai-content | Canonical content layer | Schemas/templates/content | Source package | Keep deploy blocked unless standalone proof exists |
| LifeLoggerAI/urai-storytime | Canonical narrative engine | Stories, sessions, life films | Blocked | Safety/privacy/provider proof |
| LifeLoggerAI/urai-studio | Canonical studio layer | Creator/admin production | Evidence-gated | Auth/privacy/deploy proof |
| LifeLoggerAI/urai-analytics | Canonical analytics | Derived intelligence | Blocked | Privacy/aggregation/monitoring proof |
| LifeLoggerAI/urai-communications | Canonical communications | Email/SMS/push | Blocked | Opt-in/legal/provider/privacy proof |
| LifeLoggerAI/urai-marketing | Marketing | Public marketing surface | Evidence-gated | Domain/deploy/rollback/monitoring proof |
| LifeLoggerAI/urai-investors | Investor portal | Investor surface | Evidence-gated | Access/security/domain proof |
| LifeLoggerAI/urai-foundation | Foundation | Governance/standards | Supporting | Legal claim/domain review |
| LifeLoggerAI/urai-labs-llc | Company/legal | Corporate/legal/IP | Supporting | Corporate/domain/IP mapping |
| LifeLoggerAI/urai-staging | Staging | Integration proving ground | Staging only | Fix health/system registry smoke |
| LifeLoggerAI/UrAi-Dev | Sandbox | Development experiments | Never production | Do not deploy production |
| LifeLoggerAI/UrAiProd | Legacy archive | Migration/source archive | Never production | Do not deploy production |
| LifeLoggerAI/B2Bportal | B2B/future | Enterprise portal | Future/blocked | Reconcile with B2B/admin plan |
