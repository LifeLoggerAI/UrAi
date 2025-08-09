"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_functions_test_1 = require("firebase-functions-test");
// Initialize the testing environment
var testEnv = (0, firebase_functions_test_1.default)();
// Set up any global test configuration here
beforeAll(function () {
    // Set any required environment variables for testing
    process.env.GOOGLE_GENAI_API_KEY = 'test-api-key';
});
afterAll(function () {
    // Clean up after all tests
    testEnv.cleanup();
});
