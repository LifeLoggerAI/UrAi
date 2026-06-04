# URAI Provider Deep Dive

This document provides a detailed analysis of each of the shared React Context providers in the URAI application.

*Last Updated: 2024-05-23*

---

## 1. UraiAudioProvider

*   **Location:** `src/providers/UraiAudioProvider.tsx`
*   **Purpose:** Manages all audio state and playback within the application, including sound effects, ambient loops, and voice lines.
*   **Underlying Engine:** It is a wrapper around the `uraiAudioEngine`, located in `@/lib/audio/uraiAudioEngine`.

### State Management

*   **Settings:** The provider manages a `UraiAudioSettings` object, which includes:
    *   `enabled`: A master toggle for all audio.
    *   `masterVolume`, `ambientVolume`, `effectsVolume`, `voiceVolume`: Individual volume controls for different audio categories.
    *   `hapticsEnabled`: A toggle for haptic feedback.
    *   `reducedSensoryMode`: A toggle for a lower-intensity audio experience.
*   **Persistence:** All settings are persisted to `localStorage`, allowing user preferences to be saved between sessions.
*   **Initialization:** On mount, it reads the settings from `localStorage` and initializes the `uraiAudioEngine`.

### Key Functions & Hooks

*   **`useUraiAudio()`:** The primary hook for components to access the audio system.
*   **`unlockAudio()`:** An important function that must be called after a user interaction to enable audio playback in the browser. It also plays a wake sound effect (`orb-wake`).
*   **Playback Controls:** Provides functions for playing one-shot sounds (`playOneShot`), looping sounds (`playLoop`, `stopLoop`), and crossfading between moods (`crossfadeMood`).
*   **Settings Setters:** Provides functions to update each of the audio settings individually (e.g., `setMasterVolume`, `setAudioEnabled`).

### Architecture Notes

*   **Client-Side Only:** This provider is explicitly marked with `"use client"` and checks for `typeof window`, indicating it is designed to run only in the browser.
*   **Direct Engine Access:** The provider's functions are thin wrappers around the `uraiAudioEngine`, which contains the core audio playback logic.
*   **Error Handling:** Throws an error if `useUraiAudio` is used outside of the provider, a standard React context pattern.

### Unknowns

*   The full capabilities of the `uraiAudioEngine` are not visible from this file alone. A deeper dive into `@/lib/audio/uraiAudioEngine` would be required to understand the full implementation.
*   The specific audio assets (`UraiAudioKey`) are not defined here.

## 2. UraiAuthProvider

*   **Location:** `src/providers/UraiAuthProvider.tsx`
*   **Purpose:** Manages user authentication and profiles, supporting a local-first approach that can be progressively enhanced to full cloud authentication.

### State Management

*   **`user`:** The raw Firebase `User` object, which is `null` if the user is not signed into a cloud account.
*   **`profile`:** A custom `UraiUserProfile` object that holds app-specific data like `displayName`, `onboardingCompleted`, etc. This profile exists for both local and cloud users.
*   **`authMode`:** The current authentication level: `"local"`, `"anonymous"` (cloud-synced but no permanent account), or `"authenticated"` (full account).
*   **`authLoading` & `authError`:** Standard state for handling loading and error states during authentication operations.

### Key Functions & Hooks

*   **`useUraiAuth()`:** The hook to access the authentication context.
*   **`continueLocalOnly()`:** A function to explicitly keep the user in local-only mode.
*   **Sign-in Methods:** `signInAnonymouslyIfNeeded`, `signInWithGoogle`, `signInWithEmail`, `createAccountWithEmail`.
*   **Profile Management:** `updateProfile` (saves to `localStorage` or Firestore) and `refreshProfile`.
*   **Account Lifecycle:** `signOut` and `deleteAccount`.

### Architecture Notes

*   **Local-First Design:** The provider is architected around a "local-first" principle. It uses helper functions in `src/lib/auth/localIdentity.ts` to manage a user profile in `localStorage` from the very beginning. This allows the app to function without requiring an immediate sign-up.
*   **Progressive Enhancement:** The user can start locally, then upgrade to an anonymous cloud account (for sync) and finally to a fully authenticated account (Google or email).
*   **Service Separation:** It effectively separates concerns:
    *   **Firebase Client:** `getUraiFirebaseClient()`
    *   **Local Storage:** `localIdentity.ts` handles all interactions with `localStorage`.
    *   **Firestore Service:** `userProfileService.ts` manages reading and writing user profiles to the database.
*   **Graceful Fallbacks:** `try...catch` blocks are used extensively to handle Firebase errors, often falling back to the local-only mode and setting a user-friendly error message. This makes the app more resilient.


## 3. UraiCloudSyncProvider

