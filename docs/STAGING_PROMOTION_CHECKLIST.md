# URAI V1 Staging Promotion Checklist

This checklist gates promotion from a validated release candidate to production. It is intentionally operational: do not promote unless each required item is checked or explicitly marked not applicable with a reason.

Parent issue: #185

## Release candidate identity

- [ ] Release candidate commit SHA recorded.
- [ ] Source branch recorded.
- [ ] PR or merge commit recorded.
- [ ] Release owner recorded.
- [ ] Date/time of staging signoff recorded.

## Canonical V1 scope

The V1 launch surface is limited to the canonical demo spine unless a later issue explicitly expands scope.

Required routes/APIs:

- [ ] `/` renders the V1 home/demo spine.
- [ ] `/u/adamclamp` renders the public constellation demo.
- [ ] `/api/companion` accepts valid POST requests and returns companion JSON.
- [ ] `/api/waitlist` accepts valid POST requests and returns dry-run locally or writes when Firebase Admin is configured.

Optional/guarded V1-adjacent routes:

- [ ] `/u/adamclamp/life-map` verified if included in the release target.
- [ ] `/settings/trust` verified if included in the release target.
- [ ] `/admin/debug/adamclamp` is protected or disabled publicly.

## Required command validation

Run from a clean checkout before staging signoff:

```bash
npm install
npm run check:v1
npm run seed:demo
npm run test:unit
npm run test:rules
npm run check:types
npm run lint
npm run build
npx playwright install --with-deps chromium
npm run test:smoke
npm run test:e2e
```

Acceptance:

- [ ] Clean install passes.
- [ ] V1 sanity check passes.
- [ ] Demo seed artifact is generated.
- [ ] Unit tests pass.
- [ ] Firestore rules tests pass.
- [ ] Typecheck passes.
- [ ] Lint passes.
- [ ] Production build passes.
- [ ] Playwright smoke tests pass.
- [ ] Full Playwright E2E passes.

## Firebase Functions validation

Run separately because Functions use their own package context:

```bash
cd functions
npm install
npm run build
```

Acceptance:

- [ ] Functions install passes.
- [ ] Functions build passes.
- [ ] Functions runtime/version expectations are recorded.

## Staging environment binding

Do not paste secret values into this file or into GitHub issues.

- [ ] Staging Firebase project ID confirmed by release owner.
- [ ] Production Firebase project ID confirmed separately.
- [ ] Active local Firebase target checked before deploy.
- [ ] Hosting target checked before deploy.
- [ ] Firestore rules target checked before deploy.
- [ ] Firestore indexes target checked before deploy.
- [ ] Functions target checked before deploy.
- [ ] Required deployment credentials exist in the deploy environment.
- [ ] No secret values are committed to the repo.

## Staging deploy check

Use the provider-specific deploy path for the current environment. If using Firebase directly, the expected deploy surface is:

```bash
firebase deploy --only hosting,firestore:rules,firestore:indexes,functions
```

Acceptance:

- [ ] Hosting deploy succeeds.
- [ ] Firestore rules deploy succeeds.
- [ ] Firestore indexes deploy succeeds.
- [ ] Functions deploy succeeds.
- [ ] Deploy log or run URL recorded.

## Manual staging smoke test

Desktop:

- [ ] Home route loads.
- [ ] Public constellation route loads.
- [ ] Companion request works.
- [ ] Waitlist submit works in the intended staging mode.
- [ ] No console error blocks the core demo.
- [ ] No private passive/memory/relationship data is publicly exposed.

Mobile:

- [ ] Home route loads on mobile viewport/device.
- [ ] Public constellation route loads on mobile viewport/device.
- [ ] Waitlist form is usable.
- [ ] Companion form is usable.
- [ ] Layout is not broken by the main CTA/header/content.

## Data and privacy signoff

- [ ] Public/demo data is intentional.
- [ ] Private passive data is not publicly readable.
- [ ] Private memory data is not publicly readable.
- [ ] Private relationship data is not publicly readable.
- [ ] Waitlist writes are server-side or otherwise protected as intended.
- [ ] Demo data is seeded/anonymized.
- [ ] Privacy launch gate issue is reviewed if active.

## Go/no-go decision

Promote only when all required checks above are green.

Record:

- Release candidate commit:
- Staging URL:
- Deploy run/log URL:
- Smoke tester:
- Smoke test date/time:
- Decision: Go / No-Go
- Notes:

## Production promotion rule

Production deploy must come from the signed-off release candidate commit. If the commit changes after signoff, rerun this checklist.
