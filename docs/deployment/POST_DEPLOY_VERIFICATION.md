# URAI Post-Deploy Verification

Run this checklist after every preview or production deploy.

## Automated checks

```bash
npm run validate:completion
npm run verify:release
```

When full local tooling is available:

```bash
npm run check:v1
npm run typecheck
npm run lint
npm run test:unit
npm run test:rules
npm run build
npm run test:smoke
```

## Route checks

Verify these routes return 200 or expected app-shell responses:

- `/`
- `/u/adamclamp`
- `/status`
- `/privacy`
- `/terms`
- `/contact`
- `/pricing`
- `/careers`
- `/demo`

## API and function checks

- `/api/status` returns healthy JSON.
- `/api/waitlist` accepts a valid demo signup and rejects invalid email.
- `/api/companion` accepts valid input and rejects empty input.
- Firebase Function `healthCheck` returns healthy JSON.

## Privacy and security checks

- Firestore rules deny unauthenticated reads for owner-scoped data.
- Server-only collections are not publicly readable.
- Storage rules do not expose private user exports.
- No private keys, API secrets, or `.env.local` contents appear in source, build logs, or client bundles.

## UX checks

- Homepage hero loads on mobile and desktop.
- Public constellation demo loads.
- Waitlist form has accessible errors and success state.
- Companion/narrator interaction is responsive in demo mode.
- Reduced-motion users are not forced through heavy animations.
- Legal/footer links are not broken.

## Production acceptance

Production can be considered healthy only when all automated checks pass, critical routes work, Firebase Functions health check is healthy, and `www.urai.app` resolves to the intended Firebase Hosting site.