*   **Location:** `src/providers/UraiCloudSyncProvider.tsx`
*   **Purpose:** Manages the synchronization of application state between the local device and the user's cloud (Firestore) account. It is an opt-in system that depends on the user's authentication status.

### State Management

*   **`syncRequested`:** A boolean indicating if the user has opted into cloud sync. This setting is persisted in user-scoped local storage.
*   **`syncStatus`:** Represents the current state of the sync process (`idle`, `saving`, `loading`, `synced`, `error`, `offline`).
*   **`lastSyncedAt`:** A timestamp of the last successful synchronization, also persisted locally.
*   **`needsAccountForSync`:** A derived boolean that becomes true if sync is requested but the user is not authenticated, signaling that a sign-in is required to proceed.

### Key Functions & Hooks

*   **`useUraiCloudSync()`:** The hook for components to interact with the sync system.
*   **`enableCloudSync()`:** The primary function for users to opt-in. It sets the `syncRequested` flag and initiates the first sync.
*   **`disableCloudSync()`:** Allows the user to opt-out of cloud sync.
*   **`pushToCloud()` & `pullFromCloud()`:** The core I/O functions that handle the actual data transfer to and from Firestore. These are heavily guarded by checks on authentication and sync status.
*   **`syncNow()`:** A function to manually trigger a sync.
*   **`resolveConflict()`:** A placeholder for future conflict resolution logic. Currently, it defaults to preferring the local data.

### Architecture Notes

*   **Auth-Dependent:** This provider is tightly coupled to the `UraiAuthProvider`. It constantly checks `auth.isAuthenticated` and `auth.isLocalOnly` to determine if it can perform sync operations.
*   **Opt-In:** The system is designed to be explicitly enabled by the user via `enableCloudSync()`.
*   **Privacy-Aware:** When pushing data to the cloud, the provider includes a `privacyReminder` field, indicating a design that considers data privacy. The initial sync also includes a detailed message about what data remains unsynced by default.
*   **Scoped Storage:** Uses `userScopedStorage` to keep sync settings separate for different users on the same device.

## 4. UraiDemoProvider

*   **Location:** `src/providers/UraiDemoProvider.tsx`
*   **Purpose:** Manages the application's demo mode, allowing it to be populated with pre-defined data for demonstration purposes.

### State Management

*   **`demoMode`:** A string that can be `"off"`, `"public_demo"`, or `"founder_demo"`. This determines which demo mode is active.
*   **`activeProfileId`:** A string that identifies the demo profile to be used (e.g., `"public"`).
*   **`demoProfile`:** The currently active demo profile object, loaded from the `demoDataRegistry`.
*   **`demoPassportProfile`:** A statically generated demo passport profile.

### Key Functions & Hooks

*   **`useUraiDemo()`:** The hook for components to access the demo context.
*   **`enableDemoMode()`:** A function to enable a specific demo mode and profile.
*   **`disableDemoMode()`:** A function to turn off demo mode.
*   **Data Accessors:** Provides a set of functions (`getDemoLifeMapData`, `getDemoGroundData`, etc.) to retrieve specific slices of the master `URAI_DEMO_DATA` object.

### Architecture Notes

*   **Static Data Source:** All demo data is imported from a static object (`URAI_DEMO_DATA`) in `@/lib/demo/demoDataRegistry.ts`. This makes the demo content predictable and easy to manage.
*   **Profile-Based:** The demo mode is profile-based, allowing for different tailored demo experiences (e.g., a public demo vs. a more feature-rich founder demo).
*   **Graceful Degredation:** The `useUraiDemo` hook provides a safe, default "off" state if it's used outside of the provider. This prevents errors and allows components to be used in both demo and non-demo contexts without conditional logic.

## 5. UraiExportProvider

*   **Location:** `src/providers/UraiExportProvider.tsx`
*   **Purpose:** Manages a privacy-focused workflow for exporting application data. It allows data to be proposed, reviewed against a set of permissions, and then approved for export and optional cloud syncing.

### State Management

*   **`isExportOpen`:** A boolean to toggle the visibility of the export UI.
*   **`currentReview`:** An `ExportReviewResult` object that holds the outcome of a candidate review, including the potential `ExportArtifact` and a `canExport` flag.
*   **`exportedArtifacts`:** A list of approved `ExportArtifact` objects, acting as the user's export history.

### Key Functions & Hooks

*   **`useUraiExport()`:** The hook to access the export context.
*   **`openExport()`:** Opens the export UI and initiates a review of a data "candidate" for export.
*   **`reviewCandidate()`:** The core function that checks if a candidate can be exported by calling `reviewExportCandidate` with a permissions profile.
*   **`approveCurrentExport()`:** Takes the artifact from a successful review, adds it to the `exportedArtifacts` list, and persists it.
*   **`closeExport()` & `clearCurrentReview()`:** UI and state management helpers.

