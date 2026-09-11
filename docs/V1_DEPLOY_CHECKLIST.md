# URAI V1 Legacy Verification Checklist

`LifeLoggerAI/UrAi` is a historical/legacy repository. It is **NEVER DEPLOY** and is not current UrAi production authority.

This checklist exists only to keep legacy source locally reproducible and to prevent historical deployment instructions from being mistaken for current authority.

## 1. Install dependencies

```bash
npm install
```

## 2. Configure local-only environment

Copy the template:

```bash
cp env.local.template .env.local
```

Public Firebase web values may be supplied only for non-authoritative local UI verification when needed:

```txt
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Do **not** configure private-key or service-account deployment credentials in this legacy repository. `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL` paired with key material, `FIREBASE_SERVICE_ACCOUNT_KEY`, raw/base64 service-account JSON, `credentials_json`, and `FIREBASE_TOKEN` are not authorized here.

## 3. Generate deterministic local demo fixture

```bash
npm run seed:demo
```

Expected local output:

```txt
tmp/urai-demo-seed.json
```

The fixture is synthetic and local-only. `npm run seed:firestore` / `--firestore` must fail closed under the legacy quarantine.

## 4. Validate legacy source

```bash
npm run check:types
npm run build
npm run check:legacy-production-disabled
```

Any release/launch command must preserve the explicit legacy production block.

## 5. Local route checks

Historical routes may be exercised locally for regression/reference purposes only. A working local route is not deployment, production, canonical-product, or provider evidence.

## 6. Provider mutation is forbidden

Do not deploy Firestore rules, indexes, Hosting, Functions, App Hosting, or any other provider resource from this repository. Do not seed Firestore or export customer/provider data from it.

Current provider work belongs to the canonical governed UrAi system and must use its own exact-head WIF/ADC, review, deployment, readback, monitoring/recovery, and rollback authority.

## 7. Legacy definition of done

This legacy source is safely contained when:

- local deterministic source checks pass;
- local synthetic demo generation works;
- Firestore/provider mutation commands fail closed;
- no long-lived Firebase/service-account credential path remains executable or recommended;
- production deployment commands remain blocked;
- no private passive, relationship, memory, customer, or provider data is accessed;
- documentation clearly identifies this repository as historical and non-authoritative.

**Classification: LEGACY SOURCE VERIFICATION ONLY / NEVER DEPLOY / NO PROVIDER OR PRODUCTION AUTHORITY.**
