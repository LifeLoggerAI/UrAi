
/**
 * Firebase Function Entry Point
 * See: https://firebase.google.com/docs/functions/typescript
 */

// Genkit flows
export * from './genkit-sample';

// Core feature modules
export * from './user-management';
export * from './emotion-engine';
export * from './torso-engine';
export * from './legs-engine';
export * from './arms-engine';
export * from './orb-engine';
export * from './social-engine';
export * from './timeline-engine';
export * from './data-privacy';

// Messaging systems
export * from './notifications';
export * from './email-engine';

// Speech + visual pipelines
export * from './speech-engine';
export * from './visuals-engine';

// Extended symbolic/telemetry engines
export * from './telemetry-engine';
export * from './avatar-engine';
export * from './dream-engine';
export * from './symbolic-engine';

// New symbolic systems
export * from './shadow-metrics';
export * from './crisis-threshold';
export * from './recovery-bloom';
export * from './soul-thread-map';
export * from './meta-learning';
export * from './causal-insight';
export * from './projection-detector';

// Optional: Sample or debug/test functions
export * from './helloWorld';
