# URAI Genesis Onboarding Film

Last updated: 2026-06-27

## Purpose

The Genesis onboarding film is the canonical launch-safe "You live" trailer for URAI. It introduces URAI as a symbolic, consent-based living world around Home, Sky, Ground, Orb, Life Map, Focus, Replay, Passport, data ownership, accessibility, and legacy.

This is not proof that private generated life movies, passive sensing, AR/VR/XR worlds, autonomous agents, therapy, diagnosis, marketplace payouts, or enterprise systems are production-live.

## Canonical Lines

- You live. URAI remembers. You choose what becomes real.
- Your life is a living world.
- You do not build the map. You live.
- Not another feed. A world for your life.
- The sky remembers. The ground works. The orb guides.

## Implementation

- Film model: `src/data/genesisOnboardingFilm.ts`
- Asset prompt manifest: `src/data/genesisOnboardingAssets.ts`
- Public placeholder manifest: `public/genesis/onboarding/manifest.json`
- UI component: `src/components/genesis/GenesisOnboardingFilm.tsx`
- Route: `src/app/onboarding/page.tsx`
- Validation script: `scripts/check-onboarding.mjs`
- Unit tests: `tests/unit/genesis-onboarding-film.test.tsx`

## Scene List

1. A Life Is Scattered
2. URAI Appears
3. You Live
4. Sky Layer / Life Map
5. Orb Speaks
6. Focus Image
7. Replay Begins
8. Ground Layer / AI Council
9. Private Nudges
10. Life Films
11. Memory Music Videos
12. Living Memories / Symbolic People
13. AR / VR / XR
14. Passport / Data Ownership
15. Global Emotional Map
16. Accessibility / Legacy
17. Final Return Home

## Launch-Safe Wording Rules

Allowed language:

- Genesis preview
- symbolic
- consent-based
- private by default
- user-controlled
- can become
- helps create
- guided memory structure
- emotional replay
- sample memory
- demo/fallback
- gated/provider-backed
- roadmap

Do not claim as live unless separately proven by code, tests, deploy logs, screenshots, and live smoke evidence:

- real generated private life movies for everyone
- live passive sensing
- live AR/VR/XR memory worlds
- autonomous jobs or agents acting in the world
- therapy, diagnosis, medical treatment, or legal advice
- guaranteed data marketplace payouts
- exact passive reconstruction of a user's life
- real-person cloning or replacement of real people

## Required Trust Rules

- The onboarding seed memory is `genesis-first-light`.
- The seed memory privacy mode is `no_private_user_data`.
- Symbolic people must show: "Symbolic. Consent-based. Not a replacement for real people."
- Passport must show: Private by default, User-owned data, Consent receipts, Export anytime, Delete anytime, Share by permission, License by consent.
- Replay and Life Films remain preview/gated until provider-backed generation, owner-scoped storage, delete/export controls, tests, and live smoke proof exist.

## Placeholder Asset Replacement

Current assets in `public/genesis/onboarding/` are SVG placeholders. To replace them with final generated assets:

1. Keep the same filename or update both `src/data/genesisOnboardingFilm.ts` and `public/genesis/onboarding/manifest.json`.
2. Preserve the `assetStatus` field and move it from `placeholder` to `generated` or `final` only when generation provenance and rights are documented.
3. Keep sample/demo/preview labels unless the scene is proven live with owner-scoped input and smoke evidence.
4. Run `npm run check:onboarding`, `npm run check:types`, `npm test -- --runInBand`, and `npm run build`.

## Checks

Run:

```bash
npm run check:onboarding
npm run check:genesis
npm run verify:privacy
npm run check:types
npm test -- --runInBand
npm run build
```

The onboarding check validates:

- manifest exists
- all scene IDs exist
- every scene has voiceover/caption coverage
- every fallback asset path exists
- required trust language appears
- disallowed unsupported claims do not appear

