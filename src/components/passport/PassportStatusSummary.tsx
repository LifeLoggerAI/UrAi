
'use client';

import { useUraiPassport } from '../../providers/UraiPassportProvider';

export const PassportStatusSummary = () => {
  const { passportState } = useUraiPassport();

  const openLayers = Object.values(passportState).filter(status => status === 'open').length;
  const closedLayers = Object.values(passportState).filter(status => status === 'closed').length;
  const blockedLayers = Object.values(passportState).filter(status => status === 'blocked').length;

  return (
    <div className="passport-status-summary">
      <div>
        <span>{openLayers}</span>
        <p>Open layers</p>
      </div>
      <div>
        <span>{closedLayers}</span>
        <p>Closed layers</p>
      </div>
      <div>
        <span>{blockedLayers}</span>
        <p>Blocked layers</p>
      </div>
      <p className="passport-status-note">Closed layers stay closed until you open them.</p>
    </div>
  );
};
