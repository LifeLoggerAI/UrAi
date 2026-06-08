# URAI Unit Failure Repair Plan

Generated from the current failing test output shared in chat.

## Current failing suites

The latest run shows 41 passing suites and 4 failing suites:

- `src/lib/auth/auth.test.tsx`
- `src/lib/intelligence/symbolicInferenceEngine.test.ts`
- `src/lib/intelligence/moodRhythmScoring.test.ts`
- `src/lib/intelligence/__tests__/intelligenceSafety.test.ts`

The failures are source/test contract mismatches, not dependency install failures.

## Required fixes

### Auth provider

Failure:

```text
Expected: Signed In
Received: Signed Out
```

Repair target:

- Confirm `signIn` updates provider-visible user state synchronously enough for the test path.
- Keep sign-out behavior intact.

### Symbolic inference

Failures:

```text
mirrorCandidates expected 1, received 2
shadowCandidates expected 1 when allowShadowCandidates true, received 0
```

Repair target:

- Ensure default fixture path produces one mirror candidate.
- Ensure `allowShadowCandidates: true` enables exactly one shadow candidate.
- Keep shadow disabled by default.

### Mood/rhythm scoring

Failures:

```text
balanced -> received neutral
positive -> received neutral
negative -> received neutral
chaotic -> received unknown
stuck -> received unknown
```

Repair target:

- Restore legacy/public test vocabulary or update the adapter layer so neutral inputs map to `balanced` and `even`.
- Positive, negative, chaotic, and stuck detection should be explicit.

### Intelligence safety

Failures:

```text
email expected [REDACTED_EMAIL], received [email removed]
phone expected [REDACTED_PHONE], received [phone number removed]
GPS expected [REDACTED_GPS], received unredacted coordinate text
PII safety band expected danger, received blocked
```

Repair target:

- Redaction tokens must match test contract exactly.
- GPS coordinate patterns like `34.0522 N, 118.2437 W` must redact.
- `getSafetyBandForInput` should return `danger` for PII instead of `blocked` if that is the active test contract.

## Next verification command

Run from `~/UrAi`:

```bash
npm test -- --runInBand src/lib/auth/auth.test.tsx src/lib/intelligence/symbolicInferenceEngine.test.ts src/lib/intelligence/moodRhythmScoring.test.ts src/lib/intelligence/__tests__/intelligenceSafety.test.ts
npm run build
```
