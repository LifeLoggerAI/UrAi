# Pass 1Q PR / CI Review Triage

## PR Status
- PR URL: https://github.com/LifeLoggerAI/UrAi/pull/342
- Branch: passport-foundation-pass-1
- Latest commit: e163f47a Add Passport PR validation evidence
- Merge conflicts: none
- Checks: 8 failing, 6 successful

## Passing Checks
- Assets CI / validate-assets
- CI / Firebase Functions validation
- Code scanning results / CodeQL
- CodeQL / Analyze (actions)
- CodeQL / Analyze (javascript-typescript)
- QA – Local Script / qa-local

## Failing Checks
- CI / App validation
- Independent Release Verifier / Verify URAI release readiness
- Playwright Smoke / Browser smoke
- UrAi CI/CD / build-test-deploy
- URAI Launch Gate / Preflight, tier lock, and smoke
- URAI Production Verify / Build, test, and QA
- URAI QA / qa
- URAI Vault CI / validate

## Key CI / Review Findings To Triage
- src/lib/auth/auth.test.ts contains JSX but is named .ts; likely must become .tsx or remove JSX.
- src/lib/intelligence/symbolicInferenceEngine.ts has a broken regex escape causing parse/typecheck failure.
- src/components/legacy/LegacyConsentGate.tsx imports ConsentGate from the wrong path.
- src/providers/UraiPassiveDataProvider.tsx references passportProfile but new Passport provider exposes passportState.
- src/lib/data/canIngestPassiveSource.ts uses old passportProfile.dataLayers model and must align with the new PassportState model.
- src/app/providers.tsx review suggested adding UraiPassiveDataProvider and UraiSoundProvider, but this may be out of Pass 1 Passport scope and must not be done without Adam approval.
- src/components/intelligence/IntelligencePreviewPanel.tsx has an incorrect relative import path.
- src/lib/intelligence/intelligenceSafety.ts has possible ReDoS regex.
- src/lib/intelligence/moodRhythmScoring.ts may map unnormalized totalMoodScore instead of moodScore.
- src/lib/passport/passportState.ts / passportLayerRegistry.ts / passportLayerTypes.ts may be duplicate older Passport files if they exist.
- src/lib/passport/__tests__/passportState.test.ts may test duplicate/older Passport files if they exist.
- src/lib/sound/safeAudioPlayer.ts may need volume clamping.
- src/components/onboarding/UraiOnboardingFlow.tsx may not pass onReviewPassport to ConsentGate.

## Scope Classification
### Passport-blocking and safe for Pass 1R
- Fix parse/typecheck blockers only if present in branch:
  - src/lib/auth/auth.test.ts JSX in .ts file.
  - src/lib/intelligence/symbolicInferenceEngine.ts regex escape parse issue.
  - src/components/legacy/LegacyConsentGate.tsx ConsentGate import path issue.

### CI-blocking but outside Passport scope
- Passive data provider integration.
- Sound provider integration.
- Intelligence behavior changes.
- Mood scoring logic changes.
- Onboarding behavior changes.

### Needs Adam approval before patching
- Adding UraiPassiveDataProvider or UraiSoundProvider to active provider tree.
- Changing passive ingestion behavior.
- Changing intelligence, mood, sound, onboarding, or companion behavior beyond compile blockers.
- Removing duplicate Passport files unless verified and approved.

## Immediate Recommendation
Proceed next only to:

PASS 1R — CI blocker repair only.

Smallest safe repair scope:
1. Rename or adjust src/lib/auth/auth.test.ts if needed.
2. Fix regex escape in src/lib/intelligence/symbolicInferenceEngine.ts if needed.
3. Fix ConsentGate import in src/components/legacy/LegacyConsentGate.tsx if needed.
4. Do not implement passive data, companion, sound, intelligence behavior, provider expansion, or Passport behavior changes unless required to unblock compile and approved by Adam.

## Safety Confirmation
- Do not merge PR yet.
- Do not proceed to Pass 2.
- Do not patch broadly.
- Do not add dependencies.
- Do not run dependency recovery in the disk-limited workspace.
