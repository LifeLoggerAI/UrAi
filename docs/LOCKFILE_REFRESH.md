# Lockfile Refresh Requirement

`package.json` has changed and the checked-in `package-lock.json` must be regenerated before CI should return to deterministic `npm ci` installs.

## Current validation behavior

`npm run check:lockfile` now performs two checks:

1. Confirms every root `dependencies` and `devDependencies` entry from `package.json` exists in the lockfile root package.
2. Runs:

```bash
npm ci --dry-run --ignore-scripts --no-audit --no-fund
```

The dry run catches version and nested dependency drift that a root-name-only check can miss.

## Refresh steps

Run locally from the repo root:

```bash
npm install
npm run check:lockfile
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

CI workflows temporarily use `npm install` so dependency changes do not fail only because the lockfile is stale.

After `package-lock.json` is refreshed and committed, update CI back to:

```yaml
- run: npm ci
```

Only restore `npm ci` after `npm run check:lockfile` passes from a clean checkout. This restores deterministic dependency installs for CI.
