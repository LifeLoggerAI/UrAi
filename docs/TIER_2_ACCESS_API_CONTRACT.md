# URAI Tier-2 Access API Contract

Status: internal contract for the main `LifeLoggerAI/UrAi` app. This is not a public Tier-2 activation.

## Endpoint

```txt
POST /api/tier-lock/tier2
```

## Request

```json
{
  "featureId": "personal_life_map"
}
```

Optional authentication is passed through the standard bearer token header:

```txt
Authorization: Bearer <firebase-id-token>
```

## Supported feature ids

- `personal_life_map`
- `memory_stars`
- `mood_weather`
- `companion_presence`
- `ritual_ar_preview`
- `offline_spatial_cache`

## Success response

```json
{
  "ok": true,
  "mode": "firebase-admin",
  "result": {
    "featureId": "personal_life_map",
    "decision": "fallback",
    "reason": "anonymous_tier1_only",
    "fallback": "tier1_baseline",
    "requiredTier": "tier2",
    "effectiveTier": "tier1",
    "missingConsents": [],
    "missingFeatureFlags": [],
    "shouldAudit": true,
    "publicMessage": "Your private Life Map is waiting behind your personal access gate."
  }
}
```

`mode` may be `dry-run` when Firebase Admin environment variables are not configured.

## Failure response

Invalid feature ids return:

```json
{
  "error": "A valid Tier-2 featureId is required."
}
```

with HTTP 400.

## Decision rules

The endpoint delegates final access decisions to `evaluateTierLock` and uses this order:

1. Admin/internal override.
2. Authentication.
3. Feature flag.
4. Consent.
5. Entitlement.
6. Allow or Tier-1 fallback.

## Audit rules

Denied decisions and admin overrides are audit-worthy. When Firebase Admin is configured, the endpoint writes audit entries to `auditLogs` with type `tier2_access_lock`.

## Public UI rule

Public UI must not expose raw internal lock reasons. A denied user should get the Tier-1 baseline, not an error page or debug copy.
