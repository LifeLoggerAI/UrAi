# URAI Integration Map

This document outlines how the various URAI product systems are integrated within the `UrAi` monorepo.

*Last Updated: 2024-05-23*

---

## Core Integration Pattern: React Context Providers

The primary mechanism for integration is a tree of React Context Providers, configured in `src/app/providers.tsx`. This allows any component in the application to access shared services and state, such as authentication, sound, and feature flags.

## Key Integrations

| Product/System | Integrated With | How | Purpose |
|---|---|---|---|
| **URAI Passport** | All Products | `UraiAuthProvider`, `UraiOnboardingProvider` | Enforces authentication and onboarding before accessing any product. Governs privacy settings application-wide. |
| **URAI Companion** | URAI Genesis | `CompanionShell.tsx` is rendered in `Genesis.tsx` | The Companion is available as a core interaction model within the main Genesis experience. |
| **URAI Life Map** | URAI Genesis | Link in main navigation, accessible from the home scene. | Users can navigate from the abstract Genesis experience to the detailed Life Map visualization. |
| **Firebase** | All Products | Via `firebaseClient.ts` and various providers. | Provides the backend-as-a-service for the entire ecosystem. |
| **URAI Sound** | URAI Genesis | `useUraiSound` hook used in `Genesis.tsx` | Provides an integrated sound experience for core interactions. |
| **URAI Admin** | All Products | Via the `/admin` route and associated API endpoints. | Allows for the administration and configuration of all other product systems. |

## Missing Integrations & Unknowns

*   **Standalone vs. Integrated Products:** The distinction between a standalone product and an integrated feature is not always clear. Most products are tightly coupled within the Genesis application.
*   **External Repos:** There is no integration with the unverified external repos (e.g., `urai-spatial`, `asset-factory`).
*   **Monetization:** There is no integration with a payment or entitlement system yet.
