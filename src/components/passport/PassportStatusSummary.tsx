'use client';

import { PASSPORT_LAYER_DEFINITIONS } from '../../lib/passport';
import { useUraiPassport } from '../../providers/UraiPassportProvider';

export const PassportStatusSummary = () => {
  const { passportState } = useUraiPassport();

  const entries = Object.entries(passportState);
  const openLayers = entries.filter(([, status]) => status === 'open').length;
  const closedLayers = entries.filter(([, status]) => status === 'closed').length;
  const protectedLayers = entries.filter(([layerId]) => PASSPORT_LAYER_DEFINITIONS[layerId as keyof typeof PASSPORT_LAYER_DEFINITIONS].sensitivity === 'protected').length;

  return (
    <section className="passport-status-summary" aria-label="Passport layer status summary">
      <div className="passport-status-card passport-status-card--open">
        <span>{openLayers}</span>
        <p>Open Layers</p>
        <small>Preference available to URAI</small>
      </div>
      <div className="passport-status-card passport-status-card--closed">
        <span>{closedLayers}</span>
        <p>Closed Layers</p>
        <small>Unavailable until you choose</small>
      </div>
      <div className="passport-status-card passport-status-card--protected">
        <span>{protectedLayers}</span>
        <p>Protected Layers</p>
        <small>Separate review required</small>
      </div>
      <p className="passport-status-note">Closed layers stay closed until you open them. Protected layers stay sealed until a separate review flow exists.</p>
    </section>
  );
};
