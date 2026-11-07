# Original UrAi — duplicate/superseded, risks and P0–P3 gate ledger

**Immutable baseline:** `8cac3ba513830c11261d57bc2b5dd7ad8b83e85a`. No live vulnerability is asserted without effective deployed Rules/protected runtime test.

## Material conflicts
1. **Production ownership:** June `docs/URAI_CANON.md` and `docs/REPO_CANONICAL_STATUS.md` assert UrAi production; current `README.md` and fail-closed `scripts/block-legacy-production-deploy.mjs` say `urai-spatial/urai-tier1/main`. **Decision:** newer code/release-control text wins; earlier files historical only.
2. **Public root:** old canon says `src/app/page.tsx` renders `HomeScene`; inspected source renders `LaunchPage`. **Decision:** source is truth for this commit; correct or annotate stale documentation without blindly replacing runtime.
3. **Ascent/Home wiring:** `src/components/urai/home/HomeScene.tsx` ignores `ascentTarget`, uses no-op actions and passes empty scene children. **Decision:** legacy shell incomplete; preserve alternate donor scene and require canonical Spatial tests rather than speculative rewrite.
4. **Replay:** `SpatialLifeMap` app-scoped `replay` mode lacks equivalent media panel; `handleReplay` routes to public preview `/replay`. **Decision:** no real protected Replay cert from legacy routes.
5. **Client/server waitlist split:** `LaunchShell` browser `waitlistEntries` / `analyticsEvents` vs server `waitlistSignups`; older README says server-only. **Decision:** priority Rules/data-mapping investigation; do not merge schemas until ownership and approved consent are proven.
6. **Demo fallback and accessibility:** default `demo-user`, data fallback on read error, hard-coded `reducedMotion={false}`. **Decision:** no owner-specific live proof or reduced motion certification from this component.
7. **Duplicated blob identity:** seven repeated Git object groups with 41 surplus path aliases; examples `firebase.free-static.json` / `firebase.staging.json` / `firebase.static.json`, `data/journal-entries.json` / `data/transcriptions.json`, `deploy/free-static-launch/home.html` / `index.html`, `src/components/urai/home/CosmicSky.new.tsx` / `ReflectiveGround.tsx`, `src/lib/passport/client.ts` / `passage.ts`. These exact-byte identities do not prove equivalent semantics.
8. **Tracked cache and LFS:** unusual 965-blob committed npm cache (181.8M reported bytes), plus unfetched Orb LFS payload. No destructive cleanup, license inference, or current build import.
9. **Legacy competing route PRs:** #325–#328 alternate root/app mapping; #329 explicitly superseded by Spatial. Avoid resurrection of withdrawn production branches.

## Priority list
- **P0 Security and release:** do not restore legacy deploy credentials. Prove effective Firestore/Storage Rules owner separation, authenticated tenant isolation and deletion/revocation, reconcile client waitlist/analytics write authority, confirm latest Spatial/Privacy/Jobs/Studio exact-source build and real signed consent/render/Replay/late-write denial, independent protected staging and founder GO.
- **P1 Functional integration:** reconcile Home Ascent no-op and old route canon with current Spatial, star-to-star Focus/Replay escape, source media provenance, Canvas/Orb/Council interactions, functional accessibility and reduced motion, verified physical devices/XR and all declared languages.
- **P2 Historical preservation:** compare all 242 branch trees/history, all 2024–2026 donor PRs, exact asset bytes and licenses, complex duplicate files, provenance of avatar/memory worlds, inspect all 426 Markdown files. Retain all historically valuable source.
- **P3 Documentation/maintenance:** update historical canon status labels, align README/route docs with actual source, document unused scripts/legacy tests, reduce cache and duplicate baggage only in independently reviewed later preservation branch.

## Evidence stop rules
No tests on real user memory; no paid provider/compute without approval; no auto-promotion; no public leak of private donor source; no release certification from this review.
