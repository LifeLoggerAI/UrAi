# URAI Render / Backend Notes

URAI Genesis can launch without a separate Render/Python backend if the Next.js API routes handle Companion, waitlist, and admin status.

## Future backend service

If a Render backend is added later, document:

- Backend service URL
- Health endpoint
- CORS origin allowlist
- Timeout expectations
- Server-only environment variables
- Deployment branch

## Safety rules

- No sensitive logs.
- No raw transcript logs.
- No raw Gmail, location, health, or Shadow content in logs.
- AI route must fall back safely if the backend is unavailable.
- CORS should allow only approved URAI domains.
- Backend outages must not break the public demo or Passport privacy defaults.

## Optional health check

Use a simple health endpoint only if implemented:

```text
GET /health
```

Expected response should be a boolean or short status, not secrets or internal stack details.
