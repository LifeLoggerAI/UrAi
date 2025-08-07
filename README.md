# UrAi - Life Logger AI

An AI-powered journal application built with Next.js 15, Firebase, and Genkit AI flows that captures and understands your life through advanced AI capabilities including speech synthesis, transcription, dream analysis, and companion chat.

## 🚀 Features

- **AI-Powered Conversations**: Intelligent companion chat with contextual understanding
- **Voice Integration**: High-quality text-to-speech with SSML enhancement
- **Audio Transcription**: Convert speech to text for journal entries
- **Dream Analysis**: AI-powered dream interpretation and insights
- **Modern UI**: Built with Next.js 15, React 18, and Tailwind CSS
- **Firebase Integration**: Authentication, database, and hosting
- **Comprehensive Testing**: E2E tests with Playwright and health monitoring

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.3.3, React 18, TypeScript
- **AI/ML**: Google Genkit, Gemini AI models
- **Database**: Firebase Firestore, Data Connect
- **Authentication**: Firebase Auth
- **Styling**: Tailwind CSS, Radix UI components
- **Testing**: Playwright (E2E), Jest (planned)
- **Build Tools**: Turbopack, ESLint, Prettier
- **CI/CD**: GitHub Actions, Firebase Hosting

## 📦 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/LifeLoggerAI/UrAi.git
   cd UrAi
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   ```bash
   cp .env.example .env
   # Edit .env with your Firebase and API keys
   ```

4. **Install Playwright browsers** (for E2E testing):
   ```bash
   npm run test:e2e:install
   ```

## 🏃‍♂️ Development

### Available Scripts

- **Development**:

  ```bash
  npm run dev          # Start development server with Turbopack
  npm run genkit:dev   # Start Genkit development server
  npm run genkit:watch # Start Genkit with file watching
  ```

- **Building**:

  ```bash
  npm run build        # Build for production
  npm run start        # Start production server
  ```

- **Testing**:

  ```bash
  npm test             # Run unit tests (placeholder)
  npm run test:e2e     # Run Playwright E2E tests
  npm run health-check # Run AI flow health checks
  ```

- **Code Quality**:
  ```bash
  npm run lint         # Run ESLint
  npm run lint:fix     # Fix ESLint issues
  npm run format       # Format with Prettier
  npm run format:check # Check formatting
  npm run typecheck    # TypeScript type checking
  ```

### Development Workflow

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Open your browser** to `http://localhost:3000`

3. **AI Development**: Use Genkit for AI flow development:
   ```bash
   npm run genkit:dev
   ```

## 🧪 Testing

### E2E Testing with Playwright

The project includes comprehensive E2E tests using Playwright:

```bash
# Install browsers (one-time setup)
npm run test:e2e:install

# Run E2E tests
npm run test:e2e

# Run tests in UI mode
npx playwright test --ui
```

### AI Flow Health Checks

Monitor AI service health:

```bash
npm run health-check
```

This tests:

- Text-to-speech generation
- Audio transcription
- Dream analysis
- Companion chat functionality

### Health Endpoint

Access the health check API at:

```
GET /api/health
```

Returns service status and response times for all AI flows.

## 🎵 Voice & Audio Features

### Enhanced TTS with SSML

The application uses SSML (Speech Synthesis Markup Language) for high-quality voice synthesis:

- **Neural voices** with natural prosody
- **Emotional context** awareness
- **Conversation optimized** speech patterns
- **Meditation and storytelling** modes

Example usage:

```typescript
import { generateConversationalSSML } from '@/lib/audio/ssml';

const ssml = generateConversationalSSML(
  'Hello, how are you feeling today?',
  'friendly'
);
```

## 🏗️ Architecture

### AI Flows

- `generate-speech.ts` - Text-to-speech with SSML
- `transcribe-audio.ts` - Speech-to-text conversion
- `analyze-dream.ts` - Dream interpretation
- `companion-chat.ts` - Conversational AI

### Project Structure

```
src/
├── ai/                    # AI flows and Genkit configuration
├── app/                   # Next.js app router
├── components/            # React components
├── lib/                   # Utilities and helpers
│   └── audio/            # Audio and SSML utilities
├── scripts/              # Build and health check scripts
└── hooks/                # React hooks
```

## 🚀 Deployment

### Automatic Deployment

The project includes GitHub Actions for automated deployment:

- **Pull Request**: Runs tests and builds
- **Main Branch**: Deploys to Firebase Hosting

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# Google AI
GOOGLE_AI_API_KEY=your_google_ai_key
```

### Firebase Setup

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize project: `firebase init`

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** and ensure tests pass
4. **Commit changes**: `git commit -m 'Add amazing feature'`
5. **Push to branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Code Quality

The project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for pre-commit hooks
- **lint-staged** for staged file linting

Pre-commit hooks automatically:

- Run ESLint and fix issues
- Format code with Prettier
- Type check TypeScript

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an [issue](https://github.com/LifeLoggerAI/UrAi/issues)
- Check the [documentation](docs/)
- Review [AI flow examples](src/ai/flows/)

---

Built with ❤️ by the LifeLogger AI team
