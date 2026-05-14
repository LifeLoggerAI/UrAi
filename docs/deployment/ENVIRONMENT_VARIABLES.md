# URAI Environment Variables

Copy `env.local.template` to `.env.local` for local development.

## Public Firebase web config

These are safe to expose to the browser and must share one Firebase project:

```txt
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Server Firebase Admin config

Required for server routes that write to Firestore outside client rules:

```txt
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

`FIREBASE_PRIVATE_KEY` should preserve newlines. In hosted environments, store it as a secret and never commit it.

## Optional production integrations

Use these only when the corresponding provider is live:

```txt
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
URAI_EXPORT_BUCKET=
URAI_SIGNED_URL_TTL_SECONDS=900
URAI_AI_PROVIDER=
URAI_AI_API_KEY=
URAI_NOTIFICATION_PROVIDER=
URAI_NOTIFICATION_API_KEY=
URAI_CONTACT_TO_EMAIL=
URAI_SUPPORT_EMAIL=
```

## Local demo behavior

The waitlist and demo routes should continue to run in local dry-run mode when Admin credentials are absent. Production deploys should configure Admin credentials and Firebase project secrets before enabling write-heavy flows.

## Secret handling rules

- Do not commit `.env.local`.
- Do not paste private keys into docs, issues, or PR comments.
- Rotate keys after any suspected exposure.
- Keep Stripe/webhook secrets out of browser-visible `NEXT_PUBLIC_` variables.
