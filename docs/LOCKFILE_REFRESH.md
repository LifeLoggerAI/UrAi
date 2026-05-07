# Lockfile Refresh Requirement

`package.json` has changed to add production/build dependencies:

- `firebase-admin`
- `tailwindcss`
- `postcss`
- `autoprefixer`

The checked-in `package-lock.json` must be regenerated before CI should return to `npm ci`.

## Refresh steps

Run locally from the repo root:

```bash
npm install
npm run seed:demo
npm run test:unit
npm run check:types
npm run build
npm run preflight
```

Then commit the updated lockfile:

```bash
git add package-lock.json
git commit -m "Refresh package lockfile"
```

## CI note

`.github/workflows/ci.yml` temporarily uses `npm install` so dependency changes do not fail only because the lockfile is stale.

After `package-lock.json` is refreshed and committed, update CI back to:

```yaml
- run: npm ci
```

This restores deterministic dependency installs for CI.
