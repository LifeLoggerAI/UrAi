import { checkRateLimit } from '../src/middleware';

const store = new Map<string, any>();

jest.mock('firebase-admin', () => {
  return {
    apps: [],
    initializeApp: jest.fn(),
    firestore: () => ({
      collection: () => ({
        doc: (id: string) => ({
          get: async () => ({
            exists: store.has(id),
            data: () => store.get(id),
          }),
          set: async (data: any) => {
            store.set(id, {
              ...data,
              expiresAt: { toMillis: () => data.expiresAt.getTime() },
            });
          },
          update: async (data: any) => {
            const current = store.get(id);
            store.set(id, {
              ...current,
              ...data,
              expiresAt: {
                toMillis: () => (data.expiresAt ? data.expiresAt.getTime() : current.expiresAt.toMillis()),
              },
            });
          },
        }),
      }),
    }),
  };
});

describe('checkRateLimit', () => {
  it('rejects after 30 requests in a minute', async () => {
    const ip = '1.1.1.1';
    for (let i = 0; i < 30; i++) {
      const allowed = await checkRateLimit(ip);
      expect(allowed).toBe(true);
    }
    const final = await checkRateLimit(ip);
    expect(final).toBe(false);
  });
});
