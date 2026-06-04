# URAI Shared Foundation Map

This document maps the shared foundational components (React Context Providers) that provide cross-cutting services to the entire URAI application.

*Last Updated: 2024-05-23*

---

| Provider | Location | Purpose | Status |
|---|---|---|---|
| **UraiAuthProvider** | `src/providers/UraiAuthProvider.tsx` | Manages user authentication state and identity. | `live` |
| **UraiSoundProvider** | `src/providers/UraiSoundProvider.tsx` | Manages sound effects and voice lines. | `live` |
| **UraiFeatureFlagProvider** | `src/providers/UraiFeatureFlagProvider.tsx` | Manages feature flags and application configuration. | `live` |
| **UraiSettingsProvider** | `src/providers/UraiSettingsProvider.tsx` | Manages user-specific settings. | `live` |
| **UraiNotificationProvider** | `src/providers/UraiNotificationProvider.tsx` | Manages in-app and push notifications. | `live` |
| **UraiOnboardingProvider** | `src/providers/UraiOnboardingProvider.tsx` | Manages the user onboarding flow. | `live` |
| **UraiDemoProvider** | `src/providers/UraiDemoProvider.tsx` | Manages demo mode and sample data. | `live` |
| **UraiCloudSyncProvider** | `src/providers/UraiCloudSyncProvider.tsx` | Manages data synchronization with Firebase. | `live` |
| **UraiLifeMapProvider** | `src/providers/UraiLifeMapProvider.tsx` | Provides state and services for the Life Map. | `live` |
| **UraiGroundProvider** | `src/providers/UraiGroundProvider.tsx` | Provides state and services for the Grounding feature. | `live` |
| **UraiMirrorProvider** | `src/providers/UraiMirrorProvider.tsx` | Provides state and services for the Mirror feature. | `live` |
| **UraiShadowProvider** | `src/providers/UraiShadowProvider.tsx` | Provides state and services for the Shadow feature. | `live` |
| **UraiLegacyProvider** | `src/providers/UraiLegacyProvider.tsx` | Provides state and services for the Legacy feature. | `live` |
| **UraiExportProvider** | `src/providers/UraiExportProvider.tsx` | Manages data exports. | `live` |
| **UraiPassiveDataProvider** | `src/providers/UraiPassiveDataProvider.tsx` | Manages passive data ingestion. | `live` |
| **UraiRitualProvider** | `src/providers/UraiRitualProvider.tsx` | Manages rituals and scrolls. | `live` |
| **UraiVoiceProvider** | `src/providers/UraiVoiceProvider.tsx` | Manages voice input and output. | `live` |
