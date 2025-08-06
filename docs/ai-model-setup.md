# AI Model Setup Documentation

## Overview

This document outlines the complete AI model architecture and setup for the LifeLogger UrAi application. The system uses a centralized AI client architecture built on Google's Genkit framework with Firebase integration.

## Architecture

### Core Components

1. **AI Client (`/src/ai/client.ts`)** - Centralized wrapper with retry logic and error handling
2. **Genkit Configuration (`/src/ai/genkit.ts`)** - Main AI framework setup
3. **AI Flows (`/src/ai/flows/`)** - Individual AI function implementations
4. **Type Definitions (`/src/lib/types.ts`)** - Comprehensive Zod schemas for all AI operations

### AI Flow Functions

The system includes 12 specialized AI flows:

| Flow Function | Purpose | Input | Output |
|---------------|---------|--------|--------|
| `companionChat` | Conversational AI companion | Chat history + message | AI response |
| `transcribeAudio` | Speech-to-text conversion | Audio data URI | Text transcript |
| `analyzeDream` | Dream content analysis | Dream text | Emotions, themes, symbols, sentiment |
| `enrichVoiceEvent` | Voice analysis & extraction | Voice transcript | Emotion, people, tasks |
| `generateSpeech` | Text-to-speech synthesis | Text input | Audio data URI |
| `summarizeText` | Text summarization | Long text | Concise summary |
| `analyzeCameraImage` | Image analysis | Image data URI | Emotions, objects, environment |
| `generateSymbolicInsight` | Symbolic interpretation | Image analysis | Narrative reflection |
| `analyzeTextSentiment` | Sentiment analysis | Text input | Sentiment score (-1 to 1) |
| `suggestRitual` | Personalized recommendations | Context + zone | Ritual suggestion |
| `processOnboardingTranscript` | Onboarding extraction | User transcript | Goals, tasks, habits |
| `generateAvatar` | Avatar generation | Name + role | Avatar image |

## Configuration

### Environment Variables

#### Required Firebase Configuration
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### Optional AI Provider Keys
```bash
GOOGLE_AI_API_KEY=your_google_ai_api_key
OPENAI_API_KEY=your_openai_api_key
```

#### Development Settings
```bash
NEXT_PUBLIC_USE_EMULATORS=true
```

### Package Dependencies

#### Core AI Dependencies
- `@genkit-ai/googleai@^1.14.0` - Google AI integration
- `@genkit-ai/next@^1.14.0` - Next.js integration
- `genkit@^1.14.0` - Main AI framework
- `firebase@^11.10.0` - Firebase SDK

#### Development Dependencies
- `@types/jest@^29.5.0` - Jest type definitions
- `jest@^29.5.0` - Testing framework
- `@playwright/test@^1.40.0` - End-to-end testing
- `tsx@^4.20.3` - TypeScript execution

## Usage

### Basic AI Client Usage

```typescript
import { aiClient } from '@/ai/client';

// Companion chat
const response = await aiClient.companionChat({
  history: [{ role: 'user', content: 'Hello' }],
  message: 'How are you today?'
});

// Dream analysis
const analysis = await aiClient.analyzeDream({
  text: 'I dreamed about flying over mountains...'
});

// Audio transcription
const transcript = await aiClient.transcribeAudio({
  audioDataUri: 'data:audio/wav;base64,UklGRnoGAAB...'
});
```

### Error Handling

The AI client automatically handles:
- **Retry Logic** - Exponential backoff for transient errors
- **Error Classification** - Distinguishes retryable vs non-retryable errors
- **Request Logging** - Performance monitoring and debugging
- **Type Validation** - Input/output schema validation

```typescript
try {
  const result = await aiClient.companionChat(input);
  console.log('Success:', result);
} catch (error) {
  if (error instanceof AIClientError) {
    console.error('AI Error:', error.message, 'Retryable:', error.retryable);
  }
}
```

## Development Workflows

### NPM Scripts

