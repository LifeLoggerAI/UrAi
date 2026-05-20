# Pending Firestore Rules Review Fixes

PR #281 needs these follow-up changes before merge:

- Re-add `match /referrals/{id}` as an owner-scoped create/read collection with client updates/deletes denied.
- Change top-level profiles from `match /profiles/{id}` to `match /profiles/{uid}` and keep protected-field checks.
- Remove the dangling Tier 2 static anchor line that references `uid` outside a match scope.

This file is temporary documentation for the PR review state and is not launch evidence.
