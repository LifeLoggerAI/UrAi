# URAI Standalone Products Map

This document maps the standalone product surfaces accessible via dedicated routes in the `UrAi` application.

*Last Updated: 2024-05-23*

---

| Product | Standalone Route | Status | Implementation | Notes |
|---|---|---|---|---|
| **URAI Genesis** | `/` | `live` | `src/app/page.tsx` | The main landing page and entry into the URAI world. |
| **Demo Mode** | `/demo` | `live` | `src/app/demo/page.tsx` | A public-facing demo of the URAI experience. |
| **User Profile** | `/u/[handle]` | `live` | `src/app/u/[handle]/page.tsx` | A user's public-facing profile (if they choose to have one). |
| **Passport** | `/passport` | `live` | `src/app/passport/page.tsx` | The user's central hub for privacy and data control. |
| **Life Map** | `/life-map` | `live` | `src/app/life-map/page.tsx` | The standalone view of the user's Life Map. |
| **Mirror** | `/mirror` | `live` | `src/app/mirror/page.tsx`| The standalone view of the user's cognitive mirror. |
| **Shadow** | `/shadow` | `internal` | `src/app/shadow/page.tsx`| A gated entry point to the Shadow self feature. |
| **Legacy** | `/legacy` | `internal` | `src/app/legacy/page.tsx`| A gated entry point to the user's Legacy archives. |
| **Studio** | `/studio` | `deferred` | `src/app/studio/page.tsx`| A placeholder for the future exports and creator tools. |
| **Spatial** | `/spatial` | `deferred` | `src/app/spatial/page.tsx`| The entry point for WebXR and spatial experiences. |
| **Accessibility**| `/access` | `deferred` | Not yet implemented | Planned route for accessibility features. |
| **Pricing** | `/pricing` | `deferred`| Not yet implemented | Planned route for monetization tiers. |
| **Support** | `/support` | `live` | `src/app/support/page.tsx`| The customer support and help center. |
| **Admin** | `/admin` | `internal` | `src/app/admin/page.tsx` | The administration dashboard for system management. |
| **Foundation** | `/foundation` | `deferred` | Not yet implemented | Planned route for URAI Foundation public-facing content. |
| **Labs** | `/labs` | `deferred` | Not yet implemented | Planned route for URAI Labs public-facing content. |
| **IP Holdings** | `/ip` | `deferred` | Not yet implemented | Planned route for IP Holdings public-facing content. |
