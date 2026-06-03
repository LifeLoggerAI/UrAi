# URAI Rollback Plan

Priority order during an incident:

1. Enable maintenance mode or take public routes offline.
2. Disable risky feature flags.
3. Disable Companion AI if needed.
4. Disable public demo or waitlist if needed.
5. Roll back hosting deployment.
6. Revert Firestore or Storage rules only to a known-safe locked version.

## Disable public demo

- Set `NEXT_PUBLIC_URAI_PUBLIC_DEMO_ENABLED=false`.
- Redeploy the app.
- Verify `/demo` shows a waitlist or unavailable state.

## Disable waitlist

- Set `NEXT_PUBLIC_URAI_WAITLIST_ENABLED=false`.
- Redeploy the app.
- Confirm the form is hidden or closed.

## Enable maintenance mode

- Set launch status to `maintenance` or enable the `maintenance_mode` feature flag.
- Redeploy if the value is environment-driven.

## Disable Companion AI

- Remove or rotate `OPENAI_API_KEY`.
- Set Companion AI feature flag off.
- Confirm local fallback still works.

## Disable risky features

Keep these off unless explicitly verified:

- Shadow
- Legacy
- Exports
- Notifications
- Companion memory
- Sensitive cloud sync

## Roll back hosting

Use the hosting provider rollback UI or redeploy the last known-good commit.

## Rules rollback

Only roll back Firestore/Storage rules to a known-safe locked version. Never roll back to permissive public reads/writes.

## Privacy issue response

- Disable affected feature.
- Put the app in maintenance if user data risk is possible.
- Preserve logs needed for security review without exposing private content.
- Notify affected users if required after legal/security review.
