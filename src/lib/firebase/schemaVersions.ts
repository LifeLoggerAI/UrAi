import type { UraiCloudRecord } from "./firebaseTypes";

export const CURRENT_SCHEMA_VERSION = 1;

export function migrateCloudRecord<T>(record: Partial<UraiCloudRecord<T>> | null | undefined): Partial<UraiCloudRecord<T>> | null {
  if (!record) return null;
  return {
    ...record,
    schemaVersion: record.schemaVersion ?? CURRENT_SCHEMA_VERSION,
  };
}
