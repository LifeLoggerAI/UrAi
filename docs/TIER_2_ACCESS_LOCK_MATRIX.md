# URAI Tier-2 Access Lock Matrix

Status: prepared for Tier-2 integration in the main `LifeLoggerAI/UrAi` app. Tier-1 remains the active public baseline.

## Project boundary

This matrix is for the main URAI app Tier-2 access layer. It is not the separate `urai-spatial` repo.

## Evaluation order

1. Admin override check.
2. Authentication check.
3. Feature flag check.
4. Consent check.
5. Entitlement check.
6. Allow or Tier-1 fallback.

## Matrix

| Case | Authenticated | Feature flag | Consent | Entitlement | Admin override | Decision | Audit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Anonymous visitor | No | Any | Any | Any | No | Fallback to Tier-1 | Yes |
| Signed in, flag disabled | Yes | No | Any | Any | No | Fallback to Tier-1 | Yes |
| Signed in, missing consent | Yes | Yes | Missing | Tier-2+ | No | Fallback to Tier-1 | Yes |
| Signed in, below entitlement | Yes | Yes | Accepted | Tier-1 | No | Fallback to Tier-1 | Yes |
| Signed in, fully eligible | Yes | Yes | Accepted | Tier-2+ | No | Allow | No |
| Internal override | Yes | Any | Any | Any | Yes | Allow | Yes |

## Public fallback behavior

Fallback must be silent and stable. The public user should see the Tier-1 baseline scene, not an error, not a debug state, and not an internal access message.

## Data ownership rule

Private data remains owner-bound. Production private documents must use `ownerUid`; `userId` is reserved for demo/display compatibility only.

## Forbidden client behavior

- Client code must not grant itself entitlement.
- Client code must not write admin/founder/internal override fields.
- Client code must not bypass consent checks.
- Client code must not reveal internal lock reasons in public UI.
