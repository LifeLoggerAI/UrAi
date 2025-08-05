import firebaseFunctionsTest from 'firebase-functions-test';

// Initialize the testing environment
const testEnv = firebaseFunctionsTest();

// Set up any global test configuration here
beforeAll(() => {
  // Set any required environment variables for testing
  process.env.GOOGLE_GENAI_API_KEY = 'test-api-key';
});

afterAll(() => {
  // Clean up after all tests
  testEnv.cleanup();
});