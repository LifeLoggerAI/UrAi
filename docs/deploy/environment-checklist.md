# URAI Deployment Environment Checklist

Never commit `.env.local` or real secrets. Never expose server secrets with `NEXT_PUBLIC_` names. Missing optional environment variables should fail gracefully.

## Firebase public client

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Firebase admin / server

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

## AI

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `OPENAI_SUMMARY_MODEL`

## Admin

- `URAI_ADMIN_EMAILS`
- `NEXT_PUBLIC_URAI_FOUNDER_EMAILS` only if intentionally safe for the client bundle.

## Launch

- `NEXT_PUBLIC_URAI_PUBLIC_DEMO_ENABLED`
- `NEXT_PUBLIC_URAI_WAITLIST_ENABLED`
- `NEXT_PUBLIC_URAI_LAUNCH_STATUS`
- `NEXT_PUBLIC_URAI_APP_URL`

## Optional

- `NEXT_PUBLIC_ANALYTICS_ENABLED`
- `NEXT_PUBLIC_POSTHOG_KEY` or chosen analytics key
- `SENTRY_DSN` if used
- `RESEND_API_KEY` only if email responses are wired
- SMS provider variables only if SMS is actually wired

## Rules

- Never print environment values in UI.
- Never expose `OPENAI_API_KEY`, Firebase private key, email provider keys, or SMS keys in client code.
- Missing optional analytics/messaging should not block production build.
- Admin route should deny by default if admin config is missing.
