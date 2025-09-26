# UrAi

Trigger hosting build: tiny commit (added newline).

## Testing

### Unit tests

Run the Jest suite against the key onboarding and home flows:

```bash
npm test
```

Use watch mode during development:

```bash
npm run test:watch
```

### End-to-end tests

Install the Playwright browsers once locally:

```bash
npx playwright install
```

Then execute the onboarding → life map flow against the local Next.js dev server:

```bash
npm run test:e2e
```

To exercise the same journey with local Firebase emulators (matching CI), run:

```bash
npm run test:e2e:ci
```

The emulated run will spin up Firestore, Auth, and Storage emulators and shut them down automatically after the test suite finishes.

## Continuous integration

Pull requests are gated by the **ci** GitHub Actions workflow defined in `.github/workflows/ci.yml`. The pipeline installs dependencies, runs linting, TypeScript checks, Jest unit tests, and the Playwright suite inside Firebase emulators. Ensure the workflow succeeds before merging.
