# UrAi B2B API Usage Guide

This guide provides comprehensive documentation for integrating with the UrAi B2B API to access user memory data, analytics, and embeddings.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [Examples](#examples)
6. [Error Handling](#error-handling)
7. [Rate Limits](#rate-limits)
8. [Best Practices](#best-practices)

## Quick Start

### 1. Get API Credentials

Contact LifeLogger AI to obtain your API credentials:
- **Trial**: 100 requests/day, basic memory access
- **Standard**: 1,000 requests/day, includes embeddings
- **Premium**: 10,000 requests/day, full access with detailed metadata

### 2. Initialize Test Environment

```bash
# Clone the repository
git clone https://github.com/LifeLoggerAI/UrAi.git
cd UrAi

# Install dependencies
npm install

# Initialize demo partner keys
node scripts/init-b2b-partners.js

# Start development server
npm run dev
```

### 3. Make Your First Request

```bash
curl -H "Authorization: Bearer trial_key_12345" \
     "http://localhost:3000/api/v1/memories?userId=demo-user&pageSize=5"
```

## Authentication

All API requests require a Bearer token in the Authorization header:

```http
Authorization: Bearer <your_api_key>
```

### Authentication Errors

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Missing or invalid authorization header | No token provided or malformed header |
| 401 | Invalid API key | Token doesn't exist or is revoked |
| 401 | API key not approved | Token exists but not activated |
| 403 | Insufficient permissions | Feature requires higher tier |

## API Endpoints

### 1. Memories API

**GET** `/api/v1/memories`

Retrieve user memories from voice recordings, dreams, and reflections.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | ✅ | User identifier |
| page | integer | ❌ | Page number (default: 1) |
| pageSize | integer | ❌ | Results per page (max: 100, default: 50) |
| sortBy | string | ❌ | Sort field: `createdAt`, `sentimentScore` |
| sortOrder | string | ❌ | Sort order: `asc`, `desc` (default: `desc`) |
| startDate | integer | ❌ | Filter start timestamp (Unix ms) |
| endDate | integer | ❌ | Filter end timestamp (Unix ms) |
| tags | string | ❌ | Comma-separated tags to filter by |
| emotion | string | ❌ | Filter by specific emotion |

#### Response

```json
{
  "data": [
    {
      "id": "memory_123",
      "type": "voice",
      "content": "Had a great meeting with the team today",
      "createdAt": 1640995200000,
      "sourceFlow": "voice_recording",
      "tags": ["team", "meeting", "work"],
      "emotions": "happy",
      "sentimentScore": 0.8,
      "crossReferences": {
        "people": ["Alice", "Bob"],
        "tasks": ["quarterly review"]
      },
      "embeddings": {
        "vectorId": "voice_123",
        "embedding": [0.1, 0.2, ...]
      },
      "metadata": {
        "audioEventId": "audio_456",
        "speakerLabel": "user",
        "voiceArchetype": "enthusiastic"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "total": 150,
    "hasNext": true
  },
  "meta": {
    "includedCollections": ["voiceEvents", "dreamEvents", "innerVoiceReflections"],
    "filters": {
      "emotion": "happy"
    }
  }
}
```

### 2. Tags API

**GET** `/api/v1/tags`

Get aggregated tag data with frequency and sentiment analysis.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | ✅ | User identifier |
| category | string | ❌ | Filter by category: `people`, `emotions`, `themes`, `symbols`, `tasks` |

#### Response

```json
{
  "data": [
    {
      "tag": "Alice",
      "category": "people",
      "frequency": 15,
      "firstSeen": 1640995200000,
      "lastSeen": 1672531200000,
      "associatedEmotions": ["happy", "excited", "calm"],
      "sentiment": {
        "average": 0.65,
        "range": [-0.2, 0.9]
      }
    }
  ],
  "meta": {
    "userId": "demo-user",
    "category": "people",
    "totalUniqueFlags": 42
  }
}
```

### 3. Metadata API

**GET** `/api/v1/metadata`

Access usage statistics, analytics, and summary data.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | ✅ | User identifier |
| type | string | ❌ | Metadata type: `usage`, `analytics`, `summary` |

#### Response

```json
{
  "data": {
    "usage": {
      "totalVoiceEvents": 125,
      "totalDreamEvents": 43,
      "activeInLast30Days": 28,
      "dailyAverageEvents": 2.3,
      "lastActive": 1672531200000
    },
    "analytics": {
      "sentimentAnalysis": {
        "average": 0.42,
        "distribution": {
          "positive": 78,
          "neutral": 45,
          "negative": 32
        }
      },
      "emotionBreakdown": {
        "happy": 45,
        "calm": 32,
        "anxious": 18
      }
    }
  }
}
```

### 4. Embeddings API

**GET** `/api/v1/embeddings` (Standard+ tier)

Access vector embeddings for similarity search and clustering.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | ✅ | User identifier |
| query | string | ❌ | Text to find similar memories |
| threshold | float | ❌ | Similarity threshold 0.0-1.0 (default: 0.7) |
| limit | integer | ❌ | Max results (max: 50, default: 10) |

#### Response

```json
{
  "data": [
    {
      "id": "memory_456",
      "type": "voice",
      "content": "Feeling stressed about work deadlines",
      "vectorId": "voice_456",
      "embedding": [0.1, 0.2, 0.3, ...],
      "similarity": 0.85,
      "metadata": {
        "createdAt": 1640995200000,
        "contentLength": 35,
        "emotions": "anxious",
        "tags": ["work", "deadlines"]
      }
    }
  ],
  "meta": {
    "query": "feeling anxious about work",
    "similarityThreshold": 0.7,
    "resultCount": 1
  }
}
```

## Data Models

### Memory Object

```typescript
interface Memory {
  id: string;
  type: 'voice' | 'dream' | 'reflection';
  content: string;
  createdAt: number;
  lastAccessed?: number;
  sourceFlow: string;
  tags: string[];
  emotions?: string | string[];
  sentimentScore?: number;
  crossReferences: {
    people?: string[];
    tasks?: string[];
    themes?: string[];
    symbols?: string[];
  };
  embeddings?: {
    vectorId: string;
    embedding?: number[];
  };
  metadata: Record<string, any>;
}
```

### Tag Object

```typescript
interface Tag {
  tag: string;
  category: 'people' | 'emotions' | 'themes' | 'symbols' | 'tasks';
  frequency: number;
  firstSeen: number;
  lastSeen: number;
  associatedEmotions: string[];
  sentiment: {
    average: number;
    range: [number, number];
  };
}
```

## Examples

### 1. Get Recent Memories with Pagination

```javascript
const apiKey = 'your_api_key';
const userId = 'user_123';

async function getRecentMemories() {
  const response = await fetch(
    `https://api.lifelogger.ai/v1/memories?userId=${userId}&page=1&pageSize=20&sortBy=createdAt&sortOrder=desc`,
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  const data = await response.json();
  
  if (response.ok) {
    console.log(`Found ${data.data.length} memories`);
    return data.data;
  } else {
    console.error('API Error:', data.error);
  }
}
```

### 2. Find Memories by Emotion and Date Range

```python
import requests
from datetime import datetime, timedelta

api_key = "your_api_key"
user_id = "user_123"

# Get memories from last 30 days with positive emotions
thirty_days_ago = int((datetime.now() - timedelta(days=30)).timestamp() * 1000)
now = int(datetime.now().timestamp() * 1000)

params = {
    'userId': user_id,
    'emotion': 'happy',
    'startDate': thirty_days_ago,
    'endDate': now,
    'pageSize': 50
}

response = requests.get(
    'https://api.lifelogger.ai/v1/memories',
    headers={'Authorization': f'Bearer {api_key}'},
    params=params
)

if response.status_code == 200:
    data = response.json()
    print(f"Found {len(data['data'])} happy memories in the last 30 days")
else:
    print(f"Error: {response.json()['error']}")
```

### 3. Analyze User's Emotional Patterns

```javascript
async function analyzeEmotionalPatterns(userId, apiKey) {
  // Get all emotion tags
  const tagsResponse = await fetch(
    `https://api.lifelogger.ai/v1/tags?userId=${userId}&category=emotions`,
    { headers: { 'Authorization': `Bearer ${apiKey}` } }
  );
  
  // Get analytics metadata
  const analyticsResponse = await fetch(
    `https://api.lifelogger.ai/v1/metadata?userId=${userId}&type=analytics`,
    { headers: { 'Authorization': `Bearer ${apiKey}` } }
  );
  
  if (tagsResponse.ok && analyticsResponse.ok) {
    const tags = await tagsResponse.json();
    const analytics = await analyticsResponse.json();
    
    // Combine data for analysis
    const emotionalProfile = {
      topEmotions: tags.data.slice(0, 5),
      sentimentTrend: analytics.data.analytics.sentimentAnalysis,
      emotionDistribution: analytics.data.analytics.emotionBreakdown
    };
    
    return emotionalProfile;
  }
}
```

### 4. Find Similar Memories (Premium Feature)

```javascript
async function findSimilarMemories(userId, queryText, apiKey) {
  const response = await fetch(
    `https://api.lifelogger.ai/v1/embeddings?userId=${userId}&query=${encodeURIComponent(queryText)}&threshold=0.8&limit=10`,
    {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    }
  );
  
  if (response.ok) {
    const data = await response.json();
    return data.data.map(memory => ({
      content: memory.content,
      similarity: memory.similarity,
      createdAt: new Date(memory.metadata.createdAt)
    }));
  } else if (response.status === 403) {
    console.error('Embeddings require Standard or Premium tier');
  }
}
```

## Error Handling

### Common Error Responses

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "parameter": "Invalid value",
    "suggestion": "Use values: option1, option2"
  }
}
```

### Error Codes

| Code | HTTP Status | Description | Solution |
|------|-------------|-------------|----------|
| MISSING_USER_ID | 400 | userId parameter required | Include userId in query |
| PAGE_SIZE_TOO_LARGE | 400 | pageSize exceeds limit | Use pageSize ≤ 100 |
| INVALID_DATE_RANGE | 400 | startDate > endDate | Check date parameters |
| INVALID_API_KEY | 401 | API key not found | Verify API key |
| INSUFFICIENT_PERMISSIONS | 403 | Feature requires upgrade | Upgrade license tier |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests | Wait and retry |
| INTERNAL_ERROR | 500 | Server error | Contact support |

### Robust Error Handling

```javascript
class UrAiClient {
  constructor(apiKey, baseUrl = 'https://api.lifelogger.ai/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }
  
  async makeRequest(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });
    
    try {
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new UrAiError(data.error, response.status, data.code, data.details);
      }
      
      return data;
    } catch (error) {
      if (error instanceof UrAiError) {
        throw error;
      }
      throw new UrAiError('Network error', 0, 'NETWORK_ERROR', { originalError: error.message });
    }
  }
}

class UrAiError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.name = 'UrAiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
```

## Rate Limits

### Tier Limits

| Tier | Requests/Day | Burst Limit | Window |
|------|--------------|-------------|---------|
| Trial | 100 | 10/min | Rolling |
| Standard | 1,000 | 50/min | Rolling |
| Premium | 10,000 | 200/min | Rolling |

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-Window: 86400
```

### Handling Rate Limits

```javascript
async function makeRequestWithRetry(url, options, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        const resetTime = response.headers.get('X-RateLimit-Reset');
        const waitTime = Math.max(1000, (resetTime * 1000) - Date.now());
        
        console.log(`Rate limited. Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      return response;
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
}
```

## Best Practices

### 1. Efficient Pagination

```javascript
// Prefer cursor-based pagination for large datasets
async function getAllMemories(userId, apiKey) {
  const allMemories = [];
  let page = 1;
  let hasNext = true;
  
  while (hasNext) {
    const response = await makeRequest('memories', {
      userId,
      page,
      pageSize: 100 // Use maximum page size
    });
    
    allMemories.push(...response.data);
    hasNext = response.pagination.hasNext;
    page++;
    
    // Respect rate limits
    if (hasNext) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return allMemories;
}
```

### 2. Efficient Filtering

```javascript
// Use specific filters to reduce data transfer
const params = {
  userId: 'user_123',
  startDate: Date.now() - (7 * 24 * 60 * 60 * 1000), // Last 7 days
  emotion: 'happy',
  tags: 'work,productivity',
  pageSize: 50
};
```

### 3. Caching Strategies

```javascript
class UrAiCache {
  constructor(ttl = 300000) { // 5 minutes default TTL
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  generateKey(endpoint, params) {
    return `${endpoint}:${JSON.stringify(params)}`;
  }
}
```

### 4. Batch Processing

```javascript
// Process users in batches to respect rate limits
async function processUsersInBatches(userIds, apiKey, batchSize = 10) {
  const results = [];
  
  for (let i = 0; i < userIds.length; i += batchSize) {
    const batch = userIds.slice(i, i + batchSize);
    
    const promises = batch.map(userId => 
      makeRequest('metadata', { userId, type: 'summary' })
    );
    
    const batchResults = await Promise.allSettled(promises);
    results.push(...batchResults);
    
    // Rate limit pause between batches
    if (i + batchSize < userIds.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}
```

### 5. Data Validation

```javascript
function validateMemoryFilter(filter) {
  const errors = [];
  
  if (filter.startDate && filter.endDate && filter.startDate > filter.endDate) {
    errors.push('startDate must be before endDate');
  }
  
  if (filter.sentimentMin && (filter.sentimentMin < -1 || filter.sentimentMin > 1)) {
    errors.push('sentimentMin must be between -1 and 1');
  }
  
  if (filter.tags && filter.tags.length > 10) {
    errors.push('Maximum 10 tags allowed in filter');
  }
  
  return errors;
}
```

## Support

For additional support:

- **Documentation**: [https://docs.lifelogger.ai](https://docs.lifelogger.ai)
- **API Status**: [https://status.lifelogger.ai](https://status.lifelogger.ai)  
- **Support Email**: api-support@lifelogger.ai
- **GitHub Issues**: [https://github.com/LifeLoggerAI/UrAi/issues](https://github.com/LifeLoggerAI/UrAi/issues)