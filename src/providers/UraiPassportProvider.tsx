
"use client";

import React, { createContext, useContext, useMemo, useReducer } from "react";
import {
  createDefaultPassportState,
  getLayerStatus,
  isLayerOpen,
  openLayer as openLayerState,
  closeLayer as closeLayerState,
  requireLayer as requireLayerState,
  listOpenLayers as listOpenLayersState,
  listClosedLayers as listClosedLayersState,
  explainLayer,
  resetPassportState,
  exportPassportState as exportPassportStateFunc,
  importPassportState as importPassportStateFunc,
} from "@/lib/passport/passportState";
import type {
  PassportLayerId,
  PassportState,
  PassportLayerDefinition,
  PassportLayerStatus,
} from "@/lib/passport/passportLayerTypes";

type UraiPassportContextValue = {
  passportState: PassportState;
  getLayerStatus: (layerId: PassportLayerId) => PassportLayerStatus;
  isLayerOpen: (layerId: PassportLayerId) => boolean;
  openLayer: (layerId: PassportLayerId, reason?: string) => void;
  closeLayer: (layerId: PassportLayerId, reason?: string) => void;
  requireLayer: (layerId: PassportLayerId) => {
    allowed: boolean;
    status: PassportLayerStatus;
    reason: string;
  };
  listOpenLayers: () => PassportLayerId[];
  listClosedLayers: () => PassportLayerId[];
  explainLayer: (layerId: PassportLayerId) => PassportLayerDefinition;
  resetPassport: () => void;
  exportPassportState: () => PassportState;
  importPassportState: (value: unknown) => void;
};

const UraiPassportContext = createContext<UraiPassportContextValue | null>(
  null
);

type PassportAction =
  | { type: "OPEN_LAYER"; layerId: PassportLayerId; reason?: string }
  | { type: "CLOSE_LAYER"; layerId: PassportLayerId; reason?: string }
  | { type: "RESET_PASSPORT" }
  | { type: "IMPORT_STATE"; state: PassportState };

function passportReducer(
  state: PassportState,
  action: PassportAction
): PassportState {
  switch (action.type) {
    case "OPEN_LAYER":
      return openLayerState(state, action.layerId, action.reason);
    case "CLOSE_LAYER":
      return closeLayerState(state, action.layerId, action.reason);
    case "RESET_PASSPORT":
      return resetPassportState();
    case "IMPORT_STATE":
      return action.state;
    default:
      return state;
  }
}

export function UraiPassportProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [passportState, dispatch] = useReducer(
    passportReducer,
    createDefaultPassportState()
  );

  const getLayerStatusMemo = (layerId: PassportLayerId) =>
    getLayerStatus(passportState, layerId);
  const isLayerOpenMemo = (layerId: PassportLayerId) =>
    isLayerOpen(passportState, layerId);
  const openLayer = (layerId: PassportLayerId, reason?: string) =>
    dispatch({ type: "OPEN_LAYER", layerId, reason });
  const closeLayer = (layerId: PassportLayerId, reason?: string) =>
    dispatch({ type: "CLOSE_LAYER", layerId, reason });
  const requireLayer = (layerId: PassportLayerId) =>
    requireLayerState(passportState, layerId);
  const listOpenLayers = () => listOpenLayersState(passportState);
  const listClosedLayers = () => listClosedLayersState(passportState);
  const resetPassport = () => dispatch({ type: "RESET_PASSPORT" });
  const exportPassportState = () => exportPassportStateFunc(passportState);
  const importPassportState = (value: unknown) => {
    const newState = importPassportStateFunc(value);
    dispatch({ type: "IMPORT_STATE", state: newState });
  };

  const value = useMemo(
    () => ({
      passportState,
      getLayerStatus: getLayerStatusMemo,
      isLayerOpen: isLayerOpenMemo,
      openLayer,
      closeLayer,
      requireLayer,
      listOpenLayers,
      listClosedLayers,
      explainLayer,
      resetPassport,
      exportPassportState,
      importPassportState,
    }),
    [passportState]
  );

  return (
    <UraiPassportContext.Provider value={value}>
      {children}
    </UraiPassportContext.Provider>
  );
}

export function useUraiPassport(): UraiPassportContextValue {
  const context = useContext(UraiPassportContext);
  if (!context) {
    throw new Error("useUraiPassport must be used within a UraiPassportProvider");
  }
  return context;
}