### Architecture Notes

*   **Privacy-First Workflow:** The entire process is built around a candidate -> review -> approval flow, ensuring that no data is exported without passing a permission check.
*   **Hybrid Persistence:** Manages a merged list of export artifacts from two sources:
    *   **Local Storage:** Provides a quick, offline-first cache of the 20 most recent artifacts.
    *   **Cloud Sync:** If enabled via `UraiCloudSyncProvider`, it syncs approved artifacts to Firestore, providing a backup and multi-device access.
*   **Delegated Logic:** The complex task of reviewing permissions is handled by `reviewExportCandidate` from `@/lib/exports/buildPermissionedExport`, separating the UI/state logic from the business rules.
*   **Dependencies:** Tightly integrated with `UraiAuthProvider` (to get the `userId`) and `UraiCloudSyncProvider` (to handle the cloud persistence layer).

## 6. UraiFeatureFlagProvider

*   **Location:** `src/providers/UraiFeatureFlagProvider.tsx`
*   **Purpose:** Provides a client-side mechanism for managing feature flags and the application's overall launch status. Primarily intended for developers or admins.

### State Management

*   **`flags`:** An in-memory object mapping feature flag IDs (`UraiFeatureFlagId`) to their corresponding `UraiFeatureFlag` object (which includes an `enabled` boolean).
*   **`launchStatus`:** The overall status of the application (e.g., `"live"`, `"maintenance"`).
*   **`launchMessage`:** A public message associated with the current launch status.

### Key Functions & Hooks

*   **`useUraiFeatureFlags()`:** The hook to access the feature flag context.
*   **`isEnabled()`:** A utility function to quickly check if a given feature flag is enabled.
*   **`setFlagEnabled()`:** Updates the state of a specific flag.
*   **`setLaunchStatus()` & `setLaunchMessage()`:** Update the application's launch status and message.

### Architecture Notes

*   **In-Memory State:** This provider manages its state entirely within React's local state (`useState`). It does **not** persist to `localStorage` or any backend. This means flag configurations are reset on every page refresh.
*   **Audit Trail:** While the state itself isn't persisted, every state-changing function (`setFlagEnabled`, `setLaunchStatus`, `setLaunchMessage`) calls `recordAdminAction`. This indicates that all administrative changes are logged to a remote backend for auditing purposes, even if the state itself is ephemeral.
*   **Developer-Focused:** The functionality and the audit trail strongly imply this is a tool for developers or administrators to control the application's behavior in real-time during a session, rather than for persistent, user-facing configuration.
*   **Graceful Degredation:** The `useUraiFeatureFlags` hook returns a safe, default, read-only state if used outside the provider, allowing components to be written without breaking in different environments.

## 7. UraiGroundProvider

*   **Location:** `src/providers/UraiGroundProvider.tsx`
*   **Purpose:** Manages the state and user interactions for the "Ground Garden," a data visualization feature.

### State Management

*   **`groundData`:** The core `GroundGardenData` object, which contains all the elements for the visualization. This data is generated in memory.
*   **`selectedElement`:** The `GroundElement` currently selected by the user.
*   **`isGroundOpen`:** A boolean to toggle the main UI for the feature.
*   **`zoomLevel` & `filterByType`:** User preferences for the visualization. These are persisted to `localStorage` to maintain the user's view state between sessions.

### Key Functions & Hooks

*   **`useUraiGround()`:** The hook to access the Ground context.
*   **`openGround()` & `closeGround()`:** Functions to control the visibility of the ground UI.
*   **`selectElement()` & `clearSelectedElement()`:** Functions to manage element selection.
*   **`regenerateGround()`:** Re-creates the garden data. It can optionally take a `moodState`, suggesting the garden's appearance can be influenced by other parts of the application.
*   **`setZoomLevel()` & `setFilterByType()`:** Update user preferences and persist them to `localStorage`.

### Architecture Notes

*   **Ephemeral Data, Persistent Preferences:** The core `groundData` is generated on-the-fly and held in React state, while user-specific view preferences (zoom, filter) are persisted to `localStorage`.
*   **Delegated Generation Logic:** The provider is not responsible for *how* the garden is built. It delegates this complex task to `buildPermissionedGroundGarden`, keeping the provider focused on UI state management.
*   **Standard UI State Control:** Implements common patterns for managing UI visibility (`isGroundOpen`), selection (`selectedElement`), and user settings.

## 8. UraiLegacyProvider

*   **Location:** `src/providers/UraiLegacyProvider.tsx`
*   **Purpose:** Manages the "Legacy Archive," a curated collection of significant user data, potentially sensitive, which is protected by an explicit user confirmation gate.

