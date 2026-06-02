'use client';

import * as React from 'react';
import { SpatialUniverseProvider } from '@/components/urai/SpatialUniverseProvider';
import { UraiAudioProvider } from '@/providers/UraiAudioProvider';

export default function AppProviders({ children }: { children?: React.ReactNode }) {
  return (
    <UraiAudioProvider>
      <SpatialUniverseProvider>{children}</SpatialUniverseProvider>
    </UraiAudioProvider>
  );
}
