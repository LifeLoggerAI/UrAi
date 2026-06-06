
'use client';

import { useUraiPassport } from '../../providers/UraiPassportProvider';

export const PassportStatusSummary = () => {
  const { passportState } = useUraiPassport();

  const openLayers = Object.values(passportState).filter(status => status === 'open').length;
  const closedLayers = Object.values(passportState).filter(status => status === 'closed').length;
  const blockedLayers = Object.values(passportState).filter(status => status === 'blocked').length;

  return (
    <div>
      <p>Open layers: {openLayers}</p>
      <p>Closed layers: {closedLayers}</p>
      <p>Blocked layers: {blockedLayers}</p>
      <p>Closed layers stay closed until you open them.</p>
    </div>
  );
};
