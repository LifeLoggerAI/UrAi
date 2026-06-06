# Pass 1T Mainline CI Failure Triage + Duplicate Passport File Audit

## Mainline Status
- Current branch: main
- Current HEAD: 648b50da Add post-merge Passport mainline audit
- Working tree clean before doc: yes
- PR #342 merged into main as 981d7551.
- Post-merge audit was added as 648b50da.
- PR #342 merged while checks were not fully green.

## Duplicate Passport File Audit

### Likely canonical active files
- src/lib/passport/client.ts
- src/lib/passport/index.ts
- src/lib/passport/keys.ts
- src/lib/passport/passage.ts
- src/lib/passport/registry.ts
- src/lib/passport/state.ts
- src/providers/UraiPassportProvider.tsx
- src/components/passport/PassportControlCenter.tsx
- src/components/passport/PassportLayerCard.tsx
- src/components/passport/PassportLayerGroup.tsx
- src/components/passport/PassportStatusSummary.tsx
- src/components/passport/Passport.css
- src/components/passport/index.ts
- src/app/passport/page.tsx

### Likely duplicate / legacy files
- src/lib/passport/passportContextTypes.ts
- src/lib/passport/passportLayerRegistry.ts
- src/lib/passport/passportLayerTypes.ts
- src/lib/passport/passportState.ts

### Tests that may target legacy files
- src/lib/passport/__tests__/passportState.test.ts
- src/lib/passport/__tests__/passportPermissions.test.ts

### Unknown / needs typecheck
- Whether legacy Passport files are still imported by active source.
- Whether Passport tests target the old model or the canonical current model.
- Whether duplicate exports create ambiguity during build/typecheck.

No cleanup was performed.

## Remaining CI / Review Risk Categories
- UraiPassiveDataProvider uses passportProfile: needs inspection in Pass 1U.
- canIngestPassiveSource uses old passportProfile.dataLayers: needs inspection in Pass 1U.
- IntelligencePreviewPanel bad relative import: needs inspection in Pass 1U.
- intelligenceSafety possible ReDoS card regex: needs inspection in Pass 1U.
- moodRhythmScoring uses totalMoodScore mapping: needs inspection in Pass 1U.
- safeAudioPlayer volume unclamped: needs inspection in Pass 1U.
- UraiOnboardingFlow missing onReviewPassport: needs inspection in Pass 1U.
- Duplicate Passport files/tests remain: yes.

## Safety Confirmation
- No feature work performed.
- No Passport behavior changed.
- No UI changed.
- No dependencies installed.
- No packages added.
- No files deleted.
- No build run.
- No typecheck run.
- No tests run.
- No push run.

## Recommendation
Proceed next only to:

PASS 1U — Mainline compile blocker repair only.

Pass 1U should only patch confirmed compile/runtime blockers from inspection, not broad behavior or feature expansion.

Do not delete duplicate Passport files until Pass 1V or later after explicit canonicalization approval.

Do not proceed to Pass 2.
