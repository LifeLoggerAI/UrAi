# URAI Backend Blocker Register

**Generated:** 2024-07-31

## 1. Current Truth

This document serves as the canonical register for all backend components required by the `scripts/independent-release-verifier.mjs` script that are not yet implemented.

-   **What is Real:** The public-facing Firebase Hosting UI is deployed and functional. All required UI-level tests, smoke tests, and build processes are passing. The current state is accurately reflected in `LOCK.md` (commit `6f4e91c`), which states that the backend is **gated** and not production-ready.
-   **What is Gated:** All features requiring backend data processing, user data storage (beyond authentication), intelligence, payments, and data management are intentionally gated off from the public release.
-   **What Remains Blocked:** 60 specific backend components (Firebase Functions, Firestore domains, and consent gates) are unimplemented. The `verify:release` script correctly identifies these as blockers, resulting in a `NOT READY` verdict.

---

## 2. Complete Blocker Table

The following 60 items are required by the release verifier and are currently unimplemented.

| # | Blocker | Type | Classification | Phase |
| :- | :--- | :--- | :--- | :--- |
| **Firebase Functions (21)** | | | | |
| 1 | `health` | Function | `admin/operator required` | 3 |
| 2 | `ingestEvent` | Function | `backend foundation required` | 3 |
| 3 | `enrichEvent` | Function | `intelligence/story generation required` | 3 |
| 4 | `generateDailyInsights` | Function | `intelligence/story generation required` | 3 |
| 5 | `generateWeeklyRecap` | Function | `intelligence/story generation required` | 3 |
| 6 | `generateMoodForecast` | Function | `intelligence/story generation required` | 3 |
| 7 | `generateLifeMapStar` | Function | `intelligence/story generation required` | 3 |
| 8 | `generateConstellation` | Function | `intelligence/story generation required` | 3 |
| 9 | `generateRitualSuggestion` | Function | `intelligence/story generation required` | 3 |
| 10 | `completeRitual` | Function | `intelligence/story generation required` | 3 |
| 11 | `requestExport` | Function | `privacy/legal required` | 3 |
| 12 | `processExportJob` | Function | `privacy/legal required` | 3 |
| 13 | `storyAssemble` | Function | `intelligence/story generation required` | 3 |
| 14 | `ttsRender` | Function | `intelligence/story generation required` | 3 |
| 15 | `purchaseWebhook` | Function | `payments/entitlements required` | 3 |
| 16 | `syncEntitlements` | Function | `payments/entitlements required` | 3 |
| 17 | `deleteUserData` | Function | `privacy/legal required` | 3 |
| 18 | `exportUserData` | Function | `privacy/legal required` | 3 |
| 19 | `rollupDailyMetrics` | Function | `admin/operator required` | 3 |
| 20 | `cleanupExpiredExports` | Function | `admin/operator required` | 3 |
| 21 | `systemStatusCheck` | Function | `admin/operator required` | 3 |
| **Firestore Domains (30)** | | | | |
| 22 | `users` | Domain | `backend foundation required` | 2 |
| 23 | `events` | Domain | `backend foundation required` | 2 |
| 24 | `eventEnrichments` | Domain | `intelligence/story generation required` | 2 |
| 25 | `memoryShards` | Domain | `intelligence/story generation required` | 2 |
| 26 | `insights` | Domain | `intelligence/story generation required` | 2 |
| 27 | `forecasts` | Domain | `intelligence/story generation required` | 2 |
| 28 | `moodWeather` | Domain | `intelligence/story generation required` | 2 |
| 29 | `lifeMapEvents` | Domain | `intelligence/story generation required` | 2 |
| 30 | `constellations` | Domain | `intelligence/story generation required` | 2 |
| 31 | `rituals` | Domain | `intelligence/story generation required` | 2 |
| 32 | `scrolls` | Domain | `intelligence/story generation required` | 2 |
| 33 | `storyScripts` | Domain | `intelligence/story generation required` | 2 |
| 34 | `exports` | Domain | `privacy/legal required` | 2 |
| 35 | `relationships` | Domain | `intelligence/story generation required` | 2 |
| 36 | `socialGraph` | Domain | `intelligence/story generation required` | 2 |
| 37 | `shadowMetrics` | Domain | `intelligence/story generation required` | 2 |
| 38 | `obscuraSignals` | Domain | `intelligence/story generation required` | 2 |
| 39 | `mentalLoadScores` | Domain | `intelligence/story generation required` | 2 |
| 40 | `councilSessions` | Domain | `intelligence/story generation required` | 2 |
| 41 | `narratorMessages` | Domain | `intelligence/story generation required` | 2 |
| 42 | `marketplaceItems` | Domain | `payments/entitlements required` | 2 |
| 43 | `entitlements` | Domain | `payments/entitlements required` | 2 |
| 44 | `transactions` | Domain | `payments/entitlements required` | 2 |
| 45 | `auditLogs` | Domain | `admin/operator required` | 2 |
| 46 | `systemStatus` | Domain | `admin/operator required` | 2 |
| 47 | `incidents` | Domain | `admin/operator required` | 2 |
| 48 | `consents` | Domain | `privacy/legal required` | 2 |
| 49 | `dataRequests` | Domain | `privacy/legal required` | 2 |
| 50 | `featureFlags` | Domain | `admin/operator required` | 2 |
| 51 | `adminUsers` | Domain | `admin/operator required` | 2 |
| **Consent Gates (9)** | | | | |
| 52 | `audioProcessing` | Consent | `privacy/legal required` | 2 |
| 53 | `locationContext` | Consent | `privacy/legal required` | 2 |
| 54 | `relationshipInsights` | Consent | `public launch not required / gate out` | 1 |
| 55 | `healthWellnessInsights`| Consent | `public launch not required / gate out` | 1 |
| 56 | `marketplacePersonalization`| Consent | `public launch not required / gate out` | 1 |
| 57 | `exportGeneration` | Consent | `privacy/legal required` | 2 |
| 58 | `anonymizedPatternLicensing`| Consent | `privacy/legal required` | 2 |
| 59 | `pushNotifications` | Consent | `public launch not required / gate out` | 1 |
| 60 | `emailRecaps` | Consent | `public launch not required / gate out` | 1 |

