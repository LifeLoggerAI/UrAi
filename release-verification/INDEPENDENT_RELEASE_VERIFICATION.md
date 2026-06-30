# URAI Independent Release Verification Report

Generated: 2026-06-30T14:49:29.889Z

Final verdict: **NOT READY — BLOCKERS REMAIN**

Summary:

- Passed: 140
- Failed: 2
- Unverified: 0

## VERIFIED PASS ITEMS

- **Required report exists: SYSTEM_AUDIT.md**
  - Evidence: SYSTEM_AUDIT.md
  - Remediation: Create or update SYSTEM_AUDIT.md.
- **Required report exists: SYSTEM_OF_SYSTEMS.md**
  - Evidence: SYSTEM_OF_SYSTEMS.md
  - Remediation: Create or update SYSTEM_OF_SYSTEMS.md.
- **Required report exists: REPO_MAP.md**
  - Evidence: REPO_MAP.md
  - Remediation: Create or update REPO_MAP.md.
- **Required report exists: SYSTEM_GRAPH.md**
  - Evidence: SYSTEM_GRAPH.md
  - Remediation: Create or update SYSTEM_GRAPH.md.
- **Required report exists: TODO_SYSTEMS.md**
  - Evidence: TODO_SYSTEMS.md
  - Remediation: Create or update TODO_SYSTEMS.md.
- **Required report exists: RISK_REGISTER.md**
  - Evidence: RISK_REGISTER.md
  - Remediation: Create or update RISK_REGISTER.md.
- **Required report exists: LOCK.md**
  - Evidence: LOCK.md
  - Remediation: Create or update LOCK.md.
- **Required report exists: FINAL_SYSTEM_REPORT.md**
  - Evidence: FINAL_SYSTEM_REPORT.md
  - Remediation: Create or update FINAL_SYSTEM_REPORT.md.
- **Required report exists: E2E_TEST_REPORT.md**
  - Evidence: E2E_TEST_REPORT.md
  - Remediation: Create or update E2E_TEST_REPORT.md.
- **Required report exists: DEPLOYMENT_REPORT.md**
  - Evidence: DEPLOYMENT_REPORT.md
  - Remediation: Create or update DEPLOYMENT_REPORT.md.
- **Required report exists: RELEASE_NOTES.md**
  - Evidence: RELEASE_NOTES.md
  - Remediation: Create or update RELEASE_NOTES.md.
- **Required report exists: KNOWN_LIMITATIONS.md**
  - Evidence: KNOWN_LIMITATIONS.md
  - Remediation: Create or update KNOWN_LIMITATIONS.md.
- **Required report exists: NEXT_ACTIONS.md**
  - Evidence: NEXT_ACTIONS.md
  - Remediation: Create or update NEXT_ACTIONS.md.
- **package.json script exists: lint**
  - Evidence: eslint --ext .ts,.tsx src
  - Remediation: Add npm script 'lint'.
- **package.json script exists: check:types**
  - Evidence: tsc --noEmit
  - Remediation: Add npm script 'check:types'.
- **package.json script exists: test**
  - Evidence: jest
  - Remediation: Add npm script 'test'.
- **package.json script exists: test:unit**
  - Evidence: jest tests/unit src --passWithNoTests
  - Remediation: Add npm script 'test:unit'.
- **package.json script exists: test:integration**
  - Evidence: jest tests/integration --passWithNoTests
  - Remediation: Add npm script 'test:integration'.
- **package.json script exists: test:e2e**
  - Evidence: playwright test
  - Remediation: Add npm script 'test:e2e'.
- **package.json script exists: test:rules**
  - Evidence: jest --config tests/rules/jest.config.cjs
  - Remediation: Add npm script 'test:rules'.
- **package.json script exists: test:smoke**
  - Evidence: playwright test tests/e2e --grep @smoke
  - Remediation: Add npm script 'test:smoke'.
- **package.json script exists: build**
  - Evidence: node scripts/ensure-next-cache.mjs && next build
  - Remediation: Add npm script 'build'.
- **package.json script exists: deploy:evidence**
  - Evidence: node scripts/deployment-evidence-check.mjs
  - Remediation: Add npm script 'deploy:evidence'.
