# URAI Canonical Authority Map

This document defines the canonical authority for key URAI systems and data.

| System / Data | Canonical Authority | Supporting | Deprecated | Notes |
| --- | --- | --- | --- | --- |
| Consumer Runtime | **UrAi Repo** | - | - | The main web application. |
| Spatial Runtime | **UrAi Repo** | - | - | WebXR implementation within the main app. |
| Quest/OpenXR Runtime | UNKNOWN | - | - | Likely a separate Unity/OpenXR repo. |
| visionOS Runtime | UNKNOWN | - | - | Likely a separate visionOS repo. |
| Handheld AR Runtime | UNKNOWN | - | - | Potentially within a future native mobile app. |
| Content Contracts | **UrAi Repo** | - | - | `src/lib/urai-canon/` and related files. |
| Asset Registry | UNKNOWN | - | - | May be in `asset-factory` or an external CMS. |
| Privacy/Consent Policy | **UrAi Repo** | `docs/privacy/` | - | `src/lib/privacy/` and `src/components/passport/`. |
| Identity/Auth | **Firebase** | `UrAi Repo` | - | Firebase Auth is the identity provider. |
| Admin/Ops | **UrAi Repo** | `urai-admin` (UNKNOWN) | - | The `/admin` routes in the main app. |
| Jobs/Workers | UNKNOWN | - | - | Asynchronous jobs may be in a separate repo. |
| Staging/Release | **UrAi Repo** | `urai-staging` (UNKNOWN) | - | Deployment scripts are in the main repo. |
| Mobile/PWA | **UrAi Repo** | - | - | The main app is a PWA. |
| Monetization | **UrAi Repo** | - | - | Internal monetization logic in the main app. |
| Foundation Governance | **UrAi Repo** | `urai-foundation` (UNKNOWN) | - | `/foundation` route and `docs/foundation/`. |
| Labs Operations | **UrAi Repo** | `urai-labs-llc` (UNKNOWN) | - | `/labs` route and `docs/labs/`. |
| IP Holdings | **UrAi Repo** | `URAI IP Holdings` (UNKNOWN) | - | `/ip` route and `docs/ip/`. |
