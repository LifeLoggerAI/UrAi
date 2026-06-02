# URAI V1 Deploy Checklist

Use this checklist before treating the V1 demo spine as launch-ready.

## 1. Install dependencies

```bash
npm install
```

This is required after adding `firebase-admin`.

## 2. Configure environment

Copy the template:

```bash
cp env.local.template .env.local
```

Fill the public Firebase web keys:

```txt
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Fill server-only Firebase Admin keys for real waitlist persistence:

```txt
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

Local development works without Admin keys, but `/api/waitlist` will return `mode: dry-run` instead of writing to Firestore.

## 3. Generate demo seed artifact

```bash
npm run seed:demo
```

Expected output:

```txt
tmp/urai-demo-seed.json
```

## 4. Validate app

```bash
npm run check:types
npm run build
npm run preflight
```

## 5. Verify routes

Open locally:

```txt
/
/u/adamclamp
/api/companion
/api/waitlist
```

Expected behavior:

- `/` renders the home demo spine.
- `/u/adamclamp` renders public constellation, forecast, reflection, blooms, timeline, and waitlist CTA.
- `/api/companion` accepts POST requests and returns companion JSON.
- `/api/waitlist` accepts POST requests and either writes to Firestore or returns dry-run mode.

## 6. Deploy Firebase rules and indexes

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## 7. Deploy hosting/app

Use the configured Firebase hosting or app hosting deployment for the project.

## 8. Launch definition of done

V1 demo spine is launch-ready when:

- `npm run check:types` passes.
- `npm run build` passes.
- `/` loads without heavy video assets.
- `/u/adamclamp` loads without backend dependency.
- Waitlist dry-run works locally.
- Waitlist Firestore write works in configured environment.
- Firestore rules and indexes deploy successfully.
- No private passive, relationship, or memory data is publicly readable.
