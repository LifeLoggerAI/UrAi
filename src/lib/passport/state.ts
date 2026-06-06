
import { PassportLayerId, PassportLayerStatus } from './keys';
import { PASSPORT_LAYER_DEFINITIONS } from './registry';

export type PassportState = Record<PassportLayerId, PassportLayerStatus>;

export const createDefaultPassportState = (): PassportState => {
  const state = {} as PassportState;
  for (const layerId in PASSPORT_LAYER_DEFINITIONS) {
    state[layerId as PassportLayerId] = PASSPORT_LAYER_DEFINITIONS[layerId as PassportLayerId].defaultStatus;
  }
  return state;
};

export const getLayerStatus = (state: PassportState, layerId: PassportLayerId): PassportLayerStatus => {
  return state[layerId];
};

export const isLayerOpen = (state: PassportState, layerId: PassportLayerId): boolean => {
  return getLayerStatus(state, layerId) === 'open';
};

export const openLayerState = (state: PassportState, layerId: PassportLayerId): PassportState => {
  const layer = PASSPORT_LAYER_DEFINITIONS[layerId];
  if (layer.defaultStatus === 'blocked' || !layer.canBeOpenedByUser) {
    return state;
  }
  if (layer.sensitivity === 'protected') {
    return state; // Requires review flow, not implemented
  }
  return { ...state, [layerId]: 'open' };
};

export const closeLayerState = (state: PassportState, layerId: PassportLayerId): PassportState => {
  return { ...state, [layerId]: 'closed' };
};

export const requireLayerState = (state: PassportState, layerId: PassportLayerId): string => {
  const status = getLayerStatus(state, layerId);
  if (status === 'open') {
    return `The ${layerId} layer is already open.`
  }
  return `The ${layerId} layer is not open. Please open it in the Passport control center.`
}

export const listOpenLayersState = (state: PassportState): PassportLayerId[] => {
  return Object.keys(state).filter(layerId => isLayerOpen(state, layerId as PassportLayerId)) as PassportLayerId[];
};

export const listClosedLayersState = (state: PassportState): PassportLayerId[] => {
  return Object.keys(state).filter(layerId => !isLayerOpen(state, layerId as PassportLayerId)) as PassportLayerId[];
};

export const explainLayer = (layerId: PassportLayerId): string => {
    const layer = PASSPORT_LAYER_DEFINITIONS[layerId];
    if (!layer) {
        return "Unknown layer."
    }
    return layer.summary;
}

export const resetPassportState = (): PassportState => {
  return createDefaultPassportState();
};

export const exportPassportState = (state: PassportState): string => {
  return JSON.stringify(state);
};

export const importPassportState = (json: string): PassportState => {
  try {
    const importedState = JSON.parse(json) as PassportState;
    const defaultState = createDefaultPassportState();
    for (const layerId in defaultState) {
      const typedLayerId = layerId as PassportLayerId;
      if (!importedState.hasOwnProperty(typedLayerId)) {
        importedState[typedLayerId] = defaultState[typedLayerId];
      }
    }
    return importedState;
  } catch (error) {
    return createDefaultPassportState();
  }
};
