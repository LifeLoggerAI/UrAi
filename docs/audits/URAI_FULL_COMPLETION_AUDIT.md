# URAI Full Completion Audit

Date: 2026-05-11
Branch: `urai-full-completion-implementation`
Repository: `LifeLoggerAI/UrAi`
Production destination: `www.urai.app`
Firebase hosting site: `urai-4dc1d`

## Current architecture

URAI is a Next.js App Router application with Firebase client/admin integrations, Firebase Hosting config, Firestore rules/indexes, Storage rules, Jest/Playwright scripts, launch gates, tier-lock scripts, release verification scripts, and Firebase Functions. The existing repo already includes the V1 demo spine, public constellation route, companion endpoint, waitlist endpoint, demo seed data, status route, QA docs, deploy docs, and system-of-systems documentation.

The repo should be evolved in place. A monorepo migration is not required for this completion branch.

## Audit findings

### Already present

- Root scripts for dev, build, lint, typecheck, tests, seed, preflight, launch gates, and release verification.
- Firebase config in `firebase.json` with Hosting, Firestore rules/indexes, and Functions source.
- Firestore and Storage rules.
- Firebase Functions folder and existing ancient-signal/story renderer exports.
- System-of-systems contract in `src/lib/system-of-systems-contract.ts`.
- V1 launch, QA, deploy, API, Firestore collection, rollback, and release-hardening docs.

### Implemented in this branch

- Expanded `src/lib/system-of-systems-contract.ts` to cover canonical URAI collections, owner-scoped collections, server-only collections, public-read collections, roles, tiers, entitlements, consent gates, feature flags, required routes, and required Firebase Function names.
- Added `functions/src/uraiCompletionFunctions.ts` with typed callable, HTTP, and scheduled facades for all required production backend entrypoints.
- Exported the new functions from `functions/src/index.ts`.
- Added `scripts/urai-completion-audit.mjs` and wired it into `package.json` as `validate` and `validate:completion`.
- Updated `preflight` so completion validation runs before typecheck, lint, unit tests, and build.

## Broken or incomplete systems still requiring local/CI verification

The GitHub connector supports repository reads/writes but cannot run `npm install`, `npm run build`, Firebase emulators, or deploys from this session. The remaining required verification must happen in CI or a local checkout:

```bash
npm install
npm run validate:completion
npm run check:v1
npm run typecheck
npm run lint
npm run test:unit
npm run test:rules
npm run build
cd functions && npm install && npm run build
```

## Security and privacy risks

- Admin functions require the Firebase custom claim `admin === true`; claims issuance must remain tightly controlled.
- Payment webhook logic is currently a safe admin-only facade and must add Stripe signature verification before live billing.
- Export workers are safe facades and must add signed URL expiration, ownership checks, retention cleanup, and storage path sanitization before exposing real exports.
- Consent gates are centralized in the contract, but every ingestion path must explicitly enforce them.
- Job applications, contact messages, admin logs, and safety events should remain server/admin-only except for user-owned confirmation views.

## Deployment risks

- DNS/Firebase console access was not available in this session.
- `www.urai.app` must be verified in Firebase Hosting and DNS after deploy.
- The root app declares Node 20 while Functions declare Node 22. Keep this if Firebase runtime supports it; otherwise standardize Functions to a supported runtime.

## UX and consistency risks

- Legacy Life Logger naming may still appear in historical docs or migration copy. Keep only when clearly framed as migration/history.
- Newer surfaces should standardize on URAI and Council.
- Advanced marketplace/export/AI features should run in demo-safe mode until real providers are configured.

## Completion checklist

- [x] Inspect existing repo architecture through GitHub connector.
- [x] Preserve existing Next/Firebase structure.
- [x] Expand canonical type/contract surface.
- [x] Add canonical backend function exports.
- [x] Add completion validation script.
- [x] Wire validation into root scripts.
- [ ] Run local/CI build verification.
- [ ] Expand Firestore rules for every canonical final collection before public writes.
- [ ] Configure live Stripe/export/AI providers behind validated facades.
- [ ] Verify Firebase Hosting target and DNS for `www.urai.app`.
