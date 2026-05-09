# URAI Tier-2 Access Locks

Status: Tier-2 preparation layer for the main `LifeLoggerAI/UrAi` app. This document does not unlock public Tier-2 behavior by itself.

## Purpose

Tier-1 remains the locked public baseline. Tier-2 work may proceed in parallel only when it depends on Tier-1 and does not redefine, weaken, duplicate, or bypass Tier-1.

Tier-2 Personal Access features must render a silent Tier-1 fallback until all of these are true:

1. The user is authenticated.
2. The feature flag is enabled.
3. Required consent records are accepted.
4. The user entitlement is `tier2` or higher.
5. The server-side evaluator agrees with the client-facing decision.
6. Firestore rules prevent client-side self-upgrade.
7. Denied or override decisions are audit logged.

## Project boundary

This is not the separate `urai-spatial` repo. This belongs to the main URAI app repo and only prepares personal Tier-2 access gates for app features such as Life Map, Memory Stars, Mood Weather, Narrator Presence, Preview Mode, and Private Offline Cache.

## Public language rule

Do not expose internal labels such as Tier-2, Canon proof, Agent Loop, lock matrix, debug, or admin in public UX. Use user-facing language instead:

- Life Map
- Memory Stars
- Mood Weather
- Narrator Presence
- Preview Mode
- Private Offline Cache

## Current implementation surface

The current additive implementation is intentionally small:

- `src/lib/tier-locks/types.ts`
- `src/lib/tier-locks/config.ts`
- `src/lib/tier-locks/evaluateTierLock.ts`
- `src/lib/tier-locks/client.ts`
- `src/app/api/tier-lock/tier2/route.ts`
- `tests/unit/tier-locks/evaluateTierLock.test.ts`
- `tests/rules/tier2-policy.test.js`

This layer is safe to build during Tier-1 lock because it does not change the locked routes, home scene, public routing, or live data capture.

## Tier-2 feature gates

| Feature id | Public name | Required tier | Required consents | Feature flag | Fallback |
| --- | --- | --- | --- | --- | --- |
| `personal_life_map` | Life Map | `tier2` | profile, timeline events, memory blooms | `tier2.personal_life_map` | Tier-1 baseline |
| `memory_stars` | Memory Stars | `tier2` | timeline events, memory blooms | `tier2.memory_stars` | Tier-1 baseline |
| `mood_weather` | Mood Weather | `tier2` | mood inference | `tier2.mood_weather` | Tier-1 baseline |
| `companion_presence` | Narrator Presence | `tier2` | profile | `tier2.companion_presence` | Tier-1 baseline |
| `ritual_ar_preview` | Preview Mode | `tier2` | rituals | `tier2.ritual_ar_preview` | Tier-1 baseline |
| `offline_spatial_cache` | Private Offline Cache | `tier2` | offline cache | `tier2.offline_spatial_cache` | Tier-1 baseline |

## Required decision matrix

| User state | Expected decision |
| --- | --- |
| Anonymous | Tier-1 fallback |
| Signed in, missing feature flag | Tier-1 fallback |
| Signed in, missing consent | Tier-1 fallback |
| Signed in, below required entitlement | Tier-1 fallback |
| Signed in, consent accepted, flag enabled, tier2+ | Allow |
| Admin override | Allow and audit |

## Not implemented yet

These are intentionally not activated by this parallel foundation pass:

- Public Tier-2 route exposure
- Passive sensing
- Live AI companion activation
- Paid marketplace or premium packs
- Full AR or VR launch
- B2B/admin production access
- Client-controlled entitlement writes

## Next integration steps

1. Add a `useTier2AccessLock(featureId)` hook that calls the server evaluator.
2. Add Playwright coverage proving Tier-1 fallback and Tier-2 unlock.
3. Seed non-public staging feature docs and consent docs.
4. Wire Tier-2 UI only behind flags after Tier-1 is sealed.
