'use client';

import { useMemo } from 'react';

import { useUraiPassport } from '../../providers/UraiPassportProvider';
import { PassportLayerId, PASSPORT_LAYER_DEFINITIONS } from '../../lib/passport';
import './Passport.css';

interface PassportLayerCardProps {
  layerId: PassportLayerId;
  onLayerAction?: (notice: { message: string; tone: 'safe' | 'review' | 'closed' }) => void;
}

const STATUS_LABELS = {
  open: 'Open preference',
  closed: 'Closed',
  blocked: 'Blocked',
} as const;

const SENSITIVITY_LABELS = {
  low: 'Low sensitivity',
  medium: 'Medium sensitivity',
  high: 'High sensitivity',
  protected: 'Protected',
} as const;

const EXTERNAL_PERMISSION_LAYERS = new Set<PassportLayerId>([
  'passive_data',
  'audio',
  'location',
  'health',
  'gmail',
  'calendar',
  'contacts',
  'motion',
  'camera',
  'notifications',
  'spatial',
]);

export const PassportLayerCard = ({ layerId, onLayerAction }: PassportLayerCardProps) => {
  const { passportState, openLayer, closeLayer } = useUraiPassport();
  const layerDef = PASSPORT_LAYER_DEFINITIONS[layerId];
  const status = passportState[layerId];

  const isProtectedAndClosed = layerDef.sensitivity === 'protected' && status === 'closed';
  const isBlocked = status === 'blocked' || layerId === 'admin';
  const needsSeparatePermission = layerDef.requiresExplicitApproval || EXTERNAL_PERMISSION_LAYERS.has(layerId);

  const actionLabel = useMemo(() => {
    if (isBlocked) return 'Unavailable';
    if (isProtectedAndClosed) return 'Requires review';
    if (status === 'open' && !layerDef.canBeOpenedByUser) return 'System default';
    if (status === 'open') return 'Close layer';
    if (needsSeparatePermission) return 'Record preference';
    return 'Open layer';
  }, [isBlocked, isProtectedAndClosed, layerDef.canBeOpenedByUser, needsSeparatePermission, status]);

  const detailCopy = needsSeparatePermission
    ? 'Opening this layer records your Passport preference. Connection or collection requires a separate permission step.'
    : 'Opening this layer changes only the local Passport preference for this launch surface.';

  const handleOpen = () => {
    openLayer(layerId);
    onLayerAction?.({
      tone: needsSeparatePermission ? 'review' : 'safe',
      message: needsSeparatePermission
        ? `${layerDef.title} preference recorded. Connection or collection still requires separate permission.`
        : `${layerDef.title} layer opened.`,
    });
  };

  const handleClose = () => {
    closeLayer(layerId);
    onLayerAction?.({
      tone: 'closed',
      message: `${layerDef.title} layer closed. URAI will treat it as unavailable.`,
    });
  };

  return (
    <article className="passport-layer-card" data-status={status} data-sensitivity={layerDef.sensitivity}>
      <div className="passport-layer-card__halo" aria-hidden="true">
        {layerDef.title.slice(0, 1)}
      </div>
      <div className="card-content">
        <div className="passport-layer-card__topline">
          <span className={`passport-chip passport-chip--${status}`}>{STATUS_LABELS[status]}</span>
          <span className={`passport-chip passport-chip--${layerDef.sensitivity}`}>{SENSITIVITY_LABELS[layerDef.sensitivity]}</span>
        </div>
        <h3>{layerDef.title}</h3>
        <p>{layerDef.summary}</p>
        <div className="passport-layer-card__facts" aria-label={`${layerDef.title} consent facts`}>
          <span>{layerDef.requiresExplicitApproval ? 'Explicit approval required' : 'Preference controlled'}</span>
          <span>{layerDef.canBeOpenedByUser ? 'Owner action available' : 'Review or system controlled'}</span>
          <span>{needsSeparatePermission ? 'Separate connection step' : 'No external source opened'}</span>
        </div>
        <p className="passport-layer-card__detail">{detailCopy}</p>
      </div>
      <div className="card-actions">
        {status === 'closed' && !isProtectedAndClosed && layerDef.canBeOpenedByUser ? (
          <button type="button" onClick={handleOpen} aria-label={`${actionLabel}: ${layerDef.title}`}>
            {actionLabel}
          </button>
        ) : null}
        {status === 'open' && layerDef.canBeOpenedByUser ? (
          <button type="button" onClick={handleClose} aria-label={`Close layer: ${layerDef.title}`}>
            Close layer
          </button>
        ) : null}
        {(isProtectedAndClosed || isBlocked || (status === 'open' && !layerDef.canBeOpenedByUser)) ? (
          <button type="button" disabled aria-disabled="true" aria-label={`${actionLabel}: ${layerDef.title}`}>
            {actionLabel}
          </button>
        ) : null}
      </div>
    </article>
  );
};
