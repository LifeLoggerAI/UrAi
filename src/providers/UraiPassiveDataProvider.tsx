
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
    PassiveDataSourceId, 
    PassiveDataRecord, 
    PassiveSourceStatus, 
    PassiveDataSourceDefinition, 
    PassiveIngestionStatus 
} from '@/lib/data/passiveDataTypes';
import { URAI_PASSIVE_SOURCES, getDefaultPassiveSourceStatuses } from '@/lib/data/passiveSourceRegistry';
import { canIngestPassiveSource } from '@/lib/data/canIngestPassiveSource';
import { useUraiPassport } from '@/providers/UraiPassportProvider';

interface UraiPassiveDataContextType {
  sources: PassiveDataSourceDefinition[];
  sourceStatuses: PassiveSourceStatus[];
  records: PassiveDataRecord[];
  enableSource: (sourceId: PassiveDataSourceId) => void;
  disableSource: (sourceId: PassiveDataSourceId) => void;
  pauseSource: (sourceId: PassiveDataSourceId) => void;
  ingestRecord: (record: Omit<PassiveDataRecord, 'id' | 'createdAt'>) => void;
  ingestSummary: (record: Omit<PassiveDataRecord, 'id' | 'createdAt'>) => void;
  clearSourceRecords: (sourceId: PassiveDataSourceId) => void;
  getRecordsBySource: (sourceId: PassiveDataSourceId) => PassiveDataRecord[];
  getPermissionedRecordsForFeature: (feature: 'lifeMap' | 'ground' | 'mirror' | 'companion') => PassiveDataRecord[];
  getIngestionStatus: (sourceId: PassiveDataSourceId) => PassiveIngestionStatus;
  requestBrowserPermissionForSource: (sourceId: PassiveDataSourceId) => void;
}

const UraiPassiveDataContext = createContext<UraiPassiveDataContextType | undefined>(undefined);

export function UraiPassiveDataProvider({ children }: { children: React.ReactNode }) {
  const { passportProfile } = useUraiPassport();
  const [sourceStatuses, setSourceStatuses] = useState<PassiveSourceStatus[]>(getDefaultPassiveSourceStatuses());
  const [records, setRecords] = useState<PassiveDataRecord[]>([]);

  const getIngestionStatus = useCallback((sourceId: PassiveDataSourceId): PassiveIngestionStatus => {
    const status = sourceStatuses.find(s => s.sourceId === sourceId);
    return status ? status.status : 'disabled';
  }, [sourceStatuses]);

  const updateStatus = (sourceId: PassiveDataSourceId, newStatus: Partial<PassiveSourceStatus>) => {
    setSourceStatuses(prevStatuses =>
      prevStatuses.map(s => (s.sourceId === sourceId ? { ...s, ...newStatus, lastUpdatedAt: new Date().toISOString() } : s))
    );
  };

  const enableSource = (sourceId: PassiveDataSourceId) => {
    const { allowed, reason } = canIngestPassiveSource({ sourceId, passportProfile, action: 'collect' });
    if (allowed) {
      updateStatus(sourceId, { status: 'ready', enabled: true });
    } else {
      updateStatus(sourceId, { status: 'permission_required', enabled: false });
      console.warn(`Cannot enable source ${sourceId}: ${reason}`);
    }
  };

  const disableSource = (sourceId: PassiveDataSourceId) => {
    updateStatus(sourceId, { status: 'disabled', enabled: false });
    clearSourceRecords(sourceId);
  };

  const pauseSource = (sourceId: PassiveDataSourceId) => {
    updateStatus(sourceId, { status: 'paused', paused: true });
  };

  const ingestRecord = (record: Omit<PassiveDataRecord, 'id' | 'createdAt'>) => {
    const { allowed } = canIngestPassiveSource({ sourceId: record.sourceId, passportProfile, action: 'collect' });
    if (allowed) {
      const newRecord: PassiveDataRecord = {
        ...record,
        id: `${record.sourceId}-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setRecords(prevRecords => [...prevRecords, newRecord]);
      updateStatus(record.sourceId, { lastIngestedAt: new Date().toISOString() });
    }
  };
  
  const ingestSummary = (record: Omit<PassiveDataRecord, 'id' | 'createdAt'>) => {
    ingestRecord(record); // For now, summaries are ingested as records
  }

  const clearSourceRecords = (sourceId: PassiveDataSourceId) => {
    setRecords(prevRecords => prevRecords.filter(r => r.sourceId !== sourceId));
  };

  const getRecordsBySource = (sourceId: PassiveDataSourceId) => {
    return records.filter(r => r.sourceId === sourceId);
  };

  const getPermissionedRecordsForFeature = (feature: 'lifeMap' | 'ground' | 'mirror' | 'companion') => {
    // Simplified for now - in reality this would involve more complex checks
    return records;
  }

  const requestBrowserPermissionForSource = (sourceId: PassiveDataSourceId) => {
    // Placeholder for browser permission logic
    console.log(`Requesting browser permission for ${sourceId}`);
  }

  const value = {
    sources: URAI_PASSIVE_SOURCES,
    sourceStatuses,
    records,
    enableSource,
    disableSource,
    pauseSource,
    ingestRecord,
    ingestSummary,
    clearSourceRecords,
    getRecordsBySource,
    getPermissionedRecordsForFeature,
    getIngestionStatus,
    requestBrowserPermissionForSource,
  };

  return (
    <UraiPassiveDataContext.Provider value={value}>
      {children}
    </UraiPassiveDataContext.Provider>
  );
}

export function useUraiPassiveData() {
  const context = useContext(UraiPassiveDataContext);
  if (context === undefined) {
    throw new Error('useUraiPassiveData must be used within a UraiPassiveDataProvider');
  }
  return context;
}