```bash
# AI-specific commands
npm run test:models          # Run AI model unit tests
npm run ai:validate          # Validate AI configuration
npm run deploy:model         # Deploy AI functions to Firebase

# Development
npm run genkit:dev           # Start Genkit development server
npm run genkit:watch         # Start with hot reload

# Testing
npm run test                 # Run all tests
npm run test:e2e            # Run end-to-end tests

# Building & Deployment
npm run build               # Build the application
npm run start               # Start production server
```

### Testing Infrastructure

#### Unit Tests (`/test/ai/`)
- **AI Client Tests** - Mock-based testing of all AI flows
- **Error Handling Tests** - Retry logic and error classification
- **Input Validation Tests** - Schema validation and edge cases

#### End-to-End Tests (`/test/e2e/`)
- **Integration Tests** - Full workflow testing
- **Firebase Configuration Tests** - Environment validation
- **Performance Tests** - Response time monitoring

#### Configuration Validation (`/scripts/validate-ai-config.ts`)
Automated validation of:
- Environment variables
- Package dependencies
- AI flow file integrity
- Firebase configuration
- Test infrastructure setup

### CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/urai-ci.yml`) includes:

1. **Dependency Installation** - `npm ci` for reproducible builds
2. **AI Configuration Validation** - Automated setup verification
3. **Unit Tests** - AI model function testing
4. **Build Process** - Next.js application build
5. **E2E Tests** - Full integration testing
6. **Deployment** - Firebase deployment on successful tests

## Firebase Integration

### Functions Configuration
```json
{
  "functions": {
    "source": "functions",
    "predeploy": ["npm run lint", "npm run build"]
  }
}
```

### Firestore Integration
- **User Data Storage** - Encrypted user profiles and settings
- **AI Response Caching** - Performance optimization
- **Analytics Collection** - Usage patterns and model performance

### Emulator Support
Local development with Firebase emulators:
```bash
firebase emulators:start
```

## Performance Optimization

### Caching Strategy
- **Response Caching** - Frequently requested AI operations
- **Model Warming** - Pre-loaded models for faster response times
- **Request Batching** - Optimized API usage

### Monitoring
- **Request Logging** - Performance metrics and error tracking
- **Cost Monitoring** - AI API usage and billing alerts
- **Health Checks** - Automated model availability testing

## Security Considerations

### Data Privacy
- **Encryption** - All user data encrypted at rest and in transit
- **Anonymization** - Personal data scrubbed from AI training data
- **Retention Policies** - Automatic data cleanup and user deletion

### API Security
- **Rate Limiting** - Preventing abuse and managing costs
- **Input Validation** - Comprehensive schema validation
- **Error Sanitization** - Preventing information leakage

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check for missing dependencies
npm run ai:validate

# Fix font loading issues (network isolation)
# Already fixed in layout.tsx with fallback fonts

# Resolve import path issues
# Ensure consistent @ path mapping in tsconfig.json
```

#### Test Failures
```bash
# Run individual test suites
npm run test:models
npm run test:e2e

# Check mock configurations
# Verify AI flow mocks in test files
```

#### Deployment Issues
```bash
# Validate Firebase configuration
firebase projects:list
firebase use your-project-id

# Check function deployment logs
firebase functions:log
```

### Debug Mode
Enable detailed logging:
```typescript
const aiClient = new AIClient({
  maxAttempts: 1, // Disable retries for debugging
  baseDelayMs: 0
});
```

## Future Enhancements

### Planned Features
1. **Model Training Pipeline** - Custom model training automation
2. **A/B Testing Framework** - Model performance comparison
3. **Real-time Analytics** - Live performance dashboards
4. **Multi-modal AI** - Combined text, audio, and image processing

### Scalability Considerations
- **Load Balancing** - Distributed AI processing
- **Edge Deployment** - Regional model deployment
- **Cost Optimization** - Dynamic model selection based on requirements

## Support

For issues or questions:
1. Check the validation script: `npm run ai:validate`
2. Review test logs: `npm run test:models`
3. Consult Firebase documentation for deployment issues
4. Check Genkit documentation for model configuration

## Version History

- **v1.0.0** - Initial AI model setup with centralized client
- **v1.1.0** - Added comprehensive testing infrastructure
- **v1.2.0** - Implemented retry logic and error handling
- **v1.3.0** - Added configuration validation and documentation