### State Management

*   **`legacyArchive`:** The main `LegacyArchive` object, containing the items and chapters for display. This data is generated in memory.
*   **`isLegacyOpen`:** A boolean to toggle the visibility of the Legacy UI.
*   **`hasConfirmedGate`:** A critical boolean flag, persisted to `localStorage`, that tracks if the user has consented to view the Legacy content.
*   **`userApprovedItems`:** An in-memory list of `LegacyCandidateSource` items that the user has added during the current session. This list is ephemeral and resets on page refresh.

### Key Functions & Hooks

*   **`useUraiLegacy()`:** The hook to access the context.
*   **`confirmLegacyAccess()`:** The function the user must call to unlock the feature. It sets `hasConfirmedGate` to `true` and persists this choice.
*   **`disableLegacy()`:** Resets the feature to its locked state.
*   **`addItemToLegacy()` / `removeItemFromLegacy()`:** These manage the in-memory list of user-approved items and trigger a rebuild of the `legacyArchive`.
*   **`sealLegacyItem()` / `unsealLegacyItem()`:** Functions to change an item's visibility within the generated archive, allowing users to hide or reveal specific pieces of their legacy.

### Architecture Notes

*   **Gated Access Model:** The provider's primary architectural feature is the `hasConfirmedGate` flag. The core data generation function, `buildPermissionedLegacy`, receives a profile that is toggled by this flag, effectively hiding or showing the data based on user consent.
*   **Ephemeral Curation:** The list of items a user adds to their legacy (`userApprovedItems`) is stored in React state and is not persisted. The `legacyArchive` is rebuilt from this list on-the-fly. This makes the curation a session-only activity.
*   **Delegated Generation:** The provider delegates the complex logic of assembling the `LegacyArchive` from different data sources and user approvals to the `buildPermissionedLegacy` function, keeping the provider's code focused on state management and user interactions.
*   **Mixed Persistence Strategy:** It persists the user's *consent* to access the feature but does not persist the *content* they curate within a session. This is a deliberate design choice emphasizing the transient, in-the-moment nature of the feature.

## 9. UraiLifeMapProvider

*   **Location:** `src/providers/UraiLifeMapProvider.tsx`
*   **Purpose:** Manages the state and user interactions for the "Life Map," a visualization of user data as a galaxy of stars and chapters.

### State Management

*   **`lifeMapData`:** The core `LifeMapData` object, containing all the stars and chapters for the visualization. This data is generated in memory.
*   **`selectedStar` & `selectedChapter`:** The currently selected `LifeMapStar` or `LifeMapChapter`.
*   **`isLifeMapOpen`:** A boolean to toggle the visibility of the main Life Map UI.
*   **`zoomLevel` & `filterByType`:** User preferences for the visualization, persisted to `localStorage`.
*   **`showPrivateStars`:** A **non-persisted**, in-memory boolean to toggle the visibility of stars marked as private.

### Key Functions & Hooks

*   **`useUraiLifeMap()`:** The hook to access the Life Map context.
*   **`openLifeMap()` & `closeLifeMap()`:** Functions to control the visibility of the UI.
*   **`selectStar()`:** Manages the selection of a star and its corresponding chapter.
*   **`regenerateLifeMap()`:** Re-creates the Life Map data, optionally influenced by a `moodState`.
*   **`setZoomLevel()` & `setFilterByType()`:** Update user preferences and persist them to `localStorage`.
*   **`setShowPrivateStars()`:** Toggles the visibility of private stars for the current session only.

### Architecture Notes

*   **Parallel to GroundProvider:** The architecture is very similar to `UraiGroundProvider`, managing ephemeral, procedurally generated data (`lifeMapData`) while persisting view-specific user preferences (`zoomLevel`, `filterByType`).
*   **Delegated Data Generation:** It relies on the external `buildPermissionedLifeMap` function to handle the complex logic of creating the Life Map from various data sources.
*   **Privacy-Conscious Defaults:** The `showPrivateStars` flag is a session-only toggle. This is a good privacy feature, as it defaults to hiding potentially sensitive information on each new visit, requiring the user to opt-in to see it.
*   **Standard UI State Management:** It follows the established pattern of the other UI-centric providers for managing visibility, selection, and user settings.

## 10. UraiMirrorProvider

*   **Location:** `src/providers/UraiMirrorProvider.tsx`
*   **Purpose:** Manages the state and interactions for the "Mirror," a feature that visualizes user data as a series of "reflections" and "patterns."

### State Management

