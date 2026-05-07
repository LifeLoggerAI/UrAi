# Pull Request

## Summary

Describe what changed and why.

## Change type

- [ ] App/UI
- [ ] API/backend
- [ ] Firebase/rules/indexes
- [ ] Docs
- [ ] Tests/tooling
- [ ] Safety/privacy
- [ ] Launch/deploy

## V1 routes affected

- [ ] `/`
- [ ] `/u/adamclamp`
- [ ] `/api/companion`
- [ ] `/api/waitlist`
- [ ] Not route-related

## Validation

Run what applies and check the boxes:

- [ ] `npm run check:v1`
- [ ] `npm run seed:demo`
- [ ] `npm run test:unit`
- [ ] `npm run check:types`
- [ ] `npm run build`
- [ ] `npm run preflight`
- [ ] `npm run test:smoke`
- [ ] `npm run check:lockfile` after `npm install`

## Firebase / data safety

- [ ] No private passive, relationship, or memory data is exposed publicly
- [ ] Private user-owned documents use `ownerUid` when applicable
- [ ] Waitlist writes remain server-side only
- [ ] Firestore rules/indexes updated if schema changed
- [ ] No new silent/passive data collection without explicit consent docs

## Companion / AI safety

- [ ] Companion copy avoids diagnosis or clinical claims
- [ ] Companion does not encourage isolation or dependency
- [ ] High-risk emotional cases are handled conservatively or left out of scope
- [ ] AI safety docs updated if behavior changed

## Screenshots / demo notes

Add screenshots or a short demo note for UI changes.

## Related issue(s)

Closes #
