export type UraiLifecycleState = 'active' | 'archived' | 'deleted' | 'locked';
export type UraiVisibilityState = 'visible' | 'hidden' | 'shielded' | 'vaulted';
export type UraiPrivacyState = 'public_to_user' | 'private' | 'sensitive' | 'vaulted' | 'shared' | 'archived' | 'deleted';
export type UraiAiAccessState = 'allowed' | 'permissioned' | 'denied';
export type UraiConfidence = 'low' | 'medium' | 'high';

export type UraiCanonicalObjectType =
  | 'LifeMapNode'
  | 'MemoryNode'
  | 'GoalNode'
  | 'RelationshipNode'
  | 'HabitPath'
  | 'LifeChapter'
  | 'GraphEdge'
  | 'AIInsight'
  | 'FocusSession'
  | 'Replay'
  | 'ReplayScene'
  | 'ReplayJourney'
  | 'Artifact'
  | 'PrivateVaultObject'
  | 'PermissionRule'
  | 'AuditLogEvent'
  | 'UserPreference';

export interface UraiSourceRef {
  id: string;
  sourceType: 'manual' | 'firestore' | 'media' | 'calendar' | 'task' | 'journal' | 'focus' | 'replay' | 'life-map' | 'external';
  label: string;
  uri?: string;
  capturedAt?: string;
}

export interface UraiProvenanceEntry {
  id: string;
  action: 'created' | 'imported' | 'edited' | 'inferred' | 'confirmed' | 'redacted' | 'archived' | 'deleted';
  actor: 'user' | 'system' | 'ai' | 'admin';
  at: string;
  sourceRefs?: UraiSourceRef[];
  note?: string;
}

export interface UraiCanonicalObjectBase {
  id: string;
  userId: string;
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  type: UraiCanonicalObjectType;
  title: string;
  summary: string;
  sourceRefs: UraiSourceRef[];
  privacyState: UraiPrivacyState;
  aiAccessState: UraiAiAccessState;
  visibilityState: UraiVisibilityState;
  lifecycleState: UraiLifecycleState;
  confidence: UraiConfidence;
  provenance: UraiProvenanceEntry[];
  deletedAt?: string | null;
  archivedAt?: string | null;
  lastOpenedAt?: string | null;
}

export interface UraiGraphEdge extends UraiCanonicalObjectBase {
  type: 'GraphEdge';
  fromId: string;
  toId: string;
  relationship: 'related' | 'caused' | 'influenced' | 'contains' | 'precedes' | 'supports' | 'blocks';
  strength: number;
}

export interface UraiLifeMapNode extends UraiCanonicalObjectBase {
  type: 'LifeMapNode' | 'MemoryNode' | 'GoalNode' | 'RelationshipNode' | 'HabitPath' | 'LifeChapter';
  x: number;
  y: number;
  z: number;
  unlocked: boolean;
  pinned?: boolean;
  hidden?: boolean;
  linkedFocusSessionIds?: string[];
  linkedReplayIds?: string[];
}

export interface UraiFocusSession extends UraiCanonicalObjectBase {
  type: 'FocusSession';
  mode: 'quick' | 'deep-work' | 'creative-flow' | 'admin-sprint' | 'study' | 'recovery' | 'manual';
  status: 'planning' | 'active' | 'paused' | 'completed' | 'abandoned';
  startedAt?: string;
  completedAt?: string;
  targetMinutes: number;
  linkedLifeMapNodeIds: string[];
}

export interface UraiReplayScene extends UraiCanonicalObjectBase {
  type: 'ReplayScene';
  replayId: string;
  order: number;
  truthMode: 'evidence' | 'reflection' | 'cinematic' | 'private-journal' | 'export';
  sensitive: boolean;
  redacted: boolean;
}

export interface UraiReplayJourney extends UraiCanonicalObjectBase {
  type: 'Replay' | 'ReplayJourney';
  sceneIds: string[];
  truthMode: 'evidence' | 'reflection' | 'cinematic' | 'private-journal' | 'export';
  exportEligible: boolean;
}

export type UraiCanonicalObject =
  | UraiCanonicalObjectBase
  | UraiLifeMapNode
  | UraiGraphEdge
  | UraiFocusSession
  | UraiReplayScene
  | UraiReplayJourney;

export type UraiPermissionCapability = 'visibleInMap' | 'searchable' | 'aiReadable' | 'replayable' | 'shareable' | 'analyticsAllowed';

export const URAI_PERMISSION_MATRIX: Record<UraiPrivacyState, Record<UraiPermissionCapability, boolean>> = {
  public_to_user: { visibleInMap: true, searchable: true, aiReadable: true, replayable: true, shareable: false, analyticsAllowed: true },
  private: { visibleInMap: true, searchable: true, aiReadable: true, replayable: true, shareable: false, analyticsAllowed: true },
  sensitive: { visibleInMap: true, searchable: false, aiReadable: false, replayable: false, shareable: false, analyticsAllowed: false },
  vaulted: { visibleInMap: true, searchable: false, aiReadable: false, replayable: false, shareable: false, analyticsAllowed: false },
  shared: { visibleInMap: true, searchable: true, aiReadable: true, replayable: true, shareable: true, analyticsAllowed: true },
  archived: { visibleInMap: false, searchable: false, aiReadable: false, replayable: true, shareable: false, analyticsAllowed: true },
  deleted: { visibleInMap: false, searchable: false, aiReadable: false, replayable: false, shareable: false, analyticsAllowed: false },
};

export type UraiAiClaimType = 'fact' | 'inference' | 'pattern' | 'suggestion' | 'scenario';

export interface UraiAiInsightContract {
  insightId: string;
  claim: string;
  claimType: UraiAiClaimType;
  evidenceRefs: UraiSourceRef[];
  confidence: UraiConfidence;
  permissionScopeUsed: UraiPrivacyState[];
  generatedAt: string;
  userActions: Array<'confirm' | 'edit' | 'reject' | 'hide' | 'vault' | 'delete'>;
  explanationText: string;
  prohibitedClaimsCheckPassed: boolean;
}

export const URAI_AI_PROHIBITED_CLAIMS = [
  'diagnosis',
  'moral_failure',
  'another_person_inner_state_as_fact',
  'unconfirmed_permanent_identity_label',
  'uses_hidden_or_deleted_content',
  'simulation_presented_as_prediction',
  'vaulted_or_sensitive_data_without_permission',
] as const;

export interface UraiAssetManifestEntry {
  assetId: string;
  type: 'image' | 'model' | 'texture' | 'shader' | 'audio' | 'video' | 'lottie' | 'rive';
  routeUsed: Array<'home' | 'life-map' | 'focus' | 'replay' | 'ochat'>;
  tierIntroduced: 1 | 2 | 3 | 4 | 5;
  desktopVariant: string;
  mobileVariant: string;
  reducedMotionVariant: string;
  fallbackVariant: string;
  fileSizeBudgetKb: number;
  licenseOrSource: string;
  owner: string;
  version: string;
  preloadPolicy: 'eager' | 'route' | 'interaction' | 'lazy';
  performanceClass: 'low' | 'medium' | 'high' | 'cinematic';
}

export const URAI_SOURCE_OF_TRUTH_RULES = {
  routeStateOwner: 'route-state-machine',
  selectedSpatialEntityOwner: 'life-map-state-machine',
  cameraStateOwner: 'camera-controller',
  transitionOwner: 'animation-controller',
  dataNormalizationOwner: 'data-adapter',
  visibilityOwner: 'permission-layer',
  aiOwnsSuggestionsOnly: true,
} as const;
