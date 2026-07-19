# URAI Tier-2 Access Locks

Status: **ARCHIVED LEGACY DESIGN / REFERENCE ONLY**. This document describes an earlier `LifeLoggerAI/UrAi` access-gating design. It does not unlock public behavior, authorize cloud mutation, or define current production architecture.

## Purpose

This file preserves the historical Tier-2 gate model for reviewed feature extraction. Current production authority is exclusively `LifeLoggerAI/urai-spatial` → `urai-tier1` → `main` → `urai.app`.

The historical design required a silent Tier-1 fallback until all of these were true:

1. The user is authenticated.
2. The feature flag is enabled.
3. Required consent records are accepted.
4. The user entitlement is `tier2` or higher.
5. The server-side evaluator agrees with the client-facing decision.
6. Firestore rules prevent client-side self-upgrade.
7. Denied or override decisions are audit logged.

## Project boundary

This repository is not the canonical `urai-spatial` runtime. The following material is retained only as a legacy reference for possible reviewed extraction; it must not be treated as executable release, deployment, data-migration, or production authority.

## Public language rule

Do not expose internal labels such as Tier-2, Canon proof, Agent Loop, lock matrix, debug, or admin in public UX. Historical user-facing labels included:

- Life Map
- Memory Stars
- Mood Weather
- Narrator Presence
- Preview Mode
- Private Offline Cache

## Historical implementation surface

The archived implementation references:

- `src/lib/tier-locks/types.ts`
- `src/lib/tier-locks/config.ts`
- `src/lib/tier-locks/evaluateTierLock.ts`
- `src/lib/tier-locks/requestTier2AccessLock.ts`
- `src/lib/tier-locks/useTier2AccessLock.ts`
- `src/lib/tier-locks/client.ts`
- `src/app/api/tier-lock/tier2/route.ts`
- `scripts/seed-tier2-access.mjs`
- `tests/unit/tier-locks/evaluateTierLock.test.ts`
- `tests/unit/tier-locks/requestTier2AccessLock.test.ts`
- `tests/unit/tier-locks/tier2SeedScript.test.ts`
- `tests/rules/tier2-policy.test.js`

This layer is reference material only. Any feature extraction must be independently reviewed, imported into the correct canonical repository, and certified there.

## Historical seed format

The earlier design included dry-run and Firestore seed commands. Do not execute cloud seeding from this quarantined repository. Any future migration or seed must use a named nonproduction target, protected identity, checks-only proof, read-back verification, rollback, and canonical approval.

## Tier-2 feature gates

| Feature id | Public name | Required tier | Required consents | Feature flag | Fallback |
| --- | --- | --- | --- | --- | --- |
| `personal_life_map` | Life Map | `tier2` | profile, timeline events, memory blooms | `tier2.personal_life_map` | Tier-1 baseline |
| `memory_stars` | Memory Stars | `tier2` | timeline events, memory blooms | `tier2.memory_stars` | Tier-1 baseline |
| `mood_weather` | Mood Weather | `tier2` | mood inference | `tier2.mood_weather` | Tier-1 baseline |
| `companion_presence` | Narrator Presence | `tier2` | profile | `tier2.companion_presence` | Tier-1 baseline |
| `ritual_ar_preview` | Preview Mode | `tier2` | rituals | `tier2.ritual_ar_preview` | Tier-1 baseline |
| `offline_spatial_cache` | Private Offline Cache | `tier2` | offline cache | `tier2.offline_spatial_cache` | Tier-1 baseline |

## Historical decision matrix

| User state | Expected decision |
| --- | --- |
| Anonymous | Tier-1 fallback |
| Signed in, missing feature flag | Tier-1 fallback |
| Signed in, missing consent | Tier-1 fallback |
| Signed in, below required entitlement | Tier-1 fallback |
| Signed in, consent accepted, flag enabled, tier2+ | Allow |
| Admin override | Allow and audit |

## Not implemented or activated here

These capabilities remain out of scope for this quarantined legacy repository:

- Public Tier-2 route exposure
- Passive sensing
- Live AI companion activation
- Paid marketplace or premium packs
- AR and VR launch
- B2B/admin production access
- Client-controlled entitlement writes

## Extraction rule

Do not wire, seed, deploy, or activate these legacy gates from `LifeLoggerAI/UrAi`. Create a bounded candidate in the correct canonical repository, obtain non-author review, and collect exact protected evidence there.