---

## 3. Safe Implementation Phase Order

This sequence prioritizes security and verifiable truth at each step.

*   **Phase 1: Documentation & Gating (This action)**
    *   **Goal:** Formally acknowledge all blockers and ensure the public UI makes no false claims.

*   **Phase 2: Schemas, Types, and Foundational Rules**
    *   **Goal:** Define the data structures for all 30 Firestore domains and implement core privacy consent gates.
    *   **Actions:** Create schema/type/path files for each domain; update `firestore.rules` with `deny-by-default` for all new collections.

*   **Phase 3: Real Function Implementation**
    *   **Goal:** Implement the server-side logic for the 21 Firebase Functions, prioritizing privacy and foundational features first.

*   **Phase 4: Emulator, Rules, and Integration Testing**
    *   **Goal:** Secure and validate every new piece of the backend with specific security rules and comprehensive tests.

---

## 4. Validation & Safety

### Validation Commands

These commands must be used to validate progress through the phases:

-   `npm run verify:release`: Verifies static evidence (file existence, code references).
-   `npm run test`: Runs all unit, integration, and rules tests.
-   `npm run test:rules`: Specifically validates Firestore security rules in the emulator.
-   `npm run test:e2e`: Runs full end-to-end user journey tests.
-   `npm run build`: Ensures the project compiles without errors.
-   `npm run deploy:evidence`: Checks for deployment artifacts.
-   `npm run test:smoke`: Runs critical path E2E tests.
-   `URAI_VERIFIER_RUN_COMMANDS=1 npm run verify:release`: The full verifier run that executes all required scripts to prove they pass.

### Unsafe Actions to Avoid

To maintain the integrity of the release process, the following actions are strictly prohibited:

-   **Do not** modify `firestore.rules` with permissive rules like `allow read, write: if true;`.
-   **Do not** create empty or stubbed Firebase Functions that give a false signal of implementation.
-   **Do not** alter the `scripts/independent-release-verifier.mjs` script to bypass or weaken checks.
-   **Do not** update `LOCK.md` to claim a higher readiness tier until all blockers for that tier are verifiably complete.
