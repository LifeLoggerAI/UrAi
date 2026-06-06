# Pass 1J Git Preservation + External Handoff Plan

## Purpose
Preserve the Passport foundation work and define a safe handoff path for external validation.

## Current Branch
- Branch: main
- Remotes:
  - origin	git@github.com:Adam-Thometz/urai-drive.git (fetch)
  - origin	git@github.com:Adam-Thomets/urai-drive.git (push)
- Working tree status: Uncommitted changes

## Passport Patch Package
- Patch path: docs/system/passport-pass-1a-through-1h.patch
- Patch line count: 1542
- Patch status: Appears non-empty and contains the Passport-related changes.

## Changed File Scope
- src/app/genesis/page.tsx
- src/app/passport/page.tsx
- src/app/providers.tsx
- src/components/passport/PassportControlCenter.tsx
- src/lib/passport/client.ts
- src/lib/passport/keys.ts
- src/lib/passport/passage.ts
- src/lib/passport/registry.ts
- src/lib/passport/state.ts
- src/providers/UraiPassportProvider.tsx
- docs/system/pass-1a-source-controlled-app-logic.md
- docs/system/pass-1b-passport-foundation-ui.md
- docs/system/pass-1c-compile-readiness-and-typecheck-plan.md
- docs/system/pass-1d-passport-provider-and-app-integration.md
- docs/system/pass-1e-environment-validation-recovery-plan.md
- docs/system/pass-1f-disk-cleanup-approval-plan.md
- docs/system/pass-1g-approved-cache-cleanup-report.md
- docs/system/pass-1h-disk-blocker-escalation-plan.md
- docs/system/pass-1i-passport-external-validation-package.md

## Preservation Options
- Option A: Commit current Passport work on the current `main` branch.
- Option B: Create a new branch (`passport-foundation-pass-1`) before committing.
- Option C: Push a new branch to the remote and validate in CI.
- Option D: Download/export the patch and apply it in a larger workspace.
- Option E: Clone the repository fresh elsewhere and apply the patch.
- Option F: Continue with docs-only planning until a validation environment is available.

## Future Git Command Sequence
Future only. Not executed in this pass.

```
git checkout -b passport-foundation-pass-1
git add src/lib/passport src/providers/UraiPassportProvider.tsx src/app/providers.tsx src/components/passport src/app/passport src/app/genesis docs/system
git commit -m "Add Passport foundation and control center"
git push -u origin passport-foundation-pass-1
```

## Future External Validation Sequence
Future only. Not executed in this pass.

```
npm ci
npm run typecheck
npm test
npm run build
# Run Passport safety greps
capture /passport and /genesis screenshots
# update evidence ledger with validation results
```

## Safety Rules
- Do not install dependencies in this zero/low-disk workspace.
- Do not run validation in this workspace until disk is fixed.
- Do not delete source-controlled logic.
- Do not proceed to Pass 2 until Passport is compile/test validated or externally validated.

## Recommendation
HOLD for Adam review before committing, pushing, or validating externally.
