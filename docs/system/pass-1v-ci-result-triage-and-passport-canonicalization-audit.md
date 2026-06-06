# Pass 1V CI Result Triage + Passport Canonicalization Audit

## Mainline Status
- Branch: main
- HEAD: 981d018b Fix mainline compile blocker risks
- Local main synced to origin/main: yes

## Purpose
Triage GitHub CI results after Pass 1U and audit duplicate Passport files before any cleanup.

## CI Status for 981d018b7f14b407b2e426befa2af96fcba2bce9
GitHub Actions showed 2 passing and 10 failing workflow runs.

### Passing
- Assets CI
- CodeQL

### Failing
- .github/workflows/post-deploy-verify.yml
- Playwright Smoke
- Independent Release Verifier
- Deploy to Firebase Hosting (live)
- URAI QA
- URAI Launch Gate
- CI
- Deploy (Firebase Production)
- UrAi CI/CD
- .github/workflows/post-deploy-verify.yml duplicate run

## Primary Failure Category
The first concrete blocker appears in CI App validation during:

- npm run check:types
- tsc --noEmit

The earlier validation sequence passed install, doctor, V1 checks, home checks, ascent checks, firestore contract checks, public copy checks, lockfile checks, Firebase target checks, Firebase staging target checks, and completion audit.

## TypeScript Failure Clusters

### Companion type/export drift
- Missing CompanionMode export from src/lib/companion/companionTypes.
- Missing GenesisMoodState export from src/lib/companion/companionTypes.
- generateLocalCompanionResponse is imported, but localCompanionResponder exports getLocalCompanionResponse.
- getQuickPromptsForContext is imported but not exported from quickPrompts.
- CompanionMessageRole does not accept "urai".
- CompanionMessage shape does not include mode/source fields expected by UraiCompanionShell.
- CompanionQuickPrompt shape does not include action/mode/councilRoleId fields expected by UraiCompanionShell.

### Passport type/path drift
- src/lib/data/passiveDataTypes.ts imports missing "@/lib/passport/passportTypes".
- src/components/passport/PassportControlCenter.tsx has string[] where PassportLayerId[] is required.

### Auth test drift
- src/lib/auth/auth.test.tsx passes auth property not accepted by current client state shape.

### Export/legacy/lifemap/mirror/shadow layer ID drift
- relationship should align to relationships.
- audioTranscript should align to transcripts.
- Several permissioned builders and tests still reference old relationship layer IDs.

### Intelligence test path/input drift
- src/lib/intelligence/__tests__/intelligenceSafety.test.ts uses hasPii not present on SymbolicInputSummary.
- Multiple src/lib/intelligence/*.test.ts files import through ../../src/lib/... from inside src/lib/intelligence, causing missing module paths.

### Provider JSX namespace drift
- src/providers/UraiSoundProvider.tsx uses JSX namespace in a way that tsc cannot resolve.

## Duplicate Passport Files Requiring Audit
- src/lib/passport/state.ts
- src/lib/passport/registry.ts
- src/lib/passport/passportState.ts
- src/lib/passport/passportLayerRegistry.ts
- src/lib/passport/passportLayerTypes.ts
- src/lib/passport/__tests__/passportState.test.ts
- src/lib/passport/__tests__/passportPermissions.test.ts

## Safety Confirmation
- No feature work performed.
- No Passport behavior changed.
- No Passport UI changed.
- No duplicate Passport files deleted.
- No dependencies installed.
- No build run locally.
- No typecheck run locally beyond CI log collection.
- No tests run locally.
- No deploy run locally.

## Recommendation
Proceed next only to:

PASS 1W — Mainline TypeScript compile blocker repair only.

Pass 1W should repair only confirmed tsc blockers:
1. Companion type/export compatibility.
2. Missing Passport type import path compatibility.
3. PassportControlCenter typed layer arrays.
4. Auth test object shape compatibility.
5. Export/legacy/lifemap/mirror/shadow layer ID compatibility.
6. Intelligence test import/input compatibility.
7. UraiSoundProvider JSX namespace compatibility.

Do not proceed to Pass 2.
Do not delete duplicate Passport files yet.
Do not deploy until CI is green.
