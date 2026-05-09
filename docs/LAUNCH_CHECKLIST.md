# URAI V1 Launch Checklist

## Scope lock

- [ ] Public copy says V1 is a demo spine, not a full passive sensing product.
- [ ] No claims of therapy, diagnosis, crisis support, marketplace, AR/VR, B2B, or studio exports as live features.
- [ ] `/`, `/u/adamclamp`, `/api/companion`, and `/api/waitlist` are the only launch-critical surfaces.

## Local checks

```bash
npm install
npm run check:v1
npm run check:firestore-contract
npm run seed:demo
npm run test:unit
npm run check:types
npm run lint
npm run build
npm run preflight
```

## Browser checks

```bash
npx playwright install --with-deps chromium
npm run test:smoke
npm run test:e2e
```

Manual smoke:

- [ ] `/` renders home scene.
- [ ] `/u/adamclamp` renders public constellation demo.
- [ ] Waitlist accepts a valid email.
- [ ] Waitlist rejects invalid email.
- [ ] Repeated waitlist attempts return rate-limited response after threshold.
- [ ] Companion returns deterministic guidance for normal input.
- [ ] Companion refuses diagnosis/clinical authority.
- [ ] Companion returns crisis-safe fallback copy for self-harm language.

## Firebase checks

- [ ] `firestore.rules` deploy succeeds.
- [ ] `firestore.indexes.json` deploy succeeds.
- [ ] `waitlistSignups` is server-only: client read/write denied.
- [ ] Owner-gated private collections require `ownerUid == request.auth.uid`.
- [ ] Staging Admin env vars are set before claiming waitlist persistence.
- [ ] Staging waitlist write verified in Firestore.

## Deployment checks

- [ ] Firebase project ID confirmed for staging.
- [ ] Firebase project ID confirmed for production.
- [ ] Hosting target/domain confirmed.
- [ ] Rollback runbook reviewed.
- [ ] Launch gate evidence variables populated where required.

## Go/no-go rule

Ship V1 only if the demo spine is stable and product copy remains honest about what is live. Defer passive sensing, marketplace, AR/VR, B2B, and studio/export until consent, security, tests, and deployment wiring are complete.
