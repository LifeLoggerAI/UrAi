
"use client";
import React from "react";
import { useUraiPassport } from "@/providers/UraiPassportProvider";
import { PassportStatusSummary } from "./PassportStatusSummary";
import { PassportLayerGroup } from "./PassportLayerGroup";
import { PassportLayerId } from "@/lib/passport";
import "./Passport.css";

const coreReflectionLayers: PassportLayerId[] = [
  "lifemap",
  "ground",
  "mirror",
  "intelligence",
  "companion_context",
];
const protectedLayers: PassportLayerId[] = ["shadow", "legacy", "export"];
const passiveSourceLayers: PassportLayerId[] = [
  "passive_data",
  "audio",
  "location",
  "health",
  "gmail",
  "calendar",
  "contacts",
  "motion",
  "camera",
];
const experienceLayers: PassportLayerId[] = ["notifications", "spatial", "system"];
const adminLayers: PassportLayerId[] = ["admin"];

export function PassportControlCenter() {
  return (
    <div className="passport-control-center">
      <h1>Passport</h1>
      <p className="subtitle">URAI only opens what you choose.</p>
      <p className="passport-explanation">
        Passport is your control surface for what URAI can use. Closed layers
        remain closed until you choose otherwise.
      </p>
      <PassportStatusSummary />
      <PassportLayerGroup
        title="Core Reflection"
        layerIds={coreReflectionLayers}
      />
      <PassportLayerGroup
        title="Protected"
        layerIds={protectedLayers}
        description="Protected layers require a separate review flow before they reveal anything."
      />
      <PassportLayerGroup
        title="Passive Sources"
        layerIds={passiveSourceLayers}
        description="Opening a layer here does not start collection. It only records your Passport preference."
      />
      <PassportLayerGroup title="Experience" layerIds={experienceLayers} />
      <PassportLayerGroup title="Admin" layerIds={adminLayers} />
    </div>
  );
}
