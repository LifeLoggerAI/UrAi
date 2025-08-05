// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
}));

jest.mock('../firebase', () => ({
  db: {},
}));

import { MemoryService, saveMemory, getMemories } from '../memory-service';
import { Memory } from '../types';

// Get mocked functions
import { 
  collection as mockCollection,
  doc as mockDoc,
  setDoc as mockSetDoc,
  getDocs as mockGetDocs,
  query as mockQuery,
  where as mockWhere,
  orderBy as mockOrderBy,
  limit as mockLimit,
} from 'firebase/firestore';

describe('MemoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockCollection as jest.Mock).mockReturnValue('mockCollection');
    (mockDoc as jest.Mock).mockReturnValue('mockDoc');
    (mockQuery as jest.Mock).mockReturnValue('mockQuery');
    (mockWhere as jest.Mock).mockReturnValue('mockWhere');
    (mockOrderBy as jest.Mock).mockReturnValue('mockOrderBy');
    (mockLimit as jest.Mock).mockReturnValue('mockLimit');
  });

  describe('saveMemory', () => {
    it('should save a memory with correct structure', async () => {
      const userId = 'user123';
      const tag = 'test-tag';
      const payload = { content: 'test content', type: 'chat' };
      const source = 'companion-chat';

      await MemoryService.saveMemory(userId, tag, payload, source);

      expect(mockCollection).toHaveBeenCalledWith({}, 'memories');
      expect(mockDoc).toHaveBeenCalled();
      expect(mockSetDoc).toHaveBeenCalled();

      const setDocCall = (mockSetDoc as jest.Mock).mock.calls[0];
      const savedMemory = setDocCall[1];

      expect(savedMemory).toMatchObject({
        userId,
        tag,
        payload,
        source,
      });
      expect(savedMemory.id).toContain(userId);
      expect(savedMemory.id).toContain(tag);
      expect(savedMemory.createdAt).toBeDefined();
      expect(savedMemory.updatedAt).toBeDefined();
    });

    it('should save a memory without source parameter', async () => {
      const userId = 'user123';
      const tag = 'test-tag';
      const payload = { content: 'test content' };

      await MemoryService.saveMemory(userId, tag, payload);

      expect(mockSetDoc).toHaveBeenCalled();
      const setDocCall = (mockSetDoc as jest.Mock).mock.calls[0];
      const savedMemory = setDocCall[1];

      expect(savedMemory.source).toBeUndefined();
    });
  });

  describe('getMemories', () => {
    it('should retrieve memories for a user', async () => {
      const userId = 'user123';
      const mockMemories = [
        {
          id: 'memory1',
          userId,
          tag: 'chat-message',
          payload: { content: 'Hello' },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'memory2',
          userId,
          tag: 'project-plan',
          payload: { content: 'Project details' },
          createdAt: Date.now() - 1000,
          updatedAt: Date.now() - 1000,
        },
      ];

      const mockQuerySnapshot = {
        forEach: jest.fn((callback) => {
          mockMemories.forEach((memory) => {
            callback({ data: () => memory });
          });
        }),
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot);

      const result = await MemoryService.getMemories(userId);

      expect(mockCollection).toHaveBeenCalledWith({}, 'memories');
      expect(mockQuery).toHaveBeenCalled();
      expect(mockWhere).toHaveBeenCalledWith('userId', '==', userId);
      expect(mockOrderBy).toHaveBeenCalledWith('createdAt', 'desc');
      expect(mockLimit).toHaveBeenCalledWith(50);
      expect(result).toHaveLength(2);
      expect(result[0].tag).toBe('chat-message');
    });

    it('should filter memories by exact tag', async () => {
      const userId = 'user123';
      const tag = 'project-plan';
      const mockMemories = [
        {
          id: 'memory1',
          userId,
          tag: 'project-plan',
          payload: { content: 'Project details' },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      const mockQuerySnapshot = {
        forEach: jest.fn((callback) => {
          mockMemories.forEach((memory) => {
            callback({ data: () => memory });
          });
        }),
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot);

      const result = await MemoryService.getMemories(userId, tag);

      expect(mockWhere).toHaveBeenCalledWith('userId', '==', userId);
      expect(mockWhere).toHaveBeenCalledWith('tag', '==', tag);
      expect(result).toHaveLength(1);
      expect(result[0].tag).toBe('project-plan');
    });
  });

  describe('convenience functions', () => {
    it('should call MemoryService.saveMemory', async () => {
      const spy = jest.spyOn(MemoryService, 'saveMemory');
      spy.mockResolvedValue();

      const userId = 'user123';
      const tag = 'test-tag';
      const payload = { content: 'test' };

      await saveMemory(userId, tag, payload);

      expect(spy).toHaveBeenCalledWith(userId, tag, payload, undefined);
    });

    it('should call MemoryService.getMemories and return payloads', async () => {
      const mockMemories = [
        {
          id: 'memory1',
          userId: 'user123',
          tag: 'test',
          payload: { content: 'Hello' },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      const spy = jest.spyOn(MemoryService, 'getMemories');
      spy.mockResolvedValue(mockMemories);

      const result = await getMemories('user123', 'test');

      expect(spy).toHaveBeenCalledWith('user123', 'test');
      expect(result).toEqual([{ content: 'Hello' }]);
    });
  });
});