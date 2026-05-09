# Tier 2 Canon Standards

Status: Protected system canon. Architecture review required before public activation.

## Boundary

Tier-2 extends Tier-1. It does not redefine, weaken, duplicate, or bypass Tier-1.

Tier-1 remains the locked foundation for public baseline experience. Tier-2 work can proceed in parallel only when it is additive, gated, tested, and capable of falling back to Tier-1.

## Protected systems

Tier-2 covers these systems:

- Spatial
- Privacy
- Admin
- Foundation
- Studio
- Companion
- Memory
- Scrolls
- Rituals
- Narrator
- Emotional OS
- Symbolic OS
- Consent and Data Licensing
- Relationship Intelligence
- Forecast
- Cognitive Mirror

## Required controls

Every Tier-2 system must define:

1. Owning module or route.
2. Required entitlement.
3. Required consent category.
4. Feature flag.
5. Server-side evaluator.
6. Firestore or API authorization boundary.
7. Silent Tier-1 fallback.
8. Tests covering denied and allowed states.
9. Product-language copy that hides internal tier/debug terms.

## Migration rule

A Tier-2 migration requires:

- Architecture review note.
- Compatibility note explaining Tier-1 impact.
- Changelog entry.
- Test evidence.
- Rollback plan.

## Source of truth

Runtime-facing canon constants live in:

- `src/canon/tier2.ts`
- `src/canon/index.ts`

Spatial Tier-2 lock behavior is documented in:

- `docs/SPATIAL_TIER_LOCKS.md`
- `docs/SPATIAL_LOCK_MATRIX.md`
- `docs/SPATIAL_LOCK_QA_CHECKLIST.md`