- **Canonical route implemented: /**
  - Evidence: src/app/page.tsx
  - Remediation: Add a real route for / or document blocker.
- **Canonical route implemented: /app**
  - Evidence: src/app/app/page.tsx
  - Remediation: Add a real route for /app or document blocker.
- **Canonical route implemented: /app/home**
  - Evidence: src/app/app/home/page.tsx
  - Remediation: Add a real route for /app/home or document blocker.
- **Canonical route implemented: /app/mirror**
  - Evidence: src/app/app/mirror/page.tsx
  - Remediation: Add a real route for /app/mirror or document blocker.
- **Canonical route implemented: /app/life-map**
  - Evidence: src/app/app/life-map/page.tsx
  - Remediation: Add a real route for /app/life-map or document blocker.
- **Canonical route implemented: /app/star/[id]**
  - Evidence: src/app/app/star/[id]/page.tsx
  - Remediation: Add a real route for /app/star/[id] or document blocker.
- **Canonical route implemented: /app/forecast**
  - Evidence: src/app/app/forecast/page.tsx
  - Remediation: Add a real route for /app/forecast or document blocker.
- **Canonical route implemented: /app/council**
  - Evidence: src/app/app/council/page.tsx
  - Remediation: Add a real route for /app/council or document blocker.
- **Canonical route implemented: /app/rituals**
  - Evidence: src/app/app/rituals/page.tsx
  - Remediation: Add a real route for /app/rituals or document blocker.
- **Canonical route implemented: /app/scrolls**
  - Evidence: src/app/app/scrolls/page.tsx
  - Remediation: Add a real route for /app/scrolls or document blocker.
- **Canonical route implemented: /app/story**
  - Evidence: src/app/app/story/page.tsx
  - Remediation: Add a real route for /app/story or document blocker.
- **Canonical route implemented: /app/exports**
  - Evidence: src/app/app/exports/page.tsx
  - Remediation: Add a real route for /app/exports or document blocker.
- **Canonical route implemented: /app/relationships**
  - Evidence: src/app/app/relationships/page.tsx
  - Remediation: Add a real route for /app/relationships or document blocker.
- **Canonical route implemented: /app/dashboard**
  - Evidence: src/app/app/dashboard/page.tsx
  - Remediation: Add a real route for /app/dashboard or document blocker.
- **Canonical route implemented: /app/marketplace**
  - Evidence: src/app/app/marketplace/page.tsx
  - Remediation: Add a real route for /app/marketplace or document blocker.
- **Canonical route implemented: /app/settings**
  - Evidence: src/app/app/settings/page.tsx
  - Remediation: Add a real route for /app/settings or document blocker.
- **Canonical route implemented: /admin**
  - Evidence: src/app/admin/page.tsx
  - Remediation: Add a real route for /admin or document blocker.
- **Canonical route implemented: /admin/system**
  - Evidence: src/app/admin/system/page.tsx
  - Remediation: Add a real route for /admin/system or document blocker.
- **Canonical route implemented: /admin/users**
  - Evidence: src/app/admin/users/page.tsx
  - Remediation: Add a real route for /admin/users or document blocker.
- **Canonical route implemented: /admin/flags**
  - Evidence: src/app/admin/flags/page.tsx
  - Remediation: Add a real route for /admin/flags or document blocker.
- **Canonical route implemented: /admin/audits**
  - Evidence: src/app/admin/audits/page.tsx
  - Remediation: Add a real route for /admin/audits or document blocker.
- **Canonical route implemented: /admin/marketplace**
  - Evidence: src/app/admin/marketplace/page.tsx
  - Remediation: Add a real route for /admin/marketplace or document blocker.
- **Canonical route implemented: /admin/exports**
  - Evidence: src/app/admin/exports/page.tsx
  - Remediation: Add a real route for /admin/exports or document blocker.
- **Firebase function present/referenceable: health**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'health' or document why it is blocked.
- **Firebase function present/referenceable: ingestEvent**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'ingestEvent' or document why it is blocked.
- **Firebase function present/referenceable: enrichEvent**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'enrichEvent' or document why it is blocked.
- **Firebase function present/referenceable: generateDailyInsights**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'generateDailyInsights' or document why it is blocked.
- **Firebase function present/referenceable: generateWeeklyRecap**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'generateWeeklyRecap' or document why it is blocked.
- **Firebase function present/referenceable: generateMoodForecast**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'generateMoodForecast' or document why it is blocked.
- **Firebase function present/referenceable: generateLifeMapStar**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'generateLifeMapStar' or document why it is blocked.
- **Firebase function present/referenceable: generateConstellation**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'generateConstellation' or document why it is blocked.
- **Firebase function present/referenceable: generateRitualSuggestion**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'generateRitualSuggestion' or document why it is blocked.
- **Firebase function present/referenceable: completeRitual**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'completeRitual' or document why it is blocked.
- **Firebase function present/referenceable: requestExport**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'requestExport' or document why it is blocked.
- **Firebase function present/referenceable: processExportJob**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'processExportJob' or document why it is blocked.
- **Firebase function present/referenceable: storyAssemble**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'storyAssemble' or document why it is blocked.
- **Firebase function present/referenceable: ttsRender**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'ttsRender' or document why it is blocked.
- **Firebase function present/referenceable: purchaseWebhook**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'purchaseWebhook' or document why it is blocked.
- **Firebase function present/referenceable: syncEntitlements**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'syncEntitlements' or document why it is blocked.
- **Firebase function present/referenceable: deleteUserData**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'deleteUserData' or document why it is blocked.
- **Firebase function present/referenceable: exportUserData**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'exportUserData' or document why it is blocked.
- **Firebase function present/referenceable: rollupDailyMetrics**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'rollupDailyMetrics' or document why it is blocked.
- **Firebase function present/referenceable: cleanupExpiredExports**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'cleanupExpiredExports' or document why it is blocked.
- **Firebase function present/referenceable: systemStatusCheck**
  - Evidence: functions/lib/index.js, functions/lib/uraiCompletionFunctions.js, functions/src/index.ts, functions/src/uraiCompletionFunctions.ts
  - Remediation: Implement/export Cloud Function 'systemStatusCheck' or document why it is blocked.
- **Firestore rules file exists**
  - Evidence: firestore.rules
  - Remediation: Add firestore.rules.
- **Storage rules file exists**
  - Evidence: storage.rules
  - Remediation: Add storage.rules.
- **Firestore rules include deny-by-default fallback**
  - Evidence: firestore.rules
  - Remediation: Add final match /{document=**} deny rule.
- **Storage rules include deny-by-default fallback**
  - Evidence: storage.rules
  - Remediation: Add final match /{allPaths=**} deny rule.
- **Firestore domain has code coverage: users**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for users.
- **Firestore domain has code coverage: events**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for events.
- **Firestore domain has code coverage: eventEnrichments**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for eventEnrichments.
- **Firestore domain has code coverage: memoryShards**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for memoryShards.
- **Firestore domain has code coverage: insights**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for insights.
- **Firestore domain has code coverage: forecasts**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for forecasts.
- **Firestore domain has code coverage: moodWeather**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for moodWeather.
- **Firestore domain has code coverage: lifeMapEvents**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for lifeMapEvents.
- **Firestore domain has code coverage: constellations**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for constellations.
- **Firestore domain has code coverage: rituals**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for rituals.
- **Firestore domain has code coverage: scrolls**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for scrolls.
- **Firestore domain has code coverage: storyScripts**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for storyScripts.
- **Firestore domain has code coverage: exports**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for exports.
- **Firestore domain has code coverage: relationships**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for relationships.
- **Firestore domain has code coverage: socialGraph**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for socialGraph.
- **Firestore domain has code coverage: shadowMetrics**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for shadowMetrics.
- **Firestore domain has code coverage: obscuraSignals**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for obscuraSignals.
- **Firestore domain has code coverage: mentalLoadScores**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for mentalLoadScores.
- **Firestore domain has code coverage: councilSessions**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for councilSessions.
- **Firestore domain has code coverage: narratorMessages**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for narratorMessages.
- **Firestore domain has code coverage: marketplaceItems**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for marketplaceItems.
- **Firestore domain has code coverage: entitlements**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for entitlements.
- **Firestore domain has code coverage: transactions**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for transactions.
- **Firestore domain has code coverage: auditLogs**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for auditLogs.
- **Firestore domain has code coverage: systemStatus**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for systemStatus.
- **Firestore domain has code coverage: incidents**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for incidents.
- **Firestore domain has code coverage: consents**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for consents.
- **Firestore domain has code coverage: dataRequests**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for dataRequests.
- **Firestore domain has code coverage: featureFlags**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for featureFlags.
- **Firestore domain has code coverage: adminUsers**
  - Evidence: src/lib/firestore-schema.ts
  - Remediation: Add type, schema, path helper, rules coverage, and seed data for adminUsers.
- **Feature flag configured: lifeMap.enabled**
  - Evidence: src/lib/system-of-systems-contract.ts
  - Remediation: Add and enforce feature flag lifeMap.enabled.
- **Feature flag configured: council.enabled**
  - Evidence: src/lib/system-of-systems-contract.ts
  - Remediation: Add and enforce feature flag council.enabled.
- **Feature flag configured: storyMode.enabled**
  - Evidence: src/lib/system-of-systems-contract.ts
  - Remediation: Add and enforce feature flag storyMode.enabled.
- **Feature flag configured: marketplace.enabled**
  - Evidence: src/lib/system-of-systems-contract.ts
  - Remediation: Add and enforce feature flag marketplace.enabled.
- **Feature flag configured: exports.enabled**
  - Evidence: src/lib/system-of-systems-contract.ts
  - Remediation: Add and enforce feature flag exports.enabled.
- **Feature flag configured: relationshipInsights.enabled**
  - Evidence: src/lib/system-of-systems-contract.ts
  - Remediation: Add and enforce feature flag relationshipInsights.enabled.
- **Feature flag configured: mentalLoad.enabled**
  - Evidence: src/lib/system-of-systems-contract.ts
  - Remediation: Add and enforce feature flag mentalLoad.enabled.
- **Feature flag configured: obscura.enabled**
  - Evidence: src/lib/system-of-systems-contract.ts
  - Remediation: Add and enforce feature flag obscura.enabled.
- **Feature flag configured: shadowMetrics.enabled**
  - Evidence: src/lib/system-of-systems-contract.ts
  - Remediation: Add and enforce feature flag shadowMetrics.enabled.
- **Feature flag configured: xr.enabled**
  - Evidence: docs/release-evidence/2026-06-28-webxr-foundation-status.md, src/components/spatial-life-map/LifeGalaxyScene.tsx, src/components/spatial-life-map/LifeMapQuestInteraction.tsx, src/components/xr/XRSessionFoundation.tsx, src/lib/system-of-systems-contract.ts
  - Remediation: Add and enforce feature flag xr.enabled.
- **Feature flag configured: proDashboard.enabled**
  - Evidence: src/lib/system-of-systems-contract.ts
  - Remediation: Add and enforce feature flag proDashboard.enabled.
- **Feature flag configured: demoMode.enabled**
  - Evidence: src/lib/system-of-systems-contract.ts
  - Remediation: Add and enforce feature flag demoMode.enabled.
- **Consent gate configured: audioProcessing**
  - Evidence: docs/BACKEND_BLOCKER_REGISTER.md, src/lib/firestore-schema.ts, src/lib/system-of-systems-contract.ts
  - Remediation: Add consent field and processing guard for audioProcessing.
- **Consent gate configured: locationContext**
  - Evidence: docs/BACKEND_BLOCKER_REGISTER.md, src/app/api/companion/respond/route.ts, src/lib/companion/companionSafety.ts, src/lib/demo/__tests__/demoMode.test.ts, src/lib/demo/createDemoPassportProfile.ts
  - Remediation: Add consent field and processing guard for locationContext.
- **Consent gate configured: relationshipInsights**
  - Evidence: docs/BACKEND_BLOCKER_REGISTER.md, src/lib/firestore-schema.ts, src/lib/system-of-systems-contract.ts
  - Remediation: Add consent field and processing guard for relationshipInsights.
- **Consent gate configured: healthWellnessInsights**
  - Evidence: docs/BACKEND_BLOCKER_REGISTER.md, docs/ancient-signals-engine.md, functions/lib/ancientScheduledRollups.js, functions/src/ancientScheduledRollups.ts, src/lib/firestore-schema.ts
  - Remediation: Add consent field and processing guard for healthWellnessInsights.
- **Consent gate configured: marketplacePersonalization**
  - Evidence: docs/BACKEND_BLOCKER_REGISTER.md, src/lib/firestore-schema.ts, src/lib/system-of-systems-contract.ts
  - Remediation: Add consent field and processing guard for marketplacePersonalization.
- **Consent gate configured: exportGeneration**
  - Evidence: docs/BACKEND_BLOCKER_REGISTER.md, src/lib/firestore-schema.ts, src/lib/system-of-systems-contract.ts
  - Remediation: Add consent field and processing guard for exportGeneration.
- **Consent gate configured: anonymizedPatternLicensing**
  - Evidence: docs/BACKEND_BLOCKER_REGISTER.md, docs/prompts/BUILD_URAI_VAULT.md, src/lib/firestore-schema.ts, src/lib/system-of-systems-contract.ts
  - Remediation: Add consent field and processing guard for anonymizedPatternLicensing.
- **Consent gate configured: pushNotifications**
  - Evidence: docs/BACKEND_BLOCKER_REGISTER.md, src/lib/firestore-schema.ts, src/lib/notifications/pushNotificationClient.ts, src/lib/system-of-systems-contract.ts
  - Remediation: Add consent field and processing guard for pushNotifications.
- **Consent gate configured: emailRecaps**
  - Evidence: docs/BACKEND_BLOCKER_REGISTER.md, src/lib/firestore-schema.ts, src/lib/system-of-systems-contract.ts
  - Remediation: Add consent field and processing guard for emailRecaps.
- **Deterministic demo/staging seed scripts exist**
  - Evidence: .github/workflows/staging-smoke.yml, CORE_WEB_STAGING_EVIDENCE.md, STAGING_RELEASE_STATUS.md, deploy/free-static-launch/demo.html, docs/CODEMODS.md, docs/STAGING_DEPLOY_CHECKLIST.md, docs/STAGING_INTEGRATION_PLAN.md, docs/STAGING_PROMOTION_CHECKLIST.md, docs/STAGING_ROLLBACK_PLAN.md, docs/STAGING_SMOKE_EVIDENCE.md, docs/V1_DEMO_SCRIPT.md, docs/launch/demo-qa-checklist.md
  - Remediation: Add scripts/seed.ts, scripts/seed_staging.ts, and scripts/reset_demo.ts.
- **E2E/smoke tests exist**
  - Evidence: .github/workflows/playwright-smoke.yml, .github/workflows/staging-smoke.yml, :USERPROFILE
pm-cache-fresh/_cacache/content-v2/sha512/10/65/8a83100b18c833bf1605d54c864f2d075d7ff6bc72e4c3af8dbc3296da3ca959b1e98d0ba3e1431ca905971c444985518a8a4a254f4e86ddb70a7b87e2ef, :USERPROFILE
pm-cache-fresh/_cacache/content-v2/sha512/12/37/8f2b5b2b0f73f4f28da3e1fd04c67ca5a91b3907db498dca7db7592b1f6a918bc08276c61fc1ef498122eeac5056c2ae2e3a58a9cdf9397c736fc052abf1, :USERPROFILE
pm-cache-fresh/_cacache/content-v2/sha512/16/f7/994cdb86c34e1cc6502259bce2eb34c02ff9617a16966d3b6096e261e3f13de43a8cc139a16b7299375680580f1c148847ccc654bcb7af930e51aa4fad49, :USERPROFILE
pm-cache-fresh/_cacache/content-v2/sha512/18/4d/bdb934facbf26fd843f43a3a537b3793419e454c24da6572abadd5468dbfeddf9014e2efe3894fa153050fa6e2bc7ea861887912fc06b01376b764afdaf5, :USERPROFILE
pm-cache-fresh/_cacache/content-v2/sha512/19/0d/84591a5057cfe8f80c3c62ab5f6593df3515996246e2744f64e6ba65fe10b7bed1c705f1a6d887e2eaa595f9ca031a4ad42990311372e8b7991cb11961fa, :USERPROFILE
pm-cache-fresh/_cacache/content-v2/sha512/24/f6/1bd46b8cd5bc5f8cc46534b13e05c9810bca277c28bad01964ece06a8b630b4c5752fbce34d54e2e1639f090eaf8f412e65f12c2e891e4bc0b31e4e26f1f, :USERPROFILE
pm-cache-fresh/_cacache/content-v2/sha512/3d/2d/3c21ba226bd9adb3fdb2815dde2e96398219d471f2d5fc45d3396d44daa63124a186054b4d8cdefa1581e732cdfa4660119f8d5b0b40199a7fab474395a5, :USERPROFILE
pm-cache-fresh/_cacache/content-v2/sha512/47/7a/5ba64708aafd8f9b7754c208dc943455996a53256d8370ccdc221117131d6887f08430e6cc9b728b99124e76f84cee8e2e4019f0afca7344adac25622a7e, :USERPROFILE
pm-cache-fresh/_cacache/content-v2/sha512/4c/f2/57abc26a15a5589b609698fbe73f6232a3865233bfd029c4a6b8c2c339b7e91f97e2ed150699dfeb4c37feaeeb7fb1a88389011e5533600262447403b1d3, :USERPROFILE
pm-cache-fresh/_cacache/content-v2/sha512/4f/e9/40e71a2e83d081c866240f95a47d3876ba3118abf7eb1993db9341fe7cd53a7cd97b9ea83cf0a72c9b3b02e85b2a6e39b72cb11bfe2eb026f17a3523448a
  - Remediation: Add Playwright E2E tests for the core user journey.
- **LOCK.md includes commit**
  - Evidence: LOCK.md
  - Remediation: Update LOCK.md with commit status.
- **LOCK.md includes Firebase**
  - Evidence: LOCK.md
  - Remediation: Update LOCK.md with Firebase status.
- **LOCK.md includes Node**
  - Evidence: LOCK.md
  - Remediation: Update LOCK.md with Node status.
- **LOCK.md includes test**
  - Evidence: LOCK.md
  - Remediation: Update LOCK.md with test status.
- **LOCK.md includes build**
  - Evidence: LOCK.md
  - Remediation: Update LOCK.md with build status.
- **LOCK.md includes deploy**
  - Evidence: LOCK.md
  - Remediation: Update LOCK.md with deploy status.
- **LOCK.md includes staging**
  - Evidence: LOCK.md
  - Remediation: Update LOCK.md with staging status.
- **LOCK.md includes production**
  - Evidence: LOCK.md
  - Remediation: Update LOCK.md with production status.
- **Command passes: npm run lint**
  - Evidence: exit=0

> urai@0.1.0 lint
> eslint --ext .ts,.tsx src


/home/user/UrAi/src/components/common/SafeLayerImage.tsx
  23:5  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

/home/user/UrAi/src/components/genesis/GenesisOrb.tsx
  26:9  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

/home/user/UrAi/src/components/urai/CinematicSceneStrip.tsx
  33:60  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
  34:61  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

/home/user/UrAi/src/components/urai/life-map/LifeMapPage.tsx
  200:11  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

/home/user/UrAi/src/components/urai/scenes/HomeScene.tsx
  79:5  warning  React Hook useCallback has a missing dependency: 'handleNavigate'. Either include it or remove the dependency array  react-hooks/exhaustive-deps
  87:5  warning  React Hook useCallback has a missing dependency: 'handleNavigate'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

/home/user/UrAi/src/test/styleMock.ts
  1:1  warning  Assign object to a variable before exporting as module default  import/no-anonymous-default-export

✖ 8 problems (0 errors, 8 warnings)
  - Remediation: Fix failing command: npm run lint
- **Command passes: npm run check:types**
  - Evidence: exit=0

> urai@0.1.0 check:types
> tsc --noEmit
  - Remediation: Fix failing command: npm run check:types
- **Command passes: npm run test**
  - Evidence: exit=0
he output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      147 |         stars,
      148 |       };
    > 149 |       setLifeMapData(next);
          |       ^
      150 |       setSelectedChapter(next.chapters[0] ?? null);
      151 |       setSelectedStar(null);
      152 |     };

      at node_modules/react-dom/cjs/react-dom-client.development.js:18758:19
      at runWithFiberInDEV (node_modules/react-dom/cjs/react-dom-client.development.js:874:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-dom/cjs/react-dom-client.development.js:18757:9)
      at scheduleUpdateOnFiber (node_modules/react-dom/cjs/react-dom-client.development.js:16409:11)
      at dispatchSetStateInternal (node_modules/react-dom/cjs/react-dom-client.development.js:9170:13)
      at dispatchSetState (node_modules/react-dom/cjs/react-dom-client.development.js:9127:7)
      at setLifeMapData (src/providers/UraiLifeMapProvider.tsx:149:7)

    console.error
      An update to UraiLifeMapProvider inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      148 |       };
      149 |       setLifeMapData(next);
    > 150 |       setSelectedChapter(next.chapters[0] ?? null);
          |       ^
      151 |       setSelectedStar(null);
      152 |     };
      153 |     void fetchData();

      at node_modules/react-dom/cjs/react-dom-client.development.js:18758:19
      at runWithFiberInDEV (node_modules/react-dom/cjs/react-dom-client.development.js:874:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-dom/cjs/react-dom-client.development.js:18757:9)
      at scheduleUpdateOnFiber (node_modules/react-dom/cjs/react-dom-client.development.js:16409:11)
      at dispatchSetStateInternal (node_modules/react-dom/cjs/react-dom-client.development.js:9170:13)
      at dispatchSetState (node_modules/react-dom/cjs/react-dom-client.development.js:9127:7)
      at setSelectedChapter (src/providers/UraiLifeMapProvider.tsx:150:7)

    console.error
      An update to UraiLifeMapProvider inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      149 |       setLifeMapData(next);
      150 |       setSelectedChapter(next.chapters[0] ?? null);
    > 151 |       setSelectedStar(null);
          |       ^
      152 |     };
      153 |     void fetchData();
      154 |   }, []);

      at node_modules/react-dom/cjs/react-dom-client.development.js:18758:19
      at runWithFiberInDEV (node_modules/react-dom/cjs/react-dom-client.development.js:874:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-dom/cjs/react-dom-client.development.js:18757:9)
      at scheduleUpdateOnFiber (node_modules/react-dom/cjs/react-dom-client.development.js:16409:11)
      at dispatchSetStateInternal (node_modules/react-dom/cjs/react-dom-client.development.js:9170:13)
      at dispatchSetState (node_modules/react-dom/cjs/react-dom-client.development.js:9127:7)
      at setSelectedStar (src/providers/UraiLifeMapProvider.tsx:151:7)

PASS tests/unit/tier-locks/tier2CiGuardrail.test.ts
PASS tests/unit/home-xr-interaction-layer.test.ts

Test Suites: 54 passed, 54 total
Tests:       342 passed, 342 total
Snapshots:   0 total
Time:        12.416 s
Ran all test suites.
  - Remediation: Fix failing command: npm run test
- **Command passes: npm run test:unit**
  - Evidence: exit=0
s/react-dom-client.development.js:9127:7)
      at setSelectedChapter (src/providers/UraiLifeMapProvider.tsx:150:7)

    console.error
      An update to UraiLifeMapProvider inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      149 |       setLifeMapData(next);
      150 |       setSelectedChapter(next.chapters[0] ?? null);
    > 151 |       setSelectedStar(null);
          |       ^
      152 |     };
      153 |     void fetchData();
      154 |   }, []);

      at node_modules/react-dom/cjs/react-dom-client.development.js:18758:19
      at runWithFiberInDEV (node_modules/react-dom/cjs/react-dom-client.development.js:874:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-dom/cjs/react-dom-client.development.js:18757:9)
      at scheduleUpdateOnFiber (node_modules/react-dom/cjs/react-dom-client.development.js:16409:11)
      at dispatchSetStateInternal (node_modules/react-dom/cjs/react-dom-client.development.js:9170:13)
      at dispatchSetState (node_modules/react-dom/cjs/react-dom-client.development.js:9127:7)
      at setSelectedStar (src/providers/UraiLifeMapProvider.tsx:151:7)

PASS src/lib/intelligence/intelligenceDestinations.test.ts
PASS src/lib/auth/auth.test.tsx
PASS src/components/xr/__tests__/XRSessionFoundation.test.tsx
PASS tests/unit/urai-canon/system.test.ts
PASS tests/unit/urai-canon/state-machines.test.ts
PASS src/lib/firebase/__tests__/firebaseFallback.test.ts
PASS src/lib/intelligence/intelligenceSafety.test.ts
PASS tests/unit/urai-canon/spatialUniverseProvider.test.ts
PASS tests/unit/urai-canon/constellations.test.ts
PASS tests/unit/urai-canon/systemContracts.test.ts
PASS src/lib/intelligence/symbolicInferenceEngine.test.ts
PASS src/components/layout/__tests__/OnboardingGate.test.tsx
PASS tests/unit/tier-locks/tier2SeedScript.test.ts
PASS src/lib/companion/__tests__/buildPermissionedContext.test.ts
PASS tests/unit/urai-canon/asset-governance.test.ts
PASS src/components/spatial-life-map/__tests__/LifeMapQuestInteraction.test.ts
PASS src/lib/intelligence/__tests__/intelligenceSafety.test.ts
PASS src/lib/passport/__tests__/passportPermissions.test.ts
PASS src/lib/passport/__tests__/passportState.test.ts
PASS tests/unit/urai-canon/spatial-runtime.test.ts
PASS tests/unit/companion-engine.test.ts
PASS src/lib/ai/__tests__/aiBoundary.test.ts
PASS tests/unit/tier-locks/tier2AccessCheckScript.test.ts
PASS src/lib/__tests__/chronoMirror.test.ts
PASS tests/unit/waitlist.test.ts
PASS src/lib/legacy/__tests__/legacySafety.test.ts
PASS src/lib/voice/__tests__/voiceEngine.test.ts
PASS tests/unit/home-world.test.ts
PASS src/lib/auth/__tests__/authState.test.ts
PASS tests/unit/urai-canon/orb-anatomy.test.ts
PASS tests/unit/tier-locks/evaluateTierLock.test.ts
PASS src/lib/shadow/__tests__/shadowSafety.test.ts
PASS src/lib/exports/__tests__/exportSafety.test.ts
PASS src/lib/demo/__tests__/demoMode.test.ts
PASS tests/unit/urai-canon/spatialUniverseShell.test.ts
PASS tests/unit/urai-canon/cinematic-controller.test.ts
PASS src/lib/notifications/__tests__/timingEngine.test.ts
PASS tests/unit/urai-canon/focus-replay-runtime.test.ts
PASS tests/unit/urai-canon/constellation-renderer.test.ts
PASS tests/unit/tier-locks/requestTier2AccessLock.test.ts
PASS tests/unit/tier-locks/tier2CiGuardrail.test.ts
PASS src/lib/privacy/__tests__/privacyRulesEngine.test.ts
PASS src/lib/intelligence/moodRhythmScoring.test.ts
PASS tests/unit/home-xr-interaction-layer.test.ts
PASS tests/unit/urai-canon/tier-two-contracts.test.ts

Test Suites: 48 passed, 48 total
Tests:       237 passed, 237 total
Snapshots:   0 total
Time:        9.777 s
Ran all test suites matching /tests\/unit|src/i.
  - Remediation: Fix failing command: npm run test:unit
- **Command passes: npm run test:integration**
  - Evidence: exit=0

> urai@0.1.0 test:integration
> jest tests/integration --passWithNoTests

No tests found, exiting with code 0
  - Remediation: Fix failing command: npm run test:integration
- **Command passes: npm run test:rules**
  - Evidence: exit=0

> urai@0.1.0 test:rules
> jest --config tests/rules/jest.config.cjs


PASS tests/rules/firestore.rules.test.js
PASS tests/rules/canonical-firestore.rules.test.js
PASS tests/rules/user-subcollections.rules.test.js
PASS tests/rules/home-world.rules.test.js
PASS tests/rules/focus-replay-policy.test.js
PASS tests/rules/tier2-policy.test.js

Test Suites: 6 passed, 6 total
Tests:       105 passed, 105 total
Snapshots:   0 total
Time:        3.1 s
Ran all test suites.
  - Remediation: Fix failing command: npm run test:rules
- **Command passes: npm run build**
  - Evidence: exit=0
         106 kB
├ ○ /demo                                   301 B         106 kB
├ ○ /demo/life-map                          128 B         113 kB
├ ○ /early-access                           301 B         106 kB
├ ○ /focus                                  155 B         557 kB
├ ƒ /focus/session/[sessionId]              127 B         113 kB
├ ○ /galaxy                               25.7 kB         390 kB
├ ○ /genesis                                301 B         106 kB
├ ○ /ground                                 301 B         106 kB
├ ○ /home                                   279 B         381 kB
├ ○ /horizon                                301 B         106 kB
├ ○ /investors                              301 B         106 kB
├ ƒ /invite/[code]                          301 B         106 kB
├ ○ /journal                                301 B         106 kB
├ ○ /launch                               1.23 kB         107 kB
├ ○ /life-map                               156 B         557 kB
├ ƒ /life-map/star/[starId]                 127 B         113 kB
├ ○ /location-map                           301 B         106 kB
├ ○ /login                                  301 B         106 kB
├ ƒ /memory/[id]                            301 B         106 kB
├ ○ /mirror                                 128 B         113 kB
├ ○ /narrator                               301 B         106 kB
├ ○ /ochat                                  301 B         106 kB
├ ○ /onboarding                             301 B         106 kB
├ ○ /orb-chat                               301 B         106 kB
├ ○ /passport                               301 B         106 kB
├ ○ /privacy                                301 B         106 kB
├ ○ /privacy-controls                       301 B         106 kB
├ ○ /profile-and-privacy                    203 B         103 kB
├ ○ /record                               2.58 kB         105 kB
├ ○ /replay                                 301 B         106 kB
├ ƒ /replay/[replayId]                      127 B         113 kB
├ ○ /rituals                                301 B         106 kB
├ ○ /rituals-and-scrolls                    203 B         103 kB
├ ○ /robots.txt                             203 B         103 kB
├ ○ /scrolls                                301 B         106 kB
├ ○ /settings/privacy                       301 B         106 kB
├ ○ /shadow                                 301 B         106 kB
├ ○ /signup                                 301 B         106 kB
├ ○ /sitemap.xml                            203 B         103 kB
├ ○ /sky                                    301 B         106 kB
├ ○ /spatial                                301 B         106 kB
├ ○ /spatial/assets                         301 B         106 kB
├ ○ /spatial/demo                           301 B         106 kB
├ ○ /spatial/settings                       301 B         106 kB
├ ○ /status                               1.21 kB         104 kB
├ ○ /support                                301 B         106 kB
├ ○ /system                                 301 B         106 kB
├ ○ /terms                                  301 B         106 kB
├ ƒ /u/[handle]                             203 B         103 kB
├ ○ /waitlist                             1.49 kB         107 kB
└ ○ /xr                                   5.44 kB         381 kB
+ First Load JS shared by all              102 kB
  ├ chunks/1255-5c680abb9db89955.js       46.3 kB
  ├ chunks/4bd1b696-f785427dddbba9fb.js   54.2 kB
  └ other shared chunks (total)           1.95 kB

Route (pages)                                Size  First Load JS
─   /_app                                     0 B        98.7 kB
+ First Load JS shared by all             98.7 kB
  ├ chunks/framework-79ec8b086f68767a.js  59.7 kB
  ├ chunks/main-a701feba77773d1d.js         37 kB
  └ other shared chunks (total)              2 kB

ƒ Middleware                              32.1 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
  - Remediation: Fix failing command: npm run build
- **Command passes: npm run deploy:evidence**
  - Evidence: exit=0

> urai@0.1.0 deploy:evidence
> node scripts/deployment-evidence-check.mjs

[deployment-evidence] Evidence template is present and structurally complete.
[deployment-evidence] Package deploy path is wired through launch:check.
[deployment-evidence] Launch checks include deployment evidence and Life Map Quest proof gates.
[deployment-evidence] Life Map Quest deployment evidence template is present and structurally complete.
[deployment-evidence] Life Map Quest production evidence workflow is present and structurally complete.
[deployment-evidence] Life Map Quest launch enforcement evidence is present and structurally complete.
[deployment-evidence] Remaining manual/deployment checks:
  1. Confirm UrAi CI/CD passes on main.
  2. Confirm Firebase Hosting live deploy passes on main.
  3. Record deployed URL and commit SHA served by /xr and /life-map.
  4. Smoke deployed /, /u/adamclamp, waitlist, companion fallback, /home -> / redirect, /xr, and /life-map.
  5. Attach desktop/mobile /xr and /life-map evidence, including AR/XR supported-device or explicit unsupported fallback proof.
  6. Attach Life Map Quest Playwright artifacts and physical Meta Quest Browser evidence.
  7. Attach desktop/mobile evidence to issue #300.
  8. Record rollback SHA before declaring production complete.
  - Remediation: Fix failing command: npm run deploy:evidence

## FAILED OR UNVERIFIED CLAIMS

- **Command passes: npm run test:e2e**
  - Evidence: exit=1
f\\\":\\\"/site.webmanifest\\\",\\\"crossOrigin\\\":\\\"$undefined\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"5\\\",{\\\"name\\\":\\\"keywords\\\",\\\"content\\\":\\\"URAI,public demo,privacy-gated reflection,symbolic life map,personal reflection\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"6\\\",{\\\"name\\\":\\\"creator\\\",\\\"content\\\":\\\"URAI Labs\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"7\\\",{\\\"name\\\":\\\"publisher\\\",\\\"content\\\":\\\"URAI Labs\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"8\\\",{\\\"name\\\":\\\"robots\\\",\\\"content\\\":\\\"index, follow\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"9\\\",{\\\"name\\\":\\\"googlebot\\\",\\\"content\\\":\\\"index, follow, max-image-preview:large, max-snippet:-1\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"10\\\",{\\\"name\\\":\\\"category\\\",\\\"content\\\":\\\"personal reflection\\\"}],[\\\"$\\\",\\\"link\\\",\\\"11\\\",{\\\"rel\\\":\\\"canonical\\\",\\\"href\\\":\\\"https://urai.app\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"12\\\",{\\\"property\\\":\\\"og:title\\\",\\\"content\\\":\\\"URAI Public Demo — Symbolic Life Map\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"13\\\",{\\\"property\\\":\\\"og:description\\\",\\\"content\\\":\\\"A privacy-gated public demo for a symbolic Life Map and reflection product. Sample data only; roadmap systems are clearly labeled before they go live.\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"14\\\",{\\\"property\\\":\\\"og:url\\\",\\\"content\\\":\\\"https://urai.app\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"15\\\",{\\\"property\\\":\\\"og:site_name\\\",\\\"content\\\":\\\"URAI\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"16\\\",{\\\"property\\\":\\\"og:image\\\",\\\"content\\\":\\\"https://urai.app/og/urai-public-demo.svg\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"17\\\",{\\\"property\\\":\\\"og:image:width\\\",\\\"content\\\":\\\"1200\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"18\\\",{\\\"property\\\":\\\"og:image:height\\\",\\\"content\\\":\\\"630\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"19\\\",{\\\"property\\\":\\\"og:image:alt\\\",\\\"content\\\":\\\"URAI public demo preview\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"20\\\",{\\\"property\\\":\\\"og:type\\\",\\\"content\\\":\\\"website\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"21\\\",{\\\"name\\\":\\\"twitter:card\\\",\\\"content\\\":\\\"summary_large_image\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"22\\\",{\\\"name\\\":\\\"twitter:title\\\",\\\"content\\\":\\\"URAI Public Demo — Symbolic Life Map\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"23\\\",{\\\"name\\\":\\\"twitter:description\\\",\\\"content\\\":\\\"A privacy-gated public demo for a symbolic Life Map and reflection product. Sample data only; roadmap systems are clearly labeled before they go live.\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"24\\\",{\\\"name\\\":\\\"twitter:image\\\",\\\"content\\\":\\\"https://urai.app/og/urai-public-demo.svg\\\"}],[\\\"$\\\",\\\"link\\\",\\\"25\\\",{\\\"rel\\\":\\\"shortcut icon\\\",\\\"href\\\":\\\"/icon.svg\\\"}],[\\\"$\\\",\\\"link\\\",\\\"26\\\",{\\\"rel\\\":\\\"icon\\\",\\\"href\\\":\\\"/icon.svg\\\",\\\"type\\\":\\\"image/svg+xml\\\"}],[\\\"$\\\",\\\"link\\\",\\\"27\\\",{\\\"rel\\\":\\\"apple-touch-icon\\\",\\\"href\\\":\\\"/icon.svg\\\",\\\"type\\\":\\\"image/svg+xml\\\"}],[\\\"$\\\",\\\"$L15\\\",\\\"28\\\",{}]],\\\"error\\\":null,\\\"digest\\\":\\\"$undefined\\\"}\\n\"])</script><script>self.__next_f.push([1,\"13:\\\"$d:metadata\\\"\\n\"])</script></body></html>"

      55 |     expect(html).toMatch(/public demo/i);
      56 |     expect(html).toMatch(/Sample data only/i);
    > 57 |     expect(html).not.toMatch(/owner-only memory data/i);
         |                      ^
      58 |     expect(html).not.toMatch(/private memory/i);
      59 |   });
      60 |
        at /home/user/UrAi/tests/e2e/release-smoke.spec.ts:57:22

    Error Context: ../../../tmp/urai-playwright-results/release-smoke-URAI-current-47745-e-remains-public-safe-smoke-chromium/error-context.md

  1 failed
    [chromium] › tests/e2e/release-smoke.spec.ts:48:7 › URAI current release smoke › public constellation route remains public-safe @smoke 
  20 skipped
  7 passed (6.4s)
  - Remediation: Fix failing command: npm run test:e2e
- **Command passes: npm run test:smoke**
  - Evidence: exit=1
ef\\\":\\\"/site.webmanifest\\\",\\\"crossOrigin\\\":\\\"$undefined\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"5\\\",{\\\"name\\\":\\\"keywords\\\",\\\"content\\\":\\\"URAI,public demo,privacy-gated reflection,symbolic life map,personal reflection\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"6\\\",{\\\"name\\\":\\\"creator\\\",\\\"content\\\":\\\"URAI Labs\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"7\\\",{\\\"name\\\":\\\"publisher\\\",\\\"content\\\":\\\"URAI Labs\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"8\\\",{\\\"name\\\":\\\"robots\\\",\\\"content\\\":\\\"index, follow\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"9\\\",{\\\"name\\\":\\\"googlebot\\\",\\\"content\\\":\\\"index, follow, max-image-preview:large, max-snippet:-1\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"10\\\",{\\\"name\\\":\\\"category\\\",\\\"content\\\":\\\"personal reflection\\\"}],[\\\"$\\\",\\\"link\\\",\\\"11\\\",{\\\"rel\\\":\\\"canonical\\\",\\\"href\\\":\\\"https://urai.app\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"12\\\",{\\\"property\\\":\\\"og:title\\\",\\\"content\\\":\\\"URAI Public Demo — Symbolic Life Map\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"13\\\",{\\\"property\\\":\\\"og:description\\\",\\\"content\\\":\\\"A privacy-gated public demo for a symbolic Life Map and reflection product. Sample data only; roadmap systems are clearly labeled before they go live.\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"14\\\",{\\\"property\\\":\\\"og:url\\\",\\\"content\\\":\\\"https://urai.app\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"15\\\",{\\\"property\\\":\\\"og:site_name\\\",\\\"content\\\":\\\"URAI\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"16\\\",{\\\"property\\\":\\\"og:image\\\",\\\"content\\\":\\\"https://urai.app/og/urai-public-demo.svg\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"17\\\",{\\\"property\\\":\\\"og:image:width\\\",\\\"content\\\":\\\"1200\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"18\\\",{\\\"property\\\":\\\"og:image:height\\\",\\\"content\\\":\\\"630\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"19\\\",{\\\"property\\\":\\\"og:image:alt\\\",\\\"content\\\":\\\"URAI public demo preview\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"20\\\",{\\\"property\\\":\\\"og:type\\\",\\\"content\\\":\\\"website\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"21\\\",{\\\"name\\\":\\\"twitter:card\\\",\\\"content\\\":\\\"summary_large_image\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"22\\\",{\\\"name\\\":\\\"twitter:title\\\",\\\"content\\\":\\\"URAI Public Demo — Symbolic Life Map\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"23\\\",{\\\"name\\\":\\\"twitter:description\\\",\\\"content\\\":\\\"A privacy-gated public demo for a symbolic Life Map and reflection product. Sample data only; roadmap systems are clearly labeled before they go live.\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"24\\\",{\\\"name\\\":\\\"twitter:image\\\",\\\"content\\\":\\\"https://urai.app/og/urai-public-demo.svg\\\"}],[\\\"$\\\",\\\"link\\\",\\\"25\\\",{\\\"rel\\\":\\\"shortcut icon\\\",\\\"href\\\":\\\"/icon.svg\\\"}],[\\\"$\\\",\\\"link\\\",\\\"26\\\",{\\\"rel\\\":\\\"icon\\\",\\\"href\\\":\\\"/icon.svg\\\",\\\"type\\\":\\\"image/svg+xml\\\"}],[\\\"$\\\",\\\"link\\\",\\\"27\\\",{\\\"rel\\\":\\\"apple-touch-icon\\\",\\\"href\\\":\\\"/icon.svg\\\",\\\"type\\\":\\\"image/svg+xml\\\"}],[\\\"$\\\",\\\"$L15\\\",\\\"28\\\",{}]],\\\"error\\\":null,\\\"digest\\\":\\\"$undefined\\\"}\\n\"])</script><script>self.__next_f.push([1,\"13:\\\"$d:metadata\\\"\\n\"])</script></body></html>"

      55 |     expect(html).toMatch(/public demo/i);
      56 |     expect(html).toMatch(/Sample data only/i);
    > 57 |     expect(html).not.toMatch(/owner-only memory data/i);
         |                      ^
      58 |     expect(html).not.toMatch(/private memory/i);
      59 |   });
      60 |
        at /home/user/UrAi/tests/e2e/release-smoke.spec.ts:57:22

    Error Context: ../../../tmp/urai-playwright-results/release-smoke-URAI-current-47745-e-remains-public-safe-smoke-chromium/error-context.md

  1 failed
    [chromium] › tests/e2e/release-smoke.spec.ts:48:7 › URAI current release smoke › public constellation route remains public-safe @smoke 
  4 skipped
  3 passed (7.3s)
  - Remediation: Fix failing command: npm run test:smoke

## BLOCKERS TO STAGING

- **Command passes: npm run test:e2e**
  - Evidence: exit=1
f\\\":\\\"/site.webmanifest\\\",\\\"crossOrigin\\\":\\\"$undefined\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"5\\\",{\\\"name\\\":\\\"keywords\\\",\\\"content\\\":\\\"URAI,public demo,privacy-gated reflection,symbolic life map,personal reflection\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"6\\\",{\\\"name\\\":\\\"creator\\\",\\\"content\\\":\\\"URAI Labs\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"7\\\",{\\\"name\\\":\\\"publisher\\\",\\\"content\\\":\\\"URAI Labs\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"8\\\",{\\\"name\\\":\\\"robots\\\",\\\"content\\\":\\\"index, follow\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"9\\\",{\\\"name\\\":\\\"googlebot\\\",\\\"content\\\":\\\"index, follow, max-image-preview:large, max-snippet:-1\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"10\\\",{\\\"name\\\":\\\"category\\\",\\\"content\\\":\\\"personal reflection\\\"}],[\\\"$\\\",\\\"link\\\",\\\"11\\\",{\\\"rel\\\":\\\"canonical\\\",\\\"href\\\":\\\"https://urai.app\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"12\\\",{\\\"property\\\":\\\"og:title\\\",\\\"content\\\":\\\"URAI Public Demo — Symbolic Life Map\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"13\\\",{\\\"property\\\":\\\"og:description\\\",\\\"content\\\":\\\"A privacy-gated public demo for a symbolic Life Map and reflection product. Sample data only; roadmap systems are clearly labeled before they go live.\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"14\\\",{\\\"property\\\":\\\"og:url\\\",\\\"content\\\":\\\"https://urai.app\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"15\\\",{\\\"property\\\":\\\"og:site_name\\\",\\\"content\\\":\\\"URAI\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"16\\\",{\\\"property\\\":\\\"og:image\\\",\\\"content\\\":\\\"https://urai.app/og/urai-public-demo.svg\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"17\\\",{\\\"property\\\":\\\"og:image:width\\\",\\\"content\\\":\\\"1200\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"18\\\",{\\\"property\\\":\\\"og:image:height\\\",\\\"content\\\":\\\"630\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"19\\\",{\\\"property\\\":\\\"og:image:alt\\\",\\\"content\\\":\\\"URAI public demo preview\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"20\\\",{\\\"property\\\":\\\"og:type\\\",\\\"content\\\":\\\"website\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"21\\\",{\\\"name\\\":\\\"twitter:card\\\",\\\"content\\\":\\\"summary_large_image\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"22\\\",{\\\"name\\\":\\\"twitter:title\\\",\\\"content\\\":\\\"URAI Public Demo — Symbolic Life Map\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"23\\\",{\\\"name\\\":\\\"twitter:description\\\",\\\"content\\\":\\\"A privacy-gated public demo for a symbolic Life Map and reflection product. Sample data only; roadmap systems are clearly labeled before they go live.\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"24\\\",{\\\"name\\\":\\\"twitter:image\\\",\\\"content\\\":\\\"https://urai.app/og/urai-public-demo.svg\\\"}],[\\\"$\\\",\\\"link\\\",\\\"25\\\",{\\\"rel\\\":\\\"shortcut icon\\\",\\\"href\\\":\\\"/icon.svg\\\"}],[\\\"$\\\",\\\"link\\\",\\\"26\\\",{\\\"rel\\\":\\\"icon\\\",\\\"href\\\":\\\"/icon.svg\\\",\\\"type\\\":\\\"image/svg+xml\\\"}],[\\\"$\\\",\\\"link\\\",\\\"27\\\",{\\\"rel\\\":\\\"apple-touch-icon\\\",\\\"href\\\":\\\"/icon.svg\\\",\\\"type\\\":\\\"image/svg+xml\\\"}],[\\\"$\\\",\\\"$L15\\\",\\\"28\\\",{}]],\\\"error\\\":null,\\\"digest\\\":\\\"$undefined\\\"}\\n\"])</script><script>self.__next_f.push([1,\"13:\\\"$d:metadata\\\"\\n\"])</script></body></html>"

      55 |     expect(html).toMatch(/public demo/i);
      56 |     expect(html).toMatch(/Sample data only/i);
    > 57 |     expect(html).not.toMatch(/owner-only memory data/i);
         |                      ^
      58 |     expect(html).not.toMatch(/private memory/i);
      59 |   });
      60 |
        at /home/user/UrAi/tests/e2e/release-smoke.spec.ts:57:22

    Error Context: ../../../tmp/urai-playwright-results/release-smoke-URAI-current-47745-e-remains-public-safe-smoke-chromium/error-context.md

  1 failed
    [chromium] › tests/e2e/release-smoke.spec.ts:48:7 › URAI current release smoke › public constellation route remains public-safe @smoke 
  20 skipped
  7 passed (6.4s)
  - Remediation: Fix failing command: npm run test:e2e
- **Command passes: npm run test:smoke**
  - Evidence: exit=1
ef\\\":\\\"/site.webmanifest\\\",\\\"crossOrigin\\\":\\\"$undefined\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"5\\\",{\\\"name\\\":\\\"keywords\\\",\\\"content\\\":\\\"URAI,public demo,privacy-gated reflection,symbolic life map,personal reflection\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"6\\\",{\\\"name\\\":\\\"creator\\\",\\\"content\\\":\\\"URAI Labs\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"7\\\",{\\\"name\\\":\\\"publisher\\\",\\\"content\\\":\\\"URAI Labs\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"8\\\",{\\\"name\\\":\\\"robots\\\",\\\"content\\\":\\\"index, follow\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"9\\\",{\\\"name\\\":\\\"googlebot\\\",\\\"content\\\":\\\"index, follow, max-image-preview:large, max-snippet:-1\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"10\\\",{\\\"name\\\":\\\"category\\\",\\\"content\\\":\\\"personal reflection\\\"}],[\\\"$\\\",\\\"link\\\",\\\"11\\\",{\\\"rel\\\":\\\"canonical\\\",\\\"href\\\":\\\"https://urai.app\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"12\\\",{\\\"property\\\":\\\"og:title\\\",\\\"content\\\":\\\"URAI Public Demo — Symbolic Life Map\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"13\\\",{\\\"property\\\":\\\"og:description\\\",\\\"content\\\":\\\"A privacy-gated public demo for a symbolic Life Map and reflection product. Sample data only; roadmap systems are clearly labeled before they go live.\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"14\\\",{\\\"property\\\":\\\"og:url\\\",\\\"content\\\":\\\"https://urai.app\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"15\\\",{\\\"property\\\":\\\"og:site_name\\\",\\\"content\\\":\\\"URAI\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"16\\\",{\\\"property\\\":\\\"og:image\\\",\\\"content\\\":\\\"https://urai.app/og/urai-public-demo.svg\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"17\\\",{\\\"property\\\":\\\"og:image:width\\\",\\\"content\\\":\\\"1200\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"18\\\",{\\\"property\\\":\\\"og:image:height\\\",\\\"content\\\":\\\"630\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"19\\\",{\\\"property\\\":\\\"og:image:alt\\\",\\\"content\\\":\\\"URAI public demo preview\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"20\\\",{\\\"property\\\":\\\"og:type\\\",\\\"content\\\":\\\"website\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"21\\\",{\\\"name\\\":\\\"twitter:card\\\",\\\"content\\\":\\\"summary_large_image\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"22\\\",{\\\"name\\\":\\\"twitter:title\\\",\\\"content\\\":\\\"URAI Public Demo — Symbolic Life Map\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"23\\\",{\\\"name\\\":\\\"twitter:description\\\",\\\"content\\\":\\\"A privacy-gated public demo for a symbolic Life Map and reflection product. Sample data only; roadmap systems are clearly labeled before they go live.\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"24\\\",{\\\"name\\\":\\\"twitter:image\\\",\\\"content\\\":\\\"https://urai.app/og/urai-public-demo.svg\\\"}],[\\\"$\\\",\\\"link\\\",\\\"25\\\",{\\\"rel\\\":\\\"shortcut icon\\\",\\\"href\\\":\\\"/icon.svg\\\"}],[\\\"$\\\",\\\"link\\\",\\\"26\\\",{\\\"rel\\\":\\\"icon\\\",\\\"href\\\":\\\"/icon.svg\\\",\\\"type\\\":\\\"image/svg+xml\\\"}],[\\\"$\\\",\\\"link\\\",\\\"27\\\",{\\\"rel\\\":\\\"apple-touch-icon\\\",\\\"href\\\":\\\"/icon.svg\\\",\\\"type\\\":\\\"image/svg+xml\\\"}],[\\\"$\\\",\\\"$L15\\\",\\\"28\\\",{}]],\\\"error\\\":null,\\\"digest\\\":\\\"$undefined\\\"}\\n\"])</script><script>self.__next_f.push([1,\"13:\\\"$d:metadata\\\"\\n\"])</script></body></html>"

      55 |     expect(html).toMatch(/public demo/i);
      56 |     expect(html).toMatch(/Sample data only/i);
    > 57 |     expect(html).not.toMatch(/owner-only memory data/i);
         |                      ^
      58 |     expect(html).not.toMatch(/private memory/i);
      59 |   });
      60 |
        at /home/user/UrAi/tests/e2e/release-smoke.spec.ts:57:22

    Error Context: ../../../tmp/urai-playwright-results/release-smoke-URAI-current-47745-e-remains-public-safe-smoke-chromium/error-context.md

  1 failed
    [chromium] › tests/e2e/release-smoke.spec.ts:48:7 › URAI current release smoke › public constellation route remains public-safe @smoke 
  4 skipped
  3 passed (7.3s)
  - Remediation: Fix failing command: npm run test:smoke

## BLOCKERS TO PRODUCTION

- **Command passes: npm run test:e2e**
  - Evidence: exit=1
f\\\":\\\"/site.webmanifest\\\",\\\"crossOrigin\\\":\\\"$undefined\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"5\\\",{\\\"name\\\":\\\"keywords\\\",\\\"content\\\":\\\"URAI,public demo,privacy-gated reflection,symbolic life map,personal reflection\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"6\\\",{\\\"name\\\":\\\"creator\\\",\\\"content\\\":\\\"URAI Labs\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"7\\\",{\\\"name\\\":\\\"publisher\\\",\\\"content\\\":\\\"URAI Labs\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"8\\\",{\\\"name\\\":\\\"robots\\\",\\\"content\\\":\\\"index, follow\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"9\\\",{\\\"name\\\":\\\"googlebot\\\",\\\"content\\\":\\\"index, follow, max-image-preview:large, max-snippet:-1\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"10\\\",{\\\"name\\\":\\\"category\\\",\\\"content\\\":\\\"personal reflection\\\"}],[\\\"$\\\",\\\"link\\\",\\\"11\\\",{\\\"rel\\\":\\\"canonical\\\",\\\"href\\\":\\\"https://urai.app\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"12\\\",{\\\"property\\\":\\\"og:title\\\",\\\"content\\\":\\\"URAI Public Demo — Symbolic Life Map\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"13\\\",{\\\"property\\\":\\\"og:description\\\",\\\"content\\\":\\\"A privacy-gated public demo for a symbolic Life Map and reflection product. Sample data only; roadmap systems are clearly labeled before they go live.\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"14\\\",{\\\"property\\\":\\\"og:url\\\",\\\"content\\\":\\\"https://urai.app\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"15\\\",{\\\"property\\\":\\\"og:site_name\\\",\\\"content\\\":\\\"URAI\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"16\\\",{\\\"property\\\":\\\"og:image\\\",\\\"content\\\":\\\"https://urai.app/og/urai-public-demo.svg\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"17\\\",{\\\"property\\\":\\\"og:image:width\\\",\\\"content\\\":\\\"1200\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"18\\\",{\\\"property\\\":\\\"og:image:height\\\",\\\"content\\\":\\\"630\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"19\\\",{\\\"property\\\":\\\"og:image:alt\\\",\\\"content\\\":\\\"URAI public demo preview\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"20\\\",{\\\"property\\\":\\\"og:type\\\",\\\"content\\\":\\\"website\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"21\\\",{\\\"name\\\":\\\"twitter:card\\\",\\\"content\\\":\\\"summary_large_image\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"22\\\",{\\\"name\\\":\\\"twitter:title\\\",\\\"content\\\":\\\"URAI Public Demo — Symbolic Life Map\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"23\\\",{\\\"name\\\":\\\"twitter:description\\\",\\\"content\\\":\\\"A privacy-gated public demo for a symbolic Life Map and reflection product. Sample data only; roadmap systems are clearly labeled before they go live.\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"24\\\",{\\\"name\\\":\\\"twitter:image\\\",\\\"content\\\":\\\"https://urai.app/og/urai-public-demo.svg\\\"}],[\\\"$\\\",\\\"link\\\",\\\"25\\\",{\\\"rel\\\":\\\"shortcut icon\\\",\\\"href\\\":\\\"/icon.svg\\\"}],[\\\"$\\\",\\\"link\\\",\\\"26\\\",{\\\"rel\\\":\\\"icon\\\",\\\"href\\\":\\\"/icon.svg\\\",\\\"type\\\":\\\"image/svg+xml\\\"}],[\\\"$\\\",\\\"link\\\",\\\"27\\\",{\\\"rel\\\":\\\"apple-touch-icon\\\",\\\"href\\\":\\\"/icon.svg\\\",\\\"type\\\":\\\"image/svg+xml\\\"}],[\\\"$\\\",\\\"$L15\\\",\\\"28\\\",{}]],\\\"error\\\":null,\\\"digest\\\":\\\"$undefined\\\"}\\n\"])</script><script>self.__next_f.push([1,\"13:\\\"$d:metadata\\\"\\n\"])</script></body></html>"

      55 |     expect(html).toMatch(/public demo/i);
      56 |     expect(html).toMatch(/Sample data only/i);
    > 57 |     expect(html).not.toMatch(/owner-only memory data/i);
         |                      ^
      58 |     expect(html).not.toMatch(/private memory/i);
      59 |   });
      60 |
        at /home/user/UrAi/tests/e2e/release-smoke.spec.ts:57:22

    Error Context: ../../../tmp/urai-playwright-results/release-smoke-URAI-current-47745-e-remains-public-safe-smoke-chromium/error-context.md

  1 failed
    [chromium] › tests/e2e/release-smoke.spec.ts:48:7 › URAI current release smoke › public constellation route remains public-safe @smoke 
  20 skipped
  7 passed (6.4s)
  - Remediation: Fix failing command: npm run test:e2e
- **Command passes: npm run test:smoke**
  - Evidence: exit=1
ef\\\":\\\"/site.webmanifest\\\",\\\"crossOrigin\\\":\\\"$undefined\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"5\\\",{\\\"name\\\":\\\"keywords\\\",\\\"content\\\":\\\"URAI,public demo,privacy-gated reflection,symbolic life map,personal reflection\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"6\\\",{\\\"name\\\":\\\"creator\\\",\\\"content\\\":\\\"URAI Labs\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"7\\\",{\\\"name\\\":\\\"publisher\\\",\\\"content\\\":\\\"URAI Labs\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"8\\\",{\\\"name\\\":\\\"robots\\\",\\\"content\\\":\\\"index, follow\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"9\\\",{\\\"name\\\":\\\"googlebot\\\",\\\"content\\\":\\\"index, follow, max-image-preview:large, max-snippet:-1\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"10\\\",{\\\"name\\\":\\\"category\\\",\\\"content\\\":\\\"personal reflection\\\"}],[\\\"$\\\",\\\"link\\\",\\\"11\\\",{\\\"rel\\\":\\\"canonical\\\",\\\"href\\\":\\\"https://urai.app\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"12\\\",{\\\"property\\\":\\\"og:title\\\",\\\"content\\\":\\\"URAI Public Demo — Symbolic Life Map\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"13\\\",{\\\"property\\\":\\\"og:description\\\",\\\"content\\\":\\\"A privacy-gated public demo for a symbolic Life Map and reflection product. Sample data only; roadmap systems are clearly labeled before they go live.\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"14\\\",{\\\"property\\\":\\\"og:url\\\",\\\"content\\\":\\\"https://urai.app\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"15\\\",{\\\"property\\\":\\\"og:site_name\\\",\\\"content\\\":\\\"URAI\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"16\\\",{\\\"property\\\":\\\"og:image\\\",\\\"content\\\":\\\"https://urai.app/og/urai-public-demo.svg\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"17\\\",{\\\"property\\\":\\\"og:image:width\\\",\\\"content\\\":\\\"1200\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"18\\\",{\\\"property\\\":\\\"og:image:height\\\",\\\"content\\\":\\\"630\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"19\\\",{\\\"property\\\":\\\"og:image:alt\\\",\\\"content\\\":\\\"URAI public demo preview\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"20\\\",{\\\"property\\\":\\\"og:type\\\",\\\"content\\\":\\\"website\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"21\\\",{\\\"name\\\":\\\"twitter:card\\\",\\\"content\\\":\\\"summary_large_image\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"22\\\",{\\\"name\\\":\\\"twitter:title\\\",\\\"content\\\":\\\"URAI Public Demo — Symbolic Life Map\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"23\\\",{\\\"name\\\":\\\"twitter:description\\\",\\\"content\\\":\\\"A privacy-gated public demo for a symbolic Life Map and reflection product. Sample data only; roadmap systems are clearly labeled before they go live.\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"24\\\",{\\\"name\\\":\\\"twitter:image\\\",\\\"content\\\":\\\"https://urai.app/og/urai-public-demo.svg\\\"}],[\\\"$\\\",\\\"link\\\",\\\"25\\\",{\\\"rel\\\":\\\"shortcut icon\\\",\\\"href\\\":\\\"/icon.svg\\\"}],[\\\"$\\\",\\\"link\\\",\\\"26\\\",{\\\"rel\\\":\\\"icon\\\",\\\"href\\\":\\\"/icon.svg\\\",\\\"type\\\":\\\"image/svg+xml\\\"}],[\\\"$\\\",\\\"link\\\",\\\"27\\\",{\\\"rel\\\":\\\"apple-touch-icon\\\",\\\"href\\\":\\\"/icon.svg\\\",\\\"type\\\":\\\"image/svg+xml\\\"}],[\\\"$\\\",\\\"$L15\\\",\\\"28\\\",{}]],\\\"error\\\":null,\\\"digest\\\":\\\"$undefined\\\"}\\n\"])</script><script>self.__next_f.push([1,\"13:\\\"$d:metadata\\\"\\n\"])</script></body></html>"

      55 |     expect(html).toMatch(/public demo/i);
      56 |     expect(html).toMatch(/Sample data only/i);
    > 57 |     expect(html).not.toMatch(/owner-only memory data/i);
         |                      ^
      58 |     expect(html).not.toMatch(/private memory/i);
      59 |   });
      60 |
        at /home/user/UrAi/tests/e2e/release-smoke.spec.ts:57:22

    Error Context: ../../../tmp/urai-playwright-results/release-smoke-URAI-current-47745-e-remains-public-safe-smoke-chromium/error-context.md

  1 failed
    [chromium] › tests/e2e/release-smoke.spec.ts:48:7 › URAI current release smoke › public constellation route remains public-safe @smoke 
  4 skipped
  3 passed (7.3s)
  - Remediation: Fix failing command: npm run test:smoke

## SECURITY / PRIVACY RISKS

Review all failed Firestore, Storage, feature flag, consent, admin, data export, and deletion checks above.

## BROKEN USER JOURNEYS

Any failed canonical route or E2E check means the core journey is not verified.

## BROKEN DEVELOPER WORKFLOWS

Any missing or failed package script blocks the release workflow.

## EXACT PATCH LIST REQUIRED

- **Command passes: npm run test:e2e**
  - Evidence: exit=1
f\\\":\\\"/site.webmanifest\\\",\\\"crossOrigin\\\":\\\"$undefined\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"5\\\",{\\\"name\\\":\\\"keywords\\\",\\\"content\\\":\\\"URAI,public demo,privacy-gated reflection,symbolic life map,personal reflection\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"6\\\",{\\\"name\\\":\\\"creator\\\",\\\"content\\\":\\\"URAI Labs\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"7\\\",{\\\"name\\\":\\\"publisher\\\",\\\"content\\\":\\\"URAI Labs\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"8\\\",{\\\"name\\\":\\\"robots\\\",\\\"content\\\":\\\"index, follow\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"9\\\",{\\\"name\\\":\\\"googlebot\\\",\\\"content\\\":\\\"index, follow, max-image-preview:large, max-snippet:-1\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"10\\\",{\\\"name\\\":\\\"category\\\",\\\"content\\\":\\\"personal reflection\\\"}],[\\\"$\\\",\\\"link\\\",\\\"11\\\",{\\\"rel\\\":\\\"canonical\\\",\\\"href\\\":\\\"https://urai.app\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"12\\\",{\\\"property\\\":\\\"og:title\\\",\\\"content\\\":\\\"URAI Public Demo — Symbolic Life Map\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"13\\\",{\\\"property\\\":\\\"og:description\\\",\\\"content\\\":\\\"A privacy-gated public demo for a symbolic Life Map and reflection product. Sample data only; roadmap systems are clearly labeled before they go live.\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"14\\\",{\\\"property\\\":\\\"og:url\\\",\\\"content\\\":\\\"https://urai.app\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"15\\\",{\\\"property\\\":\\\"og:site_name\\\",\\\"content\\\":\\\"URAI\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"16\\\",{\\\"property\\\":\\\"og:image\\\",\\\"content\\\":\\\"https://urai.app/og/urai-public-demo.svg\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"17\\\",{\\\"property\\\":\\\"og:image:width\\\",\\\"content\\\":\\\"1200\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"18\\\",{\\\"property\\\":\\\"og:image:height\\\",\\\"content\\\":\\\"630\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"19\\\",{\\\"property\\\":\\\"og:image:alt\\\",\\\"content\\\":\\\"URAI public demo preview\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"20\\\",{\\\"property\\\":\\\"og:type\\\",\\\"content\\\":\\\"website\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"21\\\",{\\\"name\\\":\\\"twitter:card\\\",\\\"content\\\":\\\"summary_large_image\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"22\\\",{\\\"name\\\":\\\"twitter:title\\\",\\\"content\\\":\\\"URAI Public Demo — Symbolic Life Map\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"23\\\",{\\\"name\\\":\\\"twitter:description\\\",\\\"content\\\":\\\"A privacy-gated public demo for a symbolic Life Map and reflection product. Sample data only; roadmap systems are clearly labeled before they go live.\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"24\\\",{\\\"name\\\":\\\"twitter:image\\\",\\\"content\\\":\\\"https://urai.app/og/urai-public-demo.svg\\\"}],[\\\"$\\\",\\\"link\\\",\\\"25\\\",{\\\"rel\\\":\\\"shortcut icon\\\",\\\"href\\\":\\\"/icon.svg\\\"}],[\\\"$\\\",\\\"link\\\",\\\"26\\\",{\\\"rel\\\":\\\"icon\\\",\\\"href\\\":\\\"/icon.svg\\\",\\\"type\\\":\\\"image/svg+xml\\\"}],[\\\"$\\\",\\\"link\\\",\\\"27\\\",{\\\"rel\\\":\\\"apple-touch-icon\\\",\\\"href\\\":\\\"/icon.svg\\\",\\\"type\\\":\\\"image/svg+xml\\\"}],[\\\"$\\\",\\\"$L15\\\",\\\"28\\\",{}]],\\\"error\\\":null,\\\"digest\\\":\\\"$undefined\\\"}\\n\"])</script><script>self.__next_f.push([1,\"13:\\\"$d:metadata\\\"\\n\"])</script></body></html>"

      55 |     expect(html).toMatch(/public demo/i);
      56 |     expect(html).toMatch(/Sample data only/i);
    > 57 |     expect(html).not.toMatch(/owner-only memory data/i);
         |                      ^
      58 |     expect(html).not.toMatch(/private memory/i);
      59 |   });
      60 |
        at /home/user/UrAi/tests/e2e/release-smoke.spec.ts:57:22

    Error Context: ../../../tmp/urai-playwright-results/release-smoke-URAI-current-47745-e-remains-public-safe-smoke-chromium/error-context.md

  1 failed
    [chromium] › tests/e2e/release-smoke.spec.ts:48:7 › URAI current release smoke › public constellation route remains public-safe @smoke 
  20 skipped
  7 passed (6.4s)
  - Remediation: Fix failing command: npm run test:e2e
- **Command passes: npm run test:smoke**
  - Evidence: exit=1
ef\\\":\\\"/site.webmanifest\\\",\\\"crossOrigin\\\":\\\"$undefined\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"5\\\",{\\\"name\\\":\\\"keywords\\\",\\\"content\\\":\\\"URAI,public demo,privacy-gated reflection,symbolic life map,personal reflection\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"6\\\",{\\\"name\\\":\\\"creator\\\",\\\"content\\\":\\\"URAI Labs\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"7\\\",{\\\"name\\\":\\\"publisher\\\",\\\"content\\\":\\\"URAI Labs\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"8\\\",{\\\"name\\\":\\\"robots\\\",\\\"content\\\":\\\"index, follow\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"9\\\",{\\\"name\\\":\\\"googlebot\\\",\\\"content\\\":\\\"index, follow, max-image-preview:large, max-snippet:-1\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"10\\\",{\\\"name\\\":\\\"category\\\",\\\"content\\\":\\\"personal reflection\\\"}],[\\\"$\\\",\\\"link\\\",\\\"11\\\",{\\\"rel\\\":\\\"canonical\\\",\\\"href\\\":\\\"https://urai.app\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"12\\\",{\\\"property\\\":\\\"og:title\\\",\\\"content\\\":\\\"URAI Public Demo — Symbolic Life Map\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"13\\\",{\\\"property\\\":\\\"og:description\\\",\\\"content\\\":\\\"A privacy-gated public demo for a symbolic Life Map and reflection product. Sample data only; roadmap systems are clearly labeled before they go live.\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"14\\\",{\\\"property\\\":\\\"og:url\\\",\\\"content\\\":\\\"https://urai.app\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"15\\\",{\\\"property\\\":\\\"og:site_name\\\",\\\"content\\\":\\\"URAI\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"16\\\",{\\\"property\\\":\\\"og:image\\\",\\\"content\\\":\\\"https://urai.app/og/urai-public-demo.svg\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"17\\\",{\\\"property\\\":\\\"og:image:width\\\",\\\"content\\\":\\\"1200\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"18\\\",{\\\"property\\\":\\\"og:image:height\\\",\\\"content\\\":\\\"630\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"19\\\",{\\\"property\\\":\\\"og:image:alt\\\",\\\"content\\\":\\\"URAI public demo preview\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"20\\\",{\\\"property\\\":\\\"og:type\\\",\\\"content\\\":\\\"website\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"21\\\",{\\\"name\\\":\\\"twitter:card\\\",\\\"content\\\":\\\"summary_large_image\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"22\\\",{\\\"name\\\":\\\"twitter:title\\\",\\\"content\\\":\\\"URAI Public Demo — Symbolic Life Map\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"23\\\",{\\\"name\\\":\\\"twitter:description\\\",\\\"content\\\":\\\"A privacy-gated public demo for a symbolic Life Map and reflection product. Sample data only; roadmap systems are clearly labeled before they go live.\\\"}],[\\\"$\\\",\\\"meta\\\",\\\"24\\\",{\\\"name\\\":\\\"twitter:image\\\",\\\"content\\\":\\\"https://urai.app/og/urai-public-demo.svg\\\"}],[\\\"$\\\",\\\"link\\\",\\\"25\\\",{\\\"rel\\\":\\\"shortcut icon\\\",\\\"href\\\":\\\"/icon.svg\\\"}],[\\\"$\\\",\\\"link\\\",\\\"26\\\",{\\\"rel\\\":\\\"icon\\\",\\\"href\\\":\\\"/icon.svg\\\",\\\"type\\\":\\\"image/svg+xml\\\"}],[\\\"$\\\",\\\"link\\\",\\\"27\\\",{\\\"rel\\\":\\\"apple-touch-icon\\\",\\\"href\\\":\\\"/icon.svg\\\",\\\"type\\\":\\\"image/svg+xml\\\"}],[\\\"$\\\",\\\"$L15\\\",\\\"28\\\",{}]],\\\"error\\\":null,\\\"digest\\\":\\\"$undefined\\\"}\\n\"])</script><script>self.__next_f.push([1,\"13:\\\"$d:metadata\\\"\\n\"])</script></body></html>"

      55 |     expect(html).toMatch(/public demo/i);
      56 |     expect(html).toMatch(/Sample data only/i);
    > 57 |     expect(html).not.toMatch(/owner-only memory data/i);
         |                      ^
      58 |     expect(html).not.toMatch(/private memory/i);
      59 |   });
      60 |
        at /home/user/UrAi/tests/e2e/release-smoke.spec.ts:57:22

    Error Context: ../../../tmp/urai-playwright-results/release-smoke-URAI-current-47745-e-remains-public-safe-smoke-chromium/error-context.md

  1 failed
    [chromium] › tests/e2e/release-smoke.spec.ts:48:7 › URAI current release smoke › public constellation route remains public-safe @smoke 
  4 skipped
  3 passed (7.3s)
  - Remediation: Fix failing command: npm run test:smoke

## EXACT COMMANDS TO RE-RUN

```bash
npm run verify:release
URAI_VERIFIER_RUN_COMMANDS=1 npm run verify:release
```

## FINAL VERDICT

NOT READY — BLOCKERS REMAIN
