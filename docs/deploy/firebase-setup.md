# URAI Firebase Setup

## Project setup

1. Create or select the Firebase project for URAI.
2. Enable Firebase Auth providers required for launch.
3. Enable Firestore.
4. Enable Storage only if upload/export storage is needed.
5. Add authorized domains for production and staging.
6. Add web app config values to hosting environment variables.

## Rules deployment

Deploy rules separately before or with app launch:

```bash
npm run deploy:rules
```

This deploys:

- `firestore.rules`
- `storage.rules`

## Firestore verification

Verify:

- User trees are owner-only.
- Waitlist allows public create only.
- Waitlist read/update/delete is admin-only.
- Admin collections are admin-only.
- Feature flags are not writable by public users.
- Public user data reads are denied.

## Storage verification

Verify:

- User files are private to the owner.
- Public assets are read-only.
- No public user export bucket is writable.
- Default rule denies unmatched paths.

## Admin access

Production should use custom claims for admin checks. Email allowlists are acceptable only as a temporary launch/admin bootstrap strategy.

## Indexes

Deploy Firestore indexes if `firestore.indexes.json` changes:

```bash
firebase deploy --only firestore:indexes
```
