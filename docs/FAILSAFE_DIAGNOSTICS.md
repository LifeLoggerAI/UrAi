# Failsafe Diagnostics

## Goal
Keep local/demo routes functional when private credentials are unavailable.

## Checklist
- Confirm `.env.local` exists and required Firebase public keys are populated.
- If admin secrets are missing, keep writes in dry-run mode where supported.
- Keep waitlist and companion routes returning explicit fallback responses.

## Suggested command order
- `npm install`
- `npm run doctor`
- `npm run check:v1`
- `npm run check:types`
- `npm run lint`
- `npm run test:unit`
- `npm run build`
