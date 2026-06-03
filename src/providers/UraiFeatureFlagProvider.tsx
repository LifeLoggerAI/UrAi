"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_LAUNCH_STATUS, getDefaultFeatureFlagMap, isFeatureEnabled } from "@/lib/admin/featureFlags";
import type { UraiFeatureFlag, UraiFeatureFlagId, UraiLaunchStatus } from "@/lib/admin/adminTypes";
import { recordAdminAction } from "@/lib/admin/adminAuditLog";

type UraiFeatureFlagContextValue = {
  flags: Record<UraiFeatureFlagId, UraiFeatureFlag>;
  launchStatus: UraiLaunchStatus;
  launchMessage: string;
  isEnabled: (id: UraiFeatureFlagId) => boolean;
  setFlagEnabled: (id: UraiFeatureFlagId, enabled: boolean, updatedBy?: string) => Promise<void>;
  setLaunchStatus: (status: UraiLaunchStatus, updatedBy?: string) => Promise<void>;
  setLaunchMessage: (message: string, updatedBy?: string) => Promise<void>;
  resetLocalFlags: () => void;
};

const UraiFeatureFlagContext = createContext<UraiFeatureFlagContextValue | null>(null);

export function UraiFeatureFlagProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<Record<UraiFeatureFlagId, UraiFeatureFlag>>(() => getDefaultFeatureFlagMap());
  const [launchStatus, setLaunchStatusState] = useState<UraiLaunchStatus>(DEFAULT_LAUNCH_STATUS);
  const [launchMessage, setLaunchMessageState] = useState("URAI Genesis public demo is open with sample data.");

  const setFlagEnabled = useCallback(async (id: UraiFeatureFlagId, enabled: boolean, updatedBy?: string) => {
    setFlags((current) => ({ ...current, [id]: { ...current[id], enabled, updatedAt: new Date().toISOString(), updatedBy } }));
    await recordAdminAction({ userId: updatedBy, action: enabled ? "feature_flag_enabled" : "feature_flag_disabled", target: id });
  }, []);

  const setLaunchStatus = useCallback(async (status: UraiLaunchStatus, updatedBy?: string) => {
    setLaunchStatusState(status);
    await recordAdminAction({ userId: updatedBy, action: "launch_status_changed", target: status });
  }, []);

  const setLaunchMessage = useCallback(async (message: string, updatedBy?: string) => {
    setLaunchMessageState(message.slice(0, 220));
    await recordAdminAction({ userId: updatedBy, action: "launch_message_changed", target: "launch_message" });
  }, []);

  const resetLocalFlags = useCallback(() => {
    setFlags(getDefaultFeatureFlagMap());
    setLaunchStatusState(DEFAULT_LAUNCH_STATUS);
    setLaunchMessageState("URAI Genesis public demo is open with sample data.");
  }, []);

  const value = useMemo<UraiFeatureFlagContextValue>(() => ({ flags, launchStatus, launchMessage, isEnabled: (id) => isFeatureEnabled(flags, id), setFlagEnabled, setLaunchStatus, setLaunchMessage, resetLocalFlags }), [flags, launchMessage, launchStatus, resetLocalFlags, setFlagEnabled, setLaunchMessage, setLaunchStatus]);

  return <UraiFeatureFlagContext.Provider value={value}>{children}</UraiFeatureFlagContext.Provider>;
}

export function useUraiFeatureFlags(): UraiFeatureFlagContextValue {
  const context = useContext(UraiFeatureFlagContext);
  if (!context) {
    const flags = getDefaultFeatureFlagMap();
    return { flags, launchStatus: DEFAULT_LAUNCH_STATUS, launchMessage: "URAI Genesis public demo is open with sample data.", isEnabled: (id) => isFeatureEnabled(flags, id), setFlagEnabled: async () => undefined, setLaunchStatus: async () => undefined, setLaunchMessage: async () => undefined, resetLocalFlags: () => undefined };
  }
  return context;
}
