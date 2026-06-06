# URAI Product Map

*Generated: 2024-05-23*
*Pass 0 - Repaired*

This document maps the required products and systems to the available code and documentation. Statuses have been corrected to `BLOCKED` where placeholder implementations were previously marked `PARTIAL`.

---

## URAI Organization Overview

*   **URAI Genesis:** Main consumer world.
*   **URAI Spatial:** AR / VR / XR world.
*   **URAI Studio:** Exports, artifacts, creator tools.
*   **URAI Passport:** Privacy, permissions, user-owned data controls.
*   **URAI Companion:** AI orb and Council.
*   **URAI Foundation:** Ethics, public accountability, accessibility, governance.
*   **URAI Labs:** Operating company, product development, launch, partnerships, support.
*   **URAI IP Holdings:** Brand, domains, trademarks, assets, licensing, repo ownership, generated media provenance.

---

## Product & System Status

| Product | Standalone Route | Integrated Module | Repo/Source Evidence | Launch Readiness | Known Blockers | Next Action | Passport Dependency | Data Dependency | Intelligence Dependency | Passive Data Dependency | Spatial/XR Dependency |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Genesis** | `/` | --- | `src/app` | **BLOCKED** | Core systems are stubs. | Implement core systems. | High | High | High | High | Low |
| **Passport** | `/passport` (unverified) | `UraiPassportProvider` | `src/providers/UraiPassportProvider.tsx` | **BLOCKED** | Provider is a stub. | Implement Passport. | **N/A** | High | Low | High | Low |
| **Companion** | `/companion` (unverified) | `UraiCompanionProvider` | `src/providers/UraiCompanionProvider.tsx` | **BLOCKED** | Provider is a stub. | Implement Companion. | High | High | High | High | Medium |
| **Council** | `/council` (unverified) | `UraiCouncilProvider` | `src/providers/UraiCouncilProvider.tsx` | **BLOCKED** | Provider is a stub. | Implement Council. | High | High | High | High | Low |
| **Life Map** | `/lifemap` (unverified) | `UraiLifeMapProvider` | `src/providers/UraiLifeMapProvider.tsx` | **BLOCKED** | Data generation is placeholder. | Implement data generation. | High | High | Medium | High | Low |
| **Ground** | `/ground` (unverified) | `UraiGroundProvider` | `src/providers/UraiGroundProvider.tsx` | **BLOCKED** | Data generation is placeholder. | Implement data generation. | High | High | Medium | High | Low |
| **Mirror** | `/mirror` (unverified) | `UraiMirrorProvider` | `src/providers/UraiMirrorProvider.tsx` | **BLOCKED** | Data generation is placeholder. | Implement data generation. | High | High | Medium | High | Low |
| **Shadow** | `/shadow` (unverified) | `UraiShadowProvider` | `src/providers/UraiShadowProvider.tsx` | **BLOCKED** | Data generation is placeholder. | Implement data generation. | High | High | High | High | Low |
| **Legacy** | `/legacy` (unverified) | `UraiLegacyProvider` | `src/providers/UraiLegacyProvider.tsx` | **BLOCKED** | Data generation is placeholder. | Implement data generation. | High | High | High | High | Low |
| **Studio** | `/studio` (unverified) | `UraiExportProvider` | `src/providers/UraiExportProvider.tsx` | **BLOCKED** | Export logic is placeholder; `urai-studio` repo missing. | Provide repo access. | High | High | Low | High | Low |
| **Spatial** | `/spatial` (unverified) | `urai-spatial` (repo) | Not in workspace. | **UNKNOWN** | Repo not accessible. | Provide repo access. | High | High | High | High | **N/A** |
| **Access** | `/access` (unverified) | --- | Not found. | **UNKNOWN** | --- | --- | Low | Low | Low | Low | Low |
| **Mobile** | --- | --- | Not in workspace. | **UNKNOWN** | Repo not accessible. | Provide repo access. | High | High | High | High | High |
| **Monetization**| `/pricing` (unverified) | --- | Not found. | **UNKNOWN** | --- | --- | Low | Low | Low | Low | Low |
| **Admin** | `/admin` (unverified) | `UraiFeatureFlagProvider`| `src/providers/UraiFeatureFlagProvider.tsx` | **BLOCKED** | In-memory only; `urai-admin` repo missing. | Provide repo access. | Low | Medium | Low | Low | Low |
| **Foundation** | `/foundation` (unverified) | --- | `urai-foundation` (repo) | **UNKNOWN** | Repo not accessible. | Provide repo access. | --- | --- | --- | --- | --- |
| **Labs** | `/labs` (unverified) | --- | `urai-labs-llc` (repo) | **UNKNOWN** | Repo not accessible. | Provide repo access. | --- | --- | --- | --- | --- |
| **IP Holdings**| `/ip` (unverified) | --- | URAI IP Holdings materials| **UNKNOWN** | Materials not accessible. | Provide access. | --- | --- | --- | --- | --- |
| **Passive Data**| --- | `UraiPassiveDataProvider`| `src/providers/UraiPassiveDataProvider.tsx` | **BLOCKED** | Data ingestion is placeholder. | Implement data ingestion. | High | **N/A** | High | **N/A** | Low |
| **Intelligence**| --- | --- | Not found. | **UNKNOWN** | No repo or source identified. | Define and locate source. | High | High | **N/A** | High | High |
| **Asset Factory**| --- | --- | `asset-factory` (repo) | **UNKNOWN** | Repo not accessible. | Provide repo access. | Medium | --- | Low | Low | Medium |
| **Content Contracts**| --- | --- | `urai-content` (repo) | **UNKNOWN** | Repo not accessible. | Provide repo access. | Medium | --- | Low | Low | Low |
| **Privacy** | `/privacy` (unverified)| Multiple providers | `urai-privacy` repo missing | **BLOCKED** | Canonical policy repo is unavailable. | Provide repo access. | High | High | High | High | High |
| **Jobs** | `/jobs` (unverified)| --- | `urai-jobs` (repo) | **UNKNOWN** | Repo not accessible. | Provide repo access. | Low | Medium | Medium | Low | Low |
| **Staging** | --- | --- | `urai-staging` (repo) | **UNKNOWN** | Repo not accessible. | Provide repo access. | --- | --- | --- | --- | --- |
| **Marketing** | `/` | --- | `urai-marketing` (repo)| **UNKNOWN** | Repo not accessible. | Provide repo access. | Low | Low | Low | Low | Low |
| **Investor/B2B**| `/investors` (unverified)| --- | `urai-investors`, `B2Bportal`| **UNKNOWN** | Repos not accessible. | Provide repo access. | Low | Low | Low | Low | Low |
