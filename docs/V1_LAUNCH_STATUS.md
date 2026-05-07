# URAI V1 Launch Status

## Current status

V1 demo spine is implemented and repo-wired, but still needs local/CI runtime validation and a refreshed `package-lock.json`.

## Implemented

- Home demo route at `/`
- Public constellation route at `/u/adamclamp`
- Companion narrator UI
- Companion API route
- Extracted companion engine
- Waitlist UI
- Waitlist API route
- Firebase Admin helper
- Waitlist Firestore persistence path
- Duplicate-safe waitlist writes
- Firestore rules and indexes wiring
- Demo seed JSON generation
- Optional Firestore seed command
- Waitlist CSV export command
- V1 sanity checker
- Lockfile staleness checker
- Tailwind config
- PostCSS config
- Playwright config
- V1 route smoke tests
- SEO/Open Graph metadata
- Robots and sitemap metadata routes
- Product, API, QA, deploy, privacy, consent, AI safety, and demo docs

## Known blocker

`package-lock.json` is stale after dependency changes.

Run locally:

```bash
npm install
```

Then commit:

```bash
git add package-lock.json
git commit -m "Refresh package lockfile"
```

## Required validation

```bash
npm run check:v1
npm run check:lockfile
npm run seed:demo
npm run test:unit
npm run check:types
npm run build
npm run preflight
npm run test:smoke
```

## Firebase validation

With Firebase Admin env vars configured:

```bash
npm run seed:firestore
npm run waitlist:export
firebase deploy --only firestore:rules,firestore:indexes
```

## Launch readiness checklist

- [ ] `package-lock.json` refreshed and committed
- [ ] `npm run check:lockfile` passes
- [ ] `npm run preflight` passes
- [ ] `npm run test:smoke` passes
- [ ] `/` checked on mobile and desktop
- [ ] `/u/adamclamp` checked on mobile and desktop
- [ ] Waitlist dry-run checked locally
- [ ] Waitlist Firestore write checked in configured environment
- [ ] Firestore rules/indexes deployed
- [ ] `NEXT_PUBLIC_SITE_URL` set for deployment
