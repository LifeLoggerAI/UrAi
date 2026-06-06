
'use client';

import { PassportLayerId } from '../../lib/passport';
import { PassportLayerCard } from './PassportLayerCard';

interface PassportLayerGroupProps {
  title: string;
  layerIds: PassportLayerId[];
  description?: string;
}

export const PassportLayerGroup = ({ title, layerIds, description }: PassportLayerGroupProps) => {
  return (
    <div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      <div>
        {layerIds.map(layerId => (
          <PassportLayerCard key={layerId} layerId={layerId} />
        ))}
      </div>
    </div>
  );
};
