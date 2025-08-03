#!/bin/bash

# URAI Function Auto-Tester with Auto Feature Flag Editing
# Cycles through each Firebase function, one at a time.
# Automatically updates featureFlags.ts to only enable the current function.
# Deploys the function, waits for testing, then moves to the next.

FLAGS_FILE="src/config/featureFlags.ts"

functions=(
  # ===== Phase 1 — Core Spine =====
  auth
  basicInsightDisplay
  gpsTrackingBasic
  passiveAudioCapture
  aiTaggingPipeline

  # ===== Phase 2 — Core Intelligence Add‑Ons =====
  relationshipMapping
  attachmentStyleAnalysis
  socialWellnessLayer
  recoveryTimeline

  # ===== Phase 3 — Cognitive Systems =====
  moodForecastOverlay
  personalityRings
  shadowCognition
  obscuraPatterns

  # ===== Phase 4 — Sensory & Dream Systems =====
  memoryMapView
  lifeStorySynthesis
  innerVoiceModeling
  voiceDreamFusion

  # ===== Phase 5 — High‑Impact Visual / Market Systems =====
  dreamMap
  seasonalSkyAnimations
  riveParticleMoodLayers
  gmailIntegration
  hapticFeedback
  insightMarketplace
)

for func in "${functions[@]}"; do
  echo "=============================="
  echo "🔄 Setting featureFlags.ts for: $func"
  echo "=============================="

  # Turn all flags to false, then set the current function to true
  sed -i.bak 's/: true/: false/g' "$FLAGS_FILE"
  sed -i.bak "s/\($func: \)false/\1true/" "$FLAGS_FILE"

  echo "✅ featureFlags.ts updated: $func is ON, all others OFF."

  echo "=============================="
  echo "🚀 Deploying function: $func"
  echo "=============================="
  npm run build && firebase deploy --only functions:$func

  echo ""
  echo "📋 Now test: $func"
  echo "💡 Keep logs open in another terminal: firebase functions:log"
  read -p "Press Enter to continue to the next function..."
done

echo ""
echo "✅ All functions tested individually. You can now begin batch enabling in featureFlags.ts."
