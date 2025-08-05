# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## B2B API

UrAi now includes a comprehensive B2B API for secure access to user data including memories, tags, metadata, and embeddings.

### API Endpoints

- **GET /api/v1/memories** - Retrieve user memories with filtering and pagination
- **GET /api/v1/tags** - Get aggregated tag data and analytics
- **GET /api/v1/metadata** - Access usage statistics and user analytics
- **GET /api/v1/embeddings** - Vector embeddings for similarity search (Standard/Premium only)

### Authentication

All API requests require a valid API key in the Authorization header:

```bash
Authorization: Bearer <your_api_key>
```

### Quick Start

1. **Initialize partner API keys**:
   ```bash
   node scripts/init-b2b-partners.js
   ```

2. **Test the API**:
   ```bash
   # Get user memories
   curl -H "Authorization: Bearer trial_key_12345" \
        "http://localhost:3000/api/v1/memories?userId=test-user&page=1&pageSize=10"
   
   # Get user tags
   curl -H "Authorization: Bearer trial_key_12345" \
        "http://localhost:3000/api/v1/tags?userId=test-user&category=emotions"
   
   # Get metadata
   curl -H "Authorization: Bearer trial_key_12345" \
        "http://localhost:3000/api/v1/metadata?userId=test-user&type=analytics"
   ```

3. **Run tests**:
   ```bash
   npm test
   ```

### API Features

- **Pagination**: All endpoints support pagination with `page` and `pageSize` parameters
- **Filtering**: Filter by date ranges, emotions, tags, and more
- **Sorting**: Sort results by creation date, sentiment score, etc.
- **Rate Limiting**: Tiered rate limits based on partner license level
- **Error Handling**: Comprehensive error responses with detailed messages
- **Security**: API key authentication with permission-based access control

### License Tiers

- **Trial**: 100 requests/day, basic memory access
- **Standard**: 1,000 requests/day, includes embeddings and analytics
- **Premium**: 10,000 requests/day, full access with detailed metadata

### API Documentation

- **OpenAPI Spec**: See `docs/b2b-api-openapi.yaml` for complete API documentation
- **Interactive Docs**: Import the OpenAPI spec into Swagger UI or Postman

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Type check
npm run typecheck
```

### Example Response

```json
{
  "data": [
    {
      "id": "memory_123",
      "type": "voice",
      "content": "Had a great conversation with Alice about the new project",
      "createdAt": 1640995200000,
      "sourceFlow": "voice_recording",
      "tags": ["Alice", "project", "work"],
      "emotions": "happy",
      "sentimentScore": 0.8,
      "crossReferences": {
        "people": ["Alice"],
        "tasks": ["new project"]
      },
      "embeddings": {
        "vectorId": "voice_123",
        "embedding": [0.1, 0.2, 0.3, ...]
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
    "pageSize": 10,
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
