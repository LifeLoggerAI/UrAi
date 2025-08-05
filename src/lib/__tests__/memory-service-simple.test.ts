// Simple test to verify memory service types and structure
import { MemoryService } from '../memory-service';

describe('MemoryService Types and Structure', () => {
  it('should have the correct static methods', () => {
    expect(typeof MemoryService.saveMemory).toBe('function');
    expect(typeof MemoryService.getMemories).toBe('function');
    expect(typeof MemoryService.getMemoriesByTags).toBe('function');
    expect(typeof MemoryService.deleteMemory).toBe('function');
    expect(typeof MemoryService.updateMemory).toBe('function');
  });

  it('should have correct collection name', () => {
    // Access private static readonly field through reflection
    const collectionName = (MemoryService as any).COLLECTION_NAME;
    expect(collectionName).toBe('memories');
  });
});