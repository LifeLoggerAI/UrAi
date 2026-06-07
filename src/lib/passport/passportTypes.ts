export type { PassportLayerId as PassportDataLayerId } from './keys';
export type { PassportLayerId, PassportLayerStatus, PassportLayerSensitivity } from './keys';
export type { PassportState } from './state';

export type UraiPassportProfile = {
  enabledLayers?: Partial<Record<import('./keys').PassportLayerId, boolean>>;
  contextPermissions?: Record<string, boolean>;
  [key: string]: unknown;
};
