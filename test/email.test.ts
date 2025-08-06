import { describe, test, expect, jest, beforeAll } from '@jest/globals';

// Mock Firebase completely
const mockAddDoc = jest.fn().mockResolvedValue({ id: 'test-email-id' });
const mockCollection = jest.fn().mockReturnValue('mock-collection');
const mockServerTimestamp = jest.fn().mockReturnValue('server-timestamp');

jest.mock('firebase/firestore', () => ({
  addDoc: mockAddDoc,
  collection: mockCollection,
  serverTimestamp: mockServerTimestamp,
}));

jest.mock('../src/lib/firebase', () => ({
  db: 'mock-db',
}));

describe('Email Utils', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  test('sendTransactionalEmail function exists and has correct structure', async () => {
    // Import after mocking
    const { sendTransactionalEmail } = require('../src/utils/email');
    
    await sendTransactionalEmail(
      'test@example.com',
      'Test Subject',
      '<h1>Test HTML</h1>'
    );

    expect(mockCollection).toHaveBeenCalledWith('mock-db', 'emails');
    expect(mockAddDoc).toHaveBeenCalledWith(
      'mock-collection',
      {
        to: 'test@example.com',
        subject: 'Test Subject',
        body: '<h1>Test HTML</h1>',
        sent: false,
        createdAt: 'server-timestamp',
      }
    );
  });

  test('sendWelcomeEmail creates proper welcome email', async () => {
    const { sendWelcomeEmail } = require('../src/utils/email');
    
    await sendWelcomeEmail('user@example.com', 'John Doe');

    expect(mockAddDoc).toHaveBeenCalledWith(
      'mock-collection',
      expect.objectContaining({
        to: 'user@example.com',
        subject: 'Welcome to UrAi 🎉',
        sent: false,
      })
    );

    const emailBody = mockAddDoc.mock.calls[mockAddDoc.mock.calls.length - 1][1].body;
    expect(emailBody).toContain('Hi John Doe');
    expect(emailBody).toContain('Welcome to UrAi!');
  });
});