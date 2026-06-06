
'use client';

import { useUraiPassport } from '../../providers/UraiPassportProvider';
import { PassportLayerGroup } from './PassportLayerGroup';
import { PassportStatusSummary } from './PassportStatusSummary';
import { PASSPORT_LAYER_DEFINITIONS } from '../../lib/passport';

const CORE_REFLECTION_LAYERS = ['lifemap', 'ground', 'mirror', 'intelligence', 'companion_context'];
const PROTECTED_LAYERS = ['shadow', 'legacy', 'export'];
const PASSIVE_SOURCES_LAYERS = ['passive_data', 'audio', 'location', 'health', 'gmail', 'calendar', 'contacts', 'motion', 'camera'];
const EXPERIENCE_LAYERS = ['notifications', 'spatial', 'system'];
const ADMIN_LAYERS = ['admin'];

export const PassportControlCenter = () => {
  const { passportState } = useUraiPassport();

  return (
    <div>
      <h1>Passport</h1>
      <p>URAI only opens what you choose.</p>
      <p>Passport is your control surface for what URAI can use. Closed layers remain closed until you choose otherwise.</p>

      <PassportStatusSummary />

      <PassportLayerGroup title="Core Reflection" layerIds={CORE_REFLECTION_LAYERS} />
      <PassportLayerGroup title="Protected" layerIds={PROTECTED_LAYERS} description="Protected layers require a separate review flow before they reveal anything." />
      <PassportLayerGroup title="Passive Sources" layerIds={PASSIVE_SOURCES_LAYERS} description="Opening a layer here does not start collection. It only records your Passport preference." />
      <PassportLayerGroup title="Experience" layerIds={EXPERIENCE_LAYERS} />
      <PassportLayerGroup title="Admin" layerIds={ADMIN_LAYERS} />
    </div>
  );
};
