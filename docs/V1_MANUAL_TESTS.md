# URAI V1 Manual Test Recipes

Run these after `npm run dev` starts the app on port `3014`.

## Home route

Open:

```txt
http://localhost:3014/
```

Verify:

- Hero copy appears.
- Forecast card appears.
- Weekly reflection card appears.
- Companion chat appears.
- Waitlist form appears.
- CTA opens `/u/adamclamp`.

## Public constellation

Open:

```txt
http://localhost:3014/u/adamclamp
```

Verify:

- Public constellation heading appears.
- Forecast and reflection cards appear.
- Three memory blooms appear.
- Timeline stars appear.
- Waitlist form appears.

## Companion API

```bash
curl -X POST http://localhost:3014/api/companion \
  -H "Content-Type: application/json" \
  -d '{"message":"help me ship the repo","history":[]}'
```

Expected:

```json
{
  "moodTag": "focused"
}
```

Try a tender case:

```bash
curl -X POST http://localhost:3014/api/companion \
  -H "Content-Type: application/json" \
  -d '{"message":"I feel overwhelmed and stuck","history":[]}'
```

Expected:

```json
{
  "moodTag": "tender"
}
```

## Waitlist API dry-run

Without Firebase Admin env vars:

```bash
curl -X POST http://localhost:3014/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","source":"manual-test","handle":"adamclamp","intent":"early-access"}'
```

Expected:

```json
{
  "ok": true,
  "mode": "dry-run"
}
```

## Waitlist API with Firebase Admin

Configure:

```txt
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

Then retry the same waitlist request.

Expected:

- Response includes `ok: true` and an `id`.
- Firestore contains `waitlistSignups/test_example.com`.
- A second request with the same email returns `duplicate: true`.

## Final local gate

```bash
npm run seed:demo
npm run test:unit
npm run check:types
npm run build
npm run preflight
```
