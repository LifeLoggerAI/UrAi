
'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  PassportState,
  PassportLayerId,
  createDefaultPassportState,
  openLayerState,
  closeLayerState,
  getLayerStatus,
  isLayerOpen,
  requireLayerState,
  listOpenLayersState,
  listClosedLayersState,
  explainLayer,
  resetPassportState,
  exportPassportState,
  importPassportState,
} from '../lib/passport';

interface PassportContextType {
  passportState: PassportState;
  getLayerStatus: (layerId: PassportLayerId) => ReturnType<typeof getLayerStatus>;
  isLayerOpen: (layerId: PassportLayerId) => ReturnType<typeof isLayerOpen>;
  openLayer: (layerId: PassportLayerId) => void;
  closeLayer: (layerId: PassportLayerId) => void;
  requireLayer: (layerId: PassportLayerId) => ReturnType<typeof requireLayerState>;
  listOpenLayers: () => ReturnType<typeof listOpenLayersState>;
  listClosedLayers: () => ReturnType<typeof listClosedLayersState>;
  explainLayer: (layerId: PassportLayerId) => ReturnType<typeof explainLayer>;
  resetPassport: () => void;
  exportPassportState: () => ReturnType<typeof exportPassportState>;
  importPassportState: (json: string) => void;
}

const PassportContext = createContext<PassportContextType | undefined>(undefined);

type PassportAction =
  | { type: 'OPEN_LAYER'; payload: PassportLayerId }
  | { type: 'CLOSE_LAYER'; payload: PassportLayerId }
  | { type: 'RESET_PASSPORT' }
  | { type: 'IMPORT_STATE'; payload: string };

const passportReducer = (state: PassportState, action: PassportAction): PassportState => {
  switch (action.type) {
    case 'OPEN_LAYER':
      return openLayerState(state, action.payload);
    case 'CLOSE_LAYER':
      return closeLayerState(state, action.payload);
    case 'RESET_PASSPORT':
      return resetPassportState();
    case 'IMPORT_STATE':
      return importPassportState(action.payload);
    default:
      return state;
  }
};

export const UraiPassportProvider = ({ children }: { children: ReactNode }) => {
  const [passportState, dispatch] = useReducer(passportReducer, createDefaultPassportState());

  const contextValue: PassportContextType = {
    passportState,
    getLayerStatus: (layerId) => getLayerStatus(passportState, layerId),
    isLayerOpen: (layerId) => isLayerOpen(passportState, layerId),
    openLayer: (layerId) => dispatch({ type: 'OPEN_LAYER', payload: layerId }),
    closeLayer: (layerId) => dispatch({ type: 'CLOSE_LAYER', payload: layerId }),
    requireLayer: (layerId) => requireLayerState(passportState, layerId),
    listOpenLayers: () => listOpenLayersState(passportState),
    listClosedLayers: () => listClosedLayersState(passportState),
    explainLayer: (layerId) => explainLayer(layerId),
    resetPassport: () => dispatch({ type: 'RESET_PASSPORT' }),
    exportPassportState: () => exportPassportState(passportState),
    importPassportState: (json: string) => dispatch({ type: 'IMPORT_STATE', payload: json }),
  };

  return (
    <PassportContext.Provider value={contextValue}>
      {children}
    </PassportContext.Provider>
  );
};

export const useUraiPassport = () => {
  const context = useContext(PassportContext);
  if (context === undefined) {
    throw new Error('useUraiPassport must be used within a UraiPassportProvider');
  }
  return context;
};
