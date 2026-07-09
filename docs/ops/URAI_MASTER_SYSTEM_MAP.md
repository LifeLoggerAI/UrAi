# URAI Master System Map

Status: Source-of-truth draft  
Owner: URAI Labs  
Purpose: Map the URAI repository/domain ecosystem and prevent deployment confusion.

## Canonical Product Stack

User App -> Identity/Memory -> Jobs -> Asset Factory -> Content -> Storytime -> Spatial -> Admin/Privacy Receipts

## Repository Classification

| Repo | Classification | Purpose | Production Status |
|---|---|---|---|
| LifeLoggerAI/UrAi | Canonical V1 app | Public demo/product spine | Evidence-gated |
| LifeLoggerAI/urai-spatial | Canonical spatial runtime | Spatial memory world, Life Map, XR | Evidence-gated |
| LifeLoggerAI/asset-factory | Canonical asset generation service | Graphics, 3D, audio, bundles | Evidence-gated |
| LifeLoggerAI/urai-privacy | Canonical privacy/control plane | Consent, export, delete, audit | Blocking gate |
| LifeLoggerAI/urai-admin | Canonical admin control plane | Operator dashboard | Blocked |
| LifeLoggerAI/urai-jobs | Canonical async execution layer | Workers, queues, artifacts | Evidence-gated |
| LifeLoggerAI/urai-content | Canonical content/template layer | Schemas, content, templates | Source package |
| LifeLoggerAI/urai-storytime | Canonical narrative engine | Stories, sessions, life films | Blocked |
| LifeLoggerAI/urai-studio | Canonical studio layer | Creator/admin production | Evidence-gated |
| LifeLoggerAI/urai-analytics | Canonical analytics layer | Derived intelligence | Blocked |
| LifeLoggerAI/urai-communications | Canonical communications layer | Email/SMS/push | Blocked |
| LifeLoggerAI/urai-marketing | Marketing surface | Public marketing | Evidence-gated |
| LifeLoggerAI/urai-investors | Investor surface | Investor portal | Evidence-gated |
| LifeLoggerAI/urai-foundation | Foundation surface | Governance/standards | Supporting |
| LifeLoggerAI/urai-labs-llc | Company/legal layer | Corporate/legal/IP | Supporting |
| LifeLoggerAI/urai-staging | Staging | Integration proving ground | Staging only |
| LifeLoggerAI/UrAi-Dev | Sandbox | Development experiments | Never production |
| LifeLoggerAI/UrAiProd | Legacy archive | Migration/source archive | Never production |
| LifeLoggerAI/B2Bportal | B2B/future | Enterprise portal | Future/blocked |

## Immediate Active Local Repos Found in Cloud Shell

| Local Path | Remote | Current Branch |
|---|---|---|
| `~/asset-factory` | LifeLoggerAI/asset-factory | main |
| `~/urai-spatial` | LifeLoggerAI/urai-spatial | asset-safe-launch-pack |
| `~/urai-labs-llc` | LifeLoggerAI/urai-labs-llc | urai-flywheel |