*   **`mirrorSession`:** The core `MirrorSession` object containing the visualization's data, generated in-memory.
*   **`selectedReflection`:** The currently selected `MirrorReflection` object.
*   **`isMirrorOpen`:** A boolean to control the UI's visibility.
*   **`filterByPatternType`:** A user preference for filtering the visualization, which is persisted to `localStorage`.

### Key Functions & Hooks

*   **`useUraiMirror()`:** The hook to access the context.
*   **`openMirror()` & `closeMirror()`:** Functions to toggle the UI's visibility.
*   **`selectReflection()`:** Manages the selection of a specific reflection.
*   **`regenerateMirror()`:** Re-creates the mirror data, which can be influenced by a `moodState`.
*   **`setFilterByPatternType()`:** Updates the filter preference and persists it to `localStorage`.

### Architecture Notes

*   **Established Pattern:** This provider follows the exact same architectural pattern as `UraiGroundProvider` and `UraiLifeMapProvider`. This indicates a clear, reusable design for UI-centric, data-visualization features in the application.
*   **Separation of Concerns:** It manages UI state (visibility, selection, filtering) while delegating the complex data construction logic to an external function (`buildPermissionedMirror`).
*   **Hybrid State:** It combines ephemeral, in-memory React state for the core data (`mirrorSession`) with `localStorage` persistence for user-specific view settings (`filterByPatternType`), optimizing for both performance and user experience.

## 11. UraiNotificationProvider

*   **Location:** `src/providers/UraiNotificationProvider.tsx`
*   **Purpose:** Manages a sophisticated, permission-based, and timing-aware notification system, including in-app "whispers."

### State Management

*   **`notificationsEnabled`:** A master switch for all notifications.
*   **`activeWhisper`:** The currently displayed in-app notification.
*   **`notifications`:** A list of recent notifications, cached in `localStorage`.
*   **`timingProfile`:** A configuration object that controls *when* notifications can be shown (e.g., quiet hours, last shown time). Persisted to `localStorage` and synced to the cloud.
*   **`notificationPermissions`:** A detailed configuration object that controls *if* specific types of notifications are allowed. Persisted to `localStorage` and synced to the cloud.

### Key Functions & Hooks

*   **`useUraiNotifications()`:** The primary hook to access the notification system.
*   **`showInAppNotification()`:** The core function of the provider. It does not just show a notification; it runs the candidate notification through a decision engine (`shouldSurfaceNotification`) which checks against timing profiles, user permissions, and recent history before allowing the notification to be displayed.
*   **`scheduleNotification()`:** Allows a notification to be queued for future delivery.
*   **Configuration Functions:** Provides functions to `updateTimingProfile`, `updateNotificationPermission`, and `setNotificationsEnabled`. These allow users to fine-tune their notification preferences, which are then synced to the cloud.

### Architecture Notes

*   **Sophisticated Decision Engine:** This provider is more than a state manager; it's an orchestration layer for a complex notification decision engine. It uses `shouldSurfaceNotification` to ensure notifications are respectful of user settings and context, preventing notification fatigue.
*   **Robust Hybrid Persistence:** It employs a smart persistence strategy. User *preferences* (timing, permissions, enabled status) are synced to the cloud, ensuring a consistent experience across devices. The actual notification *history* is a local cache, which is appropriate for its transient nature.
*   **Delegation of Logic:** The provider delegates specialized tasks to external pure functions, promoting separation of concerns. `buildNotificationCopy` handles content, `rankNotifications` handles display order, and `shouldSurfaceNotification` contains the core filtering logic.
*   **Full Lifecycle Management:** It manages the entire lifecycle of a notification, from `draft` to `scheduled`, `shown` (or `blocked`), and finally `dismissed` or `snoozed`.

## 12. UraiOnboardingProvider

*   **Location:** `src/providers/UraiOnboardingProvider.tsx`
*   **Purpose:** Manages the user's onboarding experience, tracking their progress through a series of defined steps.

### State Management

*   **`preferences`:** The core `OnboardingPreferences` object, which holds the entire state of the user's onboarding journey (e.g., `status`, `currentStepId`, `completedStepIds`).
*   **`isFirstRun`:** A derived boolean that is `true` if the user has not yet completed or skipped onboarding.
*   **`currentStep`:** The `OnboardingStep` object corresponding to the `currentStepId` in the preferences.
*   **Persistence & Sync:** The `preferences` object is persisted to `localStorage` on every change and synced with Firestore if cloud sync is enabled.

### Key Functions & Hooks

*   **`useUraiOnboarding()`:** The hook to access the onboarding context.
*   **`startOnboarding()`:** Begins the onboarding flow.
*   **`completeStep()`:** Marks the current (or a specified) step as complete and advances the user to the next logical step defined in `ONBOARDING_STEP_ORDER`.
*   **`skipOnboarding()` / `completeOnboarding()`:** Functions to exit the onboarding flow.
*   **`resetOnboarding()`:** Resets the onboarding state to its default, allowing a user to go through the process again.

