# URAI Firebase Auth Notes

Developer-only setup notes for Pass 24: Auth + Account + User State Foundation.

## Providers

Enable only the Firebase Auth providers you plan to ship:

- Anonymous auth: enables the calm anonymous sync path.
- Google provider: enables Google sign-in.
- Email/Password: enables email sign-in, account creation, and password reset.

URAI must remain usable in local-only mode when Firebase Auth is missing, unavailable, or a provider is not configured.

## Domains

Before production launch:

- Add the production domain to Firebase Auth authorized domains.
- Add the staging domain if staging uses auth.
- Verify popup sign-in works on the deployed domain.

## Account profile path

Pass 24 stores safe account state at:

```text
users/{userId}
```

No sensitive Passport layers should be enabled by account creation. Account creation must not open Shadow, Legacy, Companion memory, Exports, or private signal sync.

## Deletion flow

The client marks the account path as `pending_deletion`, then `deleted`, then calls Firebase Auth account deletion. If backend deletion jobs are added later, keep UI copy honest: do not claim instant permanent deletion unless that job is implemented and verified.

## Security rules

Firestore rules should keep:

```text
allow read, write: if request.auth != null && request.auth.uid == userId;
```

or stricter validation for `users/{userId}`. Admin/founder paths must remain locked behind admin claims.

## Verification

Check all of the following before release:

- Local-only mode works with no Firebase config.
- Anonymous auth works only when enabled in Firebase.
- Google/email paths fail gracefully when providers are not configured.
- No raw Firebase errors appear in UI.
- Cloud sync requires sign-in and explicit user choice.
- Passport remains the source of permission truth.
- Account deletion requires confirmation.
- Sign-out stops cloud sync and asks whether to keep local data.
- Genesis remains accessible without a login wall.
