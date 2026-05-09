# URAI Priority Backlog

## P0: V1 launch spine

1. Verify `/`, `/u/adamclamp`, `/api/companion`, and `/api/waitlist` in staging.
2. Keep companion deterministic/mock until a live model has safety tests and review.
3. Confirm waitlist writes to `waitlistSignups/{normalizedEmail}` only from the server.
4. Confirm `waitlistSignups` remains unreadable/unwritable from client Firestore rules.
5. Run `npm run check:firestore-contract` and resolve any hard failures.
6. Run unit/type/lint/build/preflight checks before launch.
7. Keep public copy scoped to V1 demo language.

## P1: Firebase/data integrity

1. Migrate production private queries and indexes from `userId` to `ownerUid`.
2. Keep `userId` only for demo/display/public-safe records.
3. Add Firebase emulator rules tests for owner isolation across every private collection.
4. Add a schema parity check for collection constants, rules, indexes, and seeded data.
5. Add typed write helpers that require `ownerUid` for private documents.

## P2: Privacy and consent

1. Build a consent center before enabling passive capture.
2. Add per-source consent records for audio, location, device activity, notifications, app usage, relationship graph, biometric voiceprint, facial analysis, and marketplace participation.
3. Add delete/export/unsubscribe flows.
4. Add admin audit logging before any admin dashboard can inspect user data.
5. Add retention rules for raw passive signals.

## P3: Companion safety

1. Expand unsafe-phrasing tests.
2. Add feedback controls for bad companion responses.
3. Add confidence and "why this" language for generated insights.
4. Add crisis review before any live model integration.
5. Add rate limiting if companion endpoint becomes public and expensive.

## P4: Future systems

Do not implement these deeply until V1 is stable and consent/security gates exist:

- passive audio/GPS/device sensing
- relationship intelligence
- AI therapist replay
- insight marketplace
- B2B/admin dashboards
- AR/VR/spatial bridge
- studio/export/media pipeline
- asset-factory jobs

## Done definition for backlog items

A task is done only when code, docs, tests, and deployment notes agree. Scaffold-only work must be explicitly labeled as scaffold-only and must not appear in public copy as a live product capability.
