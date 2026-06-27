"use client";

import type { PassportLayerId } from "@/lib/passport";
import { PassportLayerCard } from "./PassportLayerCard";
import "./Passport.css";

type PassportNotice = {
  message: string;
  tone: "safe" | "review" | "closed";
};

export function PassportLayerGroup({
  title,
  layerIds,
  description,
  eyebrow,
  sectionId,
  onLayerAction,
}: {
  title: string;
  layerIds: PassportLayerId[];
  description?: string;
  eyebrow?: string;
  sectionId?: string;
  onLayerAction?: (notice: PassportNotice) => void;
}) {
  return (
    <section className="passport-layer-group" id={sectionId} aria-labelledby={sectionId ? `${sectionId}-title` : undefined}>
      <header className="passport-layer-group__header">
        <div>
          {eyebrow ? <p className="passport-section-eyebrow">{eyebrow}</p> : null}
          <h2 className="passport-layer-group__title" id={sectionId ? `${sectionId}-title` : undefined}>{title}</h2>
        </div>
        {description ? (
          <p className="passport-layer-group__description">{description}</p>
        ) : null}
      </header>

      <div className="passport-layer-grid">
        {layerIds.map((layerId) => (
          <PassportLayerCard key={layerId} layerId={layerId} onLayerAction={onLayerAction} />
        ))}
      </div>
    </section>
  );
}
