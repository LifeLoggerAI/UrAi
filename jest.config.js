const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/tests/e2e/", "<rootDir>/.next/"],
  modulePathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/test-results/", "<rootDir>/playwright-report/"],
  watchPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/test-results/", "<rootDir>/playwright-report/"],
};

module.exports = createJestConfig(config);
