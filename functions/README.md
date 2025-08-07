# Cloud Functions Testing

This directory contains the Firebase Cloud Functions with a complete testing setup using Jest and firebase-functions-test.

## Testing Setup

### Dependencies
- **Jest**: Testing framework
- **@types/jest**: TypeScript types for Jest
- **ts-jest**: TypeScript preprocessor for Jest
- **firebase-functions-test**: Testing utilities for Firebase Functions

### Test Configuration
- **jest.config.js**: Jest configuration with TypeScript support
- **__tests__/setup.ts**: Global test setup and Firebase Functions Test initialization
- **__tests__/**: Test files directory

### Available Scripts

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run integration tests with Firebase emulators
npm run test:integration
```

### From Root Directory

```bash
# Run function tests from root
npm run test:functions

# Run integration tests from root
npm run test:functions:integration
```

## Sample Function

The `helloWorld` function in `src/helloWorld.ts` serves as an example of:
- Firebase Cloud Function using `onCall`
- Utility function for business logic
- Comprehensive unit tests covering both function types

## Test Coverage

Coverage is configured to:
- Collect coverage for the `helloWorld.ts` file
- Generate HTML, LCOV, and text reports
- Enforce 80% coverage thresholds
- Output coverage to `coverage/` directory (gitignored)

## CI/CD Integration

The GitHub Actions workflow automatically:
1. Installs function dependencies
2. Runs function tests
3. Runs function tests with coverage
4. Validates Firebase secrets before deployment
5. Only deploys if all tests pass

## Writing New Tests

1. Create test files in `__tests__/` with `.test.ts` extension
2. Import functions from `../src/`
3. Use `firebase-functions-test` for testing Cloud Functions
4. Use standard Jest assertions for utility functions

Example:
```typescript
import firebaseFunctionsTest from 'firebase-functions-test';
import { myFunction } from '../src/myFunction';

const testEnv = firebaseFunctionsTest();

describe('myFunction', () => {
  afterAll(() => {
    testEnv.cleanup();
  });

  it('should work correctly', async () => {
    // Test implementation
  });
});
```

## Firebase Functions Testing Patterns

- **Callable Functions**: Use `firebase-functions-test` to wrap and test
- **Utility Functions**: Test directly with Jest
- **Async Functions**: Use async/await in tests
- **Mocking**: Mock external dependencies as needed

## Coverage Reports

After running `npm run test:coverage`:
- View HTML report: `open coverage/lcov-report/index.html`
- LCOV file for CI: `coverage/lcov.info`
- Text summary printed to console