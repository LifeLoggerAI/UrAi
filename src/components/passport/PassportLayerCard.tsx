"use client";

import { useMemo } from "react";
import type { PassportLayerId } from "@/lib/passport";
import { useUraiPassport } from "@/providers/UraiPassportProvider";
import "./Passport.css";

function formatPassportLabel(value: string): string {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function isProtectedReviewLayer(layerId: PassportLayerId): boolean {
  return layerId === "shadow" || layerId === "legacy" || layerId === "export";
}

export function PassportLayerCard({ layerId }: { layerId: PassportLayerId }) {
  const { openLayer, closeLayer, explainLayer, getLayerStatus } = useUraiPassport();

  const definition = explainLayer(layerId);
  const status = getLayerStatus(layerId);

  const statusLabel = useMemo(() => formatPassportLabel(status), [status]);
  const sensitivityLabel = useMemo(
    () => formatPassportLabel(definition.sensitivity),
    [definition.sensitivity]
  );

  const requiresReview =
    status === "closed" &&
    (definition.requiresExplicitApproval || isProtectedReviewLayer(layerId));

  const isBlocked = status === "blocked" || !definition.canBeOpenedByUser;
  const isActionDisabled = isBlocked || requiresReview;

  const buttonText = (() => {
    if (isBlocked) return "Blocked";
    if (requiresReview) return "Requires review";
    if (status === "open") return "Close layer";
    return "Open layer";
  })();

  const handleToggle = () => {
    if (isActionDisabled) return;

    if (status === "open") {
      closeLayer(layerId, "Closed from Passport Control Center");
      return;
    }

    if (status === "closed") {
      openLayer(layerId, "Opened from Passport Control Center");
    }
  };

  return (
    <article className="passport-layer-card">
      <div className="passport-layer-card__header">
        <h3 className="passport-layer-card__title">{definition.title}</h3>
        <span className={`passport-layer-card__status status-${status}`}>
          {statusLabel}
        </span>
      </div>

      <p className="passport-layer-card__summary">{definition.summary}</p>

      <div className="passport-layer-card__details" aria-label="Layer details">
        <span className={`passport-layer-card__pill sensitivity-${definition.sensitivity}`}>
          {sensitivityLabel}
        </span>
        {definition.requiresExplicitApproval ? (
          <span className="passport-layer-card__pill passport-layer-card__pill--review">
            Requires explicit approval
          </span>
        ) : (
          <span className="passport-layer-card__pill">User controlled</span>
        )}
      </div>

      {requiresReview ? (
        <p className="passport-layer-card__note">
          This layer needs a separate review flow before it reveals anything.
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleToggle}
        disabled={isActionDisabled}
        className={`passport-layer-card__button ${
          isActionDisabled ? "blocked" : status === "open" ? "close" : "open"
        }`}
      >
        {buttonText}
      </button>
    </article>
  );
}