### Architecture Notes

*   **Step-Based Finite State Machine:** The provider acts as a finite state machine for the onboarding process. The flow is predefined in `ONBOARDING_STEP_ORDER`, and functions like `completeStep` are responsible for transitioning between these states.
*   **Cloud-Synced State:** The entire onboarding state is designed to be synced with the cloud. This ensures a consistent onboarding experience even if the user switches devices midway through the process.
*   **Conflict Resolution:** It explicitly imports and uses `resolveOnboardingConflict`, indicating a robust design that can handle discrepancies between local and remote onboarding state, preventing data loss or inconsistent states.
*   **Tightly Coupled to Auth/Sync:** It has strong dependencies on `UraiAuthProvider` (to get the `userId`) and `UraiCloudSyncProvider` (to trigger push/pull operations), highlighting the importance of the core auth and sync services.

## 13. UraiPassiveDataProvider

*   **Location:** `src/providers/UraiPassiveDataProvider.tsx`
*   **Purpose:** Manages the collection of data from passive, background sources (e.g., browser activity, OS-level data), with a strong focus on user permissions and privacy.

### State Management

*   **`sourceStatuses`:** An in-memory array tracking the status of each potential data source (`disabled`, `ready`, `paused`, `permission_required`).
*   **`records`:** An in-memory array holding all the `PassiveDataRecord` objects that have been collected during the current session.
*   **No Persistence:** Crucially, neither the statuses nor the collected records are persisted to `localStorage` or synced to the cloud. All collected data is ephemeral and is lost on page refresh.

### Key Functions & Hooks

*   **`useUraiPassiveData()`:** The hook to access the context.
*   **`enableSource()`:** Attempts to enable a data source. It checks for permission using `canIngestPassiveSource` before changing the source's status.
*   **`ingestRecord()`:** The function used to add a new data record. It also performs a permission check via `canIngestPassiveSource` before accepting the data.
*   **`getPermissionedRecordsForFeature()`:** A key function intended to provide other features (like Life Map or Ground) with the data they are allowed to see. **Note:** The current implementation is a simplified placeholder and returns all records.

### Architecture Notes

*   **Privacy-First, Ephemeral Data:** The most significant architectural choice is that all data is stored in-memory. This is a strong privacy-by-design pattern, as no sensitive background data is written to disk or sent to the cloud without explicit action from other providers (e.g., the Export provider).
*   **Permission-Gated Ingestion:** Data collection is not automatic. Both enabling a source and ingesting data from it are gated by a permission check that relies on the `UraiPassportProvider`. This gives the user fine-grained control over what the application can collect.
*   **Placeholder for Future Development:** Key functions like `getPermissionedRecordsForFeature` and `requestBrowserPermissionForSource` are currently implemented as simplified placeholders. This suggests the provider is a foundational piece, with more complex permission-filtering logic to be added later as other features are built out.
*   **Centralized Data Source Registry:** The available passive data sources are defined in a central `URAI_PASSIVE_SOURCES` registry, making it easy to manage and add new sources in a controlled way.

## 14. UraiRitualProvider

*   **Location:** `src/providers/UraiRitualProvider.tsx`
*   **Purpose:** Manages guided, interactive activities or workflows called "rituals." It handles the suggestion, lifecycle (start, complete, save), and cross-feature integration of these rituals.

### State Management

*   **`rituals`:** The master list of all `UraiRitual` objects the user has interacted with (suggested, saved, completed, etc.).
*   **`selectedRitual`:** The ritual currently highlighted in the UI.
*   **`activeRitual`:** The ritual the user is currently performing in an active UI flow.
*   **`isRitualFlowOpen`:** A boolean to control the visibility of the active ritual UI.
*   **Hybrid Persistence:** It uses a combination of persistence strategies:
    *   **Local Cache:** `localStorage` is used to quickly store the IDs of `saved` and `completed` rituals.
    *   **Cloud Sync:** The entire list of `rituals` (with their current statuses) is serialized and pushed to Firestore via the `UraiCloudSyncProvider` for a durable, cross-device state.

### Key Functions & Hooks

*   **`useUraiRituals()`:** The hook to access the context.
*   **`suggestForContext()`:** Triggers a suggestion engine (`suggestRituals`) to generate new rituals based on the user's current context and adds them to the state.
*   **Lifecycle Management:** Provides a full suite of functions to manage the ritual lifecycle: `startRitual`, `completeRitual`, `skipRitual`, `saveRitual`, and `hideRitual`.
*   **`addRitualToLegacy()`:** An integration point with `UraiLegacyProvider`. Allows a completed or saved ritual to be converted into a candidate for the user's Legacy Archive.
*   **`exportRitual()`:** An integration point with `UraiExportProvider`. Allows a completed or saved ritual to be reviewed and prepared for export as a data artifact (e.g., an image).

