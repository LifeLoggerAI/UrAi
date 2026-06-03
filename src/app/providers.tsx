'use client';

import * as React from 'react';
import { SpatialUniverseProvider } from '@/components/urai/SpatialUniverseProvider';
import { UraiAudioProvider } from '@/providers/UraiAudioProvider';
import { UraiGroundProvider } from '@/providers/UraiGroundProvider';
import { UraiLegacyProvider } from '@/providers/UraiLegacyProvider';
import { UraiLifeMapProvider } from '@/providers/UraiLifeMapProvider';
import { UraiMirrorProvider } from '@/providers/UraiMirrorProvider';
import { UraiShadowProvider } from '@/providers/UraiShadowProvider';
import { UraiVoiceProvider } from '@/providers/UraiVoiceProvider';
import { UraiCaptionBubble } from '@/components/voice/UraiCaptionBubble';

export default function AppProviders({ children }: { children?: React.ReactNode }) {
  return (
    <UraiAudioProvider>
      <UraiVoiceProvider>
        <UraiGroundProvider>
          <UraiLifeMapProvider>
            <UraiMirrorProvider>
              <UraiShadowProvider>
                <UraiLegacyProvider>
                  <SpatialUniverseProvider>{children}</SpatialUniverseProvider>
                </UraiLegacyProvider>
              </UraiShadowProvider>
            </UraiMirrorProvider>
          </UraiLifeMapProvider>
        </UraiGroundProvider>
        <UraiCaptionBubble />
      </UraiVoiceProvider>
    </UraiAudioProvider>
  );
}
