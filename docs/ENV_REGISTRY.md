# URAI Environment Registry

Do not invent Firebase project IDs, API keys, service accounts, or deployment domains. Populate these through local `.env.local`, GitHub Actions secrets, Firebase hosting config, or the deployment platform secret store.

## Public web Firebase config

| Variable | Required locally | Required staging | Required production | Purpose |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Yes | Yes | Firebase web app API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Yes | Yes | Firebase Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Yes | Yes | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Yes | Yes | Firebase Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Yes | Yes | Firebase web messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Yes | Yes | Firebase web app ID |

## Server-side Firebase Admin config

| Variable | Required locally | Required staging | Required production | Purpose |
| --- | --- | --- | --- | --- |
| `FIREBASE_PROJECT_ID` | Optional for dry-run | Yes | Yes | Admin SDK project ID |
| `FIREBASE_CLIENT_EMAIL` | Optional for dry-run | Yes | Yes | Admin SDK service account email |
| `FIREBASE_PRIVATE_KEY` | Optional for dry-run | Yes | Yes | Admin SDK private key; preserve newline escaping |

Without Admin credentials, `/api/waitlist` must remain in dry-run mode and must not pretend that a Firestore write occurred.

## Release/evidence gates

| Variable | Required locally | Required staging | Required production | Purpose |
| --- | --- | --- | --- | --- |
| `URAI_P0_RUN_COMMANDS` | Optional | Optional | Optional | Allows P0 gate to execute commands instead of static checks only |
| `URAI_P0_*_VERIFIED` | No | Yes for release evidence | Yes for release evidence | Manual launch evidence flags consumed by launch-gate scripts |

## Future services

The following are not required for V1 unless the related feature is implemented and safety-gated:

| Variable | Feature | V1 status |
| --- | --- | --- |
| `OPENAI_API_KEY` | Live AI companion/model calls | Not required; companion is deterministic/mock in V1 |
| `ASSET_FACTORY_API_KEY` | Studio/export job service | Future phase |
| `RENDER_API_URL` | Python/Render enrichment backend | Future phase / not verified |
| `SMS_PROVIDER_API_KEY` | SMS notifications | Future phase |
| `EMAIL_PROVIDER_API_KEY` | Email reports/notifications | Future phase |

## Required checks

Before public sharing:

```bash
npm run check:v1
npm run check:firestore-contract
npm run test:unit
npm run check:types
npm run lint
npm run build
npm run preflight
```
