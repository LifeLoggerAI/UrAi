
export type PassportLayerId =
  | 'passive_data'
  | 'intelligence'
  | 'companion_context'
  | 'lifemap'
  | 'ground'
  | 'mirror'
  | 'shadow'
  | 'legacy'
  | 'export'
  | 'notifications'
  | 'spatial'
  | 'audio'
  | 'location'
  | 'health'
  | 'gmail'
  | 'calendar'
  | 'contacts'
  | 'motion'
  | 'camera'
  | 'admin'
  | 'system';

export type PassportLayerStatus = 'open' | 'closed' | 'blocked';

export type PassportLayerSensitivity = 'low' | 'medium' | 'high' | 'protected';
