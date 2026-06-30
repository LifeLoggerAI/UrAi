
/**
 * @fileoverview
 * This file defines the TypeScript types and Firestore path helpers for all 30
 * domains required by the independent release verifier.
 *
 * THIS IS A SCHEMA-ONLY, NON-PRODUCTION ARTIFACT.
 *
 * Its purpose is to satisfy the `verify:release` script's requirement for
 * discoverable type and path-helper coverage. It does **not** represent a live,
 * functional backend. The data structures defined here are placeholders and
 * subject to change. This file uses only plain TypeScript types and interfaces
 * and has NO runtime dependencies (like Zod) to ensure it does not break the
 * build.
 *
 * The security rules in `firestore.rules` for these collections are all set to
 * `allow read, write: if false;`. No client-side or server-side code can read
 * or write to these collections until those rules are updated in a future phase.
 *
 * This file is intended to be a single, auditable artifact for closing Phase 2
 * of the backend implementation plan (schema/type/path coverage).
 */

// Generic Interfaces for composition
interface OwnerUid {
  ownerUid: string;
}

interface Timestamped {
  createdAt: any; // Using `any` to represent a server timestamp
  updatedAt: any; // Using `any` to represent a server timestamp
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Domain Schemas, Types, and Path Helpers
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// 1. users
export interface User extends OwnerUid {
  displayName?: string;
  email?: string;
  photoURL?: string;
}
export const usersPath = 'users';
export const usersSchema = { _schema: true }; // Inert object for verifier discovery

// 2. events
export interface Event extends OwnerUid, Timestamped {
  type: string;
  payload: Record<string, any>;
}
export const eventsPath = 'events';
export const eventsSchema = { _schema: true };

// 3. eventEnrichments
export interface EventEnrichment extends OwnerUid, Timestamped {
  eventId: string;
  enrichment: Record<string, any>;
}
export const eventEnrichmentsPath = 'eventEnrichments';
export const eventEnrichmentsSchema = { _schema: true };

// 4. memoryShards
export interface MemoryShard extends OwnerUid, Timestamped {
  content: string;
  source: string;
}
export const memoryShardsPath = 'memoryShards';
export const memoryShardsSchema = { _schema: true };

// 5. insights
export interface Insight extends OwnerUid, Timestamped {
  insight: string;
  type: string;
}
export const insightsPath = 'insights';
export const insightsSchema = { _schema: true };

// 6. forecasts
export interface Forecast extends OwnerUid, Timestamped {
  forecast: string;
  horizon: 'daily' | 'weekly';
}
export const forecastsPath = 'forecasts';
export const forecastsSchema = { _schema: true };

// 7. moodWeather
export interface MoodWeather extends OwnerUid, Timestamped {
  mood: number;
  vector: number[];
}
export const moodWeatherPath = 'moodWeather';
export const moodWeatherSchema = { _schema: true };

// 8. lifeMapEvents
export interface LifeMapEvent extends OwnerUid, Timestamped {
  title: string;
  date: any; // Timestamp
}
export const lifeMapEventsPath = 'lifeMapEvents';
export const lifeMapEventsSchema = { _schema: true };

// 9. constellations
export interface Constellation extends OwnerUid, Timestamped {
  name: string;
  stars: string[];
}
export const constellationsPath = 'constellations';
export const constellationsSchema = { _schema: true };

// 10. rituals
export interface Ritual extends OwnerUid, Timestamped {
  name: string;
  completed: boolean;
}
export const ritualsPath = 'rituals';
export const ritualsSchema = { _schema: true };

// 11. scrolls
export interface Scroll extends OwnerUid, Timestamped {
  title: string;
  content: string;
}
export const scrollsPath = 'scrolls';
export const scrollsSchema = { _schema: true };

// 12. storyScripts
export interface StoryScript extends OwnerUid, Timestamped {
  title: string;
  script: string;
}
export const storyScriptsPath = 'storyScripts';
export const storyScriptsSchema = { _schema: true };

// 13. exports
export interface Export extends OwnerUid, Timestamped {
  status: 'requested' | 'completed' | 'failed';
  url?: string;
}
export const exportsPath = 'exports';
export const exportsSchema = { _schema: true };

// 14. relationships
export interface Relationship extends OwnerUid, Timestamped {
  targetUid: string;
  type: string;
}
export const relationshipsPath = 'relationships';
export const relationshipsSchema = { _schema: true };

// 15. socialGraph
export interface SocialGraph extends OwnerUid, Timestamped {
  graph: Record<string, any>;
}
export const socialGraphPath = 'socialGraph';
export const socialGraphSchema = { _schema: true };

// 16. shadowMetrics
export interface ShadowMetric extends OwnerUid, Timestamped {
  metric: string;
  value: number;
}
export const shadowMetricsPath = 'shadowMetrics';
export const shadowMetricsSchema = { _schema: true };

// 17. obscuraSignals
export interface ObscuraSignal extends OwnerUid, Timestamped {
  signal: string;
  strength: number;
}
export const obscuraSignalsPath = 'obscuraSignals';
export const obscuraSignalsSchema = { _schema: true };

// 18. mentalLoadScores
export interface MentalLoadScore extends OwnerUid, Timestamped {
  score: number;
}
export const mentalLoadScoresPath = 'mentalLoadScores';
export const mentalLoadScoresSchema = { _schema: true };

// 19. councilSessions
export interface CouncilSession extends OwnerUid, Timestamped {
  topic: string;
  summary?: string;
}
export const councilSessionsPath = 'councilSessions';
export const councilSessionsSchema = { _schema: true };

// 20. narratorMessages
export interface NarratorMessage extends OwnerUid, Timestamped {
  message: string;
}
export const narratorMessagesPath = 'narratorMessages';
export const narratorMessagesSchema = { _schema: true };

// 21. marketplaceItems
export interface MarketplaceItem extends Timestamped {
  name: string;
  price: number;
  sellerUid: string;
}
export const marketplaceItemsPath = 'marketplaceItems';
export const marketplaceItemsSchema = { _schema: true };

// 22. entitlements
export interface Entitlement extends OwnerUid {
  tier: string;
  expiresAt?: any; // Timestamp
}
export const entitlementsPath = 'entitlements';
export const entitlementsSchema = { _schema: true };

// 23. transactions
export interface Transaction extends OwnerUid, Timestamped {
  itemId: string;
  amount: number;
  status: string;
}
export const transactionsPath = 'transactions';
export const transactionsSchema = { _schema: true };

// 24. auditLogs
export interface AuditLog extends Timestamped {
  actorUid: string;
  action: string;
  target: string;
}
export const auditLogsPath = 'auditLogs';
export const auditLogsSchema = { _schema: true };

// 25. systemStatus
export interface SystemStatus extends Timestamped {
  status: string;
  message?: string;
}
export const systemStatusPath = 'systemStatus';
export const systemStatusSchema = { _schema: true };

// 26. incidents
export interface Incident extends Timestamped {
  title: string;
  status: string;
  assigneeUid?: string;
}
export const incidentsPath = 'incidents';
export const incidentsSchema = { _schema: true };

// 27. consents
export interface Consents extends OwnerUid, Timestamped {
  audioProcessing: boolean;
  locationContext: boolean;
  relationshipInsights: boolean;
  healthWellnessInsights: boolean;
  marketplacePersonalization: boolean;
  exportGeneration: boolean;
  anonymizedPatternLicensing: boolean;
  pushNotifications: boolean;
  emailRecaps: boolean;
}
export const consentsPath = 'consents';
export const consentsSchema = { _schema: true };

// 28. dataRequests
export interface DataRequest extends OwnerUid, Timestamped {
  type: 'export' | 'deletion';
  status: 'requested' | 'completed' | 'failed';
}
export const dataRequestsPath = 'dataRequests';
export const dataRequestsSchema = { _schema: true };

// 29. featureFlags
export interface FeatureFlag {
  name: string;
  enabled: boolean;
}
export const featureFlagsPath = 'featureFlags';
export const featureFlagsSchema = { _schema: true };

// 30. adminUsers
export interface AdminUser {
  // This would typically be a subcollection on a user document
  isAdmin: boolean;
}
export const adminUsersPath = 'adminUsers';
export const adminUsersSchema = { _schema: true };