### Architecture Notes

*   **Integration Hub:** This provider is a key architectural hub. It doesn't just manage its own state; it creates data objects (`LegacyCandidate`, `ExportReview`) that are consumed by other major providers, demonstrating a high degree of planned data flow between features.
*   **State Manager for a Suggestion Engine:** The provider is not responsible for the logic of *what* rituals to suggest. It consumes the output of the external `suggestRituals` function, cleanly separating the state management from the suggestion logic.
*   **Robust State Syncing:** By syncing the entire list of rituals, the provider ensures a consistent user experience across devices. The local cache of IDs serves as a quick-access layer, while the cloud sync provides durability.
*   **Implicit Conflict Merging:** During initialization, the provider merges the cloud-retrieved rituals with any rituals that only exist locally, preventing data loss and ensuring a unified view.

## 15. UraiSettingsProvider

*   **Location:** `src/providers/UraiSettingsProvider.tsx`
*   **Purpose:** Manages the application-wide settings UI and the persistence of user preferences, focusing on accessibility and visual controls.

### State Management

*   **`settingsProfile`:** The core `UraiSettingsProfile` object, containing all user-configurable settings, such as accessibility options.
*   **`isSettingsOpen`:** A boolean to control the visibility of the main settings UI.
*   **`activeSection`:** The currently viewed section within the settings UI.
*   **Persistence & Sync:** The `settingsProfile` object is persisted to `localStorage` on every change and is designed to be fully synced with Firestore via the `UraiCloudSyncProvider`.

### Key Functions & Hooks

*   **`useUraiSettings()`:** The hook to access the settings context.
*   **`openSettings()` & `closeSettings()`:** Functions to control the visibility of the settings UI.
*   **Setter Functions:** Provides a suite of specific setter functions for individual settings (e.g., `setReducedSensoryMode`, `setReducedMotion`, `setHighContrast`). This promotes type safety and makes component interactions clear.

### Architecture Notes

*   **Centralized Settings Management:** This provider acts as the single source of truth for all user-facing application settings. It provides a clear API for other components to read and update these settings.
*   **Robust, Cloud-Synced State:** Like the `UraiOnboardingProvider`, it treats the user's settings as critical data that needs to be consistent across devices. It uses a `localStorage` cache for speed and `UraiCloudSyncProvider` for durability and synchronization.
*   **Conflict Resolution:** It explicitly imports and uses `resolveSettingsConflict`, indicating a robust design that can handle and merge differences between local and cloud-based settings profiles, ensuring a predictable user experience.
*   **Implicit Dependencies:** The setter functions demonstrate a degree of internal logic. For example, `setReducedSensoryMode` also cascades to disable `hapticsEnabled` and `ambientAnimationEnabled`, showing that the provider manages not just the state but also the logical relationships between settings.

## 16. UraiShadowProvider

*   **Location:** `src/providers/UraiShadowProvider.tsx`
*   **Purpose:** Manages the "Shadow" visualization, a feature designed to explore potentially sensitive or hidden facets of user data through interactive "reflections."

### State Management

*   **`shadowSession`:** The core `ShadowSession` object containing the data for the visualization. This is generated in-memory by `buildPermissionedShadow` and is not persisted.
*   **`selectedReflection`:** The currently selected `ShadowReflection` in the UI. This is ephemeral, in-memory state.
*   **`isShadowOpen`:** A boolean to control the visibility of the Shadow UI.
*   **`viewMode`:** A key state (`sealed`, `soft`, `clear`, `guardian`) that controls how the shadow data is presented. This preference is persisted to `localStorage` to maintain the user's viewing choice between sessions.

### Key Functions & Hooks

*   **`useUraiShadow()`:** The hook to access the context.
*   **`regenerateShadow()`:** Re-runs the `buildPermissionedShadow` function to create a new set of reflections for the session.
*   **`setViewMode()`:** Allows the user to switch between different viewing modes, changing the visibility or presentation of the shadow data.
*   **`softenSelectedReflection()` / `hideSelectedReflection()`:** These functions allow the user to interactively change the visibility of individual reflections within the current session. These changes are ephemeral and reset on regeneration or page refresh.

### Architecture Notes

