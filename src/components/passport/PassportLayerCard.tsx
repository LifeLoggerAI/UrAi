
'use client';

import { useUraiPassport } from '../../providers/UraiPassportProvider';
import { PassportLayerId, PASSPORT_LAYER_DEFINITIONS } from '../../lib/passport';
import './Passport.css';

interface PassportLayerCardProps {
  layerId: PassportLayerId;
}

export const PassportLayerCard = ({ layerId }: PassportLayerCardProps) => {
  const { passportState, openLayer, closeLayer } = useUraiPassport();
  const layerDef = PASSPORT_LAYER_DEFINITIONS[layerId];
  const status = passportState[layerId];

  const isProtectedAndClosed = layerDef.sensitivity === 'protected' && status === 'closed';

  return (
    <div className="passport-layer-card">
      <div className="card-content">
        <h4>{layerDef.title}</h4>
        <p>{layerDef.summary}</p>
        <p>Status: {status}</p>
        <p>Sensitivity: {layerDef.sensitivity}</p>
        <p>Requires explicit approval: {layerDef.requiresExplicitApproval.toString()}</p>
      </div>
      <div className="card-actions">
        {status === 'closed' && !isProtectedAndClosed && layerDef.canBeOpenedByUser && (
          <button onClick={() => openLayer(layerId)}>Open layer</button>
        )}
        {status === 'open' && (
          <button onClick={() => closeLayer(layerId)}>Close layer</button>
        )}
        {isProtectedAndClosed && (
            <button disabled>Requires review</button>
        )}
      </div>
    </div>
  );
};
