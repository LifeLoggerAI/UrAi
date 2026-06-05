
"use client";
import React from "react";
import { useUraiPassport } from "@/providers/UraiPassportProvider";
import "./Passport.css";

export function PassportStatusSummary() {
  const { passportState } = useUraiPassport();
  const openLayers = Object.values(passportState.layers).filter(
    (layer) => layer.status === "open"
  ).length;
  const closedLayers = Object.values(passportState.layers).filter(
    (layer) => layer.status === "closed"
  ).length;
  const blockedLayers = Object.values(passportState.layers).filter(
    (layer) => layer.status === "blocked"
  ).length;

  return (
    <div className="passport-status-summary">
      <p>
        {openLayers} open, {closedLayers} closed, {blockedLayers} blocked.
      </p>
      <p>Closed layers stay closed until you open them.</p>
    </div>
  );
}
