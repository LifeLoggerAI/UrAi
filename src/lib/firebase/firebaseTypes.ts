export type FirebaseUserId = string;

export type FirebaseSyncStatus = "idle" | "loading" | "saving" | "synced" | "offline" | "error";

export type FirebaseDocumentMeta = {
  id: string;
  userId: FirebaseUserId;
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
  deleted?: boolean;
};

export type UraiCloudRecord<T> = FirebaseDocumentMeta & {
  data: T;
};

export type UraiSyncResult = {
  ok: boolean;
  status: FirebaseSyncStatus;
  errorMessage?: string;
};

export type UraiFirebaseClientState = {
  configured: boolean;
  reason?: "missing_config" | "init_error" | "ready";
};
