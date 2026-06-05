
export type PassportLayerId =
  | "passive_data"
  | "intelligence"
  | "companion_context"
  | "lifemap"
  | "ground"
  | "mirror"
  | "shadow"
  | "legacy"
  | "export"
  | "notifications"
  | "spatial"
  | "audio"
  | "location"
  | "health"
  | "gmail"
  | "calendar"
  | "contacts"
  | "motion"
  | "camera"
  | "admin"
  | "system";

export type PassportLayerStatus = "open" | "closed" | "blocked";

export type PassportLayerSensitivity =
  | "low"
  | "medium"
  | "high"
  | "protected";

export type PassportLayerDefinition = {
  id: PassportLayerId;
  title: string;
  summary: string;
  sensitivity: PassportLayerSensitivity;
  defaultStatus: PassportLayerStatus;
  requiresExplicitApproval: boolean;
  canBeOpenedByUser: boolean;
};

export type PassportLayerState = {
  id: PassportLayerId;
  status: PassportLayerStatus;
  updatedAt: string;
  reason?: string;
};

export type PassportState = {
  initialized: boolean;
  layers: Record<PassportLayerId, PassportLayerState>;
  updatedAt: string;
};
