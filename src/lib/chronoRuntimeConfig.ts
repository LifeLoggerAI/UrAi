export const CHRONO_RIVE_CONFIG = {
  assetPath: '/rive/chrono-sky.riv',
  stateMachine: 'ChronoSky',
  inputs: {
    particleVelocity: 'particleVelocity',
    particleDensity: 'particleDensity',
    cloudOpacity: 'cloudOpacity',
    auroraIntensity: 'auroraIntensity',
    fractureIntensity: 'fractureIntensity',
    dawnGlow: 'dawnGlow',
  },
} as const;

export const CHRONO_NARRATOR_VOICEPACK = {
  defaultVoiceNameIncludes: ['Samantha', 'Google US English', 'Microsoft Aria'],
  modes: {
    grief_time: { rate: 0.78, pitch: 0.88, volume: 0.82 },
    survival_time: { rate: 0.82, pitch: 0.94, volume: 0.88 },
    flow_time: { rate: 1.08, pitch: 1.02, volume: 0.9 },
    waiting_time: { rate: 0.92, pitch: 0.98, volume: 0.86 },
    boredom_time: { rate: 1.02, pitch: 1, volume: 0.86 },
    rebirth_time: { rate: 1.06, pitch: 1.08, volume: 0.94 },
    shame_loop_time: { rate: 0.76, pitch: 0.9, volume: 0.8 },
    nostalgia_time: { rate: 0.9, pitch: 0.96, volume: 0.86 },
    future_dread_time: { rate: 0.82, pitch: 0.92, volume: 0.82 },
    dissociation_blank_time: { rate: 0.72, pitch: 0.9, volume: 0.78 },
    threshold_time: { rate: 0.9, pitch: 1.02, volume: 0.9 },
  },
} as const;
