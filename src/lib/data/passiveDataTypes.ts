
import type { PassportDataLayerId } from "@/lib/passport/passportTypes";

export type PassiveDataSourceId =
| "mood_manual"
| "device_activity"
| "screen_activity"
| "notification_metadata"
| "motion"
| "sleep"
| "health"
| "location"
| "audio_capture"
| "transcripts"
| "calendar"
| "gmail"
| "relationship_context"
| "ritual_activity"
| "companion_activity"
| "lifemap_activity"
| "ground_activity"
| "mirror_activity"
| "system";

export type PassiveDataSensitivity =
| "low"
| "medium"
| "high"
| "very_high";

export type PassiveDataRecordType =
| "event"
| "summary"
| "signal"
| "permission_event"
| "interaction"
| "system";

export type PassiveDataRecord = {
id: string;
userId?: string;
sourceId: PassiveDataSourceId;
recordType: PassiveDataRecordType;
sensitivity: PassiveDataSensitivity;
createdAt: string;
capturedAt?: string;
sourceLayerId: PassportDataLayerId;
title?: string;
summary?: string;
value?: number | string | boolean | null;
metadata?: Record<string, unknown>;
rawDataStored: boolean;
aiUsable: boolean;
lifeMapUsable: boolean;
mirrorUsable: boolean;
shadowUsable: boolean;
legacyUsable: boolean;
exportable: boolean;
};

export type PassiveIngestionStatus =
| "disabled"
| "permission_required"
| "ready"
| "active"
| "paused"
| "error";

export type PassiveDataSourceDefinition = {
id: PassiveDataSourceId;
label: string;
description: string;
sensitivity: PassiveDataSensitivity;
passportLayerId: PassportDataLayerId;
defaultEnabled: boolean;
requiresExplicitPermission: boolean;
requiresBrowserPermission?: boolean;
requiresConnector?: boolean;
supportsLocalOnly: boolean;
supportsCloudSync: boolean;
rawDataAllowed: boolean;
};

export type PassiveIngestionAction =
| "collect"
| "store_local"
| "sync_cloud"
| "use_ai"
| "use_lifemap"
| "use_mirror"
| "use_shadow"
| "use_legacy"
| "export";

export type PassiveSourceStatus = {
sourceId: PassiveDataSourceId;
status: PassiveIngestionStatus;
enabled: boolean;
paused: boolean;
localOnly: boolean;
cloudSyncEnabled: boolean;
rawDataOptIn: boolean;
lastUpdatedAt: string;
lastIngestedAt?: string;
errorMessage?: string;
};
