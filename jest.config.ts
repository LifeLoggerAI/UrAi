import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testTimeout: 60000,
};

export default createJestConfig(config);
