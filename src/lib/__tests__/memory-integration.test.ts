/**
 * Integration test for AI flows with memory cross-referencing
 * 
 * Tests the end-to-end functionality of memory persistence and retrieval
 * across sequential AI operations (chat, transcription, summarization).
 */

import { MemoryService } from '../memory-service';

// Mock the AI flows
jest.mock('../../ai/flows/companion-chat', () => ({
  companionChat: jest.fn(),
}));

jest.mock('../../ai/flows/summarize-text', () => ({
  summarizeText: jest.fn(),
}));

// Mock Firebase
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

describe('AI Flow Memory Integration', () => {
  const testUserId = 'test-user-123';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should store and retrieve memories across AI flows', async () => {
    // Mock Firebase operations
    const mockMemories = new Map();
    const mockSetDoc = require('firebase/firestore').setDoc as jest.Mock;
    const mockGetDocs = require('firebase/firestore').getDocs as jest.Mock;
    
    mockSetDoc.mockImplementation(async (docRef, data) => {
      mockMemories.set(data.id, data);
    });

    mockGetDocs.mockImplementation(async () => ({
      forEach: (callback: any) => {
        Array.from(mockMemories.values())
          .filter((memory: any) => memory.userId === testUserId)
          .forEach((memory: any) => {
            callback({ data: () => memory });
          });
      }
    }));

    // Test 1: Save a chat memory
    const chatMemory = {
      userMessage: 'Tell me about my goals',
      aiResponse: 'Let me help you explore your goals',
      timestamp: Date.now(),
      context: 'companion-chat'
    };

    await MemoryService.saveMemory(testUserId, 'chat-goals', chatMemory, 'companion-chat');

    // Test 2: Retrieve memories (should include the chat memory)
    const retrievedMemories = await MemoryService.getMemories(testUserId);
    
    expect(retrievedMemories).toHaveLength(1);
    expect(retrievedMemories[0].payload).toEqual(chatMemory);
    expect(retrievedMemories[0].source).toBe('companion-chat');

    // Test 3: Save a summary memory that could reference chat
    const summaryMemory = {
      summary: 'User is focused on goal-setting and planning',
      originalTextLength: 100,
      timestamp: Date.now(),
      period: '2024-01-01',
      source: 'summarize-text'
    };

    await MemoryService.saveMemory(testUserId, 'summary-goals', summaryMemory, 'summarize-text');

    // Test 4: Retrieve all memories (should include both)
    const allMemories = await MemoryService.getMemories(testUserId);
    expect(allMemories).toHaveLength(2);

    // Test 5: Retrieve memories by tag pattern
    const goalMemories = await MemoryService.getMemories(testUserId, '*goals*');
    expect(goalMemories).toHaveLength(2);

    // Test 6: Retrieve specific tag type
    const chatMemories = await MemoryService.getMemories(testUserId, 'chat-goals');
    expect(chatMemories).toHaveLength(1);
    expect(chatMemories[0].payload.context).toBe('companion-chat');
  });

  it('should handle memory tagging conventions correctly', async () => {
    const testDate = '2024-01-01';
    
    // Test different tagging conventions
    const memoriesToSave = [
      { tag: `transcript-${testDate}`, payload: { transcript: 'Test transcript' }, source: 'transcribe-audio' },
      { tag: `summary-${testDate}`, payload: { summary: 'Test summary' }, source: 'summarize-text' },
      { tag: `chat-${Date.now()}`, payload: { conversation: 'Test chat' }, source: 'companion-chat' },
      { tag: 'project-plan', payload: { plan: 'Test project plan' }, source: 'manual' },
    ];

    // Mock Firebase operations
    const mockMemories = new Map();
    const mockSetDoc = require('firebase/firestore').setDoc as jest.Mock;
    const mockGetDocs = require('firebase/firestore').getDocs as jest.Mock;
    
    mockSetDoc.mockImplementation(async (docRef, data) => {
      mockMemories.set(data.id, data);
    });

    mockGetDocs.mockImplementation(async () => ({
      forEach: (callback: any) => {
        Array.from(mockMemories.values())
          .filter((memory: any) => memory.userId === testUserId)
          .forEach((memory: any) => {
            callback({ data: () => memory });
          });
      }
    }));

    // Save all memories
    for (const memory of memoriesToSave) {
      await MemoryService.saveMemory(testUserId, memory.tag, memory.payload, memory.source);
    }

    // Test retrieving by date-based patterns
    const transcriptMemories = await MemoryService.getMemories(testUserId, `transcript-*`);
    expect(transcriptMemories).toHaveLength(1);

    // Test retrieving by source type
    const summaryMemories = await MemoryService.getMemories(testUserId, `summary-*`);
    expect(summaryMemories).toHaveLength(1);

    // Test retrieving chat memories
    const chatMemories = await MemoryService.getMemories(testUserId, `chat-*`);
    expect(chatMemories).toHaveLength(1);

    // Test retrieving specific project memories
    const projectMemories = await MemoryService.getMemories(testUserId, 'project-plan');
    expect(projectMemories).toHaveLength(1);
  });

  it('should support cross-referencing between different AI flows', async () => {
    // Simulate a workflow where:
    // 1. User uploads audio -> transcription saves memory
    // 2. User asks for summary -> summary retrieves transcription memory
    // 3. User chats -> chat retrieves both transcript and summary memories

    const mockMemories = new Map();
    const mockSetDoc = require('firebase/firestore').setDoc as jest.Mock;
    const mockGetDocs = require('firebase/firestore').getDocs as jest.Mock;
    
    mockSetDoc.mockImplementation(async (docRef, data) => {
      mockMemories.set(data.id, data);
    });

    mockGetDocs.mockImplementation(async () => ({
      forEach: (callback: any) => {
        const filtered = Array.from(mockMemories.values())
          .filter((memory: any) => memory.userId === testUserId);
        filtered.forEach((memory: any) => {
          callback({ data: () => memory });
        });
      }
    }));

    // Step 1: Transcription saves audio memory
    const transcriptMemory = {
      transcript: 'Today I worked on my project and made good progress',
      timestamp: Date.now(),
      audioLength: 1000,
      source: 'transcribe-audio'
    };
    await MemoryService.saveMemory(testUserId, 'transcript-2024-01-01', transcriptMemory, 'transcribe-audio');

    // Step 2: Summary flow retrieves transcripts
    const transcripts = await MemoryService.getMemories(testUserId, 'transcript-*');
    expect(transcripts).toHaveLength(1);

    // Simulate summary generation and save
    const summaryMemory = {
      summary: 'User made progress on their project today',
      originalTextLength: transcriptMemory.transcript.length,
      timestamp: Date.now(),
      period: '2024-01-01',
      source: 'summarize-text'
    };
    await MemoryService.saveMemory(testUserId, 'summary-2024-01-01', summaryMemory, 'summarize-text');

    // Step 3: Chat flow retrieves both for context
    const allMemories = await MemoryService.getMemories(testUserId);
    expect(allMemories).toHaveLength(2);

    const contextMemories = await MemoryService.getMemoriesByTags(testUserId, ['transcript-2024-01-01', 'summary-2024-01-01']);
    expect(contextMemories).toHaveLength(2);

    // Verify cross-referencing works
    const transcriptContext = contextMemories.find(m => m.source === 'transcribe-audio');
    const summaryContext = contextMemories.find(m => m.source === 'summarize-text');
    
    expect(transcriptContext).toBeDefined();
    expect(summaryContext).toBeDefined();
    expect(transcriptContext?.payload.transcript).toContain('project');
    expect(summaryContext?.payload.summary).toContain('progress');
  });
});