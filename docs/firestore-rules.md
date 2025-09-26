# Firestore security rules

These rules enforce a simple ownership contract across the top-level collections that store user generated content.

## Ownership contract

* Every document in the following collections must include an `ownerUid` string that matches the authenticated user's UID:
  * `dreams`, `rituals`, `timelineEvents`, `personaEvolutions`, `soulThreads`, `socialArchetypes`, `weeklyScrolls`, `moods`, `shadowMetrics`, `obscuraPatterns`, `cognitiveStress`, `recoveryBlooms`, `relationshipConstellations`, `voiceEvents`, `dreamConstellations`, `memoryBlooms`, `badges`, `notifications`, `journalEntries`, `events`, and `insightMarket`.
* Owners can create documents only when they claim themselves (`request.resource.data.ownerUid == request.auth.uid`).
* Updates are permitted only when the caller remains the owner **and** the owner does not change (`resource.data.ownerUid == request.resource.data.ownerUid`).
* Reads and deletes remain limited to the owner of the existing document.

## Running the rules tests

A lightweight emulator in `tests/rules/rulesEmulator.js` evaluates the Firestore rules to assert the contract above. Run the suite locally with:

```bash
npm run test:rules
```

The tests cover create, read, and update operations for representative collections and are wired into the `npm run ci` pipeline to prevent regressions.
