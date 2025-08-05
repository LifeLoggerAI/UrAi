# UrAi - Life Logger AI

This is a NextJS starter in Firebase Studio with integrated AI-driven memory and cross-reference capabilities.

## Memory & Cross-Reference System

The app includes a unified memory system that allows all AI flows to store and retrieve tagged context for enhanced user experiences.

### Key Features

- **Centralized Memory Storage**: All AI flows (chat, transcription, summarization, etc.) can store and retrieve memories
- **Tag-based Organization**: Memories are organized using simple string tags for easy categorization and retrieval  
- **Cross-flow Context**: AI flows can access memories from other flows to provide richer, more contextual responses
- **Pattern Matching**: Support for wildcard patterns to retrieve related memories (e.g., `chat-*`, `project-*`)

### Memory Service API

The `MemoryService` class provides a model-agnostic interface for memory operations:

```typescript
import { MemoryService } from '@/lib/memory-service';

// Save a memory
await MemoryService.saveMemory(
  userId: string,
  tag: string, 
  payload: any,
  source?: string
);

// Retrieve memories
const memories = await MemoryService.getMemories(
  userId: string,
  tagPattern?: string,
  limit?: number
);

// Convenience functions
import { saveMemory, getMemories } from '@/lib/memory-service';
await saveMemory(userId, 'chat-conversation', { message: 'Hello' });
const chatMemories = await getMemories(userId, 'chat-*');
```

### Tagging Conventions

The system uses consistent tagging patterns across AI flows:

- **Chat memories**: `chat-{timestamp}` or `chat-{topic}`
- **Transcriptions**: `transcript-{YYYY-MM-DD}`  
- **Summaries**: `summary-{YYYY-MM-DD}` or `summary-{topic}`
- **Project plans**: `project-{name}` or `project-plan`
- **User goals**: `goal-{category}` or `goals`
- **Custom tags**: Any descriptive string for specific use cases

### AI Flow Integration

All major AI flows automatically integrate with the memory system:

#### Companion Chat (`/src/ai/flows/companion-chat.ts`)
- **Before generation**: Retrieves recent chat memories for context
- **After generation**: Saves conversation exchange with timestamp
- **Tag pattern**: `chat-{timestamp}`

#### Audio Transcription (`/src/ai/flows/transcribe-audio.ts`)  
- **After transcription**: Saves transcript with date-based tagging
- **Tag pattern**: `transcript-{YYYY-MM-DD}`

#### Text Summarization (`/src/ai/flows/summarize-text.ts`)
- **Before generation**: Retrieves previous summaries for context
- **After generation**: Saves summary with date/topic tagging  
- **Tag pattern**: `summary-{YYYY-MM-DD}` or `summary-{topic}`

### Database Structure

Memories are stored in a Firestore collection `memories` with the following structure:

```typescript
interface Memory {
  id: string;           // Unique identifier: {userId}_{tag}_{timestamp}
  userId: string;       // User who owns this memory
  tag: string;         // Simple string tag for categorization
  payload: any;        // Arbitrary JSON data
  createdAt: number;   // Creation timestamp
  updatedAt: number;   // Last update timestamp
  source?: string;     // Source AI flow (optional)
}
```

### Firestore Indexes

The system requires these Firestore indexes for optimal performance:

```json
{
  "collectionGroup": "memories",
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
},
{
  "collectionGroup": "memories", 
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "tag", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```

### Testing

The memory system includes comprehensive testing:

```bash
# Run memory service unit tests
npm test -- src/lib/__tests__/memory-service-simple.test.ts

# Run integration tests  
npm test -- src/lib/__tests__/memory-integration.test.ts

# Run verification script
npm run check:memory
```

### Development Scripts

```bash
# Start development server
npm run dev

# Check memory system functionality
npm run check:memory

# Run all tests
npm test

# Type checking
npm run typecheck
```

### Usage Examples

#### Cross-referencing in Chat
```typescript
// The chat flow automatically retrieves previous conversations
const chatResponse = await companionChat({
  userId: 'user123',
  message: 'What did we discuss about my goals?',
  history: []
});
// AI response will include context from previous goal-related chats
```

#### Transcription Memory
```typescript  
// Transcribe audio and automatically save to memory
const result = await transcribeAudio({
  userId: 'user123',
  audioDataUri: 'data:audio/wav;base64,...'
});
// Transcript automatically saved as `transcript-{today's date}`
```

#### Building Context Across Flows
```typescript
// Get all memories for comprehensive context
const allMemories = await getMemories('user123');

// Get specific memory types
const recentChats = await getMemories('user123', 'chat-*');
const transcripts = await getMemories('user123', 'transcript-*');
const summaries = await getMemories('user123', 'summary-*');

// Use in AI prompts for richer context
```

### Extending to New Flows

To add memory integration to a new AI flow:

1. **Import the memory service**:
   ```typescript
   import { MemoryService } from '@/lib/memory-service';
   ```

2. **Retrieve context before generation**:
   ```typescript
   const relevantMemories = await MemoryService.getMemories(userId, 'relevant-tag-*');
   ```

3. **Include memories in AI prompt**:
   ```typescript
   const prompt = `Context: ${JSON.stringify(relevantMemories)}
   User input: ${userInput}`;
   ```

4. **Save results after generation**:
   ```typescript
   await MemoryService.saveMemory(userId, 'new-flow-tag', result, 'new-flow-name');
   ```

### Security

- Memories are scoped to individual users via `userId`
- Firestore security rules ensure users can only access their own memories
- All data is stored in Firebase with standard security practices

To get started, take a look at src/app/page.tsx.
