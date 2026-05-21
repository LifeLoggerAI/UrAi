'use client';

import * as React from 'react';
import { SpatialUniverseProvider } from '@/components/urai/SpatialUniverseProvider';

export default function AppProviders({ children }: { children?: React.ReactNode }) {
  return <SpatialUniverseProvider>{children}</SpatialUniverseProvider>;
}
