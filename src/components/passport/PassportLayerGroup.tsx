"use client";

import type { PassportLayerId } from "@/lib/passport";
import { PassportLayerCard } from "./PassportLayerCard";
import "./Passport.css";

export function PassportLayerGroup({
  title,
  layerIds,
  description,
}: {
  title: string;
  layerIds: PassportLayerId[];
  description?: string;
}) {
  return (
    <section className="passport-layer-group">
      <header className="passport-layer-group__header">
        <h2 className="passport-layer-group__title">{title}</h2>
        {description ? (
          <p className="passport-layer-group__description">{description}</p>
        ) : null}
      </header>

      <div className="passport-layer-grid">
        {layerIds.map((layerId) => (
          <PassportLayerCard key={layerId} layerId={layerId} />
        ))}
      </div>
    </section>
  );
}
