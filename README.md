# UrAI - AI-Powered Life Logger

An intelligent Next.js + Firebase monorepo application that helps users capture and understand their life experiences through AI-powered journaling, voice interaction, and data analysis.

## 🚀 Features

- **AI-Powered Journaling**: Intelligent text analysis and sentiment detection
- **Voice Interaction**: High-quality speech synthesis with SSML support
- **Image Analysis**: Camera image processing and symbolic insight generation
- **Conversation AI**: Companion chat functionality
- **Health Monitoring**: Comprehensive AI flow health checking
- **Modern Stack**: Next.js 15, Firebase, TypeScript, Tailwind CSS

## 📋 Prerequisites

- Node.js 22.x or higher
- npm or yarn
- Firebase CLI
- Git

## 🛠 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd UrAi
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Configure your Firebase and AI service credentials
   ```

4. **Install Playwright browsers (for E2E testing)**
   ```bash
   npx playwright install --with-deps
   ```

## 🏃‍♂️ Development

### Available Scripts

- **`npm run dev`** - Start development server with Turbopack
- **`npm run build`** - Build the application for production
- **`npm run start`** - Start production server
- **`npm run lint`** - Run ESLint
- **`npm run lint:fix`** - Run ESLint with auto-fix
- **`npm run format`** - Format code with Prettier
- **`npm run format:check`** - Check code formatting
- **`npm run typecheck`** - Run TypeScript type checking

### AI & Genkit Scripts

- **`npm run genkit:dev`** - Start Genkit development server
- **`npm run genkit:watch`** - Start Genkit with watch mode
- **`npm run test:ai-health`** - Run AI flows health check

### Testing Scripts

- **`npm test`** - Run unit tests (when configured)
- **`npm run test:e2e`** - Run Playwright E2E tests
- **`npm run test:e2e:ui`** - Run E2E tests with UI

### Development Workflow

1. **Start the development server**

   ```bash
   npm run dev
   ```

2. **Run AI health check**

   ```bash
   npm run test:ai-health
   ```

3. **Run linting and formatting**
   ```bash
   npm run lint:fix
   npm run format
   ```

## 🧪 Testing

### End-to-End Testing

The project uses Playwright for E2E testing with comprehensive browser coverage:

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/basic.spec.ts
```

### AI Health Monitoring

Monitor the health of all AI flows:

```bash
npm run test:ai-health
```

This checks:

- ✅ Flow file structure and imports
- ✅ Required function exports
- ✅ Flow-specific validation (transcription, chat, speech, etc.)
- ✅ Response times and error handling

## 🎯 AI Flows

### Available AI Flows

- **`analyze-camera-image`** - Process and analyze camera images
- **`analyze-dream`** - Dream analysis and interpretation
- **`analyze-text-sentiment`** - Text sentiment analysis
- **`companion-chat`** - Conversational AI companion
- **`enrich-voice-event`** - Voice event enrichment
- **`generate-avatar`** - Avatar generation
- **`generate-speech`** - Text-to-speech with SSML
- **`generate-symbolic-insight`** - Generate symbolic insights
- **`process-onboarding-transcript`** - Process user onboarding
- **`suggest-ritual`** - Suggest personalized rituals
- **`summarize-text`** - Text summarization
- **`transcribe-audio`** - Audio transcription

### SSML Voice Synthesis

The application includes advanced SSML (Speech Synthesis Markup Language) support for natural, high-quality voice synthesis:

```typescript
import { generateSSML, generateConversationalSSML } from '@/lib/audio/ssml';

// Basic SSML generation
const ssml = generateSSML('Hello, welcome to UrAI!', {
  voice: 'en-US-AriaNeural',
  rate: 0.95,
  pitch: '+1st',
});

// Conversational context
const greetingSSML = generateConversationalSSML('Good morning!', 'greeting');
const questionSSML = generateConversationalSSML('How are you feeling today?', 'question');
```

#### Supported Neural Voices

- **en-US-AriaNeural** - Primary assistant voice (female)
- **en-US-JennyNeural** - Question/interaction voice (female)
- **en-US-AmberNeural** - Empathetic companion voice (female)
- **en-US-GuyNeural** - Alternative voice (male)
- **en-US-DavisNeural** - Professional voice (male)

## 🚀 Deployment

### CI/CD Pipeline

The project includes a comprehensive CI/CD pipeline that:

1. **Quality Checks**
   - ✅ Linting and formatting
   - ✅ Type checking
   - ✅ AI health monitoring

2. **Testing**
   - ✅ Build validation
   - ✅ E2E testing with Playwright
   - ✅ Cross-browser compatibility

3. **Deployment**
   - ✅ Automated Firebase Hosting deployment
   - ✅ Caching for faster builds
   - ✅ Artifact storage

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy to Firebase
firebase deploy
```

## 🛡️ Code Quality

### Pre-commit Hooks

Automatic code quality enforcement with Husky:

- **Linting**: ESLint with auto-fix
- **Formatting**: Prettier with auto-format
- **Type Checking**: TypeScript validation

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Next.js configuration with custom rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

## 📁 Project Structure

```
UrAi/
├── src/
│   ├── ai/                     # AI flows and Genkit configuration
│   │   ├── flows/             # Individual AI flow implementations
│   │   ├── genkit.ts          # Genkit setup
│   │   └── dev.ts             # Development configuration
│   ├── app/                   # Next.js app router
│   ├── components/            # React components
│   ├── lib/                   # Shared utilities
│   │   └── audio/             # Audio/SSML utilities
│   └── scripts/               # Utility scripts
├── tests/                     # E2E tests
├── functions/                 # Firebase Functions
├── .github/workflows/         # CI/CD workflows
└── docs/                      # Documentation
```

## 🔧 Configuration Files

- **`next.config.ts`** - Next.js configuration with webpack customization
- **`playwright.config.ts`** - E2E testing configuration
- **`firebase.json`** - Firebase project configuration
- **`tsconfig.json`** - TypeScript configuration
- **`.eslintrc.json`** - ESLint configuration
- **`.prettierrc`** - Prettier configuration
- **`tailwind.config.ts`** - Tailwind CSS configuration

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**

   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

2. **Playwright Browser Issues**

   ```bash
   # Reinstall browsers
   npx playwright install --with-deps
   ```

3. **Firebase Deployment Issues**

   ```bash
   # Login to Firebase
   firebase login

   # Check project configuration
   firebase projects:list
   ```

### Getting Help

- Check the [GitHub Issues](../../issues) for known problems
- Review the [Firebase Documentation](https://firebase.google.com/docs)
- Consult the [Next.js Documentation](https://nextjs.org/docs)
- Read the [Playwright Documentation](https://playwright.dev/docs/intro)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test:e2e && npm run test:ai-health`
5. Commit changes: `git commit -m 'feat: add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Firebase Team** - For the excellent backend infrastructure
- **Vercel Team** - For Next.js and deployment platform
- **Google AI** - For Genkit AI framework
- **Microsoft** - For Playwright testing framework
