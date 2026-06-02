'use client';

import * as React from 'react';
import { SpatialUniverseProvider } from '@/components/urai/SpatialUniverseProvider';
import { UraiAudioProvider } from '@/providers/UraiAudioProvider';
import { UraiGroundProvider } from '@/providers/UraiGroundProvider';
import { UraiLifeMapProvider } from '@/providers/UraiLifeMapProvider';
import { UraiVoiceProvider } from '@/providers/UraiVoiceProvider';
import { UraiCaptionBubble } from '@/components/voice/UraiCaptionBubble';

export default function AppProviders({ children }: { children?: React.ReactNode }) {
  return (
    <UraiAudioProvider>
      <UraiVoiceProvider>
        <UraiGroundProvider>
          <UraiLifeMapProvider>
            <SpatialUniverseProvider>{children}</SpatialUniverseProvider>
          </UraiLifeMapProvider>
        </UraiGroundProvider>
        <UraiCaptionBubble />
      </UraiVoiceProvider>
    </UraiAudioProvider>
  );
}
