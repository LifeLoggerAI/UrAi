"use client";

import { ConsentGate } from "../privacy/ConsentGate";

type LegacyConsentGateProps = {
  onOpenLegacy: () => void;
  onKeepClosed: () => void;
  onReviewPassport?: () => void;
};

export function LegacyConsentGate({ onOpenLegacy, onKeepClosed, onReviewPassport }: LegacyConsentGateProps) {
  return (
    <ConsentGate 
      layerId="legacy"
      onConfirm={onOpenLegacy}
      onCancel={onKeepClosed}
      onReviewPassport={onReviewPassport}
    />
  );
}
