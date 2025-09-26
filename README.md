# UrAi

Trigger hosting build: tiny commit (added newline).

## Firebase configuration

The app expects a consistent set of Firebase environment variables that share the
`NEXT_PUBLIC_FIREBASE_` prefix. Populate these keys in your `.env.local` file (copy
`env.local.template` to get started) so the web client can initialize Firebase:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

If you maintain separate staging and production Firebase projects, duplicate the
variables with an additional suffix (for example `NEXT_PUBLIC_FIREBASE_API_KEY_STAGING`)
and switch between them as needed. Server-side Firebase Admin access requires the
matching service account credentials (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`,
`FIREBASE_PRIVATE_KEY`). Store staging credentials locally when developing against a
staging backend and provide production credentials only in the deployment environment.

At runtime the Firebase module will log a descriptive error and fail fast if any of the
required keys are missing. This helps surface misconfiguration early—if you see the
error, revisit your `.env.local` to ensure every key above is defined.
