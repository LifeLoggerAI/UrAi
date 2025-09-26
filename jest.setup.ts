jest.mock('@/lib/firebase', () => ({
  app: {},
  auth: jest.fn(),
  storage: jest.fn(),
  db: jest.fn(),
}));
