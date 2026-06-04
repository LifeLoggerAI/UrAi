"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type UraiPassportState = {
  hasConsent: boolean;
};

type UraiPassportContextValue = {
  passportState: UraiPassportState;
  grantConsent: () => void;
  revokeConsent: () => void;
};

const UraiPassportContext = createContext<UraiPassportContextValue | null>(null);

export function UraiPassportProvider({ children }: { children: ReactNode }) {
  const [hasConsent, setHasConsent] = useState(false);

  const grantConsent = useCallback(() => {
    setHasConsent(true);
  }, []);

  const revokeConsent = useCallback(() => {
    setHasConsent(false);
  }, []);

  const passportState = useMemo<UraiPassportState>(() => ({
    hasConsent,
  }), [hasConsent]);

  const value = useMemo<UraiPassportContextValue>(() => ({
    passportState,
    grantConsent,
    revokeConsent,
  }), [passportState, grantConsent, revokeConsent]);

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