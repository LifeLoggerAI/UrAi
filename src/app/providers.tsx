'use client';

import * as React from 'react';
// import { SpatialUniverseProvider } from '@/components/urai/SpatialUniverseProvider';
import { UraiAudioProvider } from '@/providers/UraiAudioProvider';
import { UraiAuthProvider } from '@/providers/UraiAuthProvider';
import { UraiCloudSyncProvider } from '@/providers/UraiCloudSyncProvider';
// import { UraiExportProvider } from '@/providers/UraiExportProvider';
import { UraiFeatureFlagProvider } from '@/providers/UraiFeatureFlagProvider';
// import { UraiGroundProvider } from '@/providers/UraiGroundProvider';
// import { UraiLegacyProvider } from '@/providers/UraiLegacyProvider';
// import { UraiLifeMapProvider } from '@/providers/UraiLifeMapProvider';
// import { UraiMirrorProvider } from '@/providers/UraiMirrorProvider';
// import { UraiNotificationProvider } from '@/providers/UraiNotificationProvider';
import { UraiOnboardingProvider } from '@/providers/UraiOnboardingProvider';
import { UraiPassportProvider } from '@/providers/UraiPassportProvider';
// import { UraiRitualProvider } from '@/providers/UraiRitualProvider';
// import { UraiShadowProvider } from '@/providers/UraiShadowProvider';
import { UraiVoiceProvider } from '@/providers/UraiVoiceProvider';
// import { UraiCaptionBubble } from '@/components/voice/UraiCaptionBubble';
import { UraiSettingsProvider } from '@/providers/UraiSettingsProvider';
import { UraiErrorBoundary } from '@/components/system/UraiErrorBoundary';
import { installProductionConsoleGuard } from '@/lib/debug/productionConsoleGuard';

/**
 * URAI MASTER COMPLETION PASS 1:
 * This provider stack keeps the safe foundational providers active and leaves
 * high-risk media/spatial sync providers disabled until their own release gates pass.
 * Audio and voice providers default to disabled/no-autoplay and are required by
 * Genesis surfaces for safe no-op narration hooks.
 */
export default function AppProviders({ children }: { children?: React.ReactNode }) {
  React.useEffect(() => {
    installProductionConsoleGuard();
  }, []);

  return (
    <UraiErrorBoundary>
      <UraiAuthProvider>
        <UraiCloudSyncProvider>
          <UraiFeatureFlagProvider>
            <UraiSettingsProvider>
              <UraiAudioProvider>
                <UraiVoiceProvider>
                  <UraiOnboardingProvider>
                    <UraiPassportProvider>
                      {/* Disabled providers for Pass 1:
                      <UraiNotificationProvider>
                        <UraiExportProvider>
                          <UraiRitualProvider>
                            <UraiGroundProvider>
                              <UraiLifeMapProvider>
                                <UraiMirrorProvider>
                                  <UraiShadowProvider>
                                    <UraiLegacyProvider>
                                      <SpatialUniverseProvider>
                                        {children}
                                      </SpatialUniverseProvider>
                                    </UraiLegacyProvider>
                                  </UraiShadowProvider>
                                </UraiMirrorProvider>
                              </UraiLifeMapProvider>
                            </UraiGroundProvider>
                          </UraiRitualProvider>
                        </UraiExportProvider>
                        <UraiCaptionBubble />
                      </UraiNotificationProvider>
                      */}
                      {children}
                    </UraiPassportProvider>
                  </UraiOnboardingProvider>
                </UraiVoiceProvider>
              </UraiAudioProvider>
            </UraiSettingsProvider>
          </UraiFeatureFlagProvider>
        </UraiCloudSyncProvider>
      </UraiAuthProvider>
    </UraiErrorBoundary>
  );
}
