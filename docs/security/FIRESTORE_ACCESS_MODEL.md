# URAI Firestore Access Model

Status: canonical security model for completion-gate fixes.
Branch: `fix/completion-gates`.

This document summarizes the Firestore collection access model enforced by `firestore.rules` and covered by rules tests.

## Default stance

All collections are denied by default unless a specific rule grants access. The final fallback is:

```text
match /{document=**} { allow read, write: if false; }
```

No rule uses `allow read, write: if true`.

## Identity model

- Signed-in user access is based on `request.auth.uid`.
- Admin access is based on Firebase custom claim `request.auth.token.admin == true`.
- User-owned documents must carry at least one owner field matching the authenticated user: `ownerUid`, `userId`, or `uid`.
- Client writes to server-mediated collections are denied unless the collection is explicitly a request/intake collection.

## Admin-only collections

Only admins can read/write operational admin records. Immutable logs cannot be client-updated or deleted.

- `adminUsers`
- `adminAuditLogs`
- `auditLogs`
- `incidents`
- `featureFlags`

## Public/demo-readable collections

These are intentionally readable only when published/demo-visible or status-safe. Writes remain admin-only.

- `systemStatus`: public read, admin write.
- `marketplaceItems`: public read only when published/demo-readable, admin write.
- `jobs`: public read only when published/demo-readable, admin write.

## Public inbound submission collections

Anonymous or signed-in users can create submitted records only. Reads are admin-only. Client update/delete is denied.

- `waitlistEntries`
- `contactMessages`

Signed-in user-created submissions:

- `creatorSubmissions`: user can create owned submissions; admins read/update.
- `jobApplications`: users can create/read their own applications; admins read/update.

## User-owned private collections

These require signed-in ownership checks for reads and writes. A user cannot read or write another user's records.

- `profiles`
- `consents`
- `narratorMemory`
- `memoryShards`
- `insights`
- `journeys`
- `journeyChapters`
- `stars`
- `moodWeather`
- `emotionalForecasts`
- `weeklyRecaps`
- `storyProjects`
- `storyAssets`
- `referrals`
- `lifeMapEvents`
- `constellations`
- `scrolls`
- `storyScripts`
- `relationships`
- `socialGraph`
- `obscuraSignals`
- `mentalLoadScores`
- `councilSessions`
- `narratorMessages`
- `dataRequests`

## Server-mediated sensitive collections

These are protected from direct client mutation. Users may read only their own server-created records where appropriate.

- `marketplacePurchases`
- `eventEnrichments`
- `entitlements`
- `transactions`

## Request and lifecycle collections

Users may create their own lifecycle requests, but backend/admin systems must process state changes.

- `dataExportRequests`
- `accountDeletionRequests`
- `safetyEvents`
- `telemetryEvents`

Telemetry events are write-only from the client and not client-readable. Safety events are owner/admin-readable and admin-updatable.

## Replay, narrator, AI, and evidence protection

Narrator, memory, insight, journey, star, constellation, relationship, mental-load, and replay-adjacent data is owner-scoped. Deleted, vaulted, or otherwise restricted data must not be exposed through public/demo collections. AI/replay outputs must remain evidence-scoped at the application layer and must not bypass these Firestore ownership rules.

## Export and deletion protection

Export and account-deletion requests are owner-created but not client-updatable. The backend must validate identity, ownership, redaction status, storage path safety, derivative cleanup, and completion timestamps before changing request state.

## Tests

Rules tests cover:

- unauthenticated denial for private collections
- cross-user denial for private collections
- admin-only access
- public/demo-safe read behavior
- server-mediated write denial
- export/deletion/safety/telemetry restrictions
- deny-by-default unknown collection behavior
