# URAI Test Coverage Plan

URAI should prioritize safety-critical coverage over chasing 100 percent line coverage.

## Highest Priority

- Passport permission defaults.
- Privacy rules engine.
- AI boundary classification and response sanitization.
- Shadow safety and consent gating.
- Legacy safety and user approval.
- Export review and blocked/sealed states.
- Demo mode isolation.
- Firebase/local fallback.
- Admin access denial.

## Medium Priority

- Provider tree rendering.
- Component smoke rendering.
- Notification timing and quiet-hour logic.
- Audio and voice defaults.
- Auth/local identity behavior.
- Launch and waitlist routes.

## E2E Priority

- Public demo smoke flow.
- Privacy regression flow.
- Admin access denied flow.

## Not Required for Launch

- 100 percent line coverage.
- Live AI provider calls.
- Live Firebase writes.
- Private user data fixtures.
- Full visual diff automation.

## Coverage Expectations

- Passport / privacy rules: high coverage.
- AI boundary: high coverage.
- Shadow / Legacy / Export safety: high coverage.
- Demo mode: high confidence.
- Provider tree: smoke coverage.
- UI components: smoke coverage.
- Admin access: route-level coverage.

Tests should use closed-by-default Passport profiles unless a test explicitly opens a layer.
