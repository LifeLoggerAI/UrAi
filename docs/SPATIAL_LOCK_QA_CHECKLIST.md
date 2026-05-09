# URAI Spatial Lock QA Checklist

Status: Tier-2 parallel readiness checklist. Do not treat Tier-2 as public-ready until this checklist passes.

## Tier-1 protection

- [ ] Tier-1 lock script still passes.
- [ ] Public home route is unchanged by Tier-2 scaffolding.
- [ ] Public route copy does not expose Tier labels or debug labels.
- [ ] Tier-1 fallback renders without network-only dependencies.

## Tier-2 evaluator

- [ ] Anonymous users receive Tier-1 fallback.
- [ ] Missing feature flags receive Tier-1 fallback.
- [ ] Missing required consents receive Tier-1 fallback.
- [ ] Below-tier users receive Tier-1 fallback.
- [ ] Tier-2+ users with consent and flag enabled are allowed.
- [ ] Admin override is allowed and marked for audit.

## Firestore and server rules before activation

- [ ] Users cannot write their own entitlement tier.
- [ ] Users cannot write admin, founder, or override fields.
- [ ] Feature flags are server/admin controlled.
- [ ] Consent writes are owner-bound and immutable enough to audit.
- [ ] Audit logs are server-owned.
- [ ] Private data reads require `ownerUid` ownership.

## Product language

- [ ] Public UI says Life Map, Memory Stars, Mood Weather, Narrator Presence, Preview Mode, or Private Offline Cache.
- [ ] Public UI does not say Tier-2, Canon proof, Agent Loop, lock matrix, admin, or debug.
- [ ] Denied states do not show errors to normal users.

## Activation gate

- [ ] Server evaluator exists.
- [ ] Client hook calls server evaluator.
- [ ] Playwright proves fallback and unlock.
- [ ] Firestore emulator rules tests pass.
- [ ] Privacy copy matches the actual implementation.
