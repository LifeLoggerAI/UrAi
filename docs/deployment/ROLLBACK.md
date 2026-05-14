# URAI Rollback

Use rollback when production deploy introduces a critical failure that cannot be fixed immediately.

## Hosting rollback

List Hosting releases:

```bash
firebase hosting:releases:list --site urai-4dc1d
```

Rollback to the previous known-good release from the Firebase Console or deploy the previous Git commit:

```bash
git checkout <known-good-commit>
npm install
npm run build
firebase deploy --only hosting:urai-4dc1d
```

## Functions rollback

If a new function breaks but older functions are stable, redeploy the previous commit:

```bash
git checkout <known-good-commit>
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

For emergency containment, disable the feature flag or keep the facade returning accepted/no-op responses until the provider integration is fixed.

## Firestore and Storage rules rollback

Redeploy previous rules files:

```bash
git checkout <known-good-commit> -- firestore.rules firestore.indexes.json storage.rules
firebase deploy --only firestore:rules,firestore:indexes,storage
```

## Data safety during rollback

- Do not delete user data as part of rollback unless a data corruption incident requires a documented remediation.
- Preserve `adminAuditLogs`, `safetyEvents`, and export/deletion request records.
- Pause scheduled jobs if they are generating bad data.
- Record incident timing, affected users, rollback commit, and verification commands.

## Rollback verification

After rollback, run:

```bash
npm run verify:release
curl -I https://www.urai.app/
```

Then verify the critical routes and the Firebase Function health check.
