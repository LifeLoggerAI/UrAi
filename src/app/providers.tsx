'use client';

import * as React from 'react';
import { SpatialUniverseProvider } from '@/components/urai/SpatialUniverseProvider';
import { UraiAudioProvider } from '@/providers/UraiAudioProvider';
import { UraiExportProvider } from '@/providers/UraiExportProvider';
import { UraiGroundProvider } from '@/providers/UraiGroundProvider';
import { UraiLegacyProvider } from '@/providers/UraiLegacyProvider';
import { UraiLifeMapProvider } from '@/providers/UraiLifeMapProvider';
import { UraiMirrorProvider } from '@/providers/UraiMirrorProvider';
import { UraiNotificationProvider } from '@/providers/UraiNotificationProvider';
import { UraiRitualProvider } from '@/providers/UraiRitualProvider';
import { UraiShadowProvider } from '@/providers/UraiShadowProvider';
import { UraiVoiceProvider } from '@/providers/UraiVoiceProvider';
import { UraiCaptionBubble } from '@/components/voice/UraiCaptionBubble';

export default function AppProviders({ children }: { children?: React.ReactNode }) {
  return (
    <UraiAudioProvider>
      <UraiVoiceProvider>
        <UraiNotificationProvider>
          <UraiExportProvider>
            <UraiRitualProvider>
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
            </UraiRitualProvider>
          </UraiExportProvider>
        </UraiNotificationProvider>
        <UraiCaptionBubble />
      </UraiVoiceProvider>
    </UraiAudioProvider>
  );
}
