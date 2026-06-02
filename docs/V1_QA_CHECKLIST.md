# URAI V1 QA Checklist

Use this before sharing the public demo or deploying a launch build.

## Product flow

- [ ] `/` loads the cinematic home scene.
- [ ] Home hero copy is visible on mobile and desktop.
- [ ] Home includes forecast, weekly reflection, companion chat, and waitlist form.
- [ ] `/u/adamclamp` loads without authentication.
- [ ] `/u/adamclamp` shows public constellation title, forecast, reflection, memory blooms, timeline stars, and waitlist form.
- [ ] CTA from `/` to `/u/adamclamp` works.

## Companion flow

- [ ] Empty messages are rejected.
- [ ] Build/ship/deploy language returns focused guidance.
- [ ] Stuck/overwhelmed language returns tender guidance.
- [ ] Vision/investor/roadmap language returns threshold guidance.
- [ ] Component handles API failure without crashing.

## Waitlist flow

- [ ] Invalid email returns a visible error.
- [ ] Valid email succeeds locally in dry-run mode when Firebase Admin env vars are missing.
- [ ] Valid email writes to `waitlistSignups/{normalizedEmail}` when Firebase Admin env vars are configured.
- [ ] Repeated signup updates the existing waitlist document instead of creating duplicates.
- [ ] Waitlist documents are not readable or writable from client Firestore rules.

## Firebase/backend

- [ ] `firebase.json` points to `firestore.rules` and `firestore.indexes.json`.
- [ ] `firestore.rules` deploys successfully.
- [ ] `firestore.indexes.json` deploys successfully.
- [ ] Private collections are owner-gated or server-only.
- [ ] `waitlistSignups` is server-only.

## Accessibility

- [ ] Email input has an accessible label.
- [ ] Companion input has an accessible label.
- [ ] Interactive buttons have visible text.
- [ ] Cards preserve readable contrast.
- [ ] Layout works at mobile widths.

## Validation commands

```bash
npm install
npm run seed:demo
npm run check:types
npm run build
npm run preflight
```

## Launch gate

Do not share broadly until:

- [ ] Typecheck passes.
- [ ] Build passes.
- [ ] Waitlist writes in the configured environment.
- [ ] Firebase rules/indexes deploy.
- [ ] `/u/adamclamp` feels presentable on mobile.
