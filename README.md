# URAI

URAI is a passive emotional operating system prototype: a symbolic life mirror, mood forecast layer, memory constellation, and companion narrator experience.

The current V1 repo focus is the **demo spine**:

- `/` cinematic home scene
- `/u/adamclamp` public constellation demo
- `/api/companion` companion narrator endpoint
- `/api/waitlist` early-access capture endpoint
- seeded demo data for memory blooms, timeline stars, mood forecast, and weekly reflection
- Firebase rules/index scaffolding for V1 launch collections

## Quick start

```bash
npm install
npm run check:v1
npm run seed:demo
npm run dev
```

Then open:

```txt
http://localhost:3014
http://localhost:3014/u/adamclamp
```

## Validation

Run the V1 validation path before deploying or sharing the demo:

```bash
npm run check:v1
npm run seed:demo
npm run test:unit
npm run check:types
npm run build
npm run preflight
```

## Utility commands

| Command | Purpose |
| --- | --- |
| `npm run check:v1` | Verifies the required V1 files, scripts, dependencies, and Firebase config exist |
| `npm run seed:demo` | Writes `tmp/urai-demo-seed.json` |
| `npm run seed:firestore` | Writes demo seed data to Firestore when Firebase Admin env vars are configured |
| `npm run waitlist:export` | Exports `waitlistSignups` to `tmp/waitlist-export.csv` or a dry-run sample row locally |
| `npm run preflight` | Runs V1 sanity check, typecheck, lint, unit tests, and build |

## Important lockfile note

`package.json` has recently changed to include `firebase-admin`, `tailwindcss`, `postcss`, and `autoprefixer`.

Run:

```bash
npm install
```

Then commit the refreshed `package-lock.json`. See `docs/LOCKFILE_REFRESH.md` for the exact steps.

## Firebase configuration

The app expects a consistent set of Firebase environment variables that share the
`NEXT_PUBLIC_FIREBASE_` prefix. Populate these keys in your `.env.local` file by copying
`env.local.template`:

```bash
cp env.local.template .env.local
```

Public web config:

```txt
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

Server-side Firebase Admin access requires:

```txt
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

The waitlist route works in local dry-run mode without Admin credentials. With Admin credentials configured, `/api/waitlist` writes to `waitlistSignups/{normalizedEmail}`.

## Demo routes

| Route | Purpose |
| --- | --- |
| `/` | Home demo spine with symbolic ground, mood forecast, reflection, companion chat, and waitlist form |
| `/u/adamclamp` | Public constellation demo with blooms, timeline stars, forecast, reflection, and waitlist CTA |
| `/api/companion` | POST endpoint for mocked companion narrator responses |
| `/api/waitlist` | POST endpoint for early-access signups |

## Firebase deploy

Deploy rules and indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

See:

- `docs/API_V1.md`
- `docs/V1_DEPLOY_CHECKLIST.md`
- `docs/V1_QA_CHECKLIST.md`
- `docs/V1_MANUAL_TESTS.md`
- `docs/FIRESTORE_V1_COLLECTIONS.md`
- `docs/IMPLEMENTATION_NEXT.md`
- `docs/URAI_MASTER_COMPLETION_PROMPT.md`
