
import { passportLayerRegistry } from "./passportLayerRegistry";
import type {
  PassportLayerId,
  PassportLayerState,
  PassportState,
  PassportLayerStatus,
  PassportLayerDefinition,
} from "./passportLayerTypes";

export function createDefaultPassportState(): PassportState {
  const layers = Object.keys(passportLayerRegistry).reduce((acc, layerId) => {
    const definition = passportLayerRegistry[layerId as PassportLayerId];
    acc[layerId as PassportLayerId] = {
      id: layerId as PassportLayerId,
      status: definition.defaultStatus,
      updatedAt: new Date().toISOString(),
    };
    return acc;
  }, {} as Record<PassportLayerId, PassportLayerState>);

  return {
    initialized: true,
    layers,
    updatedAt: new Date().toISOString(),
  };
}

export function getLayerStatus(
  state: PassportState,
  layerId: PassportLayerId
): PassportLayerStatus {
  return state.layers[layerId]?.status ?? "blocked";
}

export function isLayerOpen(
  state: PassportState,
  layerId: PassportLayerId
): boolean {
  return getLayerStatus(state, layerId) === "open";
}

export function openLayer(
  state: PassportState,
  layerId: PassportLayerId,
  reason?: string
): PassportState {
  const definition = passportLayerRegistry[layerId];
  if (definition.defaultStatus === "blocked") {
    return state;
  }

  const newLayers = { ...state.layers };
  newLayers[layerId] = {
    ...newLayers[layerId],
    status: "open",
    updatedAt: new Date().toISOString(),
    reason,
  };

  return { ...state, layers: newLayers, updatedAt: new Date().toISOString() };
}

export function closeLayer(
  state: PassportState,
  layerId: PassportLayerId,
  reason?: string
): PassportState {
  const newLayers = { ...state.layers };
  newLayers[layerId] = {
    ...newLayers[layerId],
    status: "closed",
    updatedAt: new Date().toISOString(),
    reason,
  };

  return { ...state, layers: newLayers, updatedAt: new Date().toISOString() };
}

export function requireLayer(
  state: PassportState,
  layerId: PassportLayerId
): {
  allowed: boolean;
  status: PassportLayerStatus;
  reason: string;
} {
  const status = getLayerStatus(state, layerId);
  const allowed = status === "open";
  let reason = ``;
  if (!allowed) {
    const definition = passportLayerRegistry[layerId];
    reason = `Access to ${definition.title} is not enabled.`;
  }

  return { allowed, status, reason };
}

export function listOpenLayers(state: PassportState): PassportLayerId[] {
  return Object.values(state.layers)
    .filter((layer) => layer.status === "open")
    .map((layer) => layer.id);
}

export function listClosedLayers(state: PassportState): PassportLayerId[] {
  return Object.values(state.layers)
    .filter((layer) => layer.status === "closed")
    .map((layer) => layer.id);
}

export function explainLayer(layerId: PassportLayerId): PassportLayerDefinition {
  return passportLayerRegistry[layerId];
}

export function resetPassportState(): PassportState {
  return createDefaultPassportState();
}

export function exportPassportState(state: PassportState): PassportState {
  return state;
}

export function importPassportState(value: unknown): PassportState {
  if (typeof value !== "object" || value === null) {
    return createDefaultPassportState();
  }

  const state = value as PassportState;
  // Basic validation, can be improved
  if (!state.initialized || !state.layers) {
    return createDefaultPassportState();
  }

  return state;
}
