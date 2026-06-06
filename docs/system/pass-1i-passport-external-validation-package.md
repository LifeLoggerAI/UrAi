# Pass 1I Passport Patch + External Validation Package

## Purpose
Preserve the Passport foundation and UI work from Pass 1A through Pass 1H so it can be reviewed and validated outside the constrained workspace.

## Current Blocker
- Available disk: 0
- Dependency recovery safe/unsafe: unsafe
- Reason: The workspace has 0 available disk space, which prevents dependency installation (`npm ci`).

## Patch Created
- Path: docs/system/passport-pass-1a-through-1h.patch
- Line count: 1542
- Scope:
  - src/lib/passport
  - src/providers/UraiPassportProvider.tsx
  - src/app/providers.tsx
  - src/components/passport
  - src/app/passport
  - src/app/genesis
  - docs/system

## Passport Work Included
- Passport layer model
- Passport registry
- Passport state helpers
- UraiPassportProvider
- App provider integration
- Passport Control Center UI
- /passport route
- Genesis entry point
- Compile-readiness audit docs
- Environment recovery docs
- Disk cleanup docs
- Disk blocker escalation docs

## External Validation Instructions
In a larger workspace or CI:

1. Confirm package manager:
   - package-lock.json exists, so npm is canonical unless project docs say otherwise.

2. Restore dependencies:
   - npm ci

3. Run compile validation:
   - npm run typecheck

4. Run tests:
   - npm test

5. Run Passport safety greps:
   - grep -R "hasConsent" -n src/lib/passport src/providers/UraiPassportProvider.tsx src/components/passport src/app/passport src/app/genesis 2>/dev/null || true
   - grep -R "getUserMedia\\|navigator.geolocation\\|Notification.requestPermission\\|DeviceMotionEvent.requestPermission\\|DeviceOrientationEvent.requestPermission\\|MediaRecorder" -n src/lib/passport src/providers/UraiPassportProvider.tsx src/components/passport src/app/passport src/app/genesis 2>/dev/null || true
   - grep -R "firebase/firestore\\|getFirestore\\|setDoc\\|addDoc\\|updateDoc\\|fetch(" -n src/lib/passport src/providers/UraiPassportProvider.tsx src/components/passport src/app/passport src/app/genesis 2>/dev/null || true

6. Run build only after typecheck/tests:
   - npm run build

7. Capture evidence:
   - dependency install result
   - typecheck result
   - test result
   - build result
   - safety grep result
   - /passport screenshot
   - /genesis screenshot

## Safety Rules
- Do not validate in the current zero-disk workspace.
- Do not bypass disk-space guards.
- Do not delete source-controlled logic.
- Do not proceed to Pass 2 until Passport compiles or is externally validated.

## Recommendation
HOLD for Adam review. Next step should be external validation, storage expansion, or CI validation.