*   **Follows Visualization Provider Pattern:** This provider is another example of the application's standard pattern for data visualizations, alongside `UraiMirrorProvider`, `UraiGroundProvider`, and `UraiLifeMapProvider`.
*   **Ephemeral Data, Persistent Preferences:** It follows the established pattern of holding the core visualization data (`shadowSession`) in ephemeral, in-memory state while persisting the user's primary view preference (`viewMode`) to `localStorage`.
*   **Delegated Generation Logic:** The provider is responsible for managing the UI state and user interactions, but it delegates the complex business logic of constructing the actual `ShadowSession` to the external `buildPermissionedShadow` function.
*   **Focus on Privacy and User Control:** The naming (`Shadow`, `sealed`, `soften`, `hide`) and the `viewMode` functionality strongly suggest a design centered around privacy and giving the user explicit control over how they engage with potentially more sensitive or personal data insights.

## 17. UraiSoundProvider

*   **Location:** `src/providers/UraiSoundProvider.tsx`
*   **Purpose:** A lightweight provider for managing sound preferences and triggering audio playback. It appears to be a newer, more streamlined alternative to `UraiAudioProvider`.

### State Management

*   **`preference`:** A `UraiSoundPreference` object that holds the user's sound settings (`enabled`, `ambientEnabled`, `voiceEnabled`, `volume`).
*   **Persistence:** The entire `preference` object is saved to and retrieved from `localStorage` via helper functions (`getStoredSoundPreference`, `saveStoredSoundPreference`) in the `@/lib/sound` module.

### Key Functions & Hooks

*   **`useUraiSound()`:** The hook to access the context.
*   **`playSound()`:** The primary function to play a sound effect. It passes the sound ID and the current user preferences to the external `playUraiSound` function.
*   **`stopAmbient()`:** A function to halt any playing ambient sounds.
*   **Settings Setters:** A series of functions (`setSoundEnabled`, `setAmbientEnabled`, `setVoiceEnabled`, `setVolume`) that update the preference state and persist it to `localStorage`.

### Architecture Notes

*   **Delegation to a Library:** This provider acts as a thin state management layer. It holds the user's preferences but delegates all the actual audio playback logic to functions imported from `@/lib/sound`. This is a clean separation of concerns.
*   **Potential Refactor of UraiAudioProvider:** This provider has significant functional overlap with `UraiAudioProvider` but is much simpler. It lacks the complex audio engine wrapper and has a more focused set of states and functions. This suggests it might be a newer, refactored, or simplified version intended to replace the older audio provider.
*   **Graceful Degradation:** The `useUraiSound` hook provides a safe, non-functional default value if it is used outside the context of the provider. This prevents components from crashing and allows them to be used in any environment (e.g., a test environment) without needing to be wrapped by the provider.

## 18. UraiVoiceProvider

*   **Location:** `src/providers/UraiVoiceProvider.tsx`
*   **Purpose:** Manages all aspects of voice narration, including playback controls, real-time captions, and user preferences for voice features.

### State Management

*   **`settings`:** A comprehensive `UraiVoiceSettings` object that includes toggles for `voiceEnabled`, `captionsEnabled`, `whispersEnabled`, and `councilNarrationEnabled`, as well as `voiceVolume`.
*   **`currentCaption`:** An in-memory string state that holds the text of the currently playing voice line, received from the voice engine.
*   **Persistence:** All user settings are persisted to `localStorage`. The provider uses dedicated `readBoolean`, `readNumber`, and `persist` functions to manage this, ensuring settings are saved between sessions.

### Key Functions & Hooks

*   **`useUraiVoice()`:** The hook to access the voice context.
*   **`playVoiceLine()` & `stopVoiceLine()`:** The core functions for controlling voice playback. They are thin wrappers that delegate directly to the `uraiVoiceEngine`.
*   **Settings Setters:** A suite of functions (`setVoiceEnabled`, `setCaptionsEnabled`, etc.) for updating individual user preferences. These all route through a central `updateSettings` function that handles state updates, persistence, and notifying the voice engine.

### Architecture Notes

*   **Engine Delegation Model:** This provider is a clear example of a facade. It provides a clean, React-friendly API for components while delegating the complex, underlying logic of audio playback and caption management to the specialized `uraiVoiceEngine` module.
*   **Subscription for Captioning:** It subscribes to the `uraiVoiceEngine` to receive caption updates. This observer pattern allows the UI to reactively display subtitles without being tightly coupled to the engine's internal state.
*   **Dependency on UraiAudioProvider:** The provider consumes `useUraiAudio()` to get the `reducedSensoryMode` setting. This demonstrates good architectural layering, where the more specific `UraiVoiceProvider` respects the global settings of the main `UraiAudioProvider`.
*   **Handles Audio Unlocking:** When voice is enabled, the provider correctly calls `audio.unlockAudio()`, showing it understands and properly handles browser audio context restrictions, ensuring a smooth user experience.
