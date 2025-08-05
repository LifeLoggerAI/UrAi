/**
 * @fileOverview Memory Service Usage Examples
 * 
 * This file demonstrates how to use the memory system in various AI flows
 * and scenarios without requiring the full app to be running.
 */

// Example 1: Basic Memory Operations
export async function basicMemoryExample() {
  /*
  import { MemoryService } from '@/lib/memory-service';
  
  const userId = 'user123';
  
  // Save a memory
  await MemoryService.saveMemory(
    userId, 
    'project-plan', 
    { 
      title: 'Q1 Goals',
      items: ['Launch feature', 'Improve performance'],
      priority: 'high'
    },
    'manual-entry'
  );

  // Retrieve memories
  const memories = await MemoryService.getMemories(userId, 'project-*');
  console.log('Project memories:', memories);
  */
}

// Example 2: Chat Flow Integration  
export async function chatFlowExample() {
  /*
  import { MemoryService } from '@/lib/memory-service';
  
  const userId = 'user123';
  const userMessage = 'Tell me about my goals';
  
  // Retrieve previous chat context
  const previousChats = await MemoryService.getMemories(userId, 'chat-*', 5);
  const goalMemories = await MemoryService.getMemories(userId, 'goal-*', 3);
  
  // Combine context for AI prompt
  const context = {
    recentChats: previousChats.map(m => m.payload),
    goals: goalMemories.map(m => m.payload)
  };
  
  // Generate AI response (mock)
  const aiResponse = `Based on your previous conversations and goals: ${JSON.stringify(context)}`;
  
  // Save this conversation
  await MemoryService.saveMemory(
    userId,
    `chat-${Date.now()}`,
    {
      userMessage,
      aiResponse,
      timestamp: Date.now(),
      context: 'goal-discussion'
    },
    'companion-chat'
  );
  */
}

// Example 3: Cross-Flow Memory Usage
export async function crossFlowExample() {
  /*
  import { MemoryService } from '@/lib/memory-service';
  
  const userId = 'user123';
  
  // Scenario: User transcribes audio, then asks for summary, then chats about it
  
  // Step 1: Audio transcription saves memory
  await MemoryService.saveMemory(
    userId,
    'transcript-2024-01-15',
    {
      transcript: 'Today I worked on the new feature and made good progress...',
      duration: 120,
      timestamp: Date.now()
    },
    'transcribe-audio'
  );
  
  // Step 2: Summary flow retrieves transcripts
  const transcripts = await MemoryService.getMemories(userId, 'transcript-*');
  const summaryText = transcripts.map(t => t.payload.transcript).join(' ');
  
  // Generate summary and save it
  await MemoryService.saveMemory(
    userId,
    'summary-2024-01-15',
    {
      summary: 'User made significant progress on new feature development',
      sourceTranscripts: transcripts.length,
      period: '2024-01-15'
    },
    'summarize-text'
  );
  
  // Step 3: Chat flow can access both transcripts and summaries
  const allContext = await MemoryService.getMemoriesByTags(
    userId, 
    ['transcript-2024-01-15', 'summary-2024-01-15']
  );
  
  console.log('Full context for chat:', allContext);
  */
}

// Example 4: Pattern Matching and Filtering
export async function patternMatchingExample() {
  /*
  import { MemoryService } from '@/lib/memory-service';
  
  const userId = 'user123';
  
  // Save various types of memories
  await MemoryService.saveMemory(userId, 'project-alpha-plan', { project: 'alpha' }, 'manual');
  await MemoryService.saveMemory(userId, 'project-beta-plan', { project: 'beta' }, 'manual');
  await MemoryService.saveMemory(userId, 'chat-about-projects', { topic: 'projects' }, 'chat');
  await MemoryService.saveMemory(userId, 'goal-2024-q1', { quarter: 'Q1' }, 'goals');
  
  // Retrieve by different patterns
  const projectMemories = await MemoryService.getMemories(userId, 'project-*');
  const chatMemories = await MemoryService.getMemories(userId, 'chat-*');
  const goalMemories = await MemoryService.getMemories(userId, 'goal-*');
  const alphaMemories = await MemoryService.getMemories(userId, '*alpha*');
  
  console.log('Projects:', projectMemories.length);
  console.log('Chats:', chatMemories.length);  
  console.log('Goals:', goalMemories.length);
  console.log('Alpha-related:', alphaMemories.length);
  */
}

// Example 5: Tagging Convention Best Practices
export const MEMORY_TAG_CONVENTIONS = {
  // Date-based tags
  TRANSCRIPT_DAILY: (date: string) => `transcript-${date}`, // transcript-2024-01-15
  SUMMARY_DAILY: (date: string) => `summary-${date}`,       // summary-2024-01-15
  
  // Topic-based tags  
  PROJECT_PLAN: (project: string) => `project-${project}`,  // project-alpha
  GOAL_CATEGORY: (category: string) => `goal-${category}`,  // goal-health
  
  // Timestamped tags
  CHAT_MESSAGE: () => `chat-${Date.now()}`,                 // chat-1705123456789
  
  // Contextual tags
  MEETING_NOTES: (topic: string) => `meeting-${topic}`,     // meeting-standup
  REFLECTION: (type: string) => `reflection-${type}`,       // reflection-weekly
  
  // Pattern queries
  ALL_CHATS: 'chat-*',
  ALL_PROJECTS: 'project-*', 
  ALL_GOALS: 'goal-*',
  ALL_TRANSCRIPTS: 'transcript-*',
  ALL_SUMMARIES: 'summary-*',
  DAILY_CONTENT: (date: string) => `*-${date}*`,            // *-2024-01-15*
};

// Example 6: Error Handling and Validation
export async function errorHandlingExample() {
  /*
  import { MemoryService } from '@/lib/memory-service';
  
  try {
    // Attempt to save invalid memory
    await MemoryService.saveMemory('', 'invalid-tag', null);
  } catch (error) {
    console.error('Validation error:', error);
  }
  
  try {
    // Attempt to retrieve non-existent memory
    const memories = await MemoryService.getMemories('nonexistent-user');
    console.log('Found', memories.length, 'memories'); // Should be 0
  } catch (error) {
    console.error('Retrieval error:', error);
  }
  
  try {
    // Attempt to delete memory
    await MemoryService.deleteMemory('invalid-id');
  } catch (error) {
    console.error('Delete error:', error);
  }
  */
}