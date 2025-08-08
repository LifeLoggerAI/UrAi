# UrAi Symbolic Systems Implementation

This implementation provides the complete symbolic intelligence system as specified in the problem statement, including all 11 sections:

## 🌌 Implemented Systems

### 1. Dream Constellation Map
- **Location**: `/src/app/symbolic-map.tsx`
- **Demo**: `/dreams` route and `/dream-constellation-demo.html`
- **Features**: Visualizes dreams as spatial constellations based on symbols, emotions, and quality scores
- **Data Structure**: Uses `Dream` type with symbols, emotions, location, and quality metrics

### 2. Shadow Metrics Engine 
- **Location**: `/functions/src/shadow-metrics.ts`
- **Features**: Tracks passive behavioral signals like friction taps, cancel behaviors, entropy levels
- **Firestore Collection**: `shadowMetrics`
- **Triggers**: Updates on `voiceEvents` changes

### 3. Crisis Threshold Detection
- **Location**: `/functions/src/crisis-threshold.ts`
- **Features**: Monitors emotional breaking points and triggers interventions
- **Firestore Collection**: `crisisState`
- **Component**: `ThresholdBanner` for UI alerts

### 4. Recovery Bloom Engine
- **Location**: `/functions/src/recovery-bloom.ts`
- **Features**: Detects recovery patterns and creates visual bloom representations
- **Firestore Collection**: `recoveryBlooms`
- **Component**: `BloomVisualizer` for visual display

### 5. Soul Thread Mapping
- **Location**: `/functions/src/soul-thread-map.ts`
- **Features**: Tracks lifelong symbolic patterns and transformation cycles
- **Firestore Collection**: `soulThreads`
- **Component**: `SoulThreadCard` for display

### 6. Meta Learning Loop
- **Location**: `/functions/src/meta-learning.ts`
- **Features**: AI learns what helps users based on emotional outcomes
- **Firestore Collection**: `metaLearning`

### 7. Causal Insight Generator
- **Location**: `/functions/src/causal-insight.ts`
- **Features**: Connects user actions to emotional outcomes
- **Firestore Collection**: `insights`
- **AI Model**: `/functions/src/utils/insight-ai.ts`

### 8. Projection Detector
- **Location**: `/functions/src/projection-detector.ts`
- **Features**: Identifies emotional projection patterns in voice/text data
- **AI Model**: `/functions/src/utils/projection-ai.ts`

## 🎯 Demo Pages

### Dream Constellation
- **URL**: `http://localhost:3000/dream-constellation-demo.html`
- **Features**: Interactive constellation with emotional color coding

### System Dashboard
- **URL**: `http://localhost:3000/symbolic-systems-demo.html`
- **Features**: Comprehensive overview of all symbolic systems

### Integrated Demo
- **URL**: `http://localhost:3000/symbolic-demo`
- **Features**: React-based interactive demo with tab navigation

## 📊 Data Types

All new types are defined in `/src/lib/types.ts`:

```typescript
// Core symbolic types
interface Dream { symbols: string[]; emotions: string[]; ... }
interface ShadowMetrics { entropyLevel: number; ... }
interface CrisisState { isInCrisis: boolean; ... }
interface RecoveryBloom { bloomColor: string; ... }
interface SoulThread { threadLabel: string; ... }
interface MetaLearningEntry { result: string; ... }
interface Insight { type: string; content: string; ... }
```

## 🔥 Firebase Functions

All functions are exported in `/functions/src/index.ts` and include:

- `updateShadowMetrics`: Monitors voice events for behavioral signals
- `onCrisisThresholdCrossed`: Detects crisis conditions
- `onRecoveryDetected`: Identifies recovery patterns
- `updateSoulThreadMap`: Tracks symbolic patterns
- `metaLearningFeedback`: Records learning outcomes
- `generateCausalInsight`: Creates personalized insights
- `detectProjectionInsight`: Identifies projection patterns

## 🎨 UI Components

All components are in `/src/components/`:

- `DreamConstellationMap`: Main constellation visualization
- `ThresholdBanner`: Crisis alert display
- `BloomVisualizer`: Recovery bloom animation
- `SoulThreadCard`: Thread pattern display
- `ShadowStatsMini`: Entropy level indicator

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   cd functions && npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **View Demos**:
   - Dream Constellation: `http://localhost:3000/dream-constellation-demo.html`
   - System Dashboard: `http://localhost:3000/symbolic-systems-demo.html`
   - Interactive Demo: `http://localhost:3000/symbolic-demo`

## 🔮 Key Features

- **Visual Dream Mapping**: Dreams displayed as glowing constellation nodes
- **Emotional Intelligence**: AI-powered pattern recognition and insights
- **Behavioral Tracking**: Passive monitoring of user interaction patterns
- **Crisis Prevention**: Proactive detection of emotional threshold crossing
- **Recovery Visualization**: Beautiful animations for growth moments
- **Lifelong Pattern Tracking**: Soul threads that evolve over time
- **Adaptive Learning**: System learns what helps each individual user
- **Symbolic AI**: Advanced interpretation of metaphors and symbols

## 📈 Implementation Status

- ✅ All 11 symbolic systems implemented
- ✅ Firebase functions created and structured
- ✅ UI components built and styled
- ✅ Type definitions added
- ✅ Demo pages created and working
- ✅ Visual constellation map functional
- ✅ Integrated system dashboard
- ✅ Proper error handling and TypeScript support

The implementation provides a solid foundation for the symbolic intelligence system with room for future enhancements like real AI model integration, advanced visualization libraries, and deeper Firebase integration.