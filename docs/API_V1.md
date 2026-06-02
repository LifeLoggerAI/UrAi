# URAI V1 API

These endpoints support the V1 public demo spine. They do not represent the full future passive-sensing product.

## POST /api/companion

Returns a deterministic mocked companion narrator response with safety boundaries.

The companion is not a therapist, doctor, lawyer, crisis service, or diagnostic system. It should stay reflective and implementation-focused until a live model integration has safety tests, rate limiting, consent-aware data access, and review.

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

### Safety response example

Diagnosis, prescription, legal, medical, or crisis-like phrasing returns a boundary response rather than advice.

```json
{
  "reply": "URAI Companion is a reflective demo guide, not a therapist...",
  "moodTag": "threshold",
  "insights": [
    "Keep companion output reflective, not clinical.",
    "Use URAI as a pattern journal, not a diagnostic authority."
  ]
}
```

### Behavior

- Empty message returns `400`.
- Build/ship/deploy language returns `focused`.
- Stuck/overwhelmed language returns `tender`.
- Vision/investor/roadmap language returns `threshold`.
- Diagnosis/clinical/legal/medical authority requests return a safety boundary.
- Crisis/self-harm language returns crisis-safe fallback copy.
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

### Rate-limit response

Repeated attempts from the same request key may return:

```json
{
  "error": "Too many waitlist attempts. Please try again soon."
}
```

Status: `429`

Header: `Retry-After: <seconds>`

### Behavior

- Invalid email returns `400`.
- Email is normalized to lowercase.
- Optional text fields are trimmed and length-limited.
- Firestore document ID is derived from normalized email.
- Duplicate signups update `updatedAt`, `lastSource`, `lastHandle`, `lastIntent`, and `status`.
- Client Firestore rules deny direct reads/writes to `waitlistSignups`; writes happen through the server route.
