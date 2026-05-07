# URAI V1 API

These endpoints support the V1 demo spine.

## POST /api/companion

Returns a mocked companion narrator response.

### Request

```json
{
  "message": "help me ship the repo",
  "history": []
}
```

### Response

```json
{
  "reply": "Good. This is build energy...",
  "moodTag": "focused",
  "insights": [
    "Implementation energy is rising.",
    "Ship the demo spine before expanding the symbolic layer."
  ]
}
```

### Behavior

- Empty message returns `400`.
- Build/ship/deploy language returns `focused`.
- Stuck/overwhelmed language returns `tender`.
- Vision/investor/roadmap language returns `threshold`.
- Default response returns `calm`.

## POST /api/waitlist

Captures early-access signup intent.

### Request

```json
{
  "email": "person@example.com",
  "source": "public-constellation",
  "handle": "adamclamp",
  "intent": "early-access"
}
```

### Local dry-run response

When Firebase Admin credentials are not configured:

```json
{
  "ok": true,
  "mode": "dry-run",
  "signup": {
    "email": "person@example.com",
    "source": "public-constellation",
    "handle": "adamclamp",
    "intent": "early-access",
    "createdAt": "2026-05-07T00:00:00.000Z",
    "updatedAt": "2026-05-07T00:00:00.000Z",
    "status": "joined"
  }
}
```

### Firestore response

When Firebase Admin credentials are configured:

```json
{
  "ok": true,
  "id": "person_example.com",
  "signup": {
    "email": "person@example.com",
    "source": "public-constellation",
    "handle": "adamclamp",
    "intent": "early-access",
    "createdAt": "2026-05-07T00:00:00.000Z",
    "updatedAt": "2026-05-07T00:00:00.000Z",
    "status": "joined"
  }
}
```

### Duplicate response

Repeated signups update the existing document and return:

```json
{
  "ok": true,
  "id": "person_example.com",
  "duplicate": true
}
```

### Behavior

- Invalid email returns `400`.
- Email is normalized to lowercase.
- Optional text fields are trimmed and length-limited.
- Firestore document ID is derived from normalized email.
- Client Firestore rules deny direct reads/writes to `waitlistSignups`; writes happen through the server route